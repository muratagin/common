import InputMask from 'react-input-mask';

const NumberInput = ({
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
      <InputMask
        className={'form-input form-control required'}
        ref={refElement}
        value={state.value?.toString()}
        name={props.model.create}
        mask={Array(
          props?.validation?.maxlength
            ? Number(props?.validation?.maxlength)
            : 20
        )
          .fill(9)
          .join('')}
        maskPlaceholder={null}
        placeholder={props.placeholder || ''}
        disabled={props.disabled || (props.readonly && !props.isEdit)}
        onChange={handleChange}
      />
      <span className="error">{getErrorMessage()}</span>
    </div>
  );
};

export default NumberInput;
