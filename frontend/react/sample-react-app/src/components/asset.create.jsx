import { Requests } from "@app/api";
import { MASTER_IDENTIFIER } from "@app/constant";
import FormBuilder from "@libs/form.builder";
import { MySwalData } from "@libs/myswaldata";
import { getAsset, getEntityUrl } from "@libs/parser";
import {
  checkIf,
  checkPrivilegesInRoles,
  getFirstQueryParameter,
  getQueryParameterValue,
  initialDataObject,
  resErrorMessage,
} from "@libs/utils";
import { Tabs } from "@radix-ui/themes";
import {
  setCurrentEntity,
  setIdentifier,
  setPopup,
} from "@slices/selectionSlice";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { AssetEdit } from "./asset.edit";
import AssetHeaderButton from "./asset.header.button";
import { AssetIndex } from "./asset.index";
import DynamicComponent from "./dynamic.component";
import ExcelImportModal from "./excel.import";
import Modal from "./modal";

export function AssetCreate(props) {
  const isModal = props.isModal;
  const asset = props.asset;
  const data = getAsset(asset);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const MySwal = withReactContent(Swal);
  const [key, setKey] = useState("Genel");
  const { user } = useSelector((state) => state.user);
  const roles = user?.Roles;
  const [disabledTab, setDisabledTab] = useState(false);
  const [actionModal, setActionModal] = useState({ show: false });
  const [currentData, setCurrentData] = useState({});
  // eğer tabların direkt aktif olmasını isterseniz useState'i true yapın
  const [active, setActive] = useState(false);
  /////////////////////////////////////////////////
  const companyIdentifier = useSelector((state) => state.selection.identifier);

  const [initialData, setInitialData] = useState({});
  const [importModalShow, setImportModalShow] = useState(false);
  const [importModel, setImportModel] = useState({});
  const [importMode, setImportMode] = useState(false);
  const [clearForm, setClearForm] = useState();

  useEffect(() => {
    if (location.pathname === "/contractprovider/create") {
      let dataObject = initialDataObject(location.search);
      setInitialData(dataObject);
    }
  }, []);

  const formSubmit = async (formName, formData) => {
    // if formName is Genel, create the entity
    // else update relational entities

    let response;
    let url;

    if (formName === "Genel") {
      url = getEntityUrl(data);
    } else {
      // relational entities
    }

    // check if both id and bound parameter are present at the same time
    // this happends when url includes a bound parameter
    // when a popup is generated with asset with bound id
    let externalObject;
    let firstQueryParam = getFirstQueryParameter();

    let boundParam = props.id;
    if (asset === "insurednotes") {
      boundParam = props?.clickedRow?.InsuredId || props?.clickedRow?.Id;
    } else if (asset === "contactnotes") {
      boundParam = props?.clickedRow?.ContactId;
    }
    if (checkIf(boundParam) && checkIf(props.boundItem)) {
      externalObject = {
        [props.boundItem.params]: boundParam,
      };
    } else if (checkIf(firstQueryParam) && firstQueryParam !== "") {
      externalObject = {
        [firstQueryParam]: getQueryParameterValue(firstQueryParam),
      };
    } else if (checkIf(props.id) && props.id !== "") {
      url += "/" + props.id;
    }

    if (
      checkIf(props.boundItem?.multipleParams) &&
      props.boundItem?.multipleParams === true
    ) {
      let splitParams = props.boundItem.params.split(",");
      let currentRow = props.row;
      externalObject = splitParams.reduce((result, param) => {
        return {
          ...result,
          [param]: currentRow[param] || currentRow["Id"],
        };
      }, {});
    }
    try {
      checkIf(props?.setTableData) &&
        props.setTableData((state) => ({ ...state, loading: true }));
      if (props?.customCreate === true) {
      }
      response = await Requests().CommonRequest.post({
        url,
        content: { ...formData, ...externalObject },
        headers: {
          CompanyIdentifier: props?.companyIdentifier || companyIdentifier,
        },
        loading: true,
      });
      checkIf(response.data) &&
        props?.updateCurrentEntity !== false &&
        dispatch(setCurrentEntity(response.data?.Data));
      if (response.data.IsSuccess) {
        if (props?.customCreate === true) {
          setClearForm(true);
        }
        props?.handleRefresh && props.handleRefresh();
      }

      if (response.data?.Data?.Company_Identifier && asset !== "company") {
        dispatch(setIdentifier(response.data.Data.Company_Identifier));
      }
      setActive(true);
      setDisabledTab(true);
      // create is called inside a popup, which needs to be closed after success message
      if (checkIf(props.id) && checkIf(props.boundItem)) {
        props.onClose();
      } else if (checkIf(props.onClose)) {
        // a general statement when Asset Create is called with onClose property
        // especially in a modal
        props.onClose();
      }
      dispatch(
        setPopup({
          display: true,
          class: "success",
          message: {
            body:
              data.showId === true
                ? response.data.Data.Id +
                  " numaralı " +
                  (data.label
                    ? data.label.toLowerCase() + " başarıyla kaydedildi."
                    : "kayıt başarıyla oluşturuldu")
                : "Başarıyla kaydedildi.",
          },
        })
      );
      checkIf(props?.setTableData) &&
        !checkIf(props?.boundItem?.ignoreTableDataLoading) &&
        props.setTableData((state) => ({ ...state, loading: false }));
      response?.data?.IsSuccess && data?.goBack && navigate(-1); //Ekleme sonrası geri dönme
    } catch (error) {
      checkIf(props?.setTableData) &&
        props.setTableData((state) => ({ ...state, loading: false }));
      MySwal.fire(MySwalData("error", { text: resErrorMessage(error) }));
    }
  };

  useEffect(() => {
    setDisabledTab(false);
  }, [asset]);

  const handleClick = (e, item, refElement, hiddenId) => {
    let CI = companyIdentifier;
    if (CI === MASTER_IDENTIFIER) {
      dispatch(
        setPopup({
          display: true,
          class: "warning",
          message: { title: "UYARI", body: "Lütfen, şirket seçimi yapınız!" },
        })
      );
      return false;
    }
    if (item.target === "popup") {
      setActionModal((state) => {
        return {
          ...state,
          show: true,
          item: item,
          boundCI: CI,
          refElement: refElement,
          boundId: hiddenId,
        };
      });
    }
  };
  const handleClose = (e, row, refElement) => {
    setCurrentData({ ...currentData, tableRow: row, refElement: refElement });
    setActionModal(false);
  };
  return (
    <>
      {!importMode && (
        <div className="content-container">
          {isModal ? null : (
            <AssetHeaderButton
              data={data}
              asset={asset}
              setImportModel={setImportModel}
              setImportModalShow={setImportModalShow}
              assetType="create"
              excelImportFromCreate={props?.excelImportFromCreate}
            />
          )}
          <Tabs.Root className="tabs" defaultValue="Genel">
            <Tabs.List
              className={classNames({
                "tab-list": true,
                "single-tab": data.tabs.length === 1,
              })}
            >
              {data.tabs.map((tab, index) => (
                <Tabs.Trigger
                  value={tab.name}
                  className="tab-trigger"
                  key={index}
                  disabled={
                    (index && !active) ||
                    !(
                      !checkIf(tab.privilege) ||
                      (checkIf(tab.privilege) &&
                        checkPrivilegesInRoles(tab.privilege.id, roles))
                    )
                  }
                >
                  {tab.name}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
            {data.tabs.map((tab, index) => (
              <Tabs.Content
                value={tab.name}
                className="tab-content"
                key={index}
              >
                {tab.component ? (
                  <DynamicComponent
                    row={props.row}
                    handleRefresh={props.handleRefresh}
                    CI={companyIdentifier}
                    boundCI={companyIdentifier}
                    boundId={props.id}
                    component={{ name: tab.component }}
                    clickedRow={props?.clickedRow}
                  ></DynamicComponent>
                ) : (
                  <FormBuilder
                    initialData={initialData}
                    currentData={currentData}
                    handleClick={handleClick}
                    customSave={tab.customSave}
                    filterButtons={data.filterButtons}
                    disabled={!index && disabledTab}
                    name={tab.name}
                    clearForm={clearForm}
                    mode="create"
                    data={tab.content}
                    submit={formSubmit}
                  />
                )}
              </Tabs.Content>
            ))}
          </Tabs.Root>
          {actionModal.show ? (
            actionModal.item.mode === "component" ? (
              <DynamicComponent
                boundId={actionModal.boundId}
                boundCI={actionModal.boundCI}
                component={actionModal.item.component}
                item={actionModal.item}
                handleClose={handleClose}
                onClose={() =>
                  setActionModal((state) => ({ ...state, show: false }))
                }
                refElement={actionModal.refElement}
              ></DynamicComponent>
            ) : (
              <Modal
                size="xl"
                open={actionModal.show}
                onClose={() =>
                  setActionModal((state) => ({ ...state, show: false }))
                }
                title={actionModal.item.label}
              >
                {actionModal.item.mode === "create" && (
                  <AssetCreate
                    isModal={true}
                    asset={actionModal.item.entityName}
                    id={actionModal.boundId}
                    isBoundEntity={true}
                    boundItem={actionModal.item}
                    onClose={() =>
                      setActionModal((state) => ({ ...state, show: false }))
                    }
                  />
                )}
                {actionModal.item.mode === "edit" && (
                  <AssetEdit
                    isModal={true}
                    asset={actionModal.item.entityName}
                    id={actionModal.boundId}
                    isBoundEntity={true}
                    boundItem={actionModal.item}
                  />
                )}
                {actionModal.item.mode === "index" && (
                  <AssetIndex
                    onClose={handleClose}
                    refElement={actionModal.refElement}
                    isModal={true}
                    asset={actionModal.item.entityName}
                    id={actionModal.boundId}
                    boundCI={actionModal.boundCI}
                    isBoundEntity={true}
                    boundItem={actionModal.item}
                  />
                )}
              </Modal>
            )
          ) : null}
        </div>
      )}
      <ExcelImportModal
        setImportModalShow={setImportModalShow}
        data={data}
        asset={asset}
        importMode={importMode}
        clickedRowImport={props.clickedRowImport}
        importModel={importModel}
        setImportMode={setImportMode}
        importModalShow={importModalShow}
      />
    </>
  );
}
