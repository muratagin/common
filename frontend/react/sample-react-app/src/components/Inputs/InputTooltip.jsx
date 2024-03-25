import Icon from '@components/icon';
import { Tooltip } from '@mui/material';

const InputTooltip = ({ title }) => {
  return (
    <Tooltip
      title={title}
      className="cursor-pointer"
      classes={{
        tooltip: 'bg-light shadow-lg text-xs text-black',
      }}
    >
      <button
        type="button"
        className="border-none bg-transparent  outline-none"
      >
        <Icon icon="FaInfoCircle" />
      </button>
    </Tooltip>
  );
};

export default InputTooltip;
