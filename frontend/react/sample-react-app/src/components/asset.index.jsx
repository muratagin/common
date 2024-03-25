import { Requests } from "@app/api";
import { FILE_SERVER, MASTER_IDENTIFIER } from "@app/constant";
import { MySwalData } from "@libs/myswaldata";
import {
  getAsset,
  getCloneUrl,
  getEntityUrl,
  getServiceUrl,
} from "@libs/parser";
import {
  addIdentifierLocationSearch,
  checkCompanyRelated,
  checkIf,
  checkIfCompanyIdentifierFoundUrl,
  checkIfIsEmpty,
  combineData,
  errorData,
  extract,
  findCompany,
  findCompanyIdentifier,
  getColumnCount,
  getDownload,
  getDownloadRedirect,
  getFirstQueryParameter,
  getQueryParameterValue,
  interpolateUrl,
  interpolateValue,
  isObject,
  isObjectIsNotEmpty,
  objectInterpolate,
  resErrorMessage,
  trimIf,
} from "@libs/utils";
import { fetchAsync, useObservable } from "@pages/asset";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import {
  setCurrentEntity,
  setIdentifier,
  setPopup,
} from "@slices/selectionSlice";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { BehaviorSubject, combineLatest } from "rxjs";
import { switchMap } from "rxjs/operators";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import { FIELD_TYPES } from "@app/enum";
import { settings } from "@app/settings";
import useResizeObserver from "@hooks/useResizeObserver";
import { getColumnsSelector } from "@libs/columns.selector";
import FormBuilder from "@libs/form.builder";
import Loading from "@libs/loading";
import { Toastr } from "@libs/toastr";
import { Paper as MuiPaper } from "@mui/material";
import { Flex, Popover } from "@radix-ui/themes";
import DataTable from "react-data-table-component";
import TooltipComp from "./TooltipComp";
import { AssetCreate } from "./asset.create";
import { AssetEdit } from "./asset.edit";
import AssetHeaderButton from "./asset.header.button";
import {
  DataTableInfoComponent,
  DataTablePaginationComponent,
} from "./data.table.pagination.component";
import DynamicComponent from "./dynamic.component";
import ExcelImportModal from "./excel.import";
import Export from "./export";
import History from "./history";
import Icon from "./icon";
import Modal from "./modal";

export function AssetIndex(props) {
  const isModal = props.isModal;
  const asset = props.asset;
  const data = getAsset(asset);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const MySwal = withReactContent(Swal);
  const [clickedRow, setClickedRow] = useState({});
  const [clickedRowImport, setClickedRowImport] = useState({});
  const [clickedRowExport, setClickedRowExport] = useState({});
  const [importMode, setImportMode] = useState(false);
  const { user } = useSelector((state) => state.user);
  const { DataTableSettings } = useSelector((state) => state.user.userSettings);
  const roles = user?.Roles;
  const [exportFilterData, setExportFilterData] = useState();
  const [queryParam, setQueryParam] = useState();
  const [importModalShow, setImportModalShow] = useState(false);
  const [exportModalShow, setExportModalShow] = useState(false);
  const [exportModel, setExportModel] = useState([]);
  const [actionModal, setActionModal] = useState({ show: false });
  const [actionModalCreate, setActionModalCreate] = useState(false);
  const [actionModalEdit, setActionModalEdit] = useState(false);
  const boundParam = getQueryParameterValue(getFirstQueryParameter());
  const tableViewMode = !Boolean(data?.model && data?.model?.view === false);
  const [filterText, setFilterText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [newColumns, setNewColumns] = useState([]);
  const companyIdentifierOnStore = useSelector(
    (state) => state.selection.identifier
  );
  const [tableData, setTableData] = useState({
    loading: false,
    totalRows: 0,
    data: [],
  });
  const [historyData, setHistoryData] = useState({
    showHistory: false,
    rowId: undefined,
    entity: undefined,
  });
  const [importModel, setImportModel] = useState({});
  const refElement = useRef(null);
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const customCheckboxRef = useRef();
  const modalRef = useRef();
  const dimensions = useResizeObserver(modalRef);
  const [cleanData, setCleanData] = useState([]);
  const [dataTableOnSort, setDataTableOnSort] = useState(false); // false = asc, true=desc

  const companyIdentifier = checkIf(props.boundCI)
    ? props.boundCI
    : companyIdentifierOnStore;
  const currentEntity = useSelector((state) => state.selection.currentEntity);
  let selectedRows = [];

  const {
    searchSubject,
    refreshSubject,
    combined: searchResultObservable,
  } = useMemo(() => {
    setClickedRow({});
    let behaviorSubj = {};
    let resultObservable = {};
    behaviorSubj[asset] = {
      searchSubject: new BehaviorSubject(),
      refreshSubject: new BehaviorSubject(),
    };
    resultObservable[asset] = combineLatest(
      behaviorSubj[asset].searchSubject,
      behaviorSubj[asset].refreshSubject
    ).pipe(
      switchMap(([searchSubject]) => {
        return fetchAsync({ ...searchSubject });
      })
    );
    return { ...behaviorSubj[asset], combined: resultObservable[asset] };
  }, [asset]);

  useObservable(searchResultObservable, setTableData);

  const filterSubmit = useCallback(
    (
      isFilterButton,
      formData,
      boundParam,
      identifier,
      clickedRow,
      externalQueryParam
    ) => {
      let headers;
      // check if filter is entered or query is allowed for this entity in feed.js
      let checkAnyFilterProp =
        checkIf(formData) &&
        Object.values(formData).some(
          (param) => trimIf(param.value) !== "" && param.value !== null
        );
      if (
        checkAnyFilterProp ||
        checkIf(boundParam) ||
        data.filter?.withoutFilter === true
      ) {
        // check if identifier is MASTER and query with Master Identifier is allowed in feed.js for this entity
        if (
          (identifier === MASTER_IDENTIFIER ||
            (!identifier && companyIdentifier === MASTER_IDENTIFIER)) &&
          data.filter?.withMaster !== true &&
          settings.isTpa !== false
        ) {
          let checkCompanyIdInFormData =
            formData &&
            Object.getOwnPropertyNames(formData).some(
              (key) => key !== "" && key === "CompanyId"
            );
          dispatch(
            setPopup({
              display: true,
              class: "warning",
              message: {
                title: "UYARI",
                body: checkCompanyIdInFormData
                  ? "Lütfen, şirket seçimi yapınız!"
                  : "Şirket bazında sorgulama yapılmalı!",
              },
            })
          );
        } else {
          let params;
          let url = getEntityUrl(data);

          if (checkIf(data.api?.additionalFilters)) {
            let additionalFilters = data.api.additionalFilters;
            if (!checkIf(formData)) {
              formData = {};
            }
            Object.entries(additionalFilters).forEach(([key, value]) => {
              if (!checkIf(formData[key]?.value)) {
                if (typeof value === "object") {
                  let obj = value;
                  Object.keys(obj).map((item, index) => {
                    obj[item] = interpolateValue(obj[item], boundParam || "");
                  });
                  formData[key] = obj;
                } else {
                  formData[key] = {
                    value: interpolateValue(value, boundParam || ""),
                  };
                }
              }
            });
            if (asset === "claimAddToBill" && isObjectIsNotEmpty(clickedRow)) {
              formData["ClaimType"].value = clickedRow["Category"]["Ordinal"];
              formData["ProviderId"].value = clickedRow?.ProviderId;
            }
          } else {
            const queryString = window.location.search;
            if (
              checkIf(queryString) &&
              trimIf(queryString) !== "" &&
              (!checkIf(data.includeUrlParams) ||
                data.includeUrlParams !== false)
            ) {
              const urlParams = new URLSearchParams(queryString);
              if (!checkIf(formData)) {
                formData = {};
              }
              for (const entry of urlParams.entries()) {
                formData[`${entry[0]}`] = { value: `${entry[1]}` };
              }
            }
          }

          if (checkIf(boundParam)) {
            url = interpolateUrl(url, boundParam);
          }

          if (checkIf(data.api?.params)) {
            params = objectInterpolate(data.api.params, boundParam || "");
          }
          if (
            checkIf(data.api?.headers) &&
            isObjectIsNotEmpty(data.api?.headers)
          ) {
            headers = { ...data.api.headers };
          }

          setExportFilterData(formData);
          setQueryParam(externalQueryParam);
          if (tableViewMode) {
            setTableData((state) => ({ ...state, loading: true }));
            searchSubject.next({
              filterData: formData,
              url,
              params,
              headers,
              orderBy: data?.api?.orderBy,
              identifier: identifier || companyIdentifier,
              page: data.api.params?.page || 1,
              pageSize: data.api.params?.pageSize || 10,
            });
            setResetPaginationToggle(!resetPaginationToggle);
          } else {
            // means if view mode is disabled
            // especially when direct excel export is of concern
            // at this point submit button refers to export button
            if (data?.instantReport) {
            } else setExportModalShow(true);
          }
        }
      } else if (isFilterButton) {
        // if filter button is pressed, do nothing while coming from url or elsewhere
        dispatch(
          setPopup({
            display: true,
            class: "warning",
            message: { title: "UYARI", body: "Lütfen, filtre seçimi yapınız!" },
          })
        );
      }
    },
    [asset, companyIdentifier]
  );

  const handlePerRowsChange = (perPage) => {
    setTableData((state) => ({ ...state, loading: true }));
    let newSearchSubject = searchSubject.value;
    newSearchSubject["page"] = 1;
    newSearchSubject["pageSize"] = perPage;
    searchSubject.next(newSearchSubject);
  };
  const handlePageChange = (page) => {
    setTableData((state) => ({ ...state, loading: true }));
    let newSearchSubject = searchSubject.value;
    newSearchSubject["page"] = page;
    searchSubject.next(newSearchSubject);
  };

  const handleRefresh = () => {
    refreshSubject.next();
    setActionModal((state) => {
      return {
        ...state,
        show: false,
      };
    });
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

  const handleSelectedRowsHeader = (e, refElement, refElements, rows) => {
    if (e.target.checked === true) {
      selectedRows = [];
      selectedRows = [...rows];
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

  const isLoading = (value, error) => {
    setTableData((state) => ({ ...state, loading: value }));
    if (error) {
      MySwal.fire(MySwalData("error", { text: resErrorMessage(error) }));
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
    }
    if (model.print === true) {
      let idList = selectedRows.map((row) => row.Id);
      let modelUrl = model.url + idList?.join(",");
      let url = getEntityUrl({ api: { port: model.port, url: modelUrl } });
      getDownload(e, { url, companyIdentifier }, isLoading);
    }
    if (model.download === true) {
      for (const row of selectedRows) {
        row?.MediaPath &&
          getDownloadRedirect(`${FILE_SERVER}/${row?.MediaPath}`);
      }
    }
  };

  const editRow = (e, row) => {
    e.preventDefault();
    e.stopPropagation();
    let locationSrc = addIdentifierLocationSearch(row);
    if (
      asset === "insurednotes" ||
      asset === "contactnotes" ||
      asset === "payrollnotelist" ||
      asset === "productNetworkNotes"
    ) {
      dispatch(setCurrentEntity(row));
      setActionModalEdit(true);
    } else if (asset === "imc") {
      window.open(`${asset}/edit/${row.PackageId}${locationSrc}`);
    } else {
      // find if a row contains companyRelated data
      // if so set identifier
      if (data.editName) {
        let CI =
          row.CompanyIdentifier || companyIdentifier
            ? "?CI=" + (row.CompanyIdentifier || companyIdentifier)
            : "";
        navigate(`${data.viewName}/view/${row.Id}${CI}`);
      } else {
        window.open(`${asset}/edit/${row.Id}${locationSrc}`);
      }
    }
  };
  const viewRow = (e, row) => {
    e.preventDefault();
    e.stopPropagation();

    // find if a row contains companyRelated data
    // if so set identifier
    let locationSrc = addIdentifierLocationSearch(row);
    if (data.viewName) {
      let CI =
        row.CompanyIdentifier || companyIdentifier
          ? "?CI=" + (row.CompanyIdentifier || companyIdentifier)
          : "";
      navigate(`/${data.viewName}/view/${row.Id}${CI}`);
    } else if (data.newWindow === true) {
      window.open(`${asset}/view/${row.Id}${locationSrc}`);
    } else {
      navigate(`/${asset}/view/${row.Id}${locationSrc}`);
    }
  };
  const cloneRow = (e, row) => {
    e.preventDefault();
    e.stopPropagation();

    let url = getCloneUrl(data, row.Id);

    MySwal.fire(MySwalData("clone")).then((result) => {
      if (result.isConfirmed) {
        setTableData((state) => ({ ...state, loading: true }));
        Requests()
          .CommonRequest.get({
            url,
            headers: {
              CompanyIdentifier: row.CompanyIdentifier || companyIdentifier,
            },
          })
          .then((response) => {
            refreshSubject.next();
            MySwal.fire(
              MySwalData("success", { text: "Klonlama işlemi gerçekleşti." })
            );
          })
          .catch((error) => {
            MySwal.fire(MySwalData("error", { text: resErrorMessage(error) }));
            setTableData((state) => ({ ...state, loading: false }));
          });
      }
    });
  };

  const deleteRow = async (e, row) => {
    e.preventDefault();
    e.stopPropagation();
    let url = getEntityUrl(data).split("?")[0];
    let match = location.pathname.match("/emailinformation");
    MySwal.fire(MySwalData("delete")).then((result) => {
      if (result.isConfirmed) {
        Requests()
          .CommonRequest.delete({
            url,
            content: { id: row.Id },
            headers: {
              CompanyIdentifier: match
                ? MASTER_IDENTIFIER
                : row.CompanyIdentifier || companyIdentifier,
            },
          })
          .then((response) => {
            setTableData((state) => ({ ...state, loading: true }));
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
  const updateRow = async (value, row, field) => {
    MySwal.fire(MySwalData("confirm")).then((result) => {
      if (result.isConfirmed) {
        let url = getEntityUrl(data);
        let updatedData = { ...row, [field]: value };
        Requests()
          .CommonRequest.put({
            url,
            content: updatedData,
            headers: {
              CompanyIdentifier: row.CompanyIdentifier || companyIdentifier,
            },
          })
          .then((response) => {
            MySwal.fire(MySwalData("success"));
          })
          .catch((error) => {
            refreshSubject.next();
            MySwal.fire(MySwalData("error", { text: resErrorMessage(error) }));
          });
      } else {
        customCheckboxRef.current.changeValue(!value);
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
      row: row,
      entity: data,
    }));
  };

  const actionRow = (e, row, item, externalObject, viewName, baseUrl) => {
    e.preventDefault();
    e.stopPropagation();

    // find if a row contains companyRelated data
    // if so set identifier
    let CI = row ? findCompanyIdentifier(row) : null;
    //feed.js action items useCurrentParam:true tanımlı ise filtrede gidecek boundId değeri: row içerisinde item içerisinden gelen params değerini bularak set edilir.
    let currentParamValue;
    if (item?.useCurrentParam) {
      currentParamValue = row[item?.params];
    }

    //setActionModal
    if (item.target === "popup") {
      setActionModal((state) => {
        return {
          ...state,
          show: true,
          item: item,
          boundId: currentParamValue || row?.Id || props?.id,
          boundCI: CI,
          row: row,
          clickedRow: props?.clickedRow,
          handleRefresh: handleRefresh,
        };
      });
    } else if (item.target === "ajax") {
      let url = getServiceUrl(item.service);
      url = interpolateUrl(url, row);

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
            .then((response) => {
              if (item.refresh === true) {
                setTableData((state) => ({ ...state, loading: true }));
                refreshSubject.next();
              }
              MySwal.fire(
                MySwalData("success", { text: item.dialog.successText })
              );
              setTableData((state) => ({ ...state, loading: false }));
            })
            .catch((error) => {
              dispatch(
                setPopup({
                  display: true,
                  companyIdentifier: companyIdentifier,
                  ...errorData(error),
                })
              );
              setTableData((state) => ({ ...state, loading: false }));
            });
        }
      });
    } else if (item.target === "ajaxpost") {
      let url = getServiceUrl(item.service);
      url = interpolateUrl(url, row);
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
          row["PayrollId"] = props.id;
          setTableData((state) => ({ ...state, loading: true }));
          Requests()
            .CommonRequest.post({
              url,
              content: externalObject ? externalObject : row,
              headers: { CompanyIdentifier: companyIdentifier },
            })
            .then((response) => {
              MySwal.fire(
                MySwalData("success", { text: item.dialog.successText })
              );
              refreshSubject.next();
            })
            .catch((error) => {
              dispatch(
                setPopup({
                  display: true,
                  companyIdentifier: companyIdentifier,
                  ...errorData(error),
                })
              );
              setTableData((state) => ({ ...state, loading: false }));
            });
        }
      });
    } else if (item.target === "ajaxput") {
      let url = getServiceUrl(item.service);
      url = interpolateUrl(url, row);
      if (item.withPreviosClickedRowId === true) {
        externalObject = { ...row };
        externalObject.Id = props.clickedRow.Id;
        externalObject[item.currentRowId] = row.Id;
      }
      if (item.params) {
        externalObject = { ...row };
        if (isObjectIsNotEmpty(item.params)) {
          Object.keys(item.params).forEach(
            (elem) =>
              (externalObject[elem] =
                props.clickedRow?.[extract(item.params[elem])])
          );
        }
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
          Requests()
            .CommonRequest.put({
              url: url,
              content: externalObject ? externalObject : row,
              headers: { CompanyIdentifier: companyIdentifier },
            })
            .then((response) => {
              MySwal.fire(
                MySwalData("success", { text: item.dialog.successText })
              );
              refreshSubject.next();
            })
            .catch((error) => {
              MySwal.fire(
                MySwalData("error", { text: resErrorMessage(error) })
              );
            });
        }
      });
    } else if (item.target === "ajaxdelete") {
      let url = getServiceUrl(item.service);
      url = interpolateUrl(url, row);
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
          Requests()
            .CommonRequest.delete({
              url: url,
              content: { id: row.Id },
              headers: { CompanyIdentifier: companyIdentifier },
            })
            .then((response) => {
              MySwal.fire(
                MySwalData("success", { text: item.dialog.successText })
              );
              refreshSubject.next();
            })
            .catch((error) => {
              MySwal.fire(
                MySwalData("error", { text: resErrorMessage(error) })
              );
            });
        }
      });
    } else if (item.target === "function") {
      props.onClose(e, row, props.refElement);
    } else if (item.target === "ajaxdownload") {
      let url = getServiceUrl(item.service);
      url = interpolateUrl(url, row);
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
          let item = {
            url: url,
            companyIdentifier: companyIdentifier,
          };
          getDownload(e, item, isLoading);
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
          let data = checkIfIsEmpty(baseUrl)
            ? baseUrl + row[item?.view]
            : row[item?.view];

          getDownloadRedirect(data, (loading) =>
            setTableData((state) => ({ ...state, loading }))
          );
        }
      });
    } else if (item.target === "history") {
      historyRow(e, row);
    } else if (item.target === "blank") {
      if (checkIf(viewName) && viewName == "UpdateClaim") {
        window.open(
          `/${item.entityName}${item.mode === "index" ? "" : "/" + item.mode}?${
            item.params
          }=${row.ClaimId}${CI ? "&CI=" + CI : ""}`
        );
      } else {
        window.open(
          `/${item.entityName}${item.mode === "index" ? "" : "/" + item.mode}?${
            item.params
          }=${row.Id}${CI ? "&CI=" + CI : ""}`
        );
      }
    } else if (item.target === "push") {
      if (item.mode === "edit" || item.mode === "view") {
        navigate(
          `/${item.entityName}${
            item.mode === "index" ? "" : "/" + item.mode
          }/${row.Id.toString()}`
        );
      } else if (item.mode === "create") {
        navigate(`/${item.entityName}${"/" + item.mode}`);
      } else {
        navigate(`/${item.entityName}`);
      }
    } else {
      //item.target === 'self'
      navigate(
        `/${item.entityName}${item.mode === "index" ? "" : "/" + item.mode}?${
          item.params
        }=${row.Id}${CI ? "&CI=" + CI : ""}`
      );
    }
  };

  const updateRowClicked = (clickedRow) => {
    let checkIfCompanyIdentifier = findCompanyIdentifier(clickedRow);
    checkIfCompanyIdentifier &&
      dispatch(setIdentifier(checkIfCompanyIdentifier));
    setClickedRow(clickedRow);
    setTableData((state) => {
      let newData = [...state.data];
      let foundRowIndex = newData.findIndex((row) => row.Id === clickedRow.Id);
      newData[foundRowIndex].isSelected = true;
      return {
        ...state,
        data: newData,
      };
    });
  };
  const updateCheckedRows = (select) => {
    select.selectedRows &&
      tableData?.data &&
      select.selectedRows.length > 0 &&
      setTableData((state) => {
        let newData = [...state.data];
        select.selectedRows
          .filter((selectedRow) => selectedRow.Id !== clickedRow.Id)
          .forEach((selectedRow) => {
            let foundRowIndex = newData.findIndex(
              (row) => row.Id === selectedRow.Id
            );
            newData[foundRowIndex].isSelected = false;
          });
        return {
          ...state,
          data: newData,
        };
      });
  };
  const handleSort = (column, sortDirection) => {
    if (!column?.field?.sortDisabled) {
      if (
        (column.selector && typeof column.selector !== "function") ||
        (column.selector &&
          typeof column.selector === "function" &&
          (["date", "datetime"].includes(column.type) ||
            column?.field?.sortDisabled === false))
      ) {
        setTableData((state) => ({ ...state, loading: true }));
        let newSearchSubject = searchSubject.value;
        if (checkIf(column?.field?.sortSpecialCase)) {
          //PROT-181
          let splitValue = column.field?.sortSpecialCase.split("->");
          if (splitValue[0] == column.view) {
            column.view = splitValue[1];
          }
        }
        if (
          typeof column.selector == "function" &&
          (["date", "datetime"].includes(column.type) ||
            column?.field?.sortDisabled === false)
        ) {
          //PROT-198-2
          newSearchSubject["orderBy"] =
            `${dataTableOnSort === false ? "" : "-"}` + column.view;
        } else {
          newSearchSubject["orderBy"] =
            `${sortDirection === "asc" ? "" : "-"}` + column.selector;
        }
        if (checkIf(column?.field?.sortExceptional)) {
          //PROT-183
          newSearchSubject["sortExceptional"] =
            `${sortDirection === "asc" ? "" : "-"}` +
            column?.field?.sortExceptional;
        }
        searchSubject.next(newSearchSubject);
      }
    }
  };

  const handleCreateButtonClick = () => {
    if (props.id) {
      setActionModalCreate(true);
    } else {
      dispatch(
        setPopup({
          display: true,
          class: "warning",
          message: {
            title: "UYARI",
            body: "Lütfen, sigortalı seçimi yapınız!",
          },
        })
      );
    }
  };
  const handleModalCreateClose = () => {
    let boundParam;
    if (asset === "insurednotes") {
      boundParam = props?.clickedRow?.InsuredId || props?.clickedRow?.Id;
    } else if (asset === "contactnotes") {
      boundParam = props?.clickedRow?.ContactId;
    } else {
      boundParam = props.id;
    }
    filterSubmit(false, undefined, boundParam);
    setActionModalCreate(false);
  };

  const handleModalEditClose = () => {
    filterSubmit(false, undefined, props.id);
    setActionModalEdit(false);
  };

  const handleTextChange = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFilterText(e.target.value);
  };
  const checkBoxActionUpdateRow = async (
    value,
    row,
    field,
    putService,
    externalObject
  ) => {
    MySwal.fire(MySwalData("confirm")).then((result) => {
      if (result.isConfirmed) {
        let updatedData = { ...row, [field]: value, ...externalObject };
        Requests()
          .CommonRequest.put({
            url: interpolateUrl(getServiceUrl(putService), row),
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
  const dataColumnCount = DataTableSettings?.[asset]
    ? getColumnCount(data, DataTableSettings?.[asset])
    : getColumnCount(data);

  useEffect(() => {
    getColumns();
  }, [tableData, DataTableSettings, asset]);

  const getColumns = () => {
    let columns = [];
    data.tabs[0].content.forEach((content) => {
      if (content.fields) {
        content.fields.forEach((field) => {
          // check if "view" active for that field
          if (field.visibility.view) {
            columns.push({
              name: field.label,
              sortable: true,
              view: field.model.view,
              type: field.type,
              field: field,
              omit: DataTableSettings?.[asset]?.find(
                (x) => x?.label === field?.label
              )?.omit,
              compact: true,
              center: field.type === "action" ? true : false,
              conditionalView: field.conditionalView,
              selector: (() => {
                if (FIELD_TYPES.includes(field.type)) {
                  return (row, index) =>
                    getColumnsSelector({
                      field,
                      row,
                      index,
                      refElement,
                      customCheckboxRef,
                      roles,
                      updateRow,
                      actionRow,
                      handleRefresh,
                      checkBoxActionUpdateRow,
                      data,
                    });
                }
                if (checkCompanyRelated(field)) {
                  return (row) =>
                    findCompany("CompanyIdentifier", row[field.model.view])
                      ?.CompanyShortName;
                }
                if (content.group && content.group.model) {
                  return `${content.group.model}.${field.model.view}`;
                }
                return (row, index) => {
                  let keyArr = field.model.view.split(".");
                  let value = row;
                  keyArr.map((x) => (value = value?.[x]));
                  return value?.length >= 30 && field?.textOverflow === true ? (
                    <TooltipComp key={index} tooltipContent={value}>
                      <div> {value.substr(0, 5)}...</div>
                    </TooltipComp>
                  ) : (
                    value
                  );
                };
              })(),
            });
          }
        });
      }
    });
    if (
      data.importExportModel?.importTableRows === true ||
      data.importExportModel?.exportTableRows === true
    ) {
      columns.push({
        name: "Excel Aktar",
        cell: (row) => (
          <div className="flex gap-1">
            {data.importExportModel.importTableRows === false ? null : (
              <Dropdown.Root data-tip data-for="createToolExcel">
                <Dropdown.Trigger id="dropdown-basic" asChild>
                  <div className="btn btn-success p-2">
                    <Icon icon="FaFileImport" />
                  </div>
                </Dropdown.Trigger>
                <Dropdown.Portal>
                  <Dropdown.Content className="dropdown-content" sideOffset={5}>
                    <Dropdown.Item
                      className="dropdown-item"
                      onClick={() => {
                        setClickedRowImport(row);
                        setImportModalShow(true);
                      }}
                    >
                      <Icon className="mr-1" icon="FaFileImport" /> Excel İçe
                      Aktar
                    </Dropdown.Item>
                    <Dropdown.Item
                      className="dropdown-item"
                      onClick={() =>
                        getDownloadRedirect(
                          `${FILE_SERVER}/site/samples/${data.importName}.xlsx`
                        )
                      }
                    >
                      <Icon className="mr-1" icon="FaFileExport" />
                      Örnek Excel Dosyası
                    </Dropdown.Item>
                    <Dropdown.Arrow className="fill-white" />
                  </Dropdown.Content>
                </Dropdown.Portal>
              </Dropdown.Root>
            )}
            {data.importExportModel.exportTableRows === false ? null : (
              <Dropdown.Root
                className="new-btn btn-icon excel-drop"
                data-tip
                data-for="createToolExcel"
              >
                <Dropdown.Trigger variant="success" id="dropdown-basic" asChild>
                  <div className="btn btn-primary p-2">
                    <Icon icon="FaFileExport" />
                  </div>
                </Dropdown.Trigger>
                <Dropdown.Portal>
                  <Dropdown.Content className="dropdown-content" sideOffset={5}>
                    {data.importExportModel.exportModel.map((model, index) => (
                      <Dropdown.Item
                        className="dropdown-item"
                        key={index}
                        onClick={() => {
                          setClickedRowExport(row);
                          setExportModel(model);
                          setExportModalShow(true);
                        }}
                      >
                        <Icon icon="FaFileExport" />
                        {model.label}
                      </Dropdown.Item>
                    ))}
                    <Dropdown.Arrow className="fill-white" />
                  </Dropdown.Content>
                </Dropdown.Portal>
              </Dropdown.Root>
            )}
          </div>
        ),
        allowOverflow: true,
        center: true,
        compact: true,
      });
    }
    if (data.selectableRows === true) {
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
        right: true,
        compact: true,
      });
    }
    if (data.actionsDisplay !== false) {
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
                {row.EntityPermissions?.IsEdit && (
                  <button
                    className="btn btn-warning"
                    key={"edit" + row.label}
                    onClick={(event) => {
                      checkIf(data?.actions?.edit)
                        ? actionRow(event, row, data?.actions?.edit)
                        : editRow(event, row);
                    }}
                  >
                    <Icon icon="FaEdit" /> Düzenle
                  </button>
                )}
                {row.EntityPermissions?.IsDelete && (
                  <button
                    className="btn btn-danger"
                    key={"delete" + row.label}
                    onClick={(event) => deleteRow(event, row)}
                  >
                    <Icon icon="FaTrashAlt" /> Sil
                  </button>
                )}
                {row.EntityPermissions?.IsView && (
                  <button
                    className="btn btn-light"
                    key={"view" + row.label}
                    onClick={(event) => viewRow(event, row)}
                  >
                    <Icon icon="FaSearch" /> Görüntüle
                  </button>
                )}
                {row.EntityPermissions?.IsHistory && (
                  <button
                    className="btn btn-primary"
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
        center: true,
        compact: true,
      });
    }
    setNewColumns(columns);
  };
  const [search, setSearch] = useState(false);
  useEffect(() => {
    let search = data.tabs[0].content.some((item) =>
      item.fields.some((field) => field.visibility.filter?.show)
    );
    setSearch(search);
  }, [asset, tableData, companyIdentifier, filterText]);

  useEffect(() => {
    setImportMode(false);
    setExportModalShow(false);
    //SIDEBAR : IMC modülü sayfaları IMC_IDENTIFIER ile çalışmaktadır. PRO-2010

    if (
      !checkIfCompanyIdentifierFoundUrl() &&
      !props.isBoundEntity &&
      data?.filter?.withMaster !== false
    ) {
      dispatch(setIdentifier(MASTER_IDENTIFIER));
    }

    if (
      !Boolean(props.isBoundEntity) &&
      !checkIf(boundParam) &&
      tableViewMode
    ) {
      const identifier =
        settings.isTpa === true
          ? MASTER_IDENTIFIER
          : settings.companyIdentifier;

      filterSubmit(false, undefined, undefined, identifier);
    }

    setClickedRow({});
    setExportFilterData();

    return () => {
      setCleanData([]);
    };
  }, [asset]);

  useEffect(() => {
    // check both cases when popup is present with props.id
    // also when a bound parameter is observed on url
    // where popup must take the lead
    if (checkIf(props.id) && checkIf(boundParam)) {
      filterSubmit(false, undefined, props.id, null, props?.clickedRow);
    } else if (checkIf(props.id)) {
      let id = props.id;
      if (asset === "insurednotes" || asset === "contactnotes") {
        if (asset === "insurednotes") {
          id = props?.clickedRow.Id;
        } else if (asset === "contactnotes") {
          id = props?.clickedRow?.ContactId;
        }
      }
      filterSubmit(false, undefined, id, null, props?.clickedRow);
    } else if (checkIf(boundParam)) {
      filterSubmit(false, undefined, boundParam);
    }
  }, [props.id, boundParam]);

  const handleToastrClose = () => {
    setTableData((state) => ({ ...state, error: undefined }));
  };

  useEffect(() => {
    if (tableData?.data?.length > 0 && newColumns?.length > 0) {
      if (
        tableData?.data?.length === 1 &&
        tableData?.data[0]?.IsProcessing === true &&
        tableData?.loading === false
      ) {
        setIsProcessing(true);
      } else {
        combineData(newColumns, tableData?.data).then((res) => {
          setCleanData(res);
        });
        setIsProcessing(false);
      }
    } else {
      setCleanData([]);
    }
  }, [tableData, newColumns]);

  const isOnModelView = (value) => {
    let returnValue = false;
    data.tabs[0].content[0].fields.forEach((field) => {
      if (field.model.view === value) {
        returnValue = true;
      }
    });
    return returnValue;
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
  const conditionalRowStyles = [
    {
      when: (row) => row.isSelected,
      style: {
        border: "2px solid !important",
        "border-image":
          "linear-gradient(45deg, turquoise, greenyellow) 1 !important",
      },
    },
  ];
  return (
    <>
      {tableData?.loading && <Loading />}
      {importMode ? null : (
        <>
          <div className="mb-4 rounded-lg bg-white p-4 ">
            <AssetHeaderButton
              data={data}
              actionRow={actionRow}
              asset={asset}
              handleCreateButtonClick={handleCreateButtonClick}
              setImportModel={setImportModel}
              setImportModalShow={setImportModalShow}
              handleSelectableRowsButtonClick={handleSelectableRowsButtonClick}
              setExportModalShow={setExportModalShow}
              handleTextChange={handleTextChange}
              filterText={filterText}
              setFilterText={setFilterText}
              isModal={isModal}
              searchBox={data?.searchBox}
              assetType="index"
            />
            {search && (
              <div style={{ zIndex: 2 }}>
                <FormBuilder
                  boundCI={props.boundCI}
                  boundId={props.id}
                  customSave={data.customSave}
                  filterButtons={data.filterButtons}
                  key={data.name}
                  name={data.name}
                  mode="filter"
                  assetTarget={props?.assetTarget}
                  assetMode={data.model}
                  data={data.tabs[0].content}
                  entity={data}
                  submit={filterSubmit}
                />
              </div>
            )}
          </div>
          <MuiPaper
            elevation={0}
            ref={modalRef}
            className={`table-area ${asset} index rounded-lg`}
            datacolumncount={dataColumnCount + 5}
            currenttablewidth={dimensions?.width || null}
          >
            <DataTable
              noDataComponent={
                <div className=" flex h-32 items-center text-lg text-gray-500">
                  {tableData?.isFiltering && tableData?.data.length < 1
                    ? "Aradığınız kriterlere uygun kayıt bulunamamıştır."
                    : "Verileri görüntülemek için filtreleme yapınız."}
                </div>
              }
              noHeader={true}
              fixedHeader={true}
              // title={
              //   !data?.dynamicLabel
              //     ? data?.label
              //     : data?.label + ' ' + tableData?.data[0]?.[data?.dynamicLabel]
              // }
              noContextMenu={true}
              persistTableHead={true}
              columns={newColumns}
              data={
                cleanData?.length > 0 ? cleanData?.filter(filterFunction) : []
              }
              progressComponent={Loading}
              progressPending={tableData?.loading}
              pagination={true}
              paginationServer
              paginationTotalRows={tableData?.totalRows}
              paginationResetDefaultPage={resetPaginationToggle}
              onChangeRowsPerPage={handlePerRowsChange}
              onChangePage={handlePageChange}
              subHeader
              dense={!!props.isBoundEntity}
              selectableRowsHighlight={!!data?.relationalEntities}
              pointerOnHover={!!data?.relationalEntities}
              highlightOnHover={!!data?.relationalEntities}
              conditionalRowStyles={conditionalRowStyles}
              onRowClicked={(row) =>
                clickedRow?.Id !== row?.Id &&
                !!data?.relationalEntities &&
                updateRowClicked(row)
              }
              selectableRowSelected={(row) => row.isSelected}
              onSelectedRowsChange={(select) => updateCheckedRows(select)}
              onSort={(column, sortDirection) => {
                setDataTableOnSort((state) => !state);
                handleSort(column, sortDirection);
              }}
              sortServer
              selectableRowsComponentProps={{ color: "primary" }}
              paginationComponent={
                data?.tableScroll
                  ? DataTableInfoComponent
                  : DataTablePaginationComponent
              }
            />
          </MuiPaper>
          <div key={clickedRow.Id}>
            <div className="grid  grid-cols-12 gap-3">
              {checkIf(clickedRow?.Id) &&
                data.relationalEntities?.map((rel, index) => (
                  <div
                    key={index}
                    className={`
                        max-sm:col-span-${rel.width?.xs || 6}
                        max-md:col-span-${rel.width?.sm || 4}
                        col-span-${rel.width?.lg || 3} `}
                  >
                    {rel.mode === "action" &&
                      rel.action.items.map((item) => (
                        <>
                          {item.condition ? (
                            clickedRow[item.condition] ? (
                              <GetActionItem
                                item={item}
                                clickedRow={clickedRow}
                                actionRow={actionRow}
                                {...props}
                              />
                            ) : null
                          ) : (
                            <GetActionItem
                              item={item}
                              clickedRow={clickedRow}
                              actionRow={actionRow}
                              {...props}
                            />
                          )}
                        </>
                      ))}
                    {rel.mode === "create" && <AssetCreate asset={rel.name} />}
                    {rel.mode === "edit" && (
                      <AssetEdit
                        id={clickedRow.Id}
                        asset={rel.name}
                        isBoundEntity={true}
                      />
                    )}
                    {rel.mode === "index" && (
                      <AssetIndex
                        clickedRow={clickedRow}
                        id={clickedRow.Id}
                        asset={rel.name}
                        isBoundEntity={true}
                        boundCI={clickedRow.CompanyIdentifier}
                      />
                    )}
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
      <ExcelImportModal
        setImportModalShow={setImportModalShow}
        data={data}
        asset={asset}
        clickedRowImport={clickedRowImport}
        importModel={importModel}
        importMode={importMode}
        setImportMode={setImportMode}
        importModalShow={importModalShow}
      />
      <Modal
        open={actionModalCreate}
        title={`${data.label} Ekle`}
        onClose={() => setActionModalCreate(false)}
      >
        <AssetCreate
          clickedRow={props.clickedRow}
          isModal={true}
          asset={asset}
          id={props.id}
          boundItem={data.api.create}
          boundCI={props.boundCI}
          isBoundEntity={true}
          onClose={handleModalCreateClose}
          setTableData={setTableData}
        />
      </Modal>
      <Modal
        size="lg"
        open={actionModalEdit}
        title={`${data.label} Düzenle`}
        onClose={() => setActionModalEdit(false)}
      >
        <AssetEdit
          isModal={true}
          asset={asset}
          id={currentEntity?.Id}
          boundItem={data.api.edit}
          boundCI={props.boundCI}
          isBoundEntity={true}
          onClose={handleModalEditClose}
        />
      </Modal>
      {exportModalShow && (
        <Export
          tableName={
            data.conditionalExport &&
            Object.entries(exportFilterData).some(
              ([key, value]) =>
                key === data.conditionalExport?.conditionField &&
                value?.value === data.conditionalExport?.conditionValue
            )
              ? data.conditionalExport?.exportName
              : data.exportName
          }
          feedData={data}
          isLazyLoading={data.exportIsLazyLoading}
          exportWithoutPostReq={data?.exportWithoutPostReq}
          searchData={exportFilterData}
          queryParam={queryParam}
          totalRows={tableData?.totalRows}
          exportReportWithColumnHeaders={data?.exportReportWithColumnHeaders}
          assetMode={data.model}
          onClose={() => setExportModalShow(false)}
          exportModel={exportModel}
          row={clickedRowExport}
        />
      )}
      {historyData.showHistory && (
        <History
          data={historyData}
          onClose={() =>
            setHistoryData((state) => ({ ...state, showHistory: false }))
          }
        />
      )}
      {tableData?.error && (
        <Toastr
          onClose={handleToastrClose}
          {...{
            display: true,
            filterDetails: tableData.filterDetails,
            ...errorData(tableData.error),
          }}
        />
      )}
      {actionModal.show ? (
        actionModal.item.mode === "component" ? (
          <DynamicComponent
            setTableData={setTableData}
            boundId={actionModal.boundId}
            boundCI={actionModal.boundCI}
            row={actionModal.row}
            data={data}
            show={actionModal.show}
            component={actionModal.item.component}
            handleRefresh={actionModal.handleRefresh}
            actionModalShow={actionModal.show}
            onClose={() =>
              setActionModal((state) => ({ ...state, show: false }))
            }
          />
        ) : (
          <Modal
            size={
              actionModal?.item?.modalSize ? actionModal?.item?.modalSize : "lg"
            }
            open={actionModal.show}
            onClose={() =>
              setActionModal((state) => ({ ...state, show: false }))
            }
            title={actionModal.item.label}
            // dialogClassName={actionModal?.item?.modalFullScreen && "modal-90w"}
          >
            {actionModal.item.mode === "create" && (
              <AssetCreate
                clickedRow={clickedRow || actionModal?.clickedRow}
                row={actionModal.row}
                isModal={true}
                handleRefresh={actionModal.handleRefresh}
                onClose={() =>
                  setActionModal((state) => ({ ...state, show: false }))
                }
                asset={actionModal.item.entityName}
                id={actionModal.boundId}
                isBoundEntity={true}
                boundItem={actionModal.item}
                setTableData={setTableData}
              />
            )}
            {actionModal.item.mode === "edit" && (
              <AssetEdit
                isModal={true}
                asset={actionModal.item.entityName}
                refresh={actionModal.item?.refresh}
                id={actionModal.boundId}
                handleRefresh={actionModal.handleRefresh}
                isBoundEntity={true}
                boundItem={actionModal.item}
                row={actionModal.row}
              />
            )}
            {actionModal.item.mode === "index" && (
              <AssetIndex
                clickedRow={actionModal.row}
                isModal={true}
                asset={actionModal.item.entityName}
                id={actionModal.boundId}
                boundCI={actionModal.boundCI}
                assetTarget="popup"
                isBoundEntity={true}
                boundItem={actionModal.item}
              />
            )}
          </Modal>
        )
      ) : null}
      <Modal
        open={isProcessing}
        size="lg"
        centered
        onclose={() => setIsProcessing(false)}
      >
        <div className="rounded border border-success p-5">
          <h3 className="p-5 text-center text-success">
            İlgili provizyon için güncelleme devam etmektedir. Lütfen daha sonra
            tekrar deneyiniz
          </h3>
        </div>
      </Modal>
    </>
  );
}
