const StepInput = ({
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
        className={props.required & (props.mode != 'filter') ? 'required' : ''}
        htmlFor={props.model.create}
      >
        {props.label}
      </label>
      <input
        className="form-input"
        ref={refElement}
        type="number"
        id={props.model.create}
        name={props.model.create}
        placeholder={props.placeholder || ''}
        disabled={props.disabled || (props.readonly && !props.isEdit)}
        min={props.min}
        max={props.max}
        step={props.step}
        onChange={handleChange}
      />
      <span className="error">{getErrorMessage()}</span>
    </div>
  );
};

export default StepInput;
