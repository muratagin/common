const PasswordInput = ({
  getErrorClass,
  getErrorMessage,
  handleChange,
  state,
  refElement,
  ...props
}) => {
  return (
    <div className={`form-field ${getErrorClass()}`}>
      <label
        className={props.required & (props.mode != "filter") ? "required" : ""}
        htmlFor={props.model.create}
      >
        {props.label}
      </label>
      <input
        className={"form-input form-control required"}
        ref={refElement}
        value={state.value}
        type="password"
        autoComplete="new-password"
        name={props.model.create}
        placeholder={props.placeholder || ""}
        disabled={props.disabled || (props.readonly && !props.isEdit)}
        // maxLength={props?.validation?.maxlength}
        // minLength={props?.validation?.minlength}
        onChange={handleChange}
      />
      <span className="error">{getErrorMessage()}</span>
    </div>
  );
};

export default PasswordInput;
