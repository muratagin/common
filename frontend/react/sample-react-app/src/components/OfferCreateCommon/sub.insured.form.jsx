import { IdentityType, ProductType } from "@app/enum";
import Input from "@components/Inputs/Input";
import { InputBase } from "@components/Inputs/InputBase";
import { PatternFormatInput } from "@components/Inputs/PatternFormatInput";
import ReactSelect from "@components/Inputs/ReactSelect";
import { TextArea } from "@components/Inputs/TextArea";
import { Toggle } from "@components/Inputs/Toggle";
import { useOfferContext } from "@contexts/OfferCreateProvider";
import { checkIfIsEmpty } from "@libs/utils";
import { useEffect, useState } from "react";
import { getCountiesFilterByCityId } from "./service";

export const SubInsuredForm = ({
  index,
  setFieldValue,
  isNotPasaportIdentity,
  value,
}) => {
  const { options, currentProductType } = useOfferContext();
  const [countyOptions, setCountyOptions] = useState([]);

  useEffect(() => {
    if (checkIfIsEmpty(value.CityId)) {
      getCountyOptions(value.CityId);
    }
  }, [value.CityId]);

  const getCountyOptions = async (cityId) => {
    try {
      setCountyOptions(await getCountiesFilterByCityId(cityId));
    } catch (error) {}
  };

  return (
    <>
      <InputBase
        label="*Adı"
        component={Input}
        inputClassName="!h-10"
        name={`InsuredInformationList.${index}.FirstName`}
        placeholder="Adı giriniz"
        disabled={isNotPasaportIdentity}
      />
      <InputBase
        label="*Soyadı"
        component={Input}
        inputClassName="!h-10"
        name={`InsuredInformationList.${index}.LastName`}
        placeholder="Soyadı giriniz"
        disabled={isNotPasaportIdentity}
      />
      <InputBase
        label="*Cinsiyet"
        component={ReactSelect}
        inputClassName="!h-10"
        name={`InsuredInformationList.${index}.Gender`}
        placeholder="Cinsiyet seçiniz"
        disabled={isNotPasaportIdentity}
        options={options.genderType}
        setFieldValue={setFieldValue}
      />
      {/*Pasaport seçili ise */}
      {!isNotPasaportIdentity && (
        <>
          <InputBase
            label="*Baba Adı"
            component={Input}
            inputClassName="!h-10"
            name={`InsuredInformationList.${index}.FatherName`}
            placeholder="Baba adı giriniz"
          />
        </>
      )}
      <InputBase
        label="*İl"
        component={ReactSelect}
        inputClassName="!h-10"
        name={`InsuredInformationList.${index}.CityId`}
        placeholder="İl seçiniz"
        disabled={isNotPasaportIdentity}
        options={options.cities}
        setFieldValue={setFieldValue}
      />
      <InputBase
        label="*İlçe"
        component={ReactSelect}
        inputClassName="!h-10"
        name={`InsuredInformationList.${index}.CountyId`}
        placeholder="İlçe seçiniz"
        disabled={isNotPasaportIdentity}
        options={countyOptions}
        setFieldValue={setFieldValue}
      />
      <InputBase
        label="*Adres"
        component={TextArea}
        inputClassName="!p-1.5"
        name={`InsuredInformationList.${index}.AddressDetail`}
        placeholder="Adres giriniz"
        disabled={
          isNotPasaportIdentity &&
          value.IdentityType !== IdentityType.BLUE_CARD_NUMBER
        }
        rows={2}
      />
      <InputBase
        label="*Boy(cm)"
        type="number"
        component={Input}
        inputClassName="!h-10"
        name={`InsuredInformationList.${index}.Height`}
        placeholder="Boy giriniz"
      />
      <InputBase
        label="*Kilo(kg)"
        type="number"
        component={Input}
        inputClassName="!h-10"
        name={`InsuredInformationList.${index}.Weight`}
        placeholder="Kilo giriniz"
      />
      <InputBase
        label="*Cep Telefonu"
        component={PatternFormatInput}
        inputClassName="!h-10"
        type="text"
        name={`InsuredInformationList.${index}.MobileNumber`}
        format="0 ### ### ## ##"
        placeholder="Cep telefonu giriniz"
        allowEmptyFormatting={true}
        disabled={value.IsSameInsured}
      />
      <InputBase
        label="E-posta Adresi"
        component={Input}
        inputClassName="!h-10"
        name={`InsuredInformationList.${index}.EmailAddress`}
        placeholder="E-posta adresi giriniz"
        setFieldValue={setFieldValue}
      />
      {currentProductType !== ProductType.YBU && (
        <>
          <InputBase
            label="*Birey Tipi"
            component={ReactSelect}
            isDisabled={value.SameInsured}
            disabled={true}
            isClearable
            inputClassName="!h-10"
            name={`InsuredInformationList.${index}.IndividualType`}
            placeholder="Birey tipi seçiniz"
            options={options.individualType}
            setFieldValue={setFieldValue}
            selectEmptyLabel="Birey tipi seçiniz"
          />
          <div className="flex items-center col-span-2">
            <div className="flex w-32">
              <Toggle
                type="checkbox"
                name={`InsuredInformationList.${index}.IsTransition`}
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
                  name={`InsuredInformationList.${index}.TransitionCompanyId`}
                  placeholder="Sigorta şirketi seçiniz"
                  options={options.transitionCompanies}
                  setFieldValue={setFieldValue}
                  selectEmptyLabel="Sigorta şirketi seçiniz"
                />
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};
