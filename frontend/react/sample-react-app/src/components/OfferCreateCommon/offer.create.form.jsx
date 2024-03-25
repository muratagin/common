import { Requests } from "@app/api";
import {
  ApprovalType,
  ContactType,
  IdentityType,
  ProductType,
} from "@app/enum";
import { Toggle } from "@components/Inputs/Toggle";
import InsurerForm from "@components/OfferCreateCommon/insurer.form";
import SubProductTypeRadioButton from "@components/OfferCreateCommon/subproduct.type.radio.button";
import { useOfferContext } from "@contexts/OfferCreateProvider";
import { MySwalData } from "@libs/myswaldata";
import { getEntityUrl } from "@libs/parser";
import {
  checkIfIsEmpty,
  cleanEmptyFields,
  removeWhitespaceFromMobileNumbers,
  resErrorMessage,
} from "@libs/utils";
import { setLoading } from "@slices/dynamicStyleSlice";
import { OfferCreateFormSchema } from "@validations/offer.create.form.validation";
import {
  ErrorMessage,
  FieldArray,
  Form,
  Formik,
  useFormikContext,
} from "formik";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ApprovalCheckboxInput from "./approval.checkbox.input";
import { tabNames } from "./data";
import InsuredForm from "./insured.form";
import { offerCreate, offerUpdate } from "./service";
import SubproductSelectionForm from "./subproduct.selection.form";
import { identityTypeOptions } from "./utils";

function OfferCreateForm() {
  const navigate = useNavigate();
  const {
    handleChangeTab,
    options,
    currentProductType,
    currentProductId,
    offer,
    setOffer,
  } = useOfferContext();

  const dispatch = useDispatch();

  const insuredInitialValues = {
    IdentityType:
      currentProductType === ProductType.TSS
        ? IdentityType.TC_IDENTITY_NUMBER
        : "",
    ProductType: currentProductType,
    IdentityNumber: "",
    PassportNo: "",
    DateOfBirth: "",
    IsSearch: false,
    FirstName: "",
    LastName: "",
    Gender: "",
    CountryId: "",
    CityId: "",
    CountyId: "",
    AddressDetail: "",
    Height: "",
    Weight: "",
    MobileNumber: "",
    EmailAddress: "",
    IndividualType: "",
    IsTransition: false,
    TransitionCompanyId: "",
  };

  const insurerInitialValues = {
    IsSearch: false,
    ContactType: !checkIfIsEmpty(offer) ? ContactType.GERCEK : "",
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
  };

  const [formValues, setFormValues] = useState({
    KvkkApproval: false,
    SubProductType: "",
    SubProductId: "",
    IsSameInsured: false,
    ProductId: currentProductId ? Number(currentProductId) : "",
    Insurer: {
      ...insurerInitialValues,
    },
    InsuredInformationList: [
      {
        ...insuredInitialValues,
      },
    ],
  });

  const MySwal = withReactContent(Swal);
  const [isSameInsuredToggleDisabled, setIsSameInsuredToggleDisabled] =
    useState(true);

  const formSubmit = async (values) => {
    try {
      const url = getEntityUrl({
        api: { port: 8141, url: "Offers" },
      });

      const mergeData = _.merge(formValues, values);
      const cleanValues = removeWhitespaceFromMobileNumbers(
        cleanEmptyFields(mergeData),
        false,
        true
      );
      const content = {
        ...cleanValues,
        SubProductType: Number(cleanValues?.SubProductType),
      };
      dispatch(setLoading(true));
      let response;
      if (content && content?.Id) {
        response = await offerUpdate(url, content);
      } else {
        response = await offerCreate(url, content);
      }
      if (response && response.data && response?.data?.IsSuccess) {
        const data = removeWhitespaceFromMobileNumbers(
          response.data?.Data,
          true
        );
        setOffer(data);
        navigate(`/offer/edit/${data?.Id}`);
        handleChangeTab(tabNames[1]);
      }
      dispatch(setLoading(false));
    } catch (error) {
      const errorMessage = resErrorMessage(error);
      MySwal.fire(MySwalData("error", { text: errorMessage }));
      dispatch(setLoading(false));
    }
  };

  const handleRemoveInsured = async (insured, index, remove) => {
    try {
      MySwal.fire(
        MySwalData("delete", {
          text: "Sigortalı silinsin mi?",
        })
      ).then(async (result) => {
        if (result.isConfirmed) {
          if (insured && insured.InsuredId) {
            const url = getEntityUrl({
              api: { port: 8141, url: "Insureds" },
            });
            dispatch(setLoading(true));
            const response = await Requests().CommonRequest.delete({
              url,
              content: { id: insured.InsuredId },
            });
            dispatch(setLoading(false));
            if (response && response.data && response.data?.IsSuccess) {
              remove(index);
            }
          } else remove(index);
        }
      });
    } catch (error) {
      const errorMessage = resErrorMessage(error);
      MySwal.fire(MySwalData("error", { text: errorMessage }));
      dispatch(setLoading(false));
    }
  };

  const FormContext = () => {
    const { values, setFieldValue } = useFormikContext();

    useEffect(() => {
      if (
        checkIfIsEmpty(values.Insurer?.DateOfBirth) &&
        checkIfIsEmpty(values.Insurer?.IdentityNumber) &&
        checkIfIsEmpty(values.Insurer?.MobileNumber)
      ) {
        setIsSameInsuredToggleDisabled(false);
      }
    }, [values.Insurer]);

    useEffect(() => {
      if (values.IsSameInsured) {
        const currentInsuredList = [...values.InsuredInformationList];
        const currentInsurer = { ...values.Insurer };

        const isThereSameInsured = currentInsuredList.some(
          (insured) => insured.IdentityNumber === currentInsurer.IdentityNumber
        );
        if (!isThereSameInsured) {
          const filteredInsuredList = currentInsuredList.filter((insured) =>
            checkIfIsEmpty(insured.IdentityNumber)
          );
          const modInsuredList = [
            {
              Height: "",
              Weight: "",
              IndividualType: "",
              IsTransition: false,
              TransitionCompanyId: "",
              IsSameInsured: true,
              IdentityType: IdentityType.TC_IDENTITY_NUMBER,
              ...currentInsurer,
            },
            ...filteredInsuredList,
          ];
          setFieldValue("InsuredInformationList", modInsuredList);
        }
      } else {
        const currentInsuredList = [...values.InsuredInformationList];
        const modInsuredList = currentInsuredList.filter(
          (insured) => insured.IsSameInsured !== true
        );
        setFieldValue("InsuredInformationList", modInsuredList);
      }
    }, [values.IsSameInsured]);

    return null;
  };

  useEffect(() => {
    if (offer) {
      const mergeData = _.merge(formValues, offer);
      setFormValues(mergeData);
    }
  }, [offer]);

  return (
    <Formik
      validationSchema={OfferCreateFormSchema}
      initialValues={formValues}
      onSubmit={formSubmit}
      enableReinitialize
    >
      {({ setFieldValue, handleChange, values, errors }) => (
        <Form className="flex flex-col my-5 gap-y-2.5 container mx-auto">
          {currentProductType === ProductType.TSS && <FormContext />}
          <div className="max-w-xl">
            <ApprovalCheckboxInput
              setFieldValue={setFieldValue}
              name="KvkkApproval"
              approvalType={ApprovalType.OFFER}
            />
          </div>
          <SubProductTypeRadioButton
            value={values.SubProductType}
            handleChange={handleChange}
            setFormValues={setFormValues}
            formValues={formValues}
          />
          <SubproductSelectionForm
            values={values}
            setFieldValue={setFieldValue}
          />

          {/*Sigorta Ettiren */}
          <InsurerForm
            setFieldValue={setFieldValue}
            values={values}
            setFormValues={setFormValues}
            formValues={formValues}
          />
          {values.Insurer?.ContactType == ContactType.GERCEK &&
            currentProductType === ProductType.TSS && (
              <div className="flex mt-2.5">
                <Toggle
                  disabled={isSameInsuredToggleDisabled}
                  type="checkbox"
                  name="IsSameInsured"
                  toggleContainerClassNames="!flex-row-reverse"
                  label="Sigorta ettirenle sigortalı aynı kişilerdir."
                  setFieldValue={setFieldValue}
                  value={values?.IsSameInsured}
                />
              </div>
            )}
          {/*Sigortalılar */}
          <FieldArray name="InsuredInformationList">
            {({ insert, remove, push }) => (
              <>
                {Array.isArray(values?.InsuredInformationList) &&
                  values?.InsuredInformationList?.length > 0 &&
                  values?.InsuredInformationList?.map((value, index) => (
                    <InsuredForm
                      setFieldValue={setFieldValue}
                      value={value}
                      key={index}
                      index={index}
                      remove={(index) =>
                        handleRemoveInsured(value, index, remove)
                      }
                      insuredCount={values.InsuredInformationList?.length}
                      identityTypeOptions={identityTypeOptions(
                        options,
                        currentProductType
                      )}
                    />
                  ))}
                {currentProductType !== ProductType.YBU && (
                  <div>
                    <button
                      type="button"
                      className="btn btn-success rounded-md text-white py-2 px-3.5 font-semibold mt-2.5"
                      onClick={() => {
                        push({ ...insuredInitialValues });
                      }}
                    >
                      Sigortalı Ekle
                    </button>
                    {errors?.InsuredInformationList &&
                      !Array.isArray(errors.InsuredInformationList) && (
                        <ErrorMessage
                          className="text-red-500 text-xs px-1"
                          component="span"
                          name={`InsuredInformationList`}
                        />
                      )}
                  </div>
                )}
              </>
            )}
          </FieldArray>
          <div className="flex justify-end w-full mt-5">
            <button className="btn btn-primary py-2.5 px-5">
              Paket Seçimine Devam Et
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default OfferCreateForm;
