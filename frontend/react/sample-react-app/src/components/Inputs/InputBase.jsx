import { ErrorMessage, Field } from "formik";
import { useState } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import InputTooltip from "./InputTooltip";

export const InputBase = ({
  label,
  name,
  type,
  style,
  inputClassName,
  component,
  format,
  mask,
  disabled,
  tooltip,
  placeholder,
  onFocus,
  allowEmptyFormatting,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex h-full w-full flex-col">
      <label htmlFor={name} className="text-sm font-semibold text-black">
        {label}
        {tooltip?.title && <InputTooltip title={tooltip.title} />}
      </label>
      <div className="relative">
        <Field
          type={type && showPassword ? "text" : type}
          name={name}
          style={style}
          className={inputClassName}
          component={component}
          format={format}
          mask={mask}
          disabled={disabled}
          placeholder={placeholder}
          onFocus={onFocus}
          allowEmptyFormatting={allowEmptyFormatting}
          {...props}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer border-none bg-transparent"
          >
            {showPassword ? <MdVisibility /> : <MdVisibilityOff />}
          </button>
        )}
      </div>
      <div>
        <ErrorMessage
          className="pl-1 text-xs text-persian-red"
          component="span"
          name={name}
        />
      </div>
    </div>
  );
};
