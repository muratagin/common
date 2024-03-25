import * as Progress from '@radix-ui/react-progress';

const FileInput = ({
  getErrorClass,
  getErrorMessage,
  handleChange,
  state,
  refElement,
  ...props
}) => {
  return (
    <div className={`form-field file-field ${getErrorClass()}`}>
      <label htmlFor={props.model.create}>{props.label}</label>
      <input
        className="form-input"
        ref={refElement}
        type={props.type}
        disabled={props.disabled || (props.readonly && !props.isEdit)}
        id={props.model.create}
        name={props.model.create}
        multiple={props.isMultipleFile} // Feed eklenecek
        onChange={handleChange}
      />
      {Boolean(state.progress) && (
        <div className="progress-bar-wrap">
          <Progress.Root
            className="bg-blackA9 relative h-[25px] w-[300px] overflow-hidden rounded-full"
            style={{
              // Fix overflow clipping in Safari
              // https://gist.github.com/domske/b66047671c780a238b51c51ffde8d3a0
              transform: 'translateZ(0)',
            }}
            value={state.progress}
          >
            <Progress.Indicator
              className="ease-[cubic-bezier(0.65, 0, 0.35, 1)] h-full w-full bg-white transition-transform duration-[660ms]"
              style={{
                transform: `translateX(-${100 - state.progress}%)`,
              }}
            />
          </Progress.Root>
          <span style={{ fontSize: '15px' }}>{`%${state.progress}`}</span>
        </div>
      )}
      <span className="error">{getErrorMessage()}</span>
    </div>
  );
};

export default FileInput;
