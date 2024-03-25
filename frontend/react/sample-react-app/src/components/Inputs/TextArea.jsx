import classNames from "classnames";

export const TextArea = ({ field, className, ...props }) => {
  return (
    <textarea
      className={classNames({
        "h-full w-full resize-none rounded-md border px-1.5 border-solid border-[#ced4da] bg-white p-5 font-light disabled:bg-gray-200": true,
        [className]: className,
      })}
      rows={5}
      {...field}
      {...props}
    />
  );
};
