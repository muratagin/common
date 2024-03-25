import { isBoolean } from 'lodash';
import { checkIf } from '@libs/utils';

const SelectInput = ({
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
      <select
        ref={refElement}
        className={'form-input form-control required'}
        name={props.model.create}
        value={
          checkIf(state.value)
            ? props?.selectWithBoolean
              ? state.value
              : isBoolean(state.value) && Number(state.value)
              ? Number(state.value)
              : state.value
            : ''
        }
        disabled={props.disabled || props.readonly}
        onChange={handleChange}
      >
        {props.isNotShowPlaceholder ? (
          <></>
        ) : (
          <option>{props.placeholder || 'Seçiniz'}</option>
        )}
        {state.options?.map(option => (
          <option
            key={option.value}
            value={
              props?.selectWithBoolean ? option.value : Number(option.value)
            }
          >
            {option.key}
          </option>
        ))}
      </select>
      <span className="error">{getErrorMessage()}</span>
    </div>
  );
};

export default SelectInput;
