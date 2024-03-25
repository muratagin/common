import InputMask from 'react-input-mask';

const DefaultInput = ({
  getErrorClass,
  getErrorMessage,
  handleChange,
  state,
  refElement,
  ...props
}) => {
  return (
    <div
      style={{ display: props.display ? props.display : 'block' }}
      className={`form-field ${getErrorClass()}`}
    >
      <label
        className={props.required & (props.mode != 'filter') ? 'required' : ''}
        htmlFor={props.model?.create}
      >
        {props.label}
      </label>
      <InputMask
        style={{ display: props.display ? props.display : 'block' }}
        className={'form-input form-control required'}
        ref={refElement}
        // maxLength={props?.validation?.maxlength}
        value={state.value}
        name={props.model.create}
        mask={props.mask}
        placeholder={props.placeholder || ''}
        disabled={props.disabled || (props.readonly && !props.isEdit)}
        onChange={handleChange}
      />
      <span className="error">{getErrorMessage()}</span>
    </div>
  );
};

export default DefaultInput;
