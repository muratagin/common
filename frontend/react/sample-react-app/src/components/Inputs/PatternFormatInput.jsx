import classNames from "classnames";
import { PatternFormat } from "react-number-format";

export const PatternFormatInput = ({
  field,
  format,
  mask,
  className,
  placeholder,
  onFocus,
  props,
  disabled,
  allowEmptyFormatting = false,
}) => {
  return (
    <PatternFormat
      {...field}
      {...props}
      placeholder={placeholder}
      format={format}
      mask={mask}
      className={classNames({
        "w-full rounded-md border border-solid border-[#ced4da] bg-white disabled:bg-gray-200 px-1.5 placeholder:text-sm": true,
        [className]: className,
      })}
      onFocus={onFocus}
      disabled={disabled}
      allowEmptyFormatting={allowEmptyFormatting}
    />
  );
};
