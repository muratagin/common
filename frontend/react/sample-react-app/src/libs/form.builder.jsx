import { MASTER_IDENTIFIER } from "@app/constant";
import { settings } from "@app/settings";
import Icon from "@components/icon";
import TableComponent from "@libs/table.component";
import {
  checkCompanyRelated,
  checkIf,
  checkIfIsEmpty,
  checkPrivilegeInRoles,
  checkVisible,
  filterPrepObj,
  findCompany,
  findCompanyProps,
  formDataRefactorWithObjGrouping,
  getFirstQueryParameter,
  getQueryParameterValue,
  isObject,
  isObjectIsNotEmpty,
  objIndex,
  splitParentChild,
  trimIf,
} from "@libs/utils";
import { Grid } from "@mui/material";
import { setIdentifier } from "@slices/selectionSlice";
import { format } from "date-fns";
import {
  Fragment,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import "react-tagsinput/react-tagsinput.css";
import { BehaviorSubject } from "rxjs";
import FormComponent from "./form.component";
import { FormField } from "./form.field";

const FormBuilder = memo(function FormBuilder(props) {
  const errorObjPrep = (field) => {
    return {
      required: {
        value:
          field.initialValue === undefined &&
          !(props.mode === "filter") &&
          field.required &&
          !(field.type === "checkbox" || field.type === "radio"),
        message: field.requiredMessage,
      },
    };
  };
  useEffect(() => {
    if (props?.clearForm === true) {
      resetForm.next("reset");
    }
  }, [props?.clearForm]);

  const resetForm = useMemo(() => {
    return new BehaviorSubject();
  }, [props.data]);

  const [formData, triggerData] = useMemo(() => {
    let formData = {};
    let trigger = {};
    props.data.forEach((data) => {
      if (
        data.group &&
        data.group.model &&
        data.group.type !== "tableComponent"
      ) {
        if (checkVisible(data.fields, props.mode)) {
          formData[data.group.model] = formData[data.group.model] || {};
          if (data.fields) {
            data.fields.forEach((field) => {
              if (props.mode === "filter" && field.visibility.filter?.show) {
                formData[data.group.model][
                  field.model.filter || field.model.create
                ] = {
                  //value: data.initialData ? objIndex(data.initialData, field.model[props.mode] || field.model.create) : field.value,
                  value: field.value,
                  type: field.type,
                  compSign: field.comparisonSign,
                  error: errorObjPrep(field),
                };
                trigger[field.model.filter || field.model.create] =
                  new BehaviorSubject();
              }
              if (props.mode === "create" && field.visibility?.create) {
                formData[data.group.model][field.model.create] = {
                  //value: data.initialData ? objIndex(data.initialData, field.model[props.mode] || field.model.create) : field.value,
                  value: field.value,
                  type: field.type,
                  compSign: field.comparisonSign,
                  error: errorObjPrep(field),
                };
                trigger[field.model.create] = new BehaviorSubject();
              }
              if (props.mode === "edit" && field.visibility.create) {
                formData[data.group.model][field.model.create] = {
                  // burası edit modeli ile create modeli arasında uyumsuzluğa sebep oluyor. company'de ciddi sorun yaratıyor. o yüzden create modeli kullanılıyor
                  //value: data.initialData ? objIndex(data.initialData, field.model[props.mode] || field.model.create) : field.value,
                  value: field.value,
                  type: field.type,
                  compSign: field.comparisonSign,
                  error: errorObjPrep(field),
                };
                trigger[field.model.edit || field.model.create] =
                  new BehaviorSubject();
              }
            });
          }
        }
      } else {
        if (data.fields) {
          data.fields.forEach((field) => {
            if (props.mode === "filter" && field.visibility.filter?.show) {
              formData[field.model.filter || field.model.create] = {
                //value: data.initialData ? objIndex(data.initialData, field.model[props.mode] || field.model.create) : field.value,
                value: field.value,
                type: field.type,
                compSign: field.comparisonSign,
                error: errorObjPrep(field),
              };
              trigger[field.model.filter || field.model.create] =
                new BehaviorSubject();
            }
            if (props.mode === "create" && field.visibility.create) {
              let firstQueryParam = getFirstQueryParameter();
              if (
                checkIf(firstQueryParam) &&
                field.model.create === firstQueryParam
              ) {
                field.value = getQueryParameterValue(firstQueryParam);
              }

              formData[field.model.create] = {
                //value: data.initialData ? objIndex(data.initialData, field.model[props.mode] || field.model.create) : field.value,
                value: field.value,
                type: field.type,
                compSign: field.comparisonSign,
                error: errorObjPrep(field),
              };
              trigger[field.model.create] = new BehaviorSubject();
            }
            if (props.mode === "edit" && field.visibility.create) {
              formData[field.model.edit || field.model.create] = {
                //value: data.initialData ? objIndex(data.initialData, field.model[props.mode] || field.model.create) : field.value,
                value: field.value,
                type: field.type,
                compSign: field.comparisonSign,
                error: errorObjPrep(field),
              };
              trigger[field.model.edit || field.model.create] =
                new BehaviorSubject();
            }
          });
        }
      }
    });
    return [formData, trigger];
  }, [props.data]);

  const dispatch = useDispatch();
  const location = useLocation();
  const [data, setData] = useState(formData);
  const [trigger, setTrigger] = useState(triggerData);
  const [formState, setFormState] = useState({ dirty: false, valid: false });
  const [bindings, setBindings] = useState();
  const { user } = useSelector((state) => state.user);
  const roles = user?.Roles;

  const handleClear = () => {
    resetForm.next("reset");
    dispatch(setIdentifier(MASTER_IDENTIFIER));
  };
  const handleSubmit = (e, externalQueryParam) => {
    setFormState((state) => ({ ...state, dirty: true }));
    if (checkValid(data)) {
      refactorSubmit(data, externalQueryParam);
    }
  };
  const fieldChange = ({
    error,
    value,
    label,
    parent,
    type,
    compSign,
    inputLabel,
    currentCompanyIdentifier,
    multipleFile,
  }) => {
    // set identifier for company selections
    // this is a custom behavior
    let match = label.match(/CompanyId/);
    let locationMatch =
      location.pathname.match("/emailinformation/create") ||
      location.pathname.match("/emailinformation/edit");
    if (match && value !== "" && typeof value !== "undefined") {
      let companyIdentifier;
      // if null is set, fallback to Master Identifier
      if (value === null || locationMatch) {
        companyIdentifier = MASTER_IDENTIFIER;
      } else if (Array.isArray(value)) {
        companyIdentifier = MASTER_IDENTIFIER;
      } else {
        companyIdentifier = findCompany(
          "CompanyId",
          value.value
        ).CompanyIdentifier;
      }
      dispatch(setIdentifier(companyIdentifier));
    }

    let actualValue;

    if (isObject(value)) {
      if (type === "textTagged") {
        actualValue = value.tags.join(",");
      } else if (type === "textTaggedSuggest") {
        actualValue = value.tags.map((tag) => {
          let dataValue = value?.lookup?.find((item) => item.label === tag);
          return dataValue?.uniqueId ? dataValue?.uniqueId : dataValue?.value;
        });
      } else {
        actualValue = value.value;
      }
    } else {
      actualValue = value;
    }

    setData((state) => {
      let newState;
      let [tempParent, tempChild] = splitParentChild(label);
      // check bindings and trigger changes on binded components
      if (tempParent === parent) {
        if (bindings?.[tempChild]) {
          if (Array.isArray(bindings[tempChild])) {
            bindings[tempChild].forEach((value) => {
              trigger[value] && trigger[value].next(actualValue);
            });
          } else {
            trigger[bindings[tempChild]] &&
              trigger[bindings[tempChild]].next(actualValue);
          }
        }
      } else {
        if (bindings?.[label]) {
          if (Array.isArray(bindings[label])) {
            bindings[label].forEach((value) => {
              trigger[value] && trigger[value].next(actualValue);
            });
          } else {
            //PW-8942 ile geliştirme yapılmıştır.
            //trigger[bindings[label]] && trigger[bindings[label]].next(value)
            trigger[bindings[label]] &&
              trigger[bindings[label]].next({
                value: actualValue,
                currentCompanyIdentifier,
              });
          }
        }
      }

      if (parent) {
        let updatedParent;
        if (tempParent === parent) {
          updatedParent = {
            ...state[parent],
            [tempChild]: {
              value: actualValue,
              error,
              type,
              compSign,
              inputLabel,
            },
          };
        } else {
          updatedParent = {
            ...state[parent],
            [label]: { value: actualValue, error, type, compSign, inputLabel },
          };
        }
        newState = { ...state, [parent]: updatedParent };
      } else {
        if (type == "file" && value) {
          const { fileExtension, fileName, fileBase64 } = value;
          if (checkIf(multipleFile) && multipleFile.length > 1) {
            newState = {
              ...state,
              Files: { value: multipleFile },
              [label]: { value: fileBase64, error, type, compSign, inputLabel },
            };
          } else {
            newState = {
              ...state,
              FileExtension: { value: fileExtension },
              FileName: { value: fileName },
              [label]: { value: fileBase64, error, type, compSign, inputLabel },
            };
          }
        } else if (type == "imageFile" && value) {
          const { fileExtension, fileName, fileBase64 } = value;
          newState = {
            ...state,
            [label]: {
              value: checkIf(value)
                ? isObjectIsNotEmpty(value)
                  ? {
                      // ["FileName"]: fileName,
                      ["FileExtension"]: fileExtension,
                      ["Base64Data"]: fileBase64,
                    }
                  : value
                : null,
              error,
              type,
              compSign,
            },
          };
          if (!checkIfIsEmpty(fileBase64) && checkIfIsEmpty(value?.MediaLink)) {
            newState = {
              ...state,
              [label]: {
                value,
                error,
                type,
                compSign,
              },
            };
          }
        } else
          newState = {
            ...state,
            [label]: { value: actualValue, error, type, compSign, inputLabel },
          };
      }
      return newState;
    });
  };

  const bindingAssign = (binder, bound) => {
    let model = { [binder]: bound };
    setBindings((state) => {
      if (checkIf(state?.[binder])) {
        if (typeof state[binder] === "string") {
          model[binder] = [state[binder], bound];
        } else {
          model[binder] = [...state[binder], ...bound];
        }
      }
      return { ...state, ...model };
    });
  };

  const validateForm = () => {
    setFormState((state) => ({ ...state, valid: checkValid(data) }));
  };

  const checkValid = (data) => {
    return !Object.entries(data).some((elem) => {
      if (Object.prototype.hasOwnProperty.call(elem[1], "value")) {
        let error = elem[1].error;
        let type = elem[1].type;
        let typeCheck = type === "checkbox" || type === "radio";
        return (
          type !== "hidden" &&
          ((!typeCheck && error === null) ||
            (error && Object.entries(error).some((elem) => elem[1].value)))
        );
      } else {
        return !checkValid(elem[1]);
      }
    });
  };
  const refactorSubmit = (data, externalQueryParam) => {
    let transmitFormData = {};
    Object.entries(data).forEach((item) => {
      if (!checkIfIsEmpty(item[0])) return false;

      if (!Object.prototype.hasOwnProperty.call(item[1], "value")) {
        // complex value with children
        transmitFormData[item[0]] = transmitFormData[item[0]] || {};
        Object.entries(item[1]).forEach((child) => {
          let actualValue = trimIf(child[1]?.value);

          let value;
          let type = child[1].type;

          if (type === "date") {
            value = !checkIfIsEmpty(actualValue)
              ? null
              : format(actualValue, "yyyy-MM-dd");
          } else if (type === "datetime") {
            value = !checkIfIsEmpty(actualValue)
              ? null
              : format(actualValue, "yyyy-MM-ddTHH:mm:ss");
          } else if (
            (type === "select2" || type === "asyncSelect") &&
            Array.isArray(actualValue)
          ) {
            value = actualValue.reduce((a, v) => a.concat(v.value), []);
          } else {
            value = actualValue;
          }

          transmitFormData[item[0]][child[0]] = value;
        });
      } else {
        // primitive value
        let actualValue = trimIf(item[1]?.value);

        let value;
        let type = item[1].type;

        if (type === "date") {
          value = !checkIfIsEmpty(actualValue)
            ? null
            : format(new Date(actualValue), "yyyy-MM-dd");
        } else if (type === "datetime") {
          value = !format(actualValue, "yyyy-MM-dd")
            ? null
            : format(actualValue, "yyyy-MM-ddTHH:mm:ss");
        } else if (
          (type === "select2" || type === "asyncSelect") &&
          Array.isArray(actualValue)
        ) {
          value = actualValue.reduce((a, v) => a.concat(v.value), []);
        } else if (
          (type === "select2" || type === "asyncSelect") &&
          checkIfIsEmpty(actualValue) &&
          isObjectIsNotEmpty(actualValue)
        ) {
          const val = checkIfIsEmpty(actualValue?.Ordinal)
            ? actualValue?.Ordinal
            : actualValue?.Id;
          value = val;
        } else {
          value = actualValue;
        }

        // check if part of a group
        let [parent, child] = item[0].split(".");

        if (data[parent] && typeof child !== "undefined") {
          if (checkIf(transmitFormData[parent])) {
            transmitFormData[parent][child] = value;
          } else {
            transmitFormData[parent] = { [child]: value };
          }
        } else {
          if (checkIf(child)) {
            if (checkIf(transmitFormData[parent])) {
              transmitFormData[parent][child] = value;
            } else {
              transmitFormData[parent] = { [child]: value };
            }
          } else {
            transmitFormData[parent] = value;
          }
        }
      }
    });
    if (props.mode === "filter") {
      props.submit(
        true,
        filterPrepObj(data),
        props?.assetTarget === "popup" && props?.entity?.popupFilterBoundParam
          ? props?.boundId
          : null,
        null,
        null,
        externalQueryParam
      );
    } else {
      // buraya 3lü içiçe json ihtiyacı doğduğu için statik olarak kontrol yapan bir fonksiyon ekledik
      //props.submit(props.name, transmitFormData)
      props.submit(
        props.name,
        formDataRefactorWithObjGrouping(transmitFormData)
      );
    }
  };

  const initialValueCalculator = useCallback(
    (itemInitialData, field) => {
      let initialData = props.initialData || itemInitialData;
      let initialValue;
      let modelData;

      switch (props.mode) {
        case "filter":
          modelData = field.model.filter || field.model.create;
          break;
        case "edit":
          modelData = field.model.edit || field.model.view;
          break;
        default:
          modelData = field.model.create;
          break;
      }

      if (initialData) {
        if (field.type === "select2" || field.type === "asyncSelect") {
          //initialValue = { value: objIndex(initialData, modelData), label: objIndex(initialData, modelData) }

          // exception for CompanyIdentifiers
          if (checkCompanyRelated(field)) {
            if (
              Object.prototype.hasOwnProperty.call(
                initialData,
                "CompanyIdentifier"
              )
            ) {
              initialValue = findCompanyProps(
                "CompanyIdentifier",
                initialData.CompanyIdentifier
              );
            }

            if (
              Object.prototype.hasOwnProperty.call(initialData, "CompanyId")
            ) {
              initialValue = findCompanyProps(
                "CompanyId",
                initialData.CompanyId
              );
            }
          } else {
            let value = {
              value: objIndex(
                initialData,
                field.model[props.mode] || field.model.create
              ),
              label: objIndex(initialData, field.model.view),
            };

            const checkValue = value?.label && value?.value;

            if (checkIf(checkValue)) {
              initialValue = { ...value };
            }
          }
        } else if (field.type === "date") {
          initialValue = objIndex(initialData, modelData)
            ? new Date(objIndex(initialData, modelData))
            : "";
        } else if (field.type === "datetime") {
          initialValue = objIndex(initialData, modelData)
            ? objIndex(initialData, modelData)
            : "";
        } else {
          initialValue = objIndex(initialData, modelData);
        }
      }
      return initialValue;
    },
    [props.initialData]
  );

  useEffect(() => {
    //burayı tablecomponent update ederken commentledik ama ....
    // gerekirse buraya bir exception atmak lazım. Atıldı...
    // tableComponent için setData kapalıydı ama tekrar açtım
    // yoksa formData cachle li kalıyor gibi oluyor
    props.type !== "innerForm" && setData(formData);
  }, [formData]);

  const addOrRemoveObjects = async (array, removeObjectKeys) => {
    if (checkIf(array) && array.length > 0) {
      await array.forEach((arr) => {
        setData((current) => {
          let rest = current;
          Object.keys(arr).map((x) => (rest[x] = arr[x]));
          return rest;
        });
      });
    }
    if (checkIf(removeObjectKeys) && removeObjectKeys.length > 0) {
      await removeObjectKeys.forEach((name) => {
        setData((current) => {
          const rest = current;
          delete rest[name];
          return rest;
        });
      });
    }
  };
  useEffect(() => {
    setTrigger(triggerData);
  }, [triggerData]);

  useEffect(() => {
    if (checkIf(data)) validateForm();
  }, [data]);

  const sortedFilterData = useMemo(() => {
    let mappedFields = [];

    const match = props.data.some((item) =>
      item.fields?.some(
        (field) =>
          field.model?.create === "CompanyId" ||
          field.model?.view === "CompanyIdentifier"
      )
    );

    if (match && settings.isTpa === false) {
      dispatch(setIdentifier(settings.companyIdentifier));
    }

    props.data.forEach((item) =>
      item.fields?.forEach((field, index) => {
        if (
          field.visibility.filter?.show // prettier-ignore
        ) {
          let fieldHtml = (
            <Fragment key={index}>
              {settings.isTpa === false &&
              (field.model?.create === "CompanyId" ||
                field.model?.view === "CompanyIdentifier") ? null : (
                <Grid
                  item
                  xs={field.width?.xs || 12}
                  sm={field.width?.sm || 6}
                  md={field.width?.md || 4}
                  lg={field.width?.lg || 3}
                  xl={field.width?.lg || 2}
                >
                  <FormField
                    initialValue={initialValueCalculator(
                      item.initialData,
                      field
                    )}
                    {...field}
                    addOrRemoveObjects={addOrRemoveObjects}
                    mode={props.mode}
                    parent={item.group?.model}
                    bindTrigger={
                      trigger?.[field.model.filter || field.model.create]
                    }
                    bindings={bindings}
                    readonly={props.readonly}
                    resetForm={resetForm}
                    onChange={fieldChange}
                    onBinding={bindingAssign}
                    boundId={props.boundId}
                    boundCI={props.boundCI}
                    formData={data}
                  />
                </Grid>
              )}
            </Fragment>
          );
          mappedFields.push({
            order: field.visibility.filter.order,
            value: fieldHtml,
          });
        }
      })
    );
    mappedFields.sort((Afield, Bfield) => Afield.order - Bfield.order);
    return mappedFields;
  }, [props.data, bindings, data]);

  const privilegeCheck = useCallback(
    (field) => {
      return !(
        !checkIf(field.privilege) ||
        (checkIf(field.privilege) &&
          checkPrivilegeInRoles(field.privilege.id, roles))
      );
    },
    [props]
  );
  const privilegeShowCheck = useCallback(
    (field) => {
      return checkIf(field.privilege) && field.privilege?.type === "show"
        ? checkPrivilegeInRoles(field.privilege.id, roles)
        : true;
    },
    [props]
  );

  return (
    <div
      className={`${
        formState.dirty ? "form-dirty" : "form-pristine bg-gray-5 px-2.5 pb-5"
      } ${formState.valid ? "form-valid" : "form-invalid"}`}
    >
      {props.mode === "filter" ? (
        <div>
          <Grid container className="group-filter group px-1">
            {sortedFilterData.map((field) => field.value)}
          </Grid>
        </div>
      ) : (
        <div className="w-full">
          {props.data.map((item, index) =>
            item.group ? (
              item.group.type === "formComponent" ? (
                <>
                  {item.group?.label && (
                    <div className="modal-header col-12 p-2">
                      <div className=" h6 pl-2">{item.group?.label}</div>
                    </div>
                  )}
                  <FormComponent
                    readonly={props.readonly}
                    key={index}
                    boundId={props.boundId}
                    data={{ group: item.group, fields: item.fields }}
                  />
                </>
              ) : item.group.type === "tableComponent" &&
                props.type !== "innerForm" ? (
                <div key={index}>
                  <TableComponent
                    readonly={props.readonly}
                    boundId={props.boundId}
                    entityName={props.name}
                    {...item}
                    initialData={props.initialData}
                  />{" "}
                </div>
              ) : (
                <>
                  {item.group?.label && (
                    <div className="modal-header col-12 p-2">
                      <div className=" h6 pl-2">{item.group?.label}</div>
                    </div>
                  )}
                  <Grid
                    container
                    className={`group group-${props.mode}`}
                    key={index}
                  >
                    <Grid xs={12} className="group-title">
                      {item.group.title}
                    </Grid>
                    {item.fields?.map((field, index) =>
                      field.visibility[
                        props.mode === 'edit'
                          ? props?.display && checkIf(field.visibility.display)
                            ? 'display'
                            : checkIf(field.visibility.edit)
                            ? 'edit'
                            : 'create'
                          : props.mode
                      ] &&
                      field.type !== 'hidden' && privilegeShowCheck(field) ? ( //prettier-ignore
                        <Grid
                          key={index}
                          xs={
                            props.mode === "edit" || props.mode === "create"
                              ? field.editWidth?.xs || field.width?.xs || 6
                              : field.width?.xs || 6
                          }
                          sm={
                            props.mode === "edit" || props.mode === "create"
                              ? field.editWidth?.sm || field.width?.sm || 4
                              : field.width?.sm || 4
                          }
                          lg={
                            props.mode === "edit" || props.mode === "create"
                              ? field.editWidth?.lg || field.width?.lg || 3
                              : field.width?.lg || 3
                          }
                        >
                          <FormField
                            initialValue={initialValueCalculator(
                              item.initialData,
                              field
                            )}
                            {...field}
                            addOrRemoveObjects={addOrRemoveObjects}
                            mode={props.mode}
                            parent={
                              props.type === "innerForm"
                                ? undefined
                                : item.group.model
                            }
                            bindTrigger={
                              trigger?.[
                                field.model[props.mode] || field.model.create
                              ]
                            }
                            bindings={bindings}
                            refresh={props.refresh}
                            handleClose={props.handleClose}
                            readonly={props.readonly || privilegeCheck(field)}
                            resetForm={resetForm}
                            onChange={fieldChange}
                            onBinding={bindingAssign}
                            boundId={props.boundId}
                          />
                        </Grid>
                      ) : null
                    )}
                  </Grid>
                </>
              )
            ) : (
              <Grid
                container
                key={index}
                className={`group group-${props.mode}`}
              >
                {item.fields.map((field, index) =>
                  field.visibility[props.mode] === false ||
                  field.type === "hidden" ||
                  checkCompanyRelated(field) ||
                  !privilegeShowCheck(field) ? null : (
                    <Grid
                      key={index}
                      xs={
                        props.mode === "edit" || props.mode === "create"
                          ? field.editWidth?.xs || field.width?.xs || 6
                          : field.width?.xs || 6
                      }
                      sm={
                        props.mode === "edit" || props.mode === "create"
                          ? field.editWidth?.sm || field.width?.sm || 4
                          : field.width?.sm || 4
                      }
                      lg={
                        props.mode === "edit" || props.mode === "create"
                          ? field.editWidth?.lg || field.width?.lg || 3
                          : field.width?.lg || 3
                      }
                    >
                      <FormField
                        initialValue={initialValueCalculator(
                          item.initialData,
                          field
                        )}
                        {...field}
                        addOrRemoveObjects={addOrRemoveObjects}
                        mode={props.mode}
                        bindTrigger={
                          trigger?.[
                            field.model[props.mode] || field.model.create
                          ]
                        }
                        bindings={bindings}
                        readonly={props.readonly || privilegeCheck(field)}
                        resetForm={resetForm}
                        onChange={fieldChange}
                        onBinding={bindingAssign}
                        boundId={props.boundId}
                        handleClick={props.handleClick}
                        currentData={props.currentData}
                        formData={data}
                      />
                    </Grid>
                  )
                )}
              </Grid>
            )
          )}
        </div>
      )}
      <div
        className={
          props.mode === "filter"
            ? "mb-4 flex w-full justify-end gap-1.5"
            : "save-area"
        }
      >
        {props.filterButtons === true ? null : props.customSave &&
          props.mode !== "filter" ? null : ((props.data.length === 1 &&
            props.data[0].group?.type === "tableComponent" &&
            props.type !== "innerForm") ||
            (props.type === "innerForm" && props?.data[0]?.group?.customSave) ||
            props.dataModel?.edit === false ||
            props.readonly) &&
          !(checkIf(props.actionView) && props.actionView.isSubmit) ? null : (
          <>
            {!props.entity?.instantReport && (
              <button
                type="submit"
                disabled={props.disabled}
                onClick={handleSubmit}
                // hidden={props?.data[0]?.group?.customSave}
                className={
                  props.mode === "filter"
                    ? "btn btn-primary"
                    : "btn btn-primary mx-auto"
                }
              >
                {props.mode === "filter" ? (
                  props.assetMode?.view === false ? (
                    <>
                      <Icon icon="FaFileExcel" /> AKTAR
                    </>
                  ) : (
                    <>
                      <Icon icon="FaSearch" className="mr-1" />
                      Ara
                    </>
                  )
                ) : (
                  "KAYDET"
                )}
              </button>
            )}
          </>
        )}
        {props.filterButtons === true ? null : props.customSave &&
          props.mode !== "filter" ? null : props.mode === "filter" ? (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleClear}
          >
            <Icon icon="FaTimes" />
            Temizle
          </button>
        ) : null}
      </div>
      {props.disabled && <div className="disabling-layer"></div>}
    </div>
  );
});

export default FormBuilder;
