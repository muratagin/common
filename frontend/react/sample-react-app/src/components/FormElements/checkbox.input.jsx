const CheckBoxInput = ({
  getErrorClass,
  getErrorMessage,
  handleChange,
  refElement,
  state,
  customModalForIsOpenToClaim,
  updateIsOpenToClaimCheckbox,
  ...props
}) => {
  return (
    <div className={`form-field ${getErrorClass()}`}>
      <label className="left-label" htmlFor={props.model.create}>
        {props.label}
      </label>
      <div className="onoffswitch  inline-block">
        <input
          className="onoffswitch-checkbox"
          id={props.model.create}
          ref={refElement}
          type={props.type}
          disabled={props.disabled || (props.readonly && !props.isEdit)}
          name={props.model.create}
          checked={state.value}
          onChange={handleChange}
        />
        <label className="onoffswitch-label" htmlFor={props.model.create}>
          <span className="onoffswitch-inner"></span>
          <span className="onoffswitch-switch"></span>
        </label>
      </div>
    </div>
  );
};

export default CheckBoxInput;
