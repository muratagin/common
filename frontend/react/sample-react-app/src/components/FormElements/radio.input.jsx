const RadioInput = ({
  getErrorClass,
  getErrorMessage,
  handleChange,
  state,
  refElement,
  ...props
}) => {
  return (
    <div className={`form-field ${getErrorClass()}`}>
      <label htmlFor={props.model.create}>{props.label}</label>
      {props.value.map((item, index) => (
        <div key={index} className="radio-group">
          <label
            className={
              props.required && props.mode != 'filter' ? 'required' : ''
            }
          >
            {item.key}
          </label>
          <input
            ref={refElement}
            type={props.type}
            name={props.model.create}
            checked={state.value === Number(item.value)}
            disabled={props.disabled || props.readonly}
            value={Number(item.value)}
            onChange={handleChange}
          />
        </div>
      ))}
      <span className="error">{getErrorMessage()}</span>
    </div>
  );
};

export default RadioInput;
