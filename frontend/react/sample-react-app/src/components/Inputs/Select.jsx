import classNames from "classnames";

export const Select = ({
  options,
  selectEmptyLabel,
  className,
  field,
  ...props
}) => {
  return (
    <select
      className={classNames({
        "border-light-grey h-full w-full rounded-md border px-1.5 bg-white font-light outline-none first:text-gray-500 disabled:bg-gray-200": true,
        [className]: className,
      })}
      {...field}
      {...props}
    >
      <option value="">{selectEmptyLabel || "Lütfen Seçiniz"}</option>
      {options &&
        options.map((option, index) => (
          <option
            key={option.Id || option.value || index}
            value={option.Id || option.value}
          >
            {option.Name || option.label}
          </option>
        ))}
    </select>
  );
};

export default Select;
