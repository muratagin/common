import {
  ActionInput,
  AsyncSelectInput,
  CheckBoxInput,
  DateTimeInput,
  DefaultInput,
  DummyInput,
  FileInput,
  NumberInput,
  PasswordInput,
  RadioInput,
  Select2Input,
  SelectInput,
  StepInput,
  TextAreaInput,
  TextTaggedInput,
  TextTaggedSuggestInput,
} from "@components/FormElements";
import ImageFile from "@components/FormElements/image.file";
import TinyEditor from "@components/FormElements/tiny.editor.input";

const getElementsSelector = (
  handleChange,
  inputChange,
  getErrorClass,
  getErrorMessage,
  customModalForIsOpenToClaim,
  updateIsOpenToClaimCheckbox,
  setClaimReasonHistory,
  claimReasonHistory,
  defaultPasteSplit,
  autocompleteRenderInput,
  DropdownIndicator,
  state,
  loading,
  refElement,
  roles,
  handleSetValue,
  props
) => {
  let element = {};

  switch (props.type) {
    case "file":
      element = (
        <FileInput
          handleChange={handleChange}
          getErrorClass={getErrorClass}
          getErrorMessage={getErrorMessage}
          state={state}
          refElement={refElement}
          {...props}
        />
      );
      break;

    case "imageFile":
      element = (
        <ImageFile
          props={props}
          state={state}
          refElement={refElement}
          handleChange={handleChange}
          getErrorMessage={getErrorMessage}
          getErrorClass={getErrorClass}
        />
      );
      break;
    case "checkbox":
      element = (
        <CheckBoxInput
          handleChange={handleChange}
          getErrorClass={getErrorClass}
          getErrorMessage={getErrorMessage}
          state={state}
          customModalForIsOpenToClaim={customModalForIsOpenToClaim}
          updateIsOpenToClaimCheckbox={updateIsOpenToClaimCheckbox}
          refElement={refElement}
          {...props}
        />
      );
      break;
    case "radio":
      element = (
        <RadioInput
          handleChange={handleChange}
          getErrorClass={getErrorClass}
          getErrorMessage={getErrorMessage}
          state={state}
          refElement={refElement}
          {...props}
        />
      );
      break;
    case "select":
      element = (
        <SelectInput
          handleChange={handleChange}
          getErrorClass={getErrorClass}
          getErrorMessage={getErrorMessage}
          state={state}
          refElement={refElement}
          {...props}
        />
      );
      break;
    case "asyncSelect":
      element = (
        <AsyncSelectInput
          getErrorClass={getErrorClass}
          getErrorMessage={getErrorMessage}
          components={{ DropdownIndicator }}
          className="react-select-container"
          placeholder={props.placeholder || ""}
          isDisabled={props.disabled || (props.readonly && !props.isEdit)}
          refElement={refElement}
          name={props.model.create}
          options={state.options}
          value={state.value || ""}
          isMulti={props.multiple}
          isLoading={loading}
          isClearable={true}
          noOptionsMessage={() => "Kayıt Bulunamadı"}
          loadingMessage={() => "Yükleniyor..."}
          handleChange={handleChange}
          inputChange={inputChange}
          {...props}
        />
      );
      break;
    case "select2":
      element = (
        <Select2Input
          DropdownIndicator={DropdownIndicator}
          getErrorClass={getErrorClass}
          getErrorMessage={getErrorMessage}
          state={state}
          refElement={refElement}
          loading={loading}
          handleChange={handleChange}
          inputChange={inputChange}
          roles={roles}
          {...props}
        />
      );
      break;
    case "textTagged":
      element = (
        <TextTaggedInput
          defaultPasteSplit={defaultPasteSplit}
          getErrorClass={getErrorClass}
          getErrorMessage={getErrorMessage}
          state={state}
          refElement={refElement}
          loading={loading}
          handleChange={handleChange}
          {...props}
        />
      );
      break;
    case "textTaggedSuggest":
      element = (
        <TextTaggedSuggestInput
          autocompleteRenderInput={autocompleteRenderInput}
          getErrorClass={getErrorClass}
          getErrorMessage={getErrorMessage}
          state={state}
          refElement={refElement}
          loading={loading}
          handleChange={handleChange}
          {...props}
        />
      );
      break;
    case "textarea":
      element = (
        <TextAreaInput
          getErrorClass={getErrorClass}
          getErrorMessage={getErrorMessage}
          state={state}
          refElement={refElement}
          loading={loading}
          handleChange={handleChange}
          {...props}
        />
      );
      break;
    case "step":
      element = (
        <StepInput
          getErrorClass={getErrorClass}
          getErrorMessage={getErrorMessage}
          state={state}
          refElement={refElement}
          loading={loading}
          handleChange={handleChange}
          {...props}
        />
      );
      break;
    case "action":
      element = (
        <ActionInput
          getErrorClass={getErrorClass}
          setClaimReasonHistory={setClaimReasonHistory}
          claimReasonHistory={claimReasonHistory}
        />
      );
      break;
    case "password":
      element = (
        <PasswordInput
          getErrorClass={getErrorClass}
          getErrorMessage={getErrorMessage}
          state={state}
          refElement={refElement}
          loading={loading}
          handleChange={handleChange}
          {...props}
        />
      );
      break;
    case "date":
    case "datetime":
      element = (
        <DateTimeInput
          getErrorClass={getErrorClass}
          getErrorMessage={getErrorMessage}
          state={state}
          refElement={refElement}
          loading={loading}
          handleChange={handleChange}
          {...props}
        />
      );
      break;
    case "number":
      element = (
        <NumberInput
          getErrorClass={getErrorClass}
          getErrorMessage={getErrorMessage}
          state={state}
          refElement={refElement}
          loading={loading}
          inputChange={inputChange}
          handleChange={handleChange}
          {...props}
        />
      );
      break;
    case "tinyeditor":
      element = (
        <div className={`form-field ${getErrorClass()}`}>
          <label
            className={
              props.required & (props.mode != "filter") ? "required" : ""
            }
            htmlFor={props.model.create}
          >
            {props.label}
          </label>
          <TinyEditor
            refElement={refElement}
            data={state.value}
            onChange={(value) => {
              handleChange({
                target: {
                  value,
                  type: "ckEditor",
                },
              });
            }}
          />
          <span className="error">{getErrorMessage()}</span>
        </div>
      );
      break;
    case "dummy":
      element = (
        <DummyInput
          refElement={refElement}
          state={state}
          handleChange={handleChange}
          {...props}
        />
      );
      break;
    default:
      element = (
        <DefaultInput
          getErrorClass={getErrorClass}
          getErrorMessage={getErrorMessage}
          state={state}
          refElement={refElement}
          loading={loading}
          handleChange={handleChange}
          {...props}
        />
      );
      break;
  }

  return element;
};

export default getElementsSelector;
