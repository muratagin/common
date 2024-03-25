import { Requests } from "@app/api";
import { MASTER_IDENTIFIER } from "@app/constant";
import { settings } from "@app/settings";
import { useResourcesContext } from "@contexts/ResourceProvider";
import { isDate } from "date-fns";
import { useEffect, useRef, useState } from "react";
import Autosuggest from "react-autosuggest";
import { useSelector } from "react-redux";
import { components } from "react-select";
import "react-tagsinput/react-tagsinput.css";
import getElementsSelector from "./elements.selector";
import { getServiceUrl } from "./parser";
import {
  checkIf,
  checkIfIsEmpty,
  filterArrayByObject,
  findCompany,
  findCompanyProps,
  interpolate,
  mapValueToOption,
  optionFiltererByPermission,
  roundToTwoDigitsAfterComma,
  trimIf,
} from "./utils";

export function FormField(props) {
  const [customModalForIsOpenToClaim, setCustomModalForIsOpenToClaim] =
    useState({ show: false });
  const [claimReasonHistory, setClaimReasonHistory] = useState({ show: false });
  const companyIdentifier = useSelector((state) => state.selection.identifier);
  const currentEntity = useSelector((state) => state.selection.currentEntity);
  const { user } = useSelector((state) => state.user);
  const roles = user?.Roles;

  const { resource } = useResourcesContext();

  let element = {};

  const Regex = {
    email:
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    // date: /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/,
    datetime:
      /^([0][1-9]|[1][0-9]|[2][0-9]|[3][0-1])\/([0][1-9]|[1][0-2])\/([1][9][0-9]{2}|[2][0-9]{3})( ([0-1][0-9]|[2][0-3]):[0-5][0-9])$/,
    tax: /^[0-9]{10}$/,
    identity: /^[1-9]{1}[0-9]{9}[02468]{1}$/,
    card: /^([0-9]{4})\s?([0-9]{4})\s?([0-9]{4})\s?([0-9]{4})$/,
    plate:
      /^(0[1-9]|[1-7][0-9]|8[01])(([A-Z])(\d{4,5})|([A-Z]{2})(\d{3,4})|([A-Z]{3})(\d{2,3}))$/,
    mobile: /^(05)\d{9}$/,
    phone: /^\+?\d+(\s\d+)*$/,
    decimal: /^[0-9]+(\,[0-9]{1,2})?$/,
    number: /^(0|[1-9][0-9]*)$/,
    taxNumber: /^[+-]?\d+$/,
    website:
      /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
  };

  const DynamicRegex = (value, type, param) => {
    let todo = {
      maxlength: {
        value: new RegExp("^.{0," + param + "}$"),
        message: `Lütfen en fazla ${param} karakter giriniz.`,
      },
      minlength: {
        value: new RegExp("^.{" + param + ",20000}$"),
        message: `Lütfen en az ${param} karakter giriniz.`,
      },
    };
    return {
      value: !Boolean(todo[type].value.test(value)),
      message: todo[type].message,
    };
  };

  const DropdownIndicator = (props) => {
    return (
      components.DropdownIndicator && (
        <components.DropdownIndicator {...props}>
          {props.selectProps.menuIsOpen ? (
            <svg
              width="14"
              height="14"
              viewBox="0 0 22 22"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M18.3277 8.7585C18.3277 13.5957 14.2249 17.517 9.16387 17.517C4.1028 17.517 0 13.5957 0 8.7585C0 3.92131 4.1028 0 9.16387 0C14.2249 0 18.3277 3.92131 18.3277 8.7585ZM17.3631 8.75849C17.3631 13.0865 13.6922 16.595 9.16387 16.595C4.63554 16.595 0.964606 13.0865 0.964606 8.75849C0.964606 4.43048 4.63554 0.921937 9.16387 0.921937C13.6922 0.921937 17.3631 4.43048 17.3631 8.75849Z"
                fill="currentColor"
              ></path>
              <path
                d="M14.0274 15.0682L21.28 22L22 21.3119L14.8106 14.4405C14.5636 14.6647 14.302 14.8745 14.0274 15.0682Z"
                fill="currentColor"
              ></path>
            </svg>
          ) : (
            <svg
              width="8"
              height="4"
              viewBox="0 0 8 4"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M4 4L1.61318e-07 7.75128e-07L8 0L4 4Z" fill="black" />
            </svg>
          )}
        </components.DropdownIndicator>
      )
    );
  };

  const updateIsOpenToClaimCheckbox = (value) => {
    let input = refElement.current;
    let nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "checked"
    ).set;
    nativeInputValueSetter.call(input, value);

    let event = new Event("input", { bubbles: true });
    event.simulated = true;
    input.dispatchEvent(event);

    setState((state) => ({ ...state, value: Boolean(value) }));

    setCustomModalForIsOpenToClaim({ show: false });
  };
  //PW-8942 ile geliştirme yapılmıştır.
  //const fetchData = async (param, ciFlag)
  const fetchData = async (
    param,
    ciFlag,
    currentCompanyIdentifier,
    currentValue
  ) => {
    let next = param;
    let flag, tempCI;
    let url = getServiceUrl(props.service);
    let params = props.service.params;
    if (Array.isArray(next) && props.multipleFilter) {
      next =
        next.length > 1
          ? next
              .map((elem) => {
                return elem.value;
              })
              .join("|")
          : next[0].value;
    }
    flag = Boolean(url.match(/{CompanyId}/));
    if (checkIf(next)) {
      // PRO-1981
      // check for specific company Identifier

      if (flag) {
        tempCI = findCompany("CompanyId", param).CompanyIdentifier;
      }

      // fetch for bound events
      url = interpolate(url, next);

      // custom behavior for "SagmerCoverage." case
      url = url.replace("SagmerCoverage.", "");
      url = url.replace(
        "StatusName==ClaimStatus,ClaimStatus",
        "StatusName==ClaimStatus,StatusOrdinal"
      );
      // end - custom behavior
    }
    if (
      checkIf(props?.model?.create) &&
      props?.model?.create === "RuleGroupIds"
    ) {
      url += `?filters=CompanyId==${props?.boundId}`;
      params = null;
    }

    if (settings.isTpa === false && flag) {
      const companyId = findCompanyProps(
        "CompanyIdentifier",
        settings.companyIdentifier
      ).value;
      url = url.replace("{CompanyId}", `CompanyId==${companyId}`);
      tempCI = settings.companyIdentifier;
    }

    setLoading(true);
    try {
      //PW-8942 ile geliştirme yapılmıştır.
      //const response = await Requests().CommonRequest.get({ url, content: checkIf(params) && props.service.params, headers: { 'CompanyIdentifier': flag && ciFlag ? tempCI : companyIdentifier } })
      let response;
      let headers;

      if (checkIf(props?.service) && checkIf(props?.service?.headers)) {
        headers = { ...props?.service?.headers };
      }

      if (props?.service?.resource && !resource[props?.service?.key]?.loading) {
        let filterResponse = { ...resource[props?.service?.key]?.response };
        if (
          checkIf(props?.service?.resourceFilter) &&
          checkIf(filterResponse?.data)
        ) {
          filterResponse.data = filterArrayByObject(
            filterResponse.data,
            props?.service?.resourceFilter
          );
        }
        if (
          checkIf(props?.service?.resourceCustomFilter) &&
          checkIf(filterResponse?.data) &&
          currentValue
        ) {
          filterResponse.data = filterArrayByObject(filterResponse.data, {
            [props?.service?.resourceCustomFilter]: currentValue,
          });
        }
        response = filterResponse;
      } else
        response =
          !props?.serverSideSearch &&
          (await Requests()
            .CommonRequest.get({
              url,
              content: checkIf(params) && props.service.params,
              headers: {
                CompanyIdentifier:
                  flag && ciFlag
                    ? tempCI
                    : props.service?.alwaysWithMaster
                    ? MASTER_IDENTIFIER
                    : currentCompanyIdentifier || companyIdentifier,
                ...headers,
              },
            })
            .catch((error) => {}));

      let options = [];
      let tags = [];
      let originalTags = [];
      let lookup = [];

      response &&
        response.data.map((val) => {
          let label = "";
          if (props.customSelectLabel) {
            props.customSelectLabel.map(
              (x, index) =>
                (label +=
                  index !== props.customSelectLabel.length - 1
                    ? val[x] + " - "
                    : val[x] + " ")
            );
          } else {
            label = val.DisplayName || val.name || val.Name || val.Text;
          }
          let obj;
          if (checkIfIsEmpty(val.ordinal) || checkIfIsEmpty(val.Ordinal)) {
            obj = {
              value: checkIfIsEmpty(val.Ordinal) ? val.Ordinal : val.ordinal,
              label,
            };
          } else {
            obj = {
              value: val.Id || val.id,
              label,
              uniqueId: val?.uniqueId,
            };
          }
          if (props.type === "textTaggedSuggest") {
            originalTags.push(label);
            lookup.push(obj);
          } else {
            options.push(obj);
          }
        });

      setState((state) => {
        if (props.type === "textTaggedSuggest") {
          return {
            ...state,
            value: {
              tags,
              originalTags,
              lookup,
            },
          };
        } else {
          let objTemp;
          if (props.mode === "create" || props.mode === "filter") {
            if (props?.optionsPrivilege) {
              objTemp = optionFiltererByPermission(
                props,
                roles,
                options,
                state
              );
            } else {
              objTemp = {
                ...state,
                options: options,
                value: null,
              };
            }
          } else {
            objTemp = {
              ...state,
              options: options,
            };
          }
          return objTemp;
        }
      });
    } catch (error) {
      setState((state) => ({ ...state, value: null, options: [] }));
    }
    setLoading(false);
  };

  const refElement = useRef(null);

  const componentValueCalculator = () => {
    let componentValue;
    if (props.initialValue === undefined) {
      if (
        (props.type === "select2" || props.type === "asyncSelect") &&
        !props.service
      ) {
        componentValue = null;
      } else if (props.type === "select") {
        let selectValues = props.value.filter((x) => x.selected);
        componentValue = selectValues.length > 0 ? selectValues : null;
      } else if (props.type === "textTagged") {
        componentValue = { tags: [] };
      } else if (props.type === "textTaggedSuggest") {
        componentValue = { tags: [], originalTags: [] };
      } else {
        componentValue = props.value !== "undefined" ? props.value : "";
      }
    } else {
      if (props.type === "select2" || props.type === "asyncSelect") {
        componentValue = {
          value: props.initialValue.value,
          label: props.initialValue.label,
        };
      } else if (props.type === "textTagged") {
        componentValue = { tags: props.initialValue };
      } else if (props.type === "textTaggedSuggest") {
        componentValue = { tags: props.initialValue, originalTags: [] };
      } else {
        componentValue = props.initialValue;
      }
    }
    return componentValue;
  };

  const errorCalculator = () => {
    return {
      required: {
        value:
          (props.initialValue === undefined || props.initialValue === "") &&
          !checkIfIsEmpty(props.value) &&
          !(props.mode === "filter") &&
          props.required &&
          !(props.type === "checkbox" || props.type === "radio"),
        message: props.requiredMessage || "Bu alan zorunludur.",
      },
    };
  };

  // options evaluation
  let componentOption;
  if (
    !props.service &&
    (props.type === "select" ||
      props.type === "select2" ||
      props.type === "asyncSelect")
  ) {
    if (props.type === "select2" || props.type === "asyncSelect") {
      componentOption = mapValueToOption(props.value);
    } else {
      componentOption = props.value;
    }
  }

  const [state, setState] = useState({
    type: props.type,
    compSign: props.comparisonSign,
    parent: props.parent,
    label:
      props.mode === "filter"
        ? props.model.filter || props.model.create
        : props.mode === "edit"
        ? props.model.edit || props.model.create
        : props.model.create,
    options: componentOption,
    value: componentValueCalculator(),
    error: errorCalculator(),
    progress: 0,
    multipleFile: [],
    inputLabel: props.label,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // bu kısım boundId'li sigortalı hasar kısmında 2nci koşuldakinde düzgün çalışıyor.
    // 1nci koşulda sorun yaratıyor.
    // 1nici koşul ise edit fieldları düzgün çalıştırıyor

    // DİKKAT !!!
    // commit geçmişi takip ediniz. ..

    // BİLGİ NOTU :
    // TABLE COMPONENT EDİT MODUNDA, BOUND ID:undefined

    if (checkIf(props.initialValue)) {
      setState((state) => {
        let type = props.type;
        let value;
        if (type === "date") {
          value = props.initialValue ? props.initialValue : "";
        } else if (type === "datetime") {
          value = props.initialValue ? props.initialValue : "";
        } else {
          value = props.initialValue;
        }
        return {
          ...state,
          value: value,
          error: {
            required: {
              value:
                (props.initialValue === undefined ||
                  props.initialValue === "") &&
                !(props.mode === "filter") &&
                props.required &&
                !(props.type === "checkbox" || props.type === "radio"),
              message: props.requiredMessage,
            },
          },
        };
      });
    }
  }, [JSON.stringify(props.initialValue), props.boundId]);

  useEffect(() => {
    if (props.initialValue !== undefined) {
      let event;
      let nativeInputValueSetter;
      let input = refElement.current;
      //let newValue = props.type === 'select2' ? { value: props.initialValue.value, label: props.initialValue.label } : props.initialValue
      let newValue = props.initialValue;

      if (props.type === "select2" || props.type === "asyncSelect") {
        //non-native component (Select) is used for date & datetime
      } else if (props.type === "select") {
        nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLSelectElement.prototype,
          "value"
        ).set;
        nativeInputValueSetter.call(input, newValue);
      } else if (props.type === "textarea") {
        nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLTextAreaElement.prototype,
          "value"
        ).set;
        nativeInputValueSetter.call(input, newValue);
      } else if (props.type === "checkbox") {
        nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "checked"
        ).set;
        nativeInputValueSetter.call(input, newValue);
      } else if (props.type === "date" || props.type === "datetime") {
        //non-native component (DateTime) is used for date & datetime
        //nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set
        //nativeInputValueSetter.call(input, moment(newValue, 'YYYY-MM-DDTHH:mm:ss').format('DD/MM/YYYY'))
      } else if (props.type === "imageFile") {
      } else if (props.type === "tinyeditor") {
      } else if (props.type === "dummy") {
      } else {
        nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value"
        ).set;
        nativeInputValueSetter.call(input, newValue);
      }
      event = new Event("input", { bubbles: true });
      event.simulated = true;

      try {
        input.dispatchEvent(event);
      } catch (error) {}
    }
  }, [props.initialValue, props.boundId]);

  useEffect(() => {
    let subscription = props.resetForm?.subscribe((result) => {
      if (checkIf(result)) {
        setState((state) => {
          if (props.type === "date" || props.type === "datetime") {
            refElement.current.state.inputValue = "";
          }
          return {
            ...state,
            value: componentValueCalculator(),
            error: errorCalculator(),
          };
        });
      }
    });
    return () => subscription?.unsubscribe();
  }, [props.resetForm]);

  useEffect(() => {
    let subscription = props.bindTrigger?.subscribe((result) => {
      //PW-8942 ile geliştirme yapılmıştır.
      //if (checkIf(result) && trimIf(result)) {
      //         fetchData(result, 'companyIdentifierRelated')
      if (checkIf(result?.value) && trimIf(result?.value)) {
        fetchData(
          result?.value,
          "companyIdentifierRelated",
          result?.currentCompanyIdentifier,
          result?.value
        );
      } else if (
        result &&
        result.value === null &&
        checkIf(result.currentCompanyIdentifier)
      ) {
        if (props.service?.searchEvenWithoutBoundId) {
          setState((state) => ({ ...state, value: null, options: [] }));
          fetchData(null, null, null, result?.value);
        } else setState((state) => ({ ...state, value: null, options: [] }));
      } else if (typeof result == "number") {
        let objCompanyIdentifier = findCompany(
          "CompanyId",
          result
        )?.CompanyIdentifier;
        if (checkIf(objCompanyIdentifier)) {
          fetchData(result, "companyIdentifierRelated", objCompanyIdentifier);
        }
      }
    });
    return () => subscription?.unsubscribe();
  }, []);

  useEffect(() => {
    props.onChange({ ...state });
  }, [state]);

  useEffect(() => {
    if (
      props.autofill &&
      props.mode === "create" &&
      checkIf(currentEntity) &&
      checkIf(currentEntity.Data?.[props.model.create])
    ) {
      setState((state) => ({
        ...state,
        value: currentEntity.Data[props.model.create],
      }));
    }
  }, [currentEntity]);

  useEffect(() => {
    if (checkIf(props.service) && resource.complete) {
      // it needs to get to remote url once rendered
      // for select, options need to be filled

      // for binded components check {...} binding
      let regex = /{[a-zA-Z0-9_.]*}/g;
      // let match = props.service.url.match(regex);

      let tpaProductRegex = /{CompanyId}/g;
      let isTpaMatch =
        props.service.url.match(tpaProductRegex) && settings.isTpa === false;

      let match =
        !checkIf(props.service?.resource) && props.service.url.match(regex);
      if (match && !isTpaMatch) {
        let binding = match[0].substr(1, match[0].length - 2);
        props.onBinding(binding, state.label);
        if (props.service?.searchEvenWithoutBoundId) {
          fetchData();
        }
      } else {
        !props?.serverSideSearch && fetchData(null, isTpaMatch);
      }
    }

    if (props.type === "radio" || props.type === "select") {
      if (Array.isArray(props.value)) {
        let findDefault = props.value.find((item) => item.selected);
        if (findDefault) {
          setState({ ...state, value: Number(findDefault.value) });
        } else {
          setState({ ...state, value: null });
        }
      }
    }
  }, [resource.complete]);

  const handleSetValue = (value, currentElement) => {
    const input = currentElement ? currentElement : refElement;
    const setValue = Object.getOwnPropertyDescriptor(
      input.current.__proto__,
      "value"
    ).set;
    const event = new Event("input", { bubbles: true });
    setValue.call(input.current, value ? value : "");
    refElement.current.dispatchEvent(event);
  };

  const handleChange = (e, typeData) => {
    //check if file
    if (e && e.target?.files) {
      if (e.target?.files.length <= 1) {
        const file = e.target.files[0];

        if (!file) setState({ ...state, value: null, progress: 0 });
        else {
          const fileName = file.name
            .split(/\.(?=[^\.]+$)/)[0]
            .replace(/\\/g, "_");
          const fileExtension = file.name.split(/\.(?=[^\.]+$)/)[1];

          const reader = new FileReader();
          reader.readAsBinaryString(file);

          reader.onload = () => {
            const base64Key = btoa(reader.result);
            if (typeData === "imageFile") {
              setState((state) => {
                let error = {
                  ...state.error,
                  required: {
                    value:
                      !(props.mode === "filter") &&
                      props.required &&
                      !base64Key,
                    message: "Bu alan zorunludur.",
                  },
                  type: {
                    value:
                      base64Key &&
                      !(checkIf(props.includesMedia)
                        ? props.includesMedia.includes(
                            fileExtension.toUpperCase()
                          )
                        : ["JPG", "JPEG", "PNG"].includes(
                            fileExtension.toUpperCase()
                          )),
                    message: `${
                      checkIf(props.includesMedia)
                        ? props.includesMedia.join(",")
                        : "JPG,JPEG,PNG"
                    } uzantılı dosya yükleyiniz…`,
                  },
                };
                return {
                  ...state,
                  value: {
                    fileName: fileName,
                    fileExtension,
                    fileBase64: base64Key,
                  },
                  error: error,
                };
              });
            } else {
              setState((state) => {
                let error = {
                  ...state.error,
                  required: {
                    value:
                      !(props.mode === "filter") &&
                      props.required &&
                      !base64Key,
                    message: "Bu alan zorunludur.",
                  },
                  type: {
                    value:
                      base64Key &&
                      ![
                        "XLSX",
                        "DOC",
                        "DOCX",
                        "PDF",
                        "JPEG",
                        "JPG",
                        "PNG",
                        "MSG",
                      ].includes(fileExtension.toUpperCase()),
                    message:
                      "XLSX,DOC,DOCX,PDF,JPEG,JPG,PNG, MSG uzantılı dosya yükleyiniz…",
                  },
                };

                return {
                  ...state,
                  multipleFile: [],
                  value: {
                    fileName,
                    fileExtension,
                    fileBase64: base64Key,
                  },
                  error: error,
                };
              });
            }
          };

          reader.addEventListener("progress", (event) => {
            if (event.loaded && event.total) {
              const progress = (event.loaded / event.total) * 100;
              setState({ ...state, progress });
            }
          });
        }
      } else {
        const files = e.target.files;
        Object.keys(files).forEach((i) => {
          const file = files[i];
          const reader = new FileReader();
          reader.onload = (e) => {
            const fileName = file.name
              .split(/\.(?=[^\.]+$)/)[0]
              .replace(/\\/g, "_");
            const fileExtension = file.name.split(/\.(?=[^\.]+$)/)[1];
            const base64Key = btoa(reader.result);
            let error = {
              ...state.error,
              required: {
                value:
                  !(props.mode === "filter") && props.required && !base64Key,
                message: "Bu alan zorunludur.",
              },
              type: {
                value:
                  base64Key &&
                  ![
                    "XLSX",
                    "DOC",
                    "DOCX",
                    "PDF",
                    "JPEG",
                    "JPG",
                    "PNG",
                    "MSG",
                  ].includes(fileExtension.toUpperCase()),
                message:
                  "XLSX,DOC,DOCX,PDF,JPEG,JPG,PNG, MSG uzantılı dosya yükleyiniz…",
              },
            };
            let newFile = {
              fileName,
              fileExtension,
              fileBase64: base64Key,
            };
            setState((prevState) => ({
              ...prevState,
              multipleFile: [...prevState.multipleFile, newFile],
              error: error,
            }));
          };
          reader.readAsBinaryString(file);
        });
      }
    }
    // check if select2
    if ((e && checkIf(e.value) && checkIf(e.label)) || typeData?.action) {
      let select2Value = typeData.action === "clear" ? null : e;
      setState((state) => {
        let error = { ...state.error };
        error.required = {
          value:
            !(props.mode === "filter") &&
            props.required &&
            select2Value === null,
          message: "Bu alan zorunludur.",
        };
        //PW-8942 ile geliştirme yapılmıştır.
        //return { ...state, value: select2Value, error: error }
        return {
          ...state,
          value: select2Value,
          error: error,
          currentCompanyIdentifier: companyIdentifier,
        };
      });
    }
    // check if taggedText
    else if (Array.isArray(e)) {
      let tagsValue = e;
      let lastValue = tagsValue.at(-1);
      let regex = props?.textTagged?.regex;
      let maxLength = props?.textTagged?.maxLength || 100;
      if (
        checkIf(lastValue) &&
        checkIf(regex) &&
        !Boolean(Regex[regex].test(lastValue))
      ) {
        return false;
      }
      if (tagsValue?.length > maxLength) {
        setState((state) => {
          let error = { ...state.error };
          error.required = {
            value: true,
            message: `En fazla ${maxLength} adet girilebilir.`,
          };
          return { ...state, error: error };
        });
      } else {
        setState((state) => {
          let error = { ...state.error };
          error.required = {
            value:
              !(props.mode === "filter") &&
              props.required &&
              tagsValue === null,
            message: "Bu alan zorunludur.",
          };
          let newValue = { ...state.value, tags: tagsValue };
          return {
            ...state,
            value: newValue,
            error: error,
          };
        });
      }
    } else {
      let checked = e.target?.checked;

      if (props?.isNumeric) {
        checked = checked === true ? 1 : 0;
      }

      let value = props?.onlyLetterValue
        ? e.target?.value.replace(/[0-9]/gi, "")
        : props?.withoutLetterValue
        ? e.target?.value.replace(/[a-zA-Z]/gi, "")
        : e.target?.value;
      let type = e.target?.type;
      let typeCheck = type === "checkbox" || type === "radio" || isDate(e);
      let actualValue =
        type === "checkbox"
          ? checked
          : type === "radio" || type === "select-one"
          ? isNaN(parseInt(value))
            ? null
            : Number(value)
          : typeof value === "string"
          ? type === "password" ||
            props.type === "email" ||
            props.type === "dummy"
            ? value
            : props.type === "decimal"
            ? value
                .split(/[^0-9,]+/)
                .filter(Boolean)
                .join("")
            : props?.textCaseStatus === "ignore"
            ? value
            : value.toLocaleUpperCase("tr-TR")
          : props.type == "date" || props.type == "datetime"
          ? e
          : value;
      if (props.type === "decimal" && checkIf(props?.limitDecimal)) {
        actualValue = roundToTwoDigitsAfterComma(
          actualValue,
          props?.limitDecimal
        );
      }

      if (props.type === "select" && props?.selectWithBoolean) {
        actualValue = props?.isNotInteger
          ? e.target.value
          : e.target.value === "true" || e.target.value === "false"
          ? e.target.value
          : null;
      }

      setState((state) => {
        let error = { ...state.error };
        let label;
        error.required = {
          value:
            !(props.mode === "filter") &&
            props.required &&
            !typeCheck &&
            actualValue.trim() === "",
          message: "Bu alan zorunludur.",
        };

        if (checkIf(props.validation)) {
          Object.keys(props.validation).forEach((key) => {
            error[key] = {
              ...DynamicRegex(actualValue, key, props.validation[key]),
            };
          });
        }

        if (Regex[props.type]) {
          error[props.type] = {
            value:
              trimIf(actualValue) !== "" &&
              !Boolean(Regex[props.type].test(actualValue)),
            message:
              props.invalidMessage || "Lütfen geçerli bir değer giriniz.",
          };
        }
        if (
          props.type === "dummy" &&
          checkIf(props?.isCustomModel) &&
          props?.isCustomModel === true
        ) {
          label = e.target.name;
        } else {
          label =
            props.mode === "filter"
              ? props.model.filter || props.model.create
              : props.mode === "edit"
              ? props.model.edit || props.model.create
              : props.model.create;
        }
        return { ...state, value: actualValue, error: error, label };
      });
    }
  };

  const inputChange = (event) => {
    let value = event.replace(event, event.toLocaleUpperCase("tr-TR"));
    return value;
  };

  const getErrorClass = () => {
    return state.error &&
      Object.entries(state.error).some((elem) => elem[1].value)
      ? "field-invalid"
      : "";
  };

  const getErrorMessage = () => {
    let find =
      state.error &&
      Object.entries(state.error).find((elem) => elem?.[1].value);
    return find?.[1].message;
  };

  const defaultPasteSplit = (data) => {
    return data.split(/[\n' ']+/).map((d) => d.trim());
  };

  const autocompleteRenderInput = ({ addTag, ...props }) => {
    const handleOnChange = (e, { newValue, method }) => {
      if (method === "enter") {
        e.preventDefault();
      } else {
        props.onChange(e);
      }
    };

    const inputValue = (props.value && props.value.trim().toLowerCase()) || "";

    const suggestions = state.value?.originalTags?.filter((tag) => {
      // checkIf(tag) controlled undefined value
      return (
        checkIf(tag) &&
        !(state.value?.tags?.indexOf(tag) > -1) &&
        tag.toLowerCase().match(inputValue)
      );
    });

    return (
      <Autosuggest
        ref={props.ref}
        suggestions={suggestions}
        shouldRenderSuggestions={(value) => checkIf(value)}
        getSuggestionValue={(suggestion) => suggestion}
        renderSuggestion={(suggestion) => <span>{suggestion}</span>}
        inputProps={{ ...props, onChange: handleOnChange }}
        onSuggestionSelected={(e, { suggestion }) => {
          addTag(suggestion);
        }}
        onSuggestionsClearRequested={() => {}}
        onSuggestionsFetchRequested={() => {}}
      />
    );
  };

  element = getElementsSelector(
    handleChange,
    inputChange,
    getErrorClass,
    getErrorMessage,
    customModalForIsOpenToClaim,
    updateIsOpenToClaimCheckbox,
    setClaimReasonHistory,
    claimReasonHistory,
    defaultPasteSplit,
    autocompleteRenderInput,
    DropdownIndicator,
    state,
    loading,
    refElement,
    roles,
    handleSetValue,
    props
  );

  return element;
}
