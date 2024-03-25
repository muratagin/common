import { isValid } from 'date-fns';
const CustomTimeInput = ({ date, onChange }) => {
  return (
    <div className="flex gap-1 ">
      <select
        className="form-input !h-8 cursor-pointer !border-none !p-1 text-sm"
        disabled={!isValid(date)}
        value={date.getHours()}
        onChange={({ target: { value } }) =>
          onChange(`${value}:${date.getMinutes()}`)
        }
      >
        {Array.from(Array(24).keys()).map(option => (
          <option key={option} value={option}>
            {option.toString().padStart(2, '0')}
          </option>
        ))}
      </select>
      <select
        className="form-input !h-8 cursor-pointer !border-none !p-1 text-sm"
        value={date.getMinutes()}
        disabled={!(date && date.getHours())}
        onChange={({ target: { value } }) =>
          onChange(`${date.getHours()}:${value}`)
        }
      >
        {Array.from(Array(60).keys()).map(option => (
          <option key={option} value={option}>
            {option.toString().padStart(2, '0')}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CustomTimeInput;
