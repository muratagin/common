import classNames from "classnames";
import { ErrorMessage, Field } from "formik";
import { useState } from "react";

export const Checkbox = ({
  btnLabel,
  label,
  labelProps,
  containerClassName,
  name,
  setFieldValue,
  showModal,
  modal,
  ModalComponent,
}) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  const onApproved = () => {
    setFieldValue(name, true);
    handleClose();
  };

  const valueChange = (event) => {
    const { checked } = event.target;
    if (checked && showModal) {
      setOpen(true);
    } else {
      setFieldValue(name, checked);
    }
  };

  return (
    <>
      <div
        className={classNames({
          "flex gap-x-2 items-center": true,
          [containerClassName]: containerClassName,
        })}
      >
        <div>
          <Field
            name={name}
            id={name}
            component={Input}
            onChange={valueChange}
          />
        </div>
        <div className="flex flex-col">
          <div className="text-xs font-semibold">
            <button
              type="button"
              className="underline text-xs text-start"
              onClick={() => setOpen(true)}
            >
              {btnLabel}
            </button>
            <label
              htmlFor={name}
              className={classNames({
                "md:ml-1 text-base cursor-pointer": true,
                [labelProps?.className]: labelProps?.className,
              })}
            >
              {label}
            </label>
          </div>
          <ErrorMessage
            className="text-red-500 text-xs px-1"
            component="span"
            name={name}
          />
        </div>
      </div>
      {open && ModalComponent && (
        <ModalComponent
          onApproved={onApproved}
          modal={modal}
          open={open}
          handleClose={handleClose}
        />
      )}
    </>
  );
};

const Input = ({ field, meta, ...props }) => {
  return (
    <input
      {...field}
      {...props}
      checked={field.value}
      type="checkbox"
      className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 cursor-pointer"
    />
  );
};
