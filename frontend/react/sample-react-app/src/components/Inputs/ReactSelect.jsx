import Select from "react-select";

function ReactSelect({
  options,
  multiple,
  setFieldValue,
  isClearable = true,
  ...props
}) {
  const valueChange = (value) => {
    let currentValue;

    if (multiple) {
      currentValue = value.map((val) => val.value);
    } else {
      currentValue = value?.value;
    }

    setFieldValue(props.field?.name, currentValue);
  };

  const selectedValue =
    options && options?.find((option) => option.value === props?.field?.value);

  return (
    <Select
      options={options}
      isMulti={multiple}
      isClearable={isClearable}
      menuPortalTarget={document.body}
      value={selectedValue}
      noOptionsMessage={() => "Kayıt Bulunamadı"}
      loadingMessage={() => "Yükleniyor..."}
      onChange={(value) => valueChange(value)}
      className="react-select-container"
      classNamePrefix="react-select"
      isDisabled={props.disabled}
      placeholder={
        props.placeholder ? (
          <div className="react-select-placeholder">{props.placeholder}</div>
        ) : (
          ""
        )
      }
      {...props}
    />
  );
}

export default ReactSelect;
