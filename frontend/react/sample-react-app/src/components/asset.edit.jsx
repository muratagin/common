import { Requests } from "@app/api";
import FormBuilder from "@libs/form.builder";
import { MySwalData } from "@libs/myswaldata";
import { getAsset, getEntityUrl } from "@libs/parser";
import {
  checkIf,
  checkPrivilegesInRoles,
  getFirstQueryParameter,
  getQueryParameterValue,
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
import { useLocation, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { AssetCreate } from "./asset.create";
import AssetHeaderButton from "./asset.header.button";
import { AssetIndex } from "./asset.index";
import DynamicComponent from "./dynamic.component";
import Modal from "./modal";

export function AssetEdit(props) {
  const isModal = props.isModal;
  const paramsObject = useParams();
  const location = useLocation();
  const id = props.id || paramsObject.id;
  const asset = props.asset;
  const data = getAsset(asset);
  const url = getEntityUrl(data);
  const dispatch = useDispatch();
  const entityReadOnly = props.disabled;
  const [actionModal, setActionModal] = useState({ show: false });
  const [currentData, setCurrentData] = useState({});
  const [key, setKey] = useState("Genel");
  const { user } = useSelector((state) => state.user);
  const roles = user?.Roles;
  const [initialData, setInitialData] = useState();
  const companyIdentifier = useSelector((state) => state.selection.identifier);
  const MySwal = withReactContent(Swal);
  useEffect(() => {
    if (checkIf(props?.boundItem?.customEdit)) {
    } else {
      const getEntityById = async (id) => {
        try {
          let response = await Requests().CommonRequest.getById({
            url,
            content: { id },
            headers: { CompanyIdentifier: companyIdentifier },
            loading: checkIf(data?.setLoading),
          });
          if (
            response?.data?.Data?.EntityPermissions?.IsEdit == false &&
            location.pathname.match("/edit/")
          )
            window.location.href = `${
              location.pathname.replace("edit", "view") + location.search
            }`;
          // if (response?.data?.Data?.EntityPermissions?.IsView == false && location.pathname.match('/view/')) window.location.href = `/`
          setInitialData(response.data.Data);
          dispatch(setCurrentEntity(response.data.Data));
          // custom behavior
          // check if Company asset is of concern
          // identifier setting required
          if (response.data?.Data?.Company_Identifier && asset !== "company") {
            dispatch(setIdentifier(response.data.Data.Company_Identifier));
          }
        } catch (error) {
          MySwal.fire(MySwalData("error", { text: resErrorMessage(error) }));
        }
      };
      if (checkIf(id)) getEntityById(id);
    }
  }, [id]);

  // eğer tabların direkt aktif olmasını isterseniz useState'i true yapın
  const [active, setActive] = useState(true);
  /////////////////////////////////////////////////
  const currentEntity = useSelector((state) => state.selection.currentEntity);

  const formSubmit = async (formName, formData) => {
    // if formName is Genel, create the entity
    // else update relational entities

    let response;
    let url;
    let externalObject;

    if (formName === "Genel") {
      url = getEntityUrl(data);
    } else {
      // relational entities
    }

    if (
      asset === "insurednotes" ||
      asset === "contactnotes" ||
      asset === "payrollnotelist"
    ) {
      let boundParam;
      if (asset === "insurednotes") {
        boundParam = currentEntity.InsuredId;
      } else if (asset === "contactnotes") {
        boundParam = currentEntity.ContactId;
      } else if (asset === "payrollnotelist") {
        boundParam = currentEntity.PayrollId;
      }
      if (checkIf(props.boundItem)) {
        externalObject = {
          [props.boundItem.params]: boundParam,
        };
      }
    } else {
      let firstQueryParam = getFirstQueryParameter();
      if (checkIf(firstQueryParam) && firstQueryParam !== "") {
        externalObject = {
          [firstQueryParam]: getQueryParameterValue(firstQueryParam),
        };
      }
    }

    try {
      response = await Requests().CommonRequest.put({
        url,
        content: { ...formData, ...externalObject, Id: Number(id) },
        headers: { CompanyIdentifier: companyIdentifier },
      });
      if (response.data.IsSuccess) {
        dispatch(
          setPopup({
            display: true,
            class: "success",
            message: { body: "Başarıyla güncellendi" },
          })
        );
        props?.refresh && props.handleRefresh();
      }
      if (
        isModal === true &&
        (asset === "insurednotes" ||
          asset === "contactnotes" ||
          asset === "payrollnotelist")
      ) {
        props.onClose();
      } else {
        setActive(true);
      }
    } catch (error) {
      MySwal.fire(MySwalData("error", { text: resErrorMessage(error) }));
    }
  };

  const handleClick = (e, item, refElement, hiddenId) => {
    let CI = companyIdentifier;
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
      <div className="content-container">
        {isModal ||
        asset === "insuredTab" ||
        asset === "claimdetails" ? null : (
          <AssetHeaderButton
            data={data}
            asset={asset}
            entityReadOnly={entityReadOnly}
            isBoundEntity={props.isBoundEntity}
            assetType="edit"
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
            <Tabs.Content value={tab.name} key={index}>
              {tab.component ? (
                <DynamicComponent
                  component={{ name: tab.component }}
                  asset={asset}
                  item={props.boundItem}
                  row={props.row}
                  handleRefresh={props.handleRefresh}
                  CI={companyIdentifier}
                  boundCI={companyIdentifier}
                  boundId={props?.id || id}
                ></DynamicComponent>
              ) : (
                <FormBuilder
                  display={props?.display}
                  customSave={tab.customSave || data.customSave}
                  filterButtons={tab.filterButtons || data.filterButtons}
                  name={tab.name}
                  currentData={currentData}
                  handleClick={handleClick}
                  dataModel={data.model}
                  boundId={id}
                  mode="edit"
                  initialData={initialData}
                  data={tab.content}
                  readonly={
                    checkIf(tab.edit) && tab.edit == true
                      ? !tab.edit
                      : entityReadOnly
                  }
                  actionView={data.actionView}
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
              title={actionModal.item.label}
              onClose={() =>
                setActionModal((state) => ({ ...state, show: false }))
              }
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
    </>
  );
}
