import { forwardRef } from 'react';
import ReactInputMask from 'react-input-mask';

const CustomInput = forwardRef(
  ({ isDatetime, dateMonthFormat, ...props }, ref) => {
    return (
      <ReactInputMask
        {...props}
        ref={ref}
        className="form-input form-control w-full"
        mask={
          isDatetime
            ? '99/99/9999 99:99'
            : dateMonthFormat
            ? '99/9999'
            : '99/99/9999'
        }
      />
    );
  }
);

export default CustomInput;
