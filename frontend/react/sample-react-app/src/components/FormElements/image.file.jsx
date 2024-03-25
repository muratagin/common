import Icon from "@components/icon";
import { checkIfIsEmpty } from "@libs/utils";

export default function ImageFile({
  props,
  state,
  refElement,
  handleChange,
  getErrorMessage,
  getErrorClass,
}) {
  const getSource = (value) => {
    if (checkIfIsEmpty(value?.fileBase64)) {
      return (
        "data:image/png;name=favicon-16x16.png;base64," +
        state?.value?.fileBase64
      );
    } else if (checkIfIsEmpty(value)) {
      return value;
    } else {
      return "";
    }
  };

  return (
    <div className={`form-field file-field ${getErrorClass()}`}>
      <label className="left-label " htmlFor={props.model.create}>
        {props.label}
      </label>

      <div className="flex mt-7 border-2 border-dashed border-summer-sky max-w-full max-h-72">
        <div className="">
          {checkIfIsEmpty(state?.value) || checkIfIsEmpty(state?.value) ? (
            <img
              alt="görsel bulunamadı"
              src={getSource(state?.value)}
              className="object-contain h-full w-full"
            />
          ) : (
            <></>
          )}

          {(checkIfIsEmpty(state?.value?.fileBase64) ||
            checkIfIsEmpty(state?.value?.MediaLink) ||
            checkIfIsEmpty(state?.value)) && (
            <button
              className="absolute right-2.5 top-10 rounded-full btn btn-danger"
              onClick={() =>
                handleChange({
                  target: {
                    placeholder: "Görsel Linki.",
                    value: "",
                  },
                })
              }
            >
              <Icon className="" icon="FaTimes" />
            </button>
          )}
        </div>
        {!(
          checkIfIsEmpty(state?.value?.fileBase64) ||
          checkIfIsEmpty(state?.value?.MediaLink) ||
          checkIfIsEmpty(state?.value)
        ) && (
          <label className="w-full h-full flex !mb-0 hover:bg-gray-200 transition-all duration-300 justify-center items-center cursor-pointer p-5">
            <div className="flex justify-center items-center h-full flex-col gap-y-2.5">
              <Icon icon="FaUpload" className="w-7 h-7 text-primary" />
              <h6 className="text-center font-medium text-base text-gray-500">
                Yüklenecek görseli seçiniz.
              </h6>
              <input
                type="file"
                accept="image/*"
                ref={refElement}
                className="hidden"
                disabled={props.disabled || props.readonly}
                id={props.model.create}
                name={props.model.create}
                onChange={(e) => handleChange(e, props.type)}
              />
            </div>
          </label>
        )}
      </div>

      <div className="container">
        <span className="error">{getErrorMessage()}</span>
      </div>
    </div>
  );
}
