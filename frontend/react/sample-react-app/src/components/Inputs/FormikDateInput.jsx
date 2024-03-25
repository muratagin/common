import {
  CalendarContainer,
  CustomHeader,
  CustomInput,
  CustomTimeInput,
} from "@components/DatePicker";
import { format, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import DatePicker, { registerLocale } from "react-datepicker";

const ReactDatePicker = ({ field, setFieldValue, ...props }) => {
  registerLocale("tr", tr);

  const valueChange = (value) => {
    let currentValue = value
      ? format(value, props.datetime ? "yyyy-MM-dd'T'HH:mm:ss" : "yyyy-MM-dd")
      : "";

    setFieldValue(field?.name, currentValue);
  };
  return (
    <DatePicker
      popperContainer={CalendarContainer}
      selected={field?.value ? new Date(parseISO(field?.value)) : ""}
      dateFormat={
        props.datetime
          ? "dd/MM/yyyy HH:mm"
          : props?.dateMonthFormat
          ? "MM/yyyy"
          : "dd/MM/yyyy"
      }
      locale="tr"
      className="mx-auto"
      minDate={new Date("1900-01-01")}
      maxDate={props?.afterToday ? new Date() : new Date("2099-12-31")}
      onChange={(date) => valueChange(date)}
      showTimeInput={props?.datetime}
      placeholderText={props.placeholder}
      disabled={props.disabled || (props.readonly && !props.isEdit)}
      timeInputLabel="Saat:"
      customTimeInput={<CustomTimeInput />}
      customInput={
        <CustomInput
          isDatetime={props?.datetime}
          dateMonthFormat={props?.dateMonthFormat}
        />
      }
      renderCustomHeader={(e) =>
        CustomHeader({
          ...e,
          dateMonthFormat: props?.dateMonthFormat,
        })
      }
      isClearable={!props.disabled && field?.value}
      showMonthYearPicker={props?.dateMonthFormat}
      {...props}
    />
  );
};

export default ReactDatePicker;
