import TagsInput from 'react-tagsinput';
import { checkIf, isObjectIsNotEmpty } from '@libs/utils';

const TextTaggedInput = ({
  defaultPasteSplit,
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
        pasteSplit={defaultPasteSplit}
        addOnPaste
        addKeys={
          checkIf(props.textTagged) && isObjectIsNotEmpty(props.textTagged)
            ? props.textTagged.addKeys
            : [32]
        }
        ref={refElement}
        value={state.value.tags}
        name={props.model.create}
        disabled={props.disabled || (props.readonly && !props.isEdit)}
        inputProps={{ placeholder: props.placeholder || '' }}
        onChange={handleChange}
      />
      <span className="error">{getErrorMessage()}</span>
      {state?.error?.required?.value && (
        <span className="error" style={{ display: 'block' }}>
          {state?.error?.required?.message}
        </span>
      )}
    </div>
  );
};

export default TextTaggedInput;
