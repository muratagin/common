import classNames from "classnames";

export const Input = ({ field, className, setFieldValue, ...props }) => {
  return (
    <input
      {...props}
      {...field}
      className={classNames({
        "w-full rounded-md border border-solid border-[#ced4da] bg-white disabled:bg-gray-200 px-1.5 placeholder:text-sm": true,
        [className]: className,
      })}
    />
  );
};

export default Input;
