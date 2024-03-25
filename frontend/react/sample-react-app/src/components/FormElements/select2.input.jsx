import { checkPrivilegeInRoles } from "@libs/utils";
import Select from "react-select";

const Select2Input = ({
  DropdownIndicator,
  inputChange,
  getErrorClass,
  getErrorMessage,
  handleChange,
  state,
  loading,
  refElement,
  roles,
  ...props
}) => {
  const checkIsDisable = () => {
    if (props?.disabled) return true;
    if (props?.mode === "edit" || props?.mode === "create") {
      if(!(props.readonly && !props.isEdit))
        return !checkPrivilegeInRoles(props?.privilege?.id, roles)
        else return (props.readonly && !props.isEdit) // prettier-ignore
    }
    return false;
  };
  let isDisable = checkIsDisable();
  return (
    <div className={`form-field ${getErrorClass()}`}>
      <label
        className={`select-label ${
          props.required && props.mode !== "filter" ? "select-required" : ""
        } `}
        htmlFor={props.model.create}
      >
        {props.label}
      </label>
      <Select
        closeMenuOnSelect={!props.multiple}
        components={{ DropdownIndicator }}
        className="react-select-container"
        classNamePrefix="react-select"
        placeholder={
          props.placeholder ? (
            <div className="react-select-placeholder">{props.placeholder}</div>
          ) : (
            ""
          )
        }
        isDisabled={isDisable}
        ref={refElement}
        name={props.model.create}
        options={state.options}
        value={state.value || ""}
        isMulti={props.multiple}
        isLoading={loading}
        isClearable={true}
        noOptionsMessage={() => "Kayıt Bulunamadı"}
        menuPortalTarget={props?.portal !== false && document.body}
        loadingMessage={() => "Yükleniyor..."}
        onChange={handleChange}
        onInputChange={inputChange}
      />
      <span className="error">{getErrorMessage()}</span>
    </div>
  );
};

export default Select2Input;
