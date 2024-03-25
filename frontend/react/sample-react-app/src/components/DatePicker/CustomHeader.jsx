import Icon from '@components/icon';
import { range } from 'lodash';
const months = [
  'Ocak',
  'Şubat',
  'Mart',
  'Nisan',
  'Mayıs',
  'Haziran',
  'Temmuz',
  'Ağustos',
  'Eylül',
  'Ekim',
  'Kasım',
  'Aralık',
];

const years = range(1900, 2099 + 1, 1);

const CustomHeader = ({
  date,
  changeYear,
  changeMonth,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
  dateMonthFormat,
}) => (
  <div className="mt-2 flex items-center justify-around">
    <button
      className="flex cursor-pointer rounded-full border-none bg-transparent bg-white p-2 text-sm font-medium hover:bg-blue-400/20 "
      onClick={decreaseMonth}
      disabled={prevMonthButtonDisabled}
    >
      <Icon icon="FaChevronLeft" />
    </button>
    <div className="flex gap-1 ">
      {!dateMonthFormat && (
        <select
          className="form-input cursor-pointer !border-none text-sm"
          value={months[date.getMonth()]}
          onChange={({ target: { value } }) =>
            changeMonth(months.indexOf(value))
          }
        >
          {months.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
      <select
        className="form-input h-16 cursor-pointer !border-none text-sm"
        value={date.getFullYear()}
        onChange={({ target: { value } }) => changeYear(value)}
      >
        {years.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
    <button
      className="flex cursor-pointer rounded-full border-none bg-transparent bg-white p-2 text-sm font-medium hover:bg-blue-400/20 "
      onClick={increaseMonth}
      disabled={nextMonthButtonDisabled}
    >
      <Icon icon="FaChevronRight" />
    </button>
  </div>
);
export default CustomHeader;
