import ReactDatePicker from "@components/Inputs/FormikDateInput";
import Input from "@components/Inputs/Input";
import { InputBase } from "@components/Inputs/InputBase";
import { PatternFormatInput } from "@components/Inputs/PatternFormatInput";
import ReactSelect from "@components/Inputs/ReactSelect";
import { TextArea } from "@components/Inputs/TextArea";
import { Toggle } from "@components/Inputs/Toggle";
import Icon from "@components/icon";
import { useState } from "react";
import { COMPANY_OPTIONS, INDIVIDUAL_TYPE_OPTIONS } from "../data";

function InsuredForm({ setFieldValue, value, index, insuredCount, remove }) {
  const [isSearch, setIsSearch] = useState(false);
  const handleRemove = (index) => {
    setIsSearch(false);
    remove(index);
  };

  return (
    <div className="flex flex-col relative gap-y-2.5">
      {index === 0 && <span className="group-title text-xl">Sigortalılar</span>}

      <div className="row group-summary group flex flex-col items-center gap-4 gap-y-2 !py-3 md:grid md:grid-cols-3 lg:grid-cols-4">
        <InputBase
          label="*T.C. Kimlik No"
          component={PatternFormatInput}
          inputClassName="!h-10"
          type="number"
          name={`InsuredList.${index}.IdentityNo`}
          id={`InsuredList.${index}.IdentityNo`}
          format="###########"
          placeholder="T.C. kimlik no giriniz"
        />
        <InputBase
          label="*Doğum Tarihi"
          component={ReactDatePicker}
          inputClassName="!h-10"
          name={`InsuredList.${index}.DateOfBirth`}
          placeholder="Doğum tarihi seçiniz"
          setFieldValue={setFieldValue}
        />
        {isSearch && (
          <>
            <InputBase
              label="Adı"
              component={Input}
              inputClassName="!h-10"
              name={`InsuredList.${index}.FirstName`}
              placeholder="Adı giriniz"
              disabled={true}
            />
            <InputBase
              label="Soyadı"
              component={Input}
              inputClassName="!h-10"
              name={`InsuredList.${index}.LastName`}
              placeholder="Soyadı giriniz"
              disabled={true}
            />
            <InputBase
              label="Cinsiyet"
              component={Input}
              inputClassName="!h-10"
              name={`InsuredList.${index}.GenderType.Text`}
              placeholder="Cinsiyet giriniz"
              disabled={true}
            />
            <InputBase
              label="Medeni Durumu"
              component={Input}
              inputClassName="!h-10"
              name={`InsuredList.${index}.MaritalStatus`}
              placeholder="Medeni durum giriniz"
              disabled={true}
            />
            <InputBase
              label="İl"
              component={Input}
              inputClassName="!h-10"
              name={`InsuredList.${index}.City.Name`}
              placeholder="İl giriniz"
              disabled={true}
            />
            <InputBase
              label="İlçe"
              component={Input}
              inputClassName="!h-10"
              name={`InsuredList.${index}.County.Name`}
              placeholder="İlçe giriniz"
              disabled={true}
            />
            <InputBase
              label="Adres"
              component={TextArea}
              inputClassName="!p-1.5"
              name={`InsuredList.${index}.Address`}
              placeholder="Adres giriniz"
              disabled={true}
              rows={2}
            />
            <InputBase
              label="*Cep Telefonu"
              component={PatternFormatInput}
              inputClassName="!h-10"
              type="text"
              name={`InsuredList.${index}.MobileNumber`}
              format="0 ### ### ## ##"
              placeholder="Cep telefonu giriniz"
            />
            <InputBase
              label="E-posta Adresi"
              component={Input}
              inputClassName="!h-10"
              name={`InsuredList.${index}.EmailAddress`}
              placeholder="E-posta adresi giriniz"
              setFieldValue={setFieldValue}
            />
            <InputBase
              label="Birey Tipi"
              component={ReactSelect}
              isClearable
              inputClassName="!h-10"
              name={`InsuredList.${index}.Type.Ordinal`}
              placeholder="Birey tipi seçiniz"
              options={INDIVIDUAL_TYPE_OPTIONS}
              setFieldValue={setFieldValue}
              selectEmptyLabel="Birey tipi seçiniz"
            />
            <div className="flex items-center col-span-2">
              <div className="flex w-32">
                <Toggle
                  type="checkbox"
                  name={`InsuredList.${index}.IsTransition`}
                  label="Geçiş mi?"
                  setFieldValue={setFieldValue}
                  value={value?.IsTransition}
                />
              </div>
              {value?.IsTransition && (
                <div className="max-w-[240px] w-full">
                  <InputBase
                    label="*Sigorta Şirketi"
                    component={ReactSelect}
                    isClearable
                    inputClassName="!h-10"
                    name={`InsuredList.${index}.Company`}
                    placeholder="Sigorta şirketi seçiniz"
                    options={COMPANY_OPTIONS}
                    setFieldValue={setFieldValue}
                    selectEmptyLabel="Sigorta şirketi seçiniz"
                  />
                </div>
              )}
            </div>
          </>
        )}
        {!isSearch && (
          <div className="mt-5">
            <button
              onClick={() => setIsSearch(true)}
              disabled={!(value?.IdentityNo && value?.DateOfBirth)}
              className="btn btn-success py-1.5 px-4 rounded-xl text-white disabled:bg-opacity-55"
            >
              ARA
            </button>
          </div>
        )}
        {insuredCount > 1 && (
          <div className="w-full col-span-full grid justify-items-end">
            <button
              type="button"
              className="text-danger h-10 flex  items-center hover:bg-blue-100 w-10 justify-center rounded-full transition-all duration-300"
              onClick={() => handleRemove(index)}
            >
              <Icon icon="FaTrash" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default InsuredForm;
