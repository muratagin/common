import { Requests } from "@app/api";
import { IdentityType, ProductType } from "@app/enum";
import Modal from "@components/modal";
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
import { AddNewInsuredModalFormSchema } from "@validations/add.new.insured.modal.form.validation";
import { FieldArray, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import InsuredForm from "../insured.form";
import { PackageSelectionView } from "../package.selection";
import { identityTypeOptions } from "../utils";

function AddNewInsuredModal({ handleClose, open, getPageData }) {
  const MySwal = withReactContent(Swal);
  const { currentProductType, offer, options } = useOfferContext();
  const [insuredId, setInsuredId] = useState(null);
  const [packageSelectionShow, setPackageSelectionShow] = useState(false);
  const dispatch = useDispatch();

  const [insureds, setInsureds] = useState([]);
  const [selectedPackages, setSelectedPackages] = useState([]);

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

  const [formValues, setFormValues] = useState({
    OfferId: offer?.Id,
    InsuredInformationList: [
      {
        ...insuredInitialValues,
      },
    ],
  });

  useEffect(() => {
    if (checkIfIsEmpty(insuredId)) getAddedInsuredWithPackagesForOffer();
  }, [insuredId]);

  const onClose = () => {
    MySwal.fire(
      MySwalData("confirm", {
        icon: "info",
        title: "İşlem Onayı",
        text: "Sigortalı kaydedilmeyecektir. Onaylıyor musunuz?",
      })
    ).then(async (result) => {
      if (result.isConfirmed) {
        handleClose();
      }
    });
  };

  const formSubmit = async (values) => {
    try {
      const url = getEntityUrl({
        api: {
          port: 8141,
          url: `offers/AddInsuredForOffer`,
        },
      });

      const cleanValues = removeWhitespaceFromMobileNumbers(
        cleanEmptyFields(values),
        false,
        true
      );

      const content = {
        OfferId: offer?.Id,
        InsuredInformation: cleanValues.InsuredInformationList[0],
      };
      dispatch(setLoading(true));
      const response = await Requests().CommonRequest.post({
        url,
        content,
      });
      if (response && response.data && response?.data?.IsSuccess) {
        setFormValues(values);
        setPackageSelectionShow(true);
        setInsuredId(response.data?.Data?.InsuredId);
      }
      dispatch(setLoading(false));
    } catch (error) {
      const errorMessage = resErrorMessage(error);
      MySwal.fire(
        MySwalData("error", {
          text: errorMessage,
        })
      );
      dispatch(setLoading(false));
    }
  };

  const getAddedInsuredWithPackagesForOffer = async () => {
    try {
      const url = getEntityUrl({
        api: {
          port: 8141,
          url: `Offers/GetAddedInsuredWithPackagesForOffer?OfferId=${offer?.Id}&insuredId=${insuredId}`,
        },
      });
      dispatch(setLoading(true));
      const response = await Requests().CommonRequest.get({
        url,
      });
      if (response && response.data) {
        const currentInsureds = [{ ...response.data }];
        setInsureds(currentInsureds);
        const selecteds = getSelectedPackages(currentInsureds);
        setSelectedPackages(selecteds);
      }
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
    }
  };

  const updateOfferBySelectingPackageForAddedInsured = async () => {
    try {
      const url = getEntityUrl({
        api: {
          port: 8141,
          url: `Offers/UpdateOfferBySelectingPackageForAddedInsured`,
        },
      });

      if (selectedPackages.length !== insureds.length) {
        MySwal.fire(
          MySwalData("warning", {
            text: "Sigortalı için prim seçimi yapılmalıdır.",
          })
        );
        return false;
      }

      const content = {
        OfferId: offer?.Id,
        InsuredInformation: selectedPackages[0],
      };
      dispatch(setLoading(true));
      const response = await Requests().CommonRequest.put({
        url,
        content,
      });
      if (response && response.data && response?.data?.IsSuccess) {
        MySwal.fire(
          MySwalData("success", {
            text: "Sigortalı başarıyla eklenmiştir.",
          })
        );
        handleClose();
        getPageData && getPageData();
      }
      dispatch(setLoading(false));
    } catch (error) {
      const errorMessage = resErrorMessage(error);
      MySwal.fire(
        MySwalData("error", {
          text: errorMessage,
        })
      );
      dispatch(setLoading(false));
    }
  };

  function getSelectedPackages(insureds) {
    const selectedPackages = [];

    insureds &&
      insureds.forEach((insured) => {
        if (
          insured.PackageInformationList &&
          Array.isArray(insured.PackageInformationList)
        ) {
          insured.PackageInformationList.forEach((packageInfo) => {
            if (packageInfo.IsSelected) {
              selectedPackages.push({
                InsuredId: insured.InsuredId,
                PackageId: packageInfo.PackageId,
                Premium: packageInfo.Premium,
              });
            }
          });
        }
      });

    return selectedPackages;
  }

  return (
    <Modal
      title="Yeni Sigortalı Ekle"
      size="xxl"
      keepMounted
      onClose={onClose}
      open={open}
    >
      <div className="scrollbar-hide overflow-hidden rounded-none pt-0 px-0">
        {!packageSelectionShow && (
          <Formik
            initialValues={formValues}
            validationSchema={AddNewInsuredModalFormSchema}
            onSubmit={formSubmit}
          >
            {({ errors, values, setFieldValue, handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
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
                            remove={(index) => {}}
                            insuredCount={values.InsuredInformationList?.length}
                            identityTypeOptions={identityTypeOptions(
                              options,
                              currentProductType
                            )}
                          />
                        ))}
                    </>
                  )}
                </FieldArray>
                <button className="btn btn-success rounded-md text-white py-2 px-3.5 font-semibold mt-2.5 mx-auto">
                  Kaydet
                </button>
              </Form>
            )}
          </Formik>
        )}

        {packageSelectionShow && (
          <div className="flex flex-col gap-y-2.5">
            <PackageSelectionView
              insureds={insureds}
              setSelectedPackages={setSelectedPackages}
              selectedPackages={selectedPackages}
              customTitleComponent={
                <>
                  <h5 className="font-bold text-xl text-primary">
                    Paket Seçimi
                  </h5>
                  <span className="font-normal text-matter-horn">
                    Lütfen sigortalı için paket seçiminde bulununuz.
                  </span>
                </>
              }
              isShowTotalPremium={false}
            />
            <button
              type="button"
              onClick={() => updateOfferBySelectingPackageForAddedInsured()}
              className="btn btn-primary rounded-md text-white py-2 px-3.5 font-semibold mt-2.5 mx-auto"
            >
              Seçimi Tamamla ve Sigortalıyı Ekle
            </button>
            {/* <button
              type="button"
              onClick={() => setPackageSelectionShow(false)}
              className="btn text-white btn-success rounded-md py-2 px-3.5 font-semibold mt-2.5 max-w-36"
            >
              <Icon icon="MdOutlineArrowBack" />
              Geri Dön
            </button> */}
          </div>
        )}
      </div>
    </Modal>
  );
}

export default AddNewInsuredModal;
