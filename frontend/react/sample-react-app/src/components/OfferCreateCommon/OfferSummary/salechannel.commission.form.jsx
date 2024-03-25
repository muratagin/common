import { Requests } from "@app/api";
import { DiscountCategory } from "@app/enum";
import Input from "@components/Inputs/Input";
import { InputBase } from "@components/Inputs/InputBase";
import ReactSelect from "@components/Inputs/ReactSelect";
import Modal from "@components/modal";
import { useOfferContext } from "@contexts/OfferCreateProvider";
import { MySwalData } from "@libs/myswaldata";
import { getEntityUrl } from "@libs/parser";
import { checkIfIsEmpty, currencyFormat, resErrorMessage } from "@libs/utils";
import { setLoading } from "@slices/dynamicStyleSlice";
import { SaleChannelCommissionFormSchema } from "@validations/salechannel.commission.form.validation";
import { Form, Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { getLookupFromGetByName } from "../service";

function SaleChannelCommissionForm({
  generalInformation,
  discounts,
  getOfferDiscounts,
  getPageData,
}) {
  const MySwal = withReactContent(Swal);
  const { offer } = useOfferContext();
  const dispatch = useDispatch();
  const [commissionTypeOptions, setCommissionTypeOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [commissionViewModal, setCommissionViewModal] = useState({
    show: false,
    values: null,
  });

  const currentDiscount =
    discounts &&
    discounts.find(
      (discount) =>
        discount.CategoryOrdinal ===
        DiscountCategory.SALE_CHANNEL_COMMISSION_DISCOUNT
    );

  const initialValues = {
    DiscountType: "",
    DiscountValue: "",
  };
  const [formValues, setFormValues] = useState(initialValues);

  useEffect(() => {
    getLookupByCommisionType();
  }, []);

  useEffect(() => {
    if (checkIfIsEmpty(currentDiscount)) {
      setFormValues({
        ...formValues,
        DiscountType: currentDiscount.TypeOrdinal,
        DiscountValue: currentDiscount.Amount,
      });
    } else {
      setFormValues(initialValues);
    }
  }, [discounts]);

  const getLookupByCommisionType = async () => {
    try {
      setIsLoading(true);
      const response = await getLookupFromGetByName("CommissionType");
      if (response) setCommissionTypeOptions(response);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleCalculate = async (values) => {
    try {
      const url = getEntityUrl({
        api: {
          port: 8141,
          url: "Offers/CalculateAndApplySaleChannelCommissionDiscount",
        },
      });

      dispatch(setLoading(true));

      const content = {
        ...values,
        OfferId: offer?.Id,
        IsApply: false,
        DiscountCategory: DiscountCategory.SALE_CHANNEL_COMMISSION_DISCOUNT,
        SaleChannelCommission: generalInformation?.SaleChannelCommission,
        Premium: generalInformation?.NetPremium,
      };

      const response = await Requests().CommonRequest.post({
        url: url,
        content,
      });
      if (response && response.data && response.data.IsSuccess) {
        setCommissionViewModal({
          show: true,
          values,
          discountResultInfo: response.data.Data,
        });
      }

      dispatch(setLoading(false));
    } catch (error) {
      const errorMessage = resErrorMessage(error);
      MySwal.fire(
        MySwalData("warning", {
          text: errorMessage,
        })
      );
      dispatch(setLoading(false));
    }
  };

  const handleApply = async (values) => {
    try {
      const url = getEntityUrl({
        api: {
          port: 8141,
          url: "Offers/CalculateAndApplySaleChannelCommissionDiscount",
        },
      });

      dispatch(setLoading(true));

      const content = {
        ...values,
        OfferId: offer?.Id,
        IsApply: true,
        DiscountCategory: DiscountCategory.SALE_CHANNEL_COMMISSION_DISCOUNT,
        SaleChannelCommission: generalInformation?.SaleChannelCommission,
        Premium: generalInformation?.NetPremium,
      };

      const response = await Requests().CommonRequest.post({
        url: url,
        content,
      });

      if (response && response.data) {
        getOfferDiscounts && getOfferDiscounts();
        getPageData && getPageData();
        setCommissionViewModal({ show: false });
      }

      dispatch(setLoading(false));
    } catch (error) {
      const errorMessage = resErrorMessage(error);
      MySwal.fire(
        MySwalData("warning", {
          text: errorMessage,
        })
      );
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="w-full">
      <h5 className="text-center font-medium text-success">
        Acente Komisyon İndirimi
      </h5>
      <Formik
        enableReinitialize
        initialValues={formValues}
        onSubmit={handleCalculate}
        validationSchema={SaleChannelCommissionFormSchema}
      >
        {({ setFieldValue, handleSubmit, errors, values }) => (
          <Form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-2.5">
            <InputBase
              disabled={currentDiscount}
              label="İndirim Tipi"
              component={ReactSelect}
              inputClassName="!h-10"
              name="DiscountType"
              placeholder="İndirim tipi seçiniz"
              options={commissionTypeOptions}
              setFieldValue={setFieldValue}
              selectEmptyLabel="İndirim tipi seçiniz"
              isLoading={isLoading}
            />
            <InputBase
              disabled={currentDiscount}
              label="Değer"
              component={Input}
              isClearable
              inputClassName="min-h-[40px] rounded-md border"
              name="DiscountValue"
              type="number"
            />
            <button
              disabled={currentDiscount}
              className="btn btn-success h-10 mt-5 max-w-28 mx-auto lg:mx-0 my-2.5"
            >
              <span>HESAPLA</span>
            </button>
          </Form>
        )}
      </Formik>
      {commissionViewModal.show && (
        <SaleChannelCommissionViewModal
          open={commissionViewModal.show}
          handleClose={() => setCommissionViewModal({ show: false })}
          values={commissionViewModal.values}
          discountResultInfo={commissionViewModal.discountResultInfo}
          handleApply={handleApply}
          title="Prim Bilgileri"
        />
      )}
    </div>
  );
}

const SaleChannelCommissionViewModal = ({
  title,
  open,
  handleClose,
  handleApply,
  values,
  discountResultInfo,
}) => {
  const modalRef = useRef();

  useEffect(() => {
    if (modalRef)
      modalRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [modalRef]);

  return (
    <Modal
      size="xl"
      keepMounted
      open={open}
      onClose={handleClose}
      title={title}
    >
      <div
        className="scrollbar-hide overflow-hidden rounded-none pt-0 px-0"
        ref={modalRef}
      >
        <div className="row group-summary !p-0 group grid grid-cols-1 lg:grid-cols-3 items-center justify-items-between gap-x-10">
          <div className="p-6">
            <TextView
              title="Brüt Prim"
              content={
                checkIfIsEmpty(discountResultInfo?.GrossPremium) &&
                currencyFormat(discountResultInfo?.GrossPremium)
              }
            />
            <TextView
              title="Acente Komisyonu"
              content={
                checkIfIsEmpty(discountResultInfo?.SaleChannelCommission) &&
                currencyFormat(discountResultInfo?.SaleChannelCommission)
              }
            />
            <TextView
              title="Net Prim"
              content={
                checkIfIsEmpty(discountResultInfo?.Premium) &&
                currencyFormat(discountResultInfo?.Premium)
              }
            />
          </div>
        </div>
        <div className="w-full flex justify-center items-start h-14 mt-3 gap-x-2.5">
          <button
            type="button"
            onClick={handleClose}
            className="h-12 2xl:text-lg bg-company-secondary font-bold text-white px-5 2xl:px-10 bg-turquoise-blue rounded-2xl 2xl:rounded-3xl"
          >
            Vazgeç
          </button>
          <button
            type="button"
            onClick={() => handleApply(values)}
            className="h-12 2xl:text-lg bg-primary font-bold text-white px-5 2xl:px-10 bg-turquoise-blue rounded-2xl 2xl:rounded-3xl"
          >
            Uygula
          </button>
        </div>
      </div>
    </Modal>
  );
};

const TextView = ({ title, content }) => {
  return (
    <div className="gap-x-2 w-full items-center grid grid-cols-2">
      <span className="font-semibold">{title}:</span>
      <span>{content}</span>
    </div>
  );
};

export default SaleChannelCommissionForm;
