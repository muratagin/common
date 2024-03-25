import { Requests } from "@app/api";
import { FILE_SERVER } from "@app/constant";
import TooltipComp from "@components/TooltipComp";
import { AssetCreate } from "@components/asset.create";
import { AssetEdit } from "@components/asset.edit";
import { AssetIndex } from "@components/asset.index";
import { DataTablePaginationComponent } from "@components/data.table.pagination.component";
import DynamicComponent from "@components/dynamic.component";
import ExcelImportModal from "@components/excel.import";
import Export from "@components/export";
import History from "@components/history";
import Icon from "@components/icon";
import Modal from "@components/modal";
import Loading from "@libs/loading";
import { getAsset, getEntityUrl, getServiceUrl } from "@libs/parser";
import { Paper as MuiPaper } from "@mui/material";
import { fetchAsync, useObservable } from "@pages/asset";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import { Flex, Popover } from "@radix-ui/themes";
import { setCurrentEntity, setPopup } from "@slices/selectionSlice";
import { memo, useEffect, useRef, useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BehaviorSubject, combineLatest } from "rxjs";
import { switchMap } from "rxjs/operators";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { getColumnsSelector } from "./columns.selector";
import MyModal from "./modal";
import { MySwalData } from "./myswaldata";
import {
  checkCompanyRelated,
  checkIf,
  checkPrivilegeInRoles,
  checkPrivilegeWithType,
  checkPrivilegesInRoles,
  combineData,
  errorData,
  findCompany,
  findCompanyIdentifier,
  getDownloadRedirect,
  getModel,
  interpolateUrl,
  interpolatedObject,
  interpolatedObjectV2,
  isObject,
  objectInterpolate,
  resErrorMessage,
} from "./utils";

const behaviorSubj = {};
const resultObservable = {};
let selectedRows = [];
export const useBehaviorSubject = (model, setTableData) => {
  if (!behaviorSubj[model]) {
    behaviorSubj[model] = {
      searchSubject: new BehaviorSubject(),
      refreshSubject: new BehaviorSubject(),
    };
    resultObservable[model] = combineLatest(
      behaviorSubj[model].searchSubject,
      behaviorSubj[model].refreshSubject
    ).pipe(
      switchMap(([searchSubject]) => {
        return fetchAsync({ ...searchSubject }, setTableData);
      })
    );
  }
  return { ...behaviorSubj[model], combined: resultObservable[model] };
};
function TableComponent(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const MySwal = withReactContent(Swal);
  const currentEntity = useSelector((state) => state.selection.currentEntity);
  let companyIdentifier = useSelector((state) => state.selection.identifier);
  // START custom behavior
  // make an exception for "packages/companypackage"
  // package tab for the company
  // use company's identifier rather than the selected identifier on the store
  if (props.group?.service?.url === "packages/companypackage") {
    companyIdentifier = currentEntity?.Company_Identifier;
  }

  // END custom behavior

  // START Import-Export
  const asset = props.asset;
  const data = getAsset(props);
  const [importMode, setImportMode] = useState(false);
  const [importModalShow, setImportModalShow] = useState(false);
  const [exportModalShow, setExportModalShow] = useState(false);
  const [actionModalCreate, setActionModalCreate] = useState(false);
  const [actionModalEdit, setActionModalEdit] = useState(false);
  const [queryParam, setQueryParam] = useState();
  const [newColumns, setNewColumns] = useState([]);
  const [historyData, setHistoryData] = useState({
    showHistory: false,
    rowId: undefined,
    entity: undefined,
    rowCompanyIdentifier: undefined,
  });
  const [componentState, setComponentState] = useState({
    show: false,
    component: { name: "" },
  });
  // END Import-Export
  let updateEntityId = checkIf(props.boundId)
    ? Number(props.boundId)
    : currentEntity?.Id;
  const [filterText, setFilterText] = useState("");
  const [cleanData, setCleanData] = useState([]);
  const [modalShow, setModalShow] = useState({ show: false, readonly: false });
  const [editModalData, setEditModalData] = useState();
  const [actionModal, setActionModal] = useState({ show: false });
  const [ruleAddModal, setRuleAddModal] = useState({ show: false });
  const [tableData, setTableData] = useState({
    loading: true,
    totalRows: 0,
    data: [],
  });
  const customCheckboxRef = useRef();
  const { user } = useSelector((state) => state.user);
  const userRoles = user?.Roles;
  let url = getServiceUrl(props.group.service);
  let headers = props.group.service.headers;
  let externalObject;

  // check if the page is edit mode
  // where boundId === currentEntityId
  if (!checkIf(props.boundId) || Number(props.boundId) === currentEntity?.Id) {
    externalObject = interpolatedObject(
      props.group.service.params,
      updateEntityId
    );
  } else if (props?.group?.model === "medicalnote" && checkIf(props.boundId)) {
    externalObject = interpolatedObject(
      props.group.service.params,
      updateEntityId
    );
  } else if (checkIf(props.boundId)) {
    // this condition is for insuredTabs / Package
    externalObject = interpolatedObjectV2(props.group.service, updateEntityId);
  }

  let isImcModules =
    props?.group?.model === "price" || props?.group?.model === "packageAgency"
      ? true
      : false;
  if (isImcModules) {
    updateEntityId = checkIf(props.boundId)
      ? Number(props.boundId)
      : currentEntity?.Data?.PackageId;
    externalObject = interpolatedObject(
      props.group.service.params,
      updateEntityId
    );
  }
  if (props?.group?.model === "contactNotes") {
    updateEntityId = currentEntity?.ContactId || updateEntityId;
    externalObject = interpolatedObject(
      props.group.service.params,
      updateEntityId
    );
  }
  if (props?.group?.model === "ContactBankAccounts") {
    updateEntityId = currentEntity?.ContactId || updateEntityId;
    externalObject = interpolatedObject(
      props.group.service.params,
      updateEntityId
    );
  }
  if (props?.group?.model === "price") {
    updateEntityId = currentEntity?.Id || updateEntityId;
    externalObject = interpolatedObject(
      props.group.service.params,
      updateEntityId
    );
  }
  if (props?.group?.model === "PackageTableClaim") {
    updateEntityId = currentEntity?.InsuredId || updateEntityId;
    externalObject = interpolatedObject(
      props.group.service.params,
      updateEntityId
    );
  }
  url = interpolateUrl(url, updateEntityId);

  const createNew = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setEditModalData();
    setModalShow({ show: true, readonly: false });
  };

  const ruleAdd = (item, mode) => {
    let company = findCompany(
      "CompanyIdentifier",
      currentEntity?.CompanyIdentifier || companyIdentifier
    );
    setRuleAddModal((state) => {
      return {
        ...state,
        show: true,
        item,
        mode,
        boundId: company?.CompanyId,
        currentEntityId: currentEntity?.Id,
        title: props.group.title,
      };
    });
  };
  const ruleAddModalClose = () => {
    setRuleAddModal({ show: false });
    refreshSubject.next();
  };

  let filterPrefix = "";

  const filterFunction = (item) => {
    if (!filterText || filterText === "") {
      return true;
    }
    return Object.keys(item).some((value) => {
      if (isObject(item[value])) {
        let temp = filterPrefix;
        filterPrefix += value + ".";
        let recursiveResult = filterFunction(item[value]);
        filterPrefix = temp;
        return recursiveResult;
      } else {
        if (value === "IsPrimary") {
          if (isOnModelView(value)) {
            if (
              (item[value].toString().toLocaleLowerCase() === "false" &&
                "HAYIR".includes(filterText.toLocaleUpperCase())) ||
              (item[value].toString().toLocaleLowerCase() === "true" &&
                "EVET".includes(filterText.toLocaleUpperCase()))
            ) {
              return true;
            }
          }
          return false;
        } else {
          return (
            isOnModelView(filterPrefix + value) &&
            item[value]
              .toString()
              .toLocaleLowerCase()
              .includes(filterText.toLocaleLowerCase())
          );
        }
      }
    });
  };

  const isOnModelView = (value) => {
    let returnValue = false;
    props.fields.forEach((field) => {
      if (field.model.view === value) {
        returnValue = true;
      }
    });
    return returnValue;
  };

  const handleTextChange = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFilterText(e.target.value);
  };
  const handleModalClose = async (mode, formData) => {
    if (mode === "create") {
      try {
        setTableData((state) => ({ ...state, loading: true }));
        await Requests().CommonRequest.post({
          url,
          content: { ...formData, ...externalObject },
          headers: { CompanyIdentifier: companyIdentifier },
        });
        dispatch(
          setPopup({
            display: true,
            class: "success",
            message: { title: "BİLGİ", body: "Başarıyla yaratıldı." },
          })
        );
        refreshSubject.next();
        setModalShow((state) => ({ ...state, show: false }));
      } catch (error) {
        dispatch(setPopup({ display: true, ...errorData(error) }));
        setTableData((state) => ({ ...state, loading: false }));
      }
    } else if (mode == "edit") {
      try {
        setTableData((state) => ({ ...state, loading: true }));
        await Requests().CommonRequest.put({
          url,
          content: { ...formData, ...externalObject },
          headers: { CompanyIdentifier: companyIdentifier },
        });
        dispatch(
          setPopup({
            display: true,
            class: "success",
            message: { title: "BİLGİ", body: "Başarıyla güncellendi" },
          })
        );
        refreshSubject.next();
        setModalShow((state) => ({ ...state, show: false }));
      } catch (error) {
        dispatch(setPopup({ display: true, ...errorData(error) }));
        setTableData((state) => ({ ...state, loading: false }));
      }
    }

    // close button clicked
    if (!mode) {
      setModalShow((state) => ({ ...state, show: false }));
    }
  };
  const editRow = (e, row, readonly) => {
    e.preventDefault();
    e.stopPropagation();
    if (props.group.componentEdit) {
      componentSettings(props, row);
    } else if (props.group.viewName) {
      let CI =
        row.CompanyIdentifier || companyIdentifier
          ? "?CI=" + (row.CompanyIdentifier || companyIdentifier)
          : "";
      let isEdit = readonly === true ? "view" : "edit";
      navigate(`/${props.group.viewName}/${isEdit}/${row.Id}${CI}`);
    } else {
      const initialData = props?.initialData;
      setEditModalData(row);
      if (props?.group?.useInitialData === true) {
        dispatch(setCurrentEntity({ ...initialData, ClickedData: row }));
      } else {
        dispatch(setCurrentEntity({ ...currentEntity, ClickedData: row }));
      }
      setModalShow({ show: true, readonly });
    }
  };
  const deleteRow = async (e, row) => {
    e.preventDefault();
    e.stopPropagation();
    if (props.group.deleteService) {
      url = getServiceUrl(props?.group?.deleteService);
    }
    MySwal.fire(
      props?.group?.actionsDisplay?.customDeleteMessage
        ? MySwalData("delete", {
            text: props?.group?.actionsDisplay?.customDeleteMessage,
          })
        : MySwalData("delete")
    ).then((result) => {
      if (result.isConfirmed) {
        Requests()
          .CommonRequest.delete({
            url,
            content: { id: row.Id },
            headers: {
              CompanyIdentifier: row.CompanyIdentifier || companyIdentifier,
            },
          })
          .then((response) => {
            refreshSubject.next();
            MySwal.fire(
              MySwalData("success", { text: "Silme işlemi gerçekleşti." })
            );
          })
          .catch((error) => {
            MySwal.fire(MySwalData("error", { text: resErrorMessage(error) }));
          });
      }
    });
  };

  const checkBoxActionUpdateRow = async (value, row, field, putService) => {
    MySwal.fire(MySwalData("confirm")).then((result) => {
      if (result.isConfirmed) {
        let updatedData = { ...row, [field]: value, ...externalObject };
        Requests()
          .CommonRequest.put({
            url: putService ? getServiceUrl(putService) : url,
            content: updatedData,
            headers: {
              CompanyIdentifier: row.CompanyIdentifier || companyIdentifier,
            },
          })
          .then((response) => {
            putService && refreshSubject.next();
            MySwal.fire(MySwalData("success"));
          })
          .catch((error) => {
            refreshSubject.next();
            MySwal.fire(MySwalData("error", { text: resErrorMessage(error) }));
          });
      } else {
        !putService && customCheckboxRef.current.changeValue(!value);
      }
    });
  };

  const historyRow = (e, row) => {
    e.preventDefault();
    e.stopPropagation();

    setHistoryData((state) => ({
      ...state,
      showHistory: true,
      rowId: row.Id,
      row,
      entity: props.group,
      rowCompanyIdentifier: row?.CompanyIdentifier,
    }));
  };

  const actionRow = (e, row, item) => {
    e.preventDefault();
    e.stopPropagation();
    // find if a row contains companyRelated data
    // if so set identifier
    let CI = findCompanyIdentifier(row);

    if (item.target === "popup") {
      setActionModal((state) => {
        return {
          ...state,
          show: true,
          item: item,
          clickedRow: row,
          boundId: row.Id,
        };
      });
    } else if (item.target === "ajax") {
      let url = getServiceUrl(item.service);
      url = interpolateUrl(url, row);
      if (item.service.url === "InsuredNotes/SendUwToCompany") {
        url = url + `?InsuredNoteId=${row?.Id}&InsuredId=${row?.InsuredId}`;
      }
      MySwal.fire(
        MySwalData("custom", {
          title: item.dialog.title,
          text: item.dialog.text,
          icon: item.dialog.icon,
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: item.dialog.confirmButtonText,
          cancelButtonText: item.dialog.cancelButtonText,
        })
      ).then((result) => {
        if (result.isConfirmed) {
          setTableData((state) => ({ ...state, loading: true }));
          Requests()
            .CommonRequest.get({
              url,
              headers: { CompanyIdentifier: companyIdentifier },
            })
            .then(() => {
              if (item.refresh === true) {
                setTableData((state) => ({ ...state, loading: true }));
              }
              MySwal.fire(
                MySwalData("success", { text: item.dialog.successText })
              );
              setTableData((state) => ({ ...state, loading: false }));
              refreshSubject.next();
            })
            .catch((error) => {
              MySwal.fire(
                MySwalData("error", { text: resErrorMessage(error) })
              );
              setTableData((state) => ({ ...state, loading: false }));
            });
        }
      });
    } else if (item.target === "downloadredirect") {
      MySwal.fire(
        MySwalData("custom", {
          title: item.dialog.title,
          text: item.dialog.text,
          icon: item.dialog.icon,
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: item.dialog.confirmButtonText,
          cancelButtonText: item.dialog.cancelButtonText,
        })
      ).then((result) => {
        if (result.isConfirmed) {
          getDownloadRedirect(`${FILE_SERVER}/${row[item?.view]}`);
        }
      });
    } else if (item.target === "blank") {
      window.open(
        `/${item.entityName}${item.mode === "index" ? "" : "/" + item.mode}?${
          item.params
        }=${row.Id}${CI ? "&CI=" + CI : ""}`
      );
    } else {
      //item.target === 'self'
      navigate(
        `/${item.entityName}${item.mode === "index" ? "" : "/" + item.mode}?${
          item.params
        }=${row.Id}${CI ? "&CI=" + CI : ""}`
      );
    }
  };

  const isCompleted = (loading, completed, error) => {
    setTableData((state) => ({ ...state, loading: loading }));
    if (completed === true && error) {
      dispatch(
        setPopup({
          display: true,
          class: "danger",
          message: { title: "HATA", body: error },
        })
      );
      selectedRows = [];
    } else if (completed === true && !checkIf(error)) {
      refreshSubject.next();
      dispatch(
        setPopup({
          display: true,
          class: "success",
          message: { title: "BAŞARILI", body: "İşlem başarıyla tamamlandı." },
        })
      );
      selectedRows = [];
    }
  };
  const handleSelectableRowsButtonClick = (e, model) => {
    if (selectedRows.length === 0) {
      return dispatch(
        setPopup({
          display: true,
          class: "warning",
          message: { title: "UYARI", body: "Lütfen, önce seçim yapınız!" },
        })
      );
    } else if (model && model?.active) {
      if (model.active === true) {
        let isActiveField = selectedRows.map((row) => ({
          ...row,
          isActive: true,
        }));
        const url = getEntityUrl({ api: { port: model.port, url: model.url } });
        setTableData((state) => ({ ...state, loading: true }));
        Requests()
          .CommonRequest.put({
            url,
            content: isActiveField,
            headers: {
              CompanyIdentifier: companyIdentifier,
            },
          })
          .then(() => {
            setTableData((state) => ({ ...state, loading: false }));
            refreshSubject.next();
            MySwal.fire(MySwalData("success"));
            selectedRows = [];
          })
          .catch((error) => {
            setTableData((state) => ({ ...state, loading: false }));
            refreshSubject.next();
            MySwal.fire(MySwalData("error", { text: resErrorMessage(error) }));
            selectedRows = [];
          });
      }
    } else if (model && model?.passive) {
      if (model.passive === true) {
        let isActiveField = selectedRows.map((row) => ({
          ...row,
          isActive: false,
        }));
        const url = getEntityUrl({ api: { port: model.port, url: model.url } });
        setTableData((state) => ({ ...state, loading: true }));
        Requests()
          .CommonRequest.put({
            url,
            content: isActiveField,
            headers: {
              CompanyIdentifier: companyIdentifier,
            },
          })
          .then(() => {
            setTableData((state) => ({ ...state, loading: false }));
            refreshSubject.next();
            MySwal.fire(MySwalData("success"));
            selectedRows = [];
          })
          .catch((error) => {
            setTableData((state) => ({ ...state, loading: false }));
            refreshSubject.next();
            MySwal.fire(MySwalData("error", { text: resErrorMessage(error) }));
            selectedRows = [];
          });
      }
    } else if (model && model?.print) {
      let mediaPathList = selectedRows?.map((row) => {
        return `${FILE_SERVER}/${row.MediaPath}`;
      });
      if (mediaPathList && mediaPathList.length > 0)
        getDownloadRedirect(mediaPathList);
      selectedRows = [];
    } else {
      if (model.get === true) {
        let idList = selectedRows.map((row) => row.Id);
        const url =
          getEntityUrl({ api: { port: model.port, url: model.url } }) +
          idList?.join(",");
        getModel(e, { url, companyIdentifier }, isCompleted);
      }
    }
  };

  const handleSelectedRowsHeader = (e, refElement, refElements, rows) => {
    let allTableData = tableData.data;
    if (e.target.checked === true) {
      selectedRows = [];
      selectedRows = props?.group?.selectAllData
        ? [...allTableData]
        : [...rows];
      refElements.forEach((element) => {
        if (checkIf(element.current)) {
          element.current.checked = true;
        }
      });
    } else {
      selectedRows = [];
      refElements.forEach((element) => {
        if (checkIf(element.current)) {
          element.current.checked = false;
        }
      });
    }
  };
  const handleSelectedRows = (e, row) => {
    if (e.target.checked === true) {
      selectedRows = [...selectedRows, row];
    } else {
      for (let index = 0; index < selectedRows.length; index++) {
        const element = selectedRows[index];
        if (element.Id === row.Id) {
          selectedRows.splice(index, 1);
        }
      }
    }
  };

  const componentSettings = (props, row) => {
    setComponentState({
      ...componentState,
      show: true,
      boundId: props.boundId,
      component: { ...props.component, currentRow: row },
    });
  };

  // START Import - Export functions
  const handleModalCreateClose = () => {
    setActionModalCreate(false);
  };
  const handleModalEditClose = () => {
    setActionModalEdit(false);
  };
  const refresh = () => {
    refreshSubject.next();
    setImportMode(false);
  };

  useEffect(() => {
    getColumns();
  }, [tableData, asset]);

  const getColumns = () => {
    let columns = [];
    props.fields.forEach((field) => {
      // check if "view" active for that field
      if (field.visibility.view) {
        columns.push({
          name: field.label,
          sortable: field.sortable,
          maxWidth: field.maxWidth,
          minWidth: field.minWidth,
          selector:
            field.type === "checkbox" ||
            field.type === "radio" ||
            field.type === "select" ||
            field.type === "checkboxButton" ||
            field.type === "payrollStatusButton" ||
            field.type === "StatusText" ||
            field.type === "TooltipText" ||
            field.type === "TooltipView" ||
            field.type === "date" ||
            field.type === "datetime" ||
            field.type === "MediaName" ||
            field.type === "downloadMedia" ||
            field.type === "checkboxAction" ||
            field.type === "action"
              ? (row, index) =>
                  getColumnsSelector({
                    field,
                    row,
                    index,
                    customCheckboxRef,
                    updateRow: checkBoxActionUpdateRow,
                    actionRow,
                    tableComponent: true,
                    checkBoxActionUpdateRow,
                    data,
                    loading: (e) => {
                      setTableData({ ...tableData, loading: e });
                    },
                    ...props,
                  })
              : checkCompanyRelated(field)
              ? (row) =>
                  findCompany("CompanyIdentifier", row[field.model.view])
                    ?.CompanyName
              : field.model.view,
        });
      }
    });
    if (props.group.selectableRows === true) {
      columns.push({
        name: (
          <SelectableRowsCheckBoxHeaderComponent
            handleSelectedRowsHeader={handleSelectedRowsHeader}
          />
        ),
        cell: (row) => (
          <SelectableRowsCheckBoxComponent
            row={row}
            handleSelectedRows={handleSelectedRows}
          />
        ),
        allowOverflow: true,
        button: true,
      });
    }
    if (props.group.actionsDisplay !== false) {
      columns.push({
        name: "İşlemler",
        cell: (row) => (
          <Popover.Root>
            <Popover.Trigger>
              <button className="btn">
                <Icon icon="BsThreeDots" className={"text-xl text-gray-800"} />
              </button>
            </Popover.Trigger>
            <Popover.Content>
              <Flex gap="3" direction="column">
                {(row.EntityPermissions?.IsView || true) && (
                  <button
                    className="btn btn-light"
                    disabled={Boolean(props.readonly)}
                    key={"view" + row.label}
                    onClick={(event) => editRow(event, row, true)}
                  >
                    <Icon icon="FaSearch" /> <div>Görüntüle</div>
                  </button>
                )}
                {row.EntityPermissions?.IsEdit && (
                  <button
                    className="btn btn-warning"
                    key={"edit" + row.label}
                    disabled={Boolean(props.readonly)}
                    onClick={(event) => editRow(event, row, false)}
                  >
                    <Icon icon="FaEdit" /> Düzenle
                  </button>
                )}
                {row.EntityPermissions?.IsDelete && (
                  <button
                    className="btn btn-danger"
                    disabled={Boolean(props.readonly)}
                    key={"delete" + row.label}
                    onClick={(event) => deleteRow(event, row)}
                  >
                    <Icon icon="FaTrashAlt" /> Sil
                  </button>
                )}
                {row.EntityPermissions?.IsHistory && (
                  <button
                    className="btn btn-primary"
                    disabled={Boolean(props.readonly)}
                    key={"history" + row.label}
                    onClick={(event) => historyRow(event, row)}
                  >
                    <Icon icon="FaHourglassHalf" /> Tarihçe
                  </button>
                )}
              </Flex>
            </Popover.Content>
          </Popover.Root>
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
      });
    }
    setNewColumns(columns);
  };

  const getSelectableRowsModels = () => {
    let selectableRowsModels =
      Array.isArray(props.group.selectableRowsModel) &&
      props.group.selectableRowsModel.length > 0
        ? [...props.group.selectableRowsModel]
        : [{ ...props.group.selectableRowsModel }];

    const arr =
      selectableRowsModels &&
      selectableRowsModels.length > 0 &&
      selectableRowsModels.map((selectableRow) => {
        if (
          selectableRow?.privilege &&
          !checkPrivilegesInRoles(selectableRow.privilege, userRoles)
        ) {
          return null;
        } else if (selectableRow && selectableRow?.active) {
          return (
            <TooltipComp
              key={"allActiveRows"}
              tooltipContent={selectableRow.label}
            >
              <button
                disabled={Boolean(props.readonly)}
                data-tip
                className={`btn table-header-btn ${selectableRow.variant}`}
                onClick={(e) =>
                  handleSelectableRowsButtonClick(e, selectableRow)
                }
              >
                <Icon icon={selectableRow.icon} />
              </button>
            </TooltipComp>
          );
        } else if (selectableRow && selectableRow?.passive) {
          return (
            <TooltipComp
              key={"allActiveRows"}
              tooltipContent={selectableRow.label}
            >
              <button
                disabled={Boolean(props.readonly)}
                data-tip
                className={`btn table-header-btn ${selectableRow.variant}`}
                onClick={(e) =>
                  handleSelectableRowsButtonClick(e, selectableRow)
                }
              >
                <Icon icon={selectableRow.icon} />
              </button>
            </TooltipComp>
          );
        } else if (selectableRow && selectableRow?.print) {
          return (
            <TooltipComp
              key={"downloadRows"}
              tooltipContent={selectableRow.label}
            >
              <button
                disabled={Boolean(props.readonly)}
                data-tip
                className={`btn table-header-btn ${selectableRow.icon}`}
                onClick={(e) =>
                  handleSelectableRowsButtonClick(e, selectableRow)
                }
              >
                <Icon icon="FaDownload" />
              </button>
            </TooltipComp>
          );
        } else {
          return (
            <TooltipComp
              key={"deleteRows"}
              tooltipContent={selectableRow.label}
            >
              <button
                disabled={Boolean(props.readonly)}
                data-tip
                className={`btn table-header-btn ${selectableRow.icon}`}
                onClick={(e) =>
                  handleSelectableRowsButtonClick(e, selectableRow)
                }
              >
                <Icon icon="FaTimes" />
              </button>
            </TooltipComp>
          );
        }
      });
    return arr;
  };
  const SubComponent = () => {
    return (
      <div className="flex items-center justify-end">
        {props?.group?.searchBox !== false && (
          <div key={"filter-text"} className="header-search">
            <input
              className="form-input"
              type="text"
              placeholder="Anahtar kelime"
              aria-label="Anahtar kelime"
              value={filterText}
              onChange={handleTextChange}
            />
            <button
              className="header-search-btn"
              type="button"
              onClick={() => setFilterText("")}
            >
              X
            </button>
          </div>
        )}
        {!(props.group.actions?.create === false) &&
          checkPrivilegeWithType(
            props.group?.headerActionsPrivilege?.create,
            "show",
            userRoles
          ) &&
          (!props.component ? (
            <TooltipComp tooltipContent={"Ekle"}>
              <button
                disabled={
                  props?.group?.actionView?.addButton
                    ? props?.group?.priviligeCreateButton?.id
                      ? !checkPrivilegeInRoles(
                          props?.group?.priviligeCreateButton?.id,
                          userRoles
                        )
                      : false
                    : Boolean(props.readonly)
                }
                data-tip
                className="btn btn-success table-header-btn"
                onClick={createNew}
              >
                <Icon icon="FaPlus" />
              </button>
            </TooltipComp>
          ) : (
            <TooltipComp key={"add"} tooltipContent={"Ekle"}>
              <button
                disabled={Boolean(props.readonly)}
                data-tip
                className="btn btn-success table-header-btn"
                onClick={() => componentSettings(props)}
              >
                <Icon icon="FaPlus" />
              </button>
            </TooltipComp>
          ))}
        {props.group.actions?.rule && (
          <>
            <TooltipComp key={"ruleGroup"} tooltipContent={"Kural Grubu"}>
              <button
                disabled={Boolean(props.readonly)}
                data-tip
                className="btn btn-success mx-0.5 cursor-pointer px-4 py-2"
                onClick={() => ruleAdd(props?.group?.actions?.rule, "group")}
              >
                G
              </button>
            </TooltipComp>
            <TooltipComp key={"rule"} tooltipContent={"Kural"}>
              <button
                disabled={Boolean(props.readonly)}
                data-tip
                className="btn btn-success mx-0.5 cursor-pointer px-4 py-2"
                onClick={() => ruleAdd(props?.group?.actions?.rule, "rule")}
              >
                K
              </button>
            </TooltipComp>
          </>
        )}
        {props.group.selectableRowsModel && getSelectableRowsModels()}
        {props.group.process && props.group.process.import === true && (
          <TooltipComp tooltipContent={"Excel Ayarları"}>
            <Dropdown.Root data-for="createToolExcel">
              <Dropdown.Trigger size="sm" variant="success" id="dropdown-basic">
                <Icon icon="FaFileExcel" />
              </Dropdown.Trigger>
              <Dropdown.Portal>
                <Dropdown.Content sideOffset={5}>
                  <Dropdown.Item onClick={() => setImportModalShow(true)}>
                    <Icon icon="FaFileImport" /> Excel İçe Aktar
                  </Dropdown.Item>
                  {props.group.process &&
                  props.group.process.export === false ? null : (
                    <Dropdown.Item onClick={() => setExportModalShow(true)}>
                      <Icon icon="FaFileExport" /> Excel Dışa Aktar
                    </Dropdown.Item>
                  )}
                  <Dropdown.Item
                    onClick={() =>
                      getDownloadRedirect(
                        `${FILE_SERVER}/site/samples/${props.group.process.name}.xlsx`
                      )
                    }
                  >
                    <Icon icon="FaFile" />
                    Örnek Excel Dosyası
                  </Dropdown.Item>
                  <Dropdown.Arrow className="fill-white" />
                </Dropdown.Content>
              </Dropdown.Portal>
            </Dropdown.Root>
          </TooltipComp>
        )}
      </div>
    );
  };
  const getSelectableRowsModel = (actions, selectableRow) => {
    if (
      selectableRow?.privilege &&
      !checkPrivilegesInRoles(selectableRow.privilege, userRoles)
    ) {
    } else if (selectableRow && selectableRow?.print) {
      actions.push(
        <TooltipComp key={"downloadRows"} tooltipContent={selectableRow.label}>
          <button
            disabled={Boolean(props.readonly)}
            data-tip
            className={`btn-moor ${selectableRow.icon}`}
            onClick={(e) => handleSelectableRowsButtonClick(e, selectableRow)}
          >
            <Icon icon="FaDownload" />
          </button>
        </TooltipComp>
      );
    } else {
      actions.push(
        <TooltipComp key={"deleteRows"} tooltipContent={selectableRow.label}>
          <button
            disabled={Boolean(props.readonly)}
            data-tip
            className={`btn-moor ${selectableRow.icon}`}
            onClick={(e) => handleSelectableRowsButtonClick(e, selectableRow)}
          >
            <Icon icon="FaTimes" />
          </button>
        </TooltipComp>
      );
    }
    return actions;
  };
  const {
    searchSubject,
    refreshSubject,
    combined: searchResultObservable,
  } = useBehaviorSubject(props.group.model, setTableData);
  useObservable(searchResultObservable, setTableData);

  useEffect(() => {
    // Tazminat ve Sigortalı ekranlarında altta yer alan sekmelerde sorgu parametresi için case'ler eklendi.
    // group.model bilgisi değişirse burası çalışmaz.
    setQueryParam(
      objectInterpolate({ ...props.group.service.params }, updateEntityId)
        .filters
    );
    if (
      props.group?.model === "insurednotes" ||
      props.group?.model === "insuredexclusions"
    ) {
      searchSubject.next({
        url,
        params: objectInterpolate(
          { ...props.group.service.params },
          currentEntity?.InsuredId
        ),
        identifier: companyIdentifier,
        headers,
      });
    } else if (props.group?.model === "contactnotes") {
      searchSubject.next({
        url,
        params: objectInterpolate(
          { ...props.group.service.params },
          currentEntity?.Insured?.ContactId
        ),
        identifier: companyIdentifier,
        headers,
      });
    } else if (
      props.group?.model === "contactNotes" ||
      props.group?.model === "ContactBankAccounts"
    ) {
      searchSubject.next({
        url,
        params: objectInterpolate(
          { ...props.group.service.params },
          currentEntity?.ContactId
        ),
        identifier: companyIdentifier,
        headers,
      });
    } else if (props.group?.model === "insuredExclusions") {
      searchSubject.next({
        url,
        params: objectInterpolate(
          { ...props.group.service.params },
          currentEntity?.Id
        ),
        identifier: companyIdentifier,
        headers,
      });
    } else {
      searchSubject.next({
        url,
        returnModel: props?.group?.service?.returnModel ?? null,
        params: objectInterpolate(
          { ...props.group.service.params },
          updateEntityId
        ),
        identifier: companyIdentifier,
        headers,
      });
    }
  }, [updateEntityId]);

  useEffect(() => {
    if (tableData?.data?.length > 0 && newColumns?.length > 0) {
      combineData(newColumns, tableData?.data).then((res) => {
        setCleanData(res);
      });
    } else {
      setCleanData([]);
    }
  }, [tableData, newColumns]);

  return (
    <>
      {props.group.label && (
        <div className="modal-header col-12 p-2">
          <div className=" h6">{props.group.label}</div>
        </div>
      )}
      {tableData?.loading && <Loading />}
      {importMode ? null : (
        <>
          <SubComponent />
          <MuiPaper
            elevation={0}
            className={`table-area ${asset} index rounded-lg`}
          >
            <DataTable
              noDataComponent={
                <div className=" flex h-32 items-center text-lg text-gray-500">
                  {tableData?.isFiltering && tableData?.data.length < 1
                    ? "Kayıt bulunamamıştır."
                    : "Verileri görüntülemek için filtreleme yapınız."}
                </div>
              }
              fixedHeader={true}
              persistTableHead={true}
              key={"table" + props.group.model}
              title={props.group.label}
              columns={newColumns}
              data={
                cleanData?.length > 0 ? cleanData?.filter(filterFunction) : []
              }
              striped
              pagination={props?.group?.pagination === false ? false : true}
              subHeader
              paginationComponent={DataTablePaginationComponent}
            />
          </MuiPaper>
        </>
      )}
      {modalShow && (
        <MyModal
          {...props}
          show={modalShow.show}
          readonly={modalShow.readonly}
          initialData={editModalData}
          close={handleModalClose}
          currentEntity={currentEntity}
          refresh={refresh}
        />
      )}
      {actionModal.show && (
        <Modal
          size="xl"
          open={actionModal.show}
          onClose={() => setActionModal((state) => ({ ...state, show: false }))}
          title={actionModal.item.label}
        >
          {actionModal.item.mode === "create" && (
            <AssetCreate
              isModal={true}
              asset={actionModal.item.entityName}
              id={actionModal.boundId}
              clickedRow={actionModal.clickedRow}
              isBoundEntity={true}
            />
          )}
          {actionModal.item.mode === "edit" && (
            <AssetEdit
              isModal={true}
              asset={actionModal.item.entityName}
              id={actionModal.boundId}
              isBoundEntity={true}
            />
          )}
          {actionModal.item.mode === "index" && (
            <AssetIndex
              asset={actionModal.item.entityName}
              id={actionModal.boundId}
              isBoundEntity={true}
            />
          )}
        </Modal>
      )}
      {historyData.showHistory && (
        <History
          data={historyData}
          onClose={() =>
            setHistoryData((state) => ({ ...state, showHistory: false }))
          }
        />
      )}
      {ruleAddModal.show && (
        <RuleAddComponent
          boundId={ruleAddModal.boundId}
          data={ruleAddModal}
          onClose={ruleAddModalClose}
        />
      )}
      <ExcelImportModal
        setImportModalShow={setImportModalShow}
        data={data}
        asset={asset}
        importModel={{}}
        assetModel={props}
        importMode={importMode}
        setImportMode={setImportMode}
        importModalShow={importModalShow}
        fromTableComp={true}
        tableRefresh={refresh}
      />
      {exportModalShow && (
        <Export
          tableName={props.group.exportName}
          queryParam={queryParam}
          assetMode={props.group.model}
          onClose={() => setExportModalShow(false)}
          exportModel={[]}
        />
      )}
      <Modal
        open={actionModalCreate}
        onClose={() => setActionModalCreate(false)}
        title={`${props.name} Ekle`}
      >
        <AssetCreate
          isModal={true}
          asset={asset}
          id={props.id}
          boundCI={props.boundCI}
          isBoundEntity={true}
          onClose={handleModalCreateClose}
        />
      </Modal>
      <Modal
        open={actionModalEdit}
        onClose={() => setActionModalEdit(false)}
        title={`${props.name} Düzenle`}
      >
        <AssetEdit
          isModal={true}
          asset={asset}
          id={currentEntity?.Id}
          boundCI={props.boundCI}
          isBoundEntity={true}
          onClose={handleModalEditClose}
        />
      </Modal>
      {componentState.show && (
        <DynamicComponent
          component={componentState.component}
          modalShow={componentState.show}
          boundId={componentState.boundId}
          refresh={refresh}
          handleClose={() =>
            setComponentState({ ...componentState, show: false })
          }
        ></DynamicComponent>
      )}
    </>
  );
}

export default memo(TableComponent);
