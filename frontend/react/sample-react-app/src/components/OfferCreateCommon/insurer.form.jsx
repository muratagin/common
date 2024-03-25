import { ContactType, IdentityType } from "@app/enum";
import ReactDatePicker from "@components/Inputs/FormikDateInput";
import Input from "@components/Inputs/Input";
import { InputBase } from "@components/Inputs/InputBase";
import { PatternFormatInput } from "@components/Inputs/PatternFormatInput";
import ReactSelect from "@components/Inputs/ReactSelect";
import { TextArea } from "@components/Inputs/TextArea";
import {
  getCountiesFilterByCityId,
  getIndividualInformationFromKPS,
  getVknInformationFromKPS,
} from "@components/OfferCreateCommon/service";
import { useOfferContext } from "@contexts/OfferCreateProvider";
import { MySwalData } from "@libs/myswaldata";
import { checkIfIsEmpty, isLabelPrefix, resErrorMessage } from "@libs/utils";
import { setLoading } from "@slices/dynamicStyleSlice";
import { ErrorMessage } from "formik";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function InsurerForm({ setFieldValue, values, setFormValues }) {
  const { options } = useOfferContext();
  const [countyOptions, setCountyOptions] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const dispacth = useDispatch();
  const isRealPerson = values.Insurer?.ContactType == ContactType.GERCEK;

  const MySwal = withReactContent(Swal);

  useEffect(() => {
    setIsSearch(false);
    setFormValues({
      ...values,
      Insurer: {
        IsSearch: false,
        ContactType: values?.Insurer?.ContactType,
        IdentityNumber: "",
        DateOfBirth: "",
        TaxNumber: "",
        TaxOffice: "",
        FirstName: "",
        LastName: "",
        Gender: "",
        MaritalStatus: "",
        MobileNumber: "",
        EmailAddress: "",
        CityId: "",
        CountyId: "",
        AddressDetail: "",
      },
    });
  }, [values?.Insurer?.ContactType]);

  useEffect(() => {
    if (checkIfIsEmpty(values?.Insurer?.CityId)) {
      getCountyOptions(values?.Insurer?.CityId);
    }
  }, [values?.Insurer?.CityId]);

  const getCountyOptions = async (cityId) => {
    try {
      setCountyOptions(await getCountiesFilterByCityId(cityId));
    } catch (error) {}
  };

  const getInsurerInfoFromKPS = async () => {
    try {
      dispacth(setLoading(true));
      if (isRealPerson) {
        const content = {
          identityNumber: values?.Insurer?.IdentityNumber,
          birthDate: values?.Insurer?.DateOfBirth,
          identityType:
            values?.Insurer?.ContactType == ContactType.GERCEK
              ? IdentityType.TC_IDENTITY_NUMBER
              : IdentityType.VKN,
        };
        const response = await getIndividualInformationFromKPS(content);
        if (response && response.data) {
          const result = response.data;
          setFormValues({
            ...values,
            Insurer: {
              ...values.Insurer,
              ...result,
              IsSearch: true,
            },
          });
        }
      } else {
        const response = await getVknInformationFromKPS(
          values.Insurer?.TaxNumber
        );
        if (response && response.data) {
          const result = response.data;
          setFormValues({
            ...values,
            Insurer: {
              ...values.Insurer,
              ...result,
              IsSearch: true,
            },
          });
        }
      }
      setIsSearch(true);
      dispacth(setLoading(false));
    } catch (error) {
      const errorMessage = resErrorMessage(error);
      MySwal.fire(MySwalData("error", { text: errorMessage }));
    }
  };

  return (
    <>
      <span className="group-title text-xl">Sigorta Ettiren</span>
      <div className="row group-summary group flex flex-col items-center gap-4 gap-y-2 !py-3 md:grid md:grid-cols-3 lg:grid-cols-4">
        <InputBase
          label="*Sigorta Ettiren Tipi"
          component={ReactSelect}
          isClearable
          inputClassName="!h-10"
          name="Insurer.ContactType"
          placeholder="Sigorta ettiren tipi seçiniz"
          options={options.contactType}
          setFieldValue={setFieldValue}
          disabled={values.Insurer?.Id}
        />

        {/*Gerçek Kişi */}
        {isRealPerson && (
          <>
            <InputBase
              label="*T.C. Kimlik No"
              component={PatternFormatInput}
              inputClassName="!h-10"
              type="number"
              name="Insurer.IdentityNumber"
              format="###########"
              placeholder="T.C. kimlik no giriniz"
              disabled={isSearch || values.Insurer?.IsSearch}
            />
            <InputBase
              label="*Doğum Tarihi"
              component={ReactDatePicker}
              inputClassName="!h-10"
              name="Insurer.DateOfBirth"
              placeholder="Doğum tarihi seçiniz"
              setFieldValue={setFieldValue}
              disabled={isSearch || values.Insurer?.IsSearch}
            />
            {!isSearch && !values.Insurer?.IsSearch && (
              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => getInsurerInfoFromKPS()}
                  disabled={
                    !(
                      values.Insurer?.IdentityNumber &&
                      values.Insurer?.DateOfBirth
                    )
                  }
                  className="btn btn-success py-1.5 px-4  h-10 rounded-xl text-white disabled:bg-opacity-55"
                >
                  ARA
                </button>
                <ErrorMessage
                  className="pl-1 text-xs text-persian-red"
                  component="span"
                  name="Insurer.IsSearch"
                />
              </div>
            )}
          </>
        )}

        {/*Tüzel Kişi */}
        {!isRealPerson && (
          <>
            <InputBase
              label="*Vergi Kimlik No"
              component={PatternFormatInput}
              inputClassName="!h-10"
              type="number"
              name="Insurer.TaxNumber"
              format="##########"
              placeholder="Vergi kimlik no giriniz"
              disabled={isSearch}
            />
            <InputBase
              label="*Vergi Dairesi"
              component={Input}
              inputClassName="!h-10"
              name="Insurer.TaxOffice"
              placeholder="Vergi dairesi giriniz"
              disabled={isSearch}
            />
            {!isSearch && !values?.Insurer?.IsSearch && (
              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => getInsurerInfoFromKPS()}
                  disabled={
                    !(values.Insurer?.TaxNumber && values.Insurer?.TaxOffice)
                  }
                  className="btn btn-success py-1.5 px-4 h-10 rounded-xl text-white disabled:bg-opacity-55"
                >
                  ARA
                </button>
                <ErrorMessage
                  className="pl-1 text-xs text-persian-red"
                  component="span"
                  name="Insurer.IsSearch"
                />
              </div>
            )}
          </>
        )}

        {(isSearch || values?.Insurer?.IsSearch) && (
          <>
            <br />
            {!isRealPerson && (
              <>
                <InputBase
                  label="Unvan"
                  component={Input}
                  inputClassName="!h-10"
                  name="Insurer.Title"
                  placeholder="Unvan giriniz"
                  disabled={true}
                />
              </>
            )}

            <InputBase
              label={isLabelPrefix(
                !isRealPerson,
                isRealPerson ? "Adı" : "Yetkili Adı"
              )}
              component={Input}
              inputClassName="!h-10"
              name="Insurer.FirstName"
              placeholder={`${isRealPerson ? "" : "Yetkili"} adı giriniz`}
              disabled={isRealPerson}
            />
            <InputBase
              label={isLabelPrefix(
                !isRealPerson,
                isRealPerson ? "Soyadı" : "Yetkili Soyadı"
              )}
              component={Input}
              inputClassName="!h-10"
              name="Insurer.LastName"
              placeholder={`${isRealPerson ? "" : "Yetkili"} soyadı giriniz`}
              disabled={isRealPerson}
            />

            {isRealPerson && (
              <>
                <InputBase
                  label="Cinsiyet"
                  component={ReactSelect}
                  inputClassName="!h-10"
                  name="Insurer.Gender"
                  placeholder="Medeni durum seçiniz"
                  disabled={true}
                  options={options.genderType}
                  setFieldValue={setFieldValue}
                />
                <InputBase
                  label="Medeni Durumu"
                  component={ReactSelect}
                  inputClassName="!h-10"
                  name="Insurer.MaritalStatus"
                  placeholder="Medeni durum seçiniz"
                  disabled={true}
                  options={options.maritalStatus}
                  setFieldValue={setFieldValue}
                />
              </>
            )}

            <InputBase
              label="*Cep Telefonu"
              component={PatternFormatInput}
              inputClassName="!h-10"
              type="text"
              name="Insurer.MobileNumber"
              format="0 ### ### ## ##"
              placeholder="Cep telefonu giriniz"
              allowEmptyFormatting={true}
              disabled={values?.IsSameInsured}
            />
            <InputBase
              label="E-posta Adresi"
              component={Input}
              inputClassName="!h-10"
              name="Insurer.EmailAddress"
              placeholder="E-posta adresi giriniz"
            />
            <InputBase
              label={isLabelPrefix(!isRealPerson, "İl")}
              component={ReactSelect}
              inputClassName="!h-10"
              name="Insurer.CityId"
              placeholder="İl seçiniz"
              disabled={isRealPerson}
              options={options.cities}
              setFieldValue={setFieldValue}
            />
            <InputBase
              label={isLabelPrefix(!isRealPerson, "İlçe")}
              component={ReactSelect}
              inputClassName="!h-10"
              name="Insurer.CountyId"
              placeholder="İlçe seçiniz"
              disabled={isRealPerson}
              options={countyOptions}
              setFieldValue={setFieldValue}
            />
            <InputBase
              label={isLabelPrefix(!isRealPerson, "Adres")}
              component={TextArea}
              inputClassName="!p-1.5 max-w-[500px]"
              name="Insurer.AddressDetail"
              placeholder="Adres giriniz"
              disabled={isRealPerson}
              rows={2}
            />
          </>
        )}
      </div>
    </>
  );
}

export default InsurerForm;
