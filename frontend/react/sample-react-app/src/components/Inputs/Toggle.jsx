import classNames from "classnames";

export const Toggle = ({
  label,
  setFieldValue,
  name,
  value,
  toggleContainerClassNames,
  ...props
}) => {
  const valueChange = (event) => {
    const { checked } = event.target;
    setFieldValue(name, checked);
  };

  return (
    <label className="items-center cursor-pointer h-full">
      <div
        className={classNames({
          "flex flex-col": true,
          [toggleContainerClassNames]: toggleContainerClassNames,
        })}
      >
        <span className="text-sm md:text-base ml-1 font-light text-black">
          {label}
        </span>
        <div className="relative">
          <input
            {...props}
            checked={value}
            type="checkbox"
            className="sr-only peer"
            onChange={valueChange}
          />
          <div
            className="w-14 h-7 flex-shrink-0 bg-[#ced4da] border-[1px] border-[#ced4da] peer-focus:outline-none rounded-full left-1 peer peer-checked:after:translate-x-7 
       peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[1.5px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all
         peer-checked:bg-success"
          />
        </div>
      </div>
    </label>
  );
};
