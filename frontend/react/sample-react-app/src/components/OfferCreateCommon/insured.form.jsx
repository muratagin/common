import { IdentityType, ProductType } from "@app/enum";
import ReactDatePicker from "@components/Inputs/FormikDateInput";
import { InputBase } from "@components/Inputs/InputBase";
import { PatternFormatInput } from "@components/Inputs/PatternFormatInput";
import ReactSelect from "@components/Inputs/ReactSelect";
import { SubInsuredForm } from "@components/OfferCreateCommon/sub.insured.form";
import Icon from "@components/icon";
import { useOfferContext } from "@contexts/OfferCreateProvider";
import { MySwalData } from "@libs/myswaldata";
import { checkIfIsEmpty, resErrorMessage } from "@libs/utils";
import { setLoading } from "@slices/dynamicStyleSlice";
import { ErrorMessage } from "formik";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { getIndividualInformationFromKPS } from "./service";

function InsuredForm({
  setFieldValue,
  value,
  index,
  insuredCount,
  remove,
  identityTypeOptions,
}) {
  const [isSearch, setIsSearch] = useState(false);
  const [identityTypeLabel, setIdentityTypeLabel] = useState("T.C Kimlik No");
  const { options, currentProductType } = useOfferContext();
  const dispatch = useDispatch();
  const MySwal = withReactContent(Swal);
  const isNotEmptyIdentityNumber =
    value.IdentityType === IdentityType.TC_IDENTITY_NUMBER ||
    value.IdentityType === IdentityType.FOREIGN_IDENTITY_NUMBER ||
    value.IdentityType === IdentityType.BLUE_CARD_NUMBER;

  useEffect(() => {
    setIsSearch(false);
    setIdentityTypeLabel(getIdentityTypeLabel(value.IdentityType));
  }, [value.IdentityType]);

  const getIdentityTypeLabel = (type) => {
    let result = "";
    if (type === IdentityType.TC_IDENTITY_NUMBER) {
      result = "T.C. Kimlik No";
    } else if (type === IdentityType.BLUE_CARD_NUMBER) {
      result = "Mavi Kart No";
    } else if (type === IdentityType.FOREIGN_IDENTITY_NUMBER) {
      result = "Yabancı Kimlik No";
    }
    return result;
  };

  const isNotPasaportIdentity = value.IdentityType !== IdentityType.PASSPORT;

  const getInsuredInfoFromKPS = async () => {
    try {
      dispatch(setLoading(true));
      const content = {
        identityNumber: isNotPasaportIdentity
          ? value.IdentityNumber
          : value.PassportNo,
        birthDate: value.DateOfBirth,
        identityType: value.IdentityType,
      };
      const response = await getIndividualInformationFromKPS(content);
      if (response && response.data) {
        const result = response.data;
        const currentData = { ...value, ...result, IsSearch: true };
        setFieldValue(`InsuredInformationList.${index}`, currentData);
      }
      setIsSearch(true);
      dispatch(setLoading(false));
    } catch (error) {
      const errorMessage = resErrorMessage(error);
      MySwal.fire(MySwalData("error", { text: errorMessage }));
    }
  };

  return (
    <div className="flex flex-col relative gap-y-2.5">
      {index === 0 && <span className="group-title text-xl">Sigortalılar</span>}

      <div className="row group-summary group flex flex-col items-center gap-4 gap-y-2 !py-3 md:grid md:grid-cols-3 lg:grid-cols-4">
        {currentProductType !== ProductType.TSS && (
          <InputBase
            label="*Kimlik Tipi"
            component={ReactSelect}
            isClearable
            inputClassName="!h-10"
            name={`InsuredInformationList.${index}.IdentityType`}
            placeholder="Kimlik tipi seçiniz"
            options={identityTypeOptions}
            setFieldValue={setFieldValue}
            selectEmptyLabel="Kimlik tipi seçiniz"
            disabled={value?.IsSearch}
          />
        )}

        {/*T.C. kimlik no veya Yabancı kimlik no veya Mavi kart no */}
        {isNotEmptyIdentityNumber && (
          <>
            <InputBase
              label={`*${identityTypeLabel}`}
              component={PatternFormatInput}
              inputClassName="!h-10"
              type="number"
              name={`InsuredInformationList.${index}.IdentityNumber`}
              id={`InsuredInformationList.${index}.IdentityNumber`}
              format="###########"
              placeholder={`${identityTypeLabel} giriniz.`}
              disabled={isSearch || value?.IsSearch}
            />
            <InputBase
              label="*Doğum Tarihi"
              component={ReactDatePicker}
              inputClassName="!h-10"
              name={`InsuredInformationList.${index}.DateOfBirth`}
              placeholder="Doğum tarihi seçiniz"
              setFieldValue={setFieldValue}
              disabled={isSearch || value?.IsSearch}
            />
          </>
        )}

        {value.IdentityType === IdentityType.PASSPORT && (
          <>
            <InputBase
              label="*Uyruk"
              component={ReactSelect}
              isClearable
              inputClassName="!h-10"
              name={`InsuredInformationList.${index}.CountryId`}
              placeholder="Uyruk seçiniz"
              options={options.countries}
              setFieldValue={setFieldValue}
              selectEmptyLabel="Uyruk seçiniz"
            />
            <InputBase
              label="*Pasaport No"
              component={PatternFormatInput}
              inputClassName="!h-10"
              type="number"
              name={`InsuredInformationList.${index}.PassportNo`}
              id={`InsuredInformationList.${index}.PassportNo`}
              format="###########"
              placeholder="Pasaport no giriniz"
            />
            <InputBase
              label="*Doğum Tarihi"
              component={ReactDatePicker}
              inputClassName="!h-10"
              name={`InsuredInformationList.${index}.DateOfBirth`}
              placeholder="Doğum tarihi seçiniz"
              setFieldValue={setFieldValue}
            />
          </>
        )}

        {!isSearch &&
          !value.IsSearch &&
          checkIfIsEmpty(value.IdentityType) &&
          value.IdentityType !== IdentityType.PASSPORT &&
          !value.IsSameInsured && (
            <div className="mt-5">
              <button
                type="button"
                onClick={() => getInsuredInfoFromKPS()}
                disabled={!(value?.IdentityNumber && value?.DateOfBirth)}
                className="btn btn-success py-1.5 px-4 rounded-xl text-white disabled:bg-opacity-55"
              >
                ARA
              </button>
              <ErrorMessage
                className="pl-1 text-xs text-persian-red"
                component="span"
                name={`InsuredInformationList.${index}.IsSearch`}
              />
            </div>
          )}

        {(isSearch ||
          value.IsSearch ||
          value.IdentityType === IdentityType.PASSPORT ||
          value.IsSameInsured) && (
          <SubInsuredForm
            index={index}
            setFieldValue={setFieldValue}
            identityType={value.IdentityType}
            isNotPasaportIdentity={isNotEmptyIdentityNumber}
            value={value}
          />
        )}
        {insuredCount > 1 && !value.IsSameInsured && (
          <div className="w-full col-span-full grid justify-items-end">
            <button
              type="button"
              className="text-danger h-10 flex  items-center hover:bg-blue-100 w-10 justify-center rounded-full transition-all duration-300"
              onClick={() => remove(index)}
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
