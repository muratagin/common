import {
  CalendarContainer,
  CustomHeader,
  CustomInput,
  CustomTimeInput,
} from "@components/DatePicker";
import { checkIfIsEmpty } from "@libs/utils";
import { lastDayOfMonth } from "date-fns";
import { tr } from "date-fns/locale";
import { useEffect } from "react";
import ReactDatePicker, { registerLocale } from "react-datepicker";

const DateTimeInput = ({
  getErrorClass,
  getErrorMessage,
  handleChange,
  state,
  refElement,
  ...props
}) => {
  registerLocale("tr", tr);
  useEffect(() => {
    if (!checkIfIsEmpty(state.value) && props.defaultValueNow) {
      handleChange(new Date());
    }
  }, [state]);

  return (
    <div className={`form-field ${getErrorClass()}`}>
      <label
        className={props.required & (props.mode != "filter") ? "required" : ""}
        htmlFor={props.model.create}
      >
        {props.label}
      </label>
      <ReactDatePicker
        popperContainer={CalendarContainer}
        selected={
          checkIfIsEmpty(state.value) ? new Date(state.value) : state.value
        }
        dateFormat={
          props.type === "datetime"
            ? "dd/MM/yyyy HH:mm"
            : props?.dateMonthFormat
            ? "MM/yyyy"
            : "dd/MM/yyyy"
        }
        locale="tr"
        className="mx-auto"
        minDate={new Date("1900-01-01")}
        maxDate={props?.afterToday ? new Date() : new Date("2099-12-31")}
        onChange={(date) => {
          handleChange(
            props?.dateMonthFormat ? lastDayOfMonth(date) : date ?? ""
          );
        }}
        showTimeInput={props.type === "datetime"}
        placeholderText={props.placeholder}
        disabled={props.disabled || (props.readonly && !props.isEdit)}
        ref={refElement}
        timeInputLabel="Saat:"
        customTimeInput={<CustomTimeInput />}
        customInput={
          <CustomInput
            isDatetime={props.type === "datetime"}
            dateMonthFormat={props?.dateMonthFormat === true}
          />
        }
        renderCustomHeader={(e) =>
          CustomHeader({
            ...e,
            dateMonthFormat: props?.dateMonthFormat === true,
          })
        }
        isClearable={
          !(props.disabled || (props.readonly && !props.isEdit)) && state?.value
        }
        showMonthYearPicker={props?.dateMonthFormat === true}
      />
      <span className="error">{getErrorMessage()}</span>
    </div>
  );
};

export default DateTimeInput;
