import { Requests } from "@app/api";
import { MASTER_IDENTIFIER } from "@app/constant";
import { getServiceUrl } from "@libs/parser";
import { checkIf, checkIfIsEmpty } from "@libs/utils";
import { useCallback, useEffect, useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";

const AsyncSelectInput = ({
  getErrorClass,
  getErrorMessage,
  className,
  isDisabled,
  value,
  isLoading,
  options,
  refElement,
  components,
  handleChange,
  inputChange,
  isMulti,
  name,
  placeholder,
  ...props
}) => {
  const [isChange, setIsChange] = useState(true);
  const [defaultValue, setDefaultValue] = useState(true);
  const [bindValue, setBindValue] = useState(null);

  useEffect(() => {
    setIsChange(!isChange);
  }, [options, bindValue]);

  useEffect(() => {
    let subscription = props.bindTrigger.subscribe((result) => {
      if (result?.value) return setBindValue(result?.value);
      return setBindValue(null);
    });
    return () => subscription?.unsubscribe();
  }, []);

  useEffect(() => {
    if (
      props?.mode === "edit" &&
      props?.serverSideSearch &&
      defaultValue &&
      value
    ) {
      getOptions(null, value?.value).then((res) =>
        res.map((x) =>
          handleChange(
            { label: x.label, value: x.value },
            {
              action: "select-option",
              name: name,
            }
          )
        )
      );
    }
  }, [value]);

  const getOptions = async (search, id) => {
    let param = bindValue ? `,ProcessListType==${bindValue}` : "";
    let url = getServiceUrl(props?.service);
    url = checkIfIsEmpty(url) ? url.split("?")[0] : url;
    if (id) {
      url = `${url}?filters=Id==${id}${param}`;
    } else {
      url = `${url}?filters=${props?.searchName}${
        props?.serverSideSearchCompSign || props?.comparisonSign
      }${search}${param}`;
    }

    let options = [];
    if (checkIf(url) && (checkIf(id) || search?.length >= 3)) {
      await Requests()
        .CommonRequest.get({
          url,
          content: {},
          headers: { CompanyIdentifier: MASTER_IDENTIFIER },
        })
        .then((response) => {
          options = response.data.map((val) => {
            let label = "";
            if (props.customSelectLabel) {
              props.customSelectLabel.map((x) => (label += val[x] + " "));
            } else {
              label = val.DisplayName || val.name || val.Name;
            }
            return {
              label: label,
              value: val.Id || val.id || val.ordinal || val.Ordinal,
            };
          });
        })
        .catch((error) => {
          console.log("error");
        });
    }
    setDefaultValue(false);
    return options;
  };

  const sleep = (ms) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  const loadOptions = async (search, prevOptions) => {
    if (props?.serverSideSearch) {
      const response = await getOptions(search);
      const hasMore = response.length > prevOptions.length + 10;
      const slicedOptions = response.slice(
        prevOptions.length,
        prevOptions.length + 10
      );
      return {
        options: slicedOptions,
        hasMore,
      };
    } else {
      await sleep(1000);
      let filteredOptions;
      if (!search) {
        filteredOptions = options;
      } else {
        const searchUpper = search.toLocaleUpperCase("tr-TR");

        filteredOptions = options.filter(({ label }) =>
          label.toLocaleUpperCase("tr-TR").includes(searchUpper)
        );
      }
      const hasMore = filteredOptions.length > prevOptions.length + 10;
      const slicedOptions = filteredOptions.slice(
        prevOptions.length,
        prevOptions.length + 10
      );
      return {
        options: slicedOptions,
        hasMore,
      };
    }
  };
  const extendedLoadOptions = useCallback(
    async (search, prevOptions) => {
      const result = await loadOptions(search, prevOptions);
      return result;
    },
    [isChange]
  );
  return (
    <div className={`form-field ${getErrorClass()}`}>
      <label
        className={`select-label ${
          props.required && props.mode != "filter" ? "select-required" : ""
        } `}
        htmlFor={props.model.create}
      >
        {props.label}
      </label>
      <AsyncPaginate
        components={components}
        className={className}
        placeholder={!isLoading ? placeholder || "" : "Yükleniyor..."}
        isDisabled={isLoading || isDisabled}
        name={name}
        value={!isLoading ? value || "" : ""}
        isMulti={isMulti}
        isClearable={true}
        noOptionsMessage={() =>
          value && props?.serverSideSearch ? placeholder : "Kayıt Bulunamadı"
        }
        loadingMessage={() => "Yükleniyor..."}
        loadOptions={extendedLoadOptions}
        cacheUniqs={[isChange]}
        onChange={handleChange}
        onInputChange={inputChange}
      />

      <span className="error">{getErrorMessage()}</span>
    </div>
  );
};

export default AsyncSelectInput;
