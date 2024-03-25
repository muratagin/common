import { isObjectIsNotEmpty } from '@libs/utils';

const TextAreaInput = ({
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
        className={props.required && props.mode != 'filter' ? 'required' : ''}
        htmlFor={props.model.create}
      >
        {props.label}
      </label>
      <textarea
        className={'form-input required resize-y'}
        ref={refElement}
        value={state.value}
        name={props.model.create}
        placeholder={props.placeholder || ''}
        disabled={props.disabled || (props.readonly && !props.isEdit)}
        onChange={e => {
          if (
            isObjectIsNotEmpty(props.validation) &&
            e.nativeEvent.inputType === 'insertLineBreak'
          ) {
            // PROT-153 textarea alt satıra geçme hatası
          } else {
            handleChange(e);
          }
        }}
        rows={props?.textareaRows || 5}
      />
      <span className="error">{getErrorMessage()}</span>
    </div>
  );
};

export default TextAreaInput;
