import TagsInput from 'react-tagsinput';

const TextTaggedSuggestInput = ({
  autocompleteRenderInput,
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
      <TagsInput
        ref={refElement}
        value={state?.value?.tags}
        name={props.model.create}
        disabled={props.disabled || (props.readonly && !props.isEdit)}
        renderInput={autocompleteRenderInput}
        inputProps={{ placeholder: props.placeholder || '' }}
        onChange={handleChange}
      />
      <span className="error">{getErrorMessage()}</span>
    </div>
  );
};

export default TextTaggedSuggestInput;
