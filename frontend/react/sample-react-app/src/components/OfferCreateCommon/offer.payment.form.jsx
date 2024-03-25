import Input from "@components/Inputs/Input";
import { InputBase } from "@components/Inputs/InputBase";
import { PatternFormatInput } from "@components/Inputs/PatternFormatInput";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import Select from "react-select";

import { Requests } from "@app/api";
import { ApprovalType, PaymentType } from "@app/enum";
import ReactSelect from "@components/Inputs/ReactSelect";
import { useOfferContext } from "@contexts/OfferCreateProvider";
import { getEntityUrl } from "@libs/parser";
import ApprovalCheckboxInput from "./approval.checkbox.input";
import { CreditCards } from "./credit.cards";

function OfferPaymentForm() {
  const [paymentType, setPaymentType] = useState(null);
  const [paymentTypeOptions, setPaymentTypeOptions] = useState([]);
  const { currentProductId } = useOfferContext();
  useEffect(() => {
    getPaymentTypeOptions();
  }, []);

  const getPaymentTypeOptions = async () => {
    try {
      const url = getEntityUrl({
        api: {
          url: `ProductPaymentOptions?filters=ProductId==${currentProductId}`,
          port: 8141,
        },
      });

      const response = await Requests().CommonRequest.get({
        url,
      });

      if (response && response.data && Array.isArray(response.data)) {
        const options = response.data.map((res) => {
          return {
            label: res.PaymentType?.Text,
            value: res.PaymentType?.Ordinal,
          };
        });
        setPaymentTypeOptions(options);
      }
    } catch (error) {}
  };

  const handlePaymentTypeChange = (value) => {
    setPaymentType(value);
  };

  return (
    <div className="my-5 flex flex-col justify-center items-center gap-y-2.5">
      <div className="container flex flex-col gap-y-2.5">
        <div className="flex flex-col gap-y-2 py-4 lg:p-0 flex-shrink-0">
          <h5 className="font-bold text-xl text-primary">Poliçeleştirme</h5>
          <span className="font-normal text-matter-horn">
            Ödeme işlemi sonrasında poliçeniz oluşur/ başlar.
          </span>
        </div>
        <div className="max-w-72 my-2.5">
          <label className="text-sm font-semibold text-black">Ödeme Tipi</label>
          <Select
            options={paymentTypeOptions}
            isClearable
            value={paymentType}
            noOptionsMessage={() => "Kayıt Bulunamadı"}
            loadingMessage={() => "Yükleniyor..."}
            onChange={(value) => handlePaymentTypeChange(value)}
            className="react-select-container"
            classNamePrefix="react-select"
            placeholder="Ödeme tipi seçiniz"
          />
        </div>
        {paymentType?.value === PaymentType.CREDIT_CARD && <PaymentForm />}
      </div>
    </div>
  );
}

const PaymentForm = () => {
  const [formValues, setFormValues] = useState({
    CardNumber: "",
    CardOwner: "",
    ExpiryDate: "",
    CVV: "",
    InstallmentCount: "",
    KVKK: "",
  });

  const [focusedInput, setFocusedInput] = useState("");

  const handleFocus = (event) => {
    setFocusedInput(event.target.name);
  };
  return (
    <Formik className="" initialValues={formValues}>
      {({ setFieldValue, values }) => (
        <>
          <div className="flex flex-col relative gap-y-2.5">
            <span className="group-title text-xl">Kart Bilgileri</span>
            <div className="row group-summary group">
              <div>
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 items-center justify-items-between">
                  <Form className="flex flex-col lg:grid lg:grid-cols-2 gap-2.5 w-full order-2 lg:order-1">
                    <InputBase
                      label="Kart Numarası"
                      component={PatternFormatInput}
                      isClearable
                      inputClassName="min-h-[40px] rounded-md border"
                      name="CardNumber"
                      placeholder="Kart numarası giriniz"
                      format="#### #### #### ####"
                      onFocus={handleFocus}
                    />
                    <InputBase
                      label="Kart Sahibi Adı Soyadı"
                      component={Input}
                      inputClassName="min-h-[40px] rounded-md border uppercase placeholder:normal-case"
                      name="CardOwner"
                      placeholder="Kart sahibi adı ve soyad giriniz"
                      onFocus={handleFocus}
                    />
                    <InputBase
                      label="Son Kullanma Tarihi"
                      component={PatternFormatInput}
                      inputClassName="min-h-[40px] rounded-md border"
                      name="ExpiryDate"
                      placeholder="Son kullanma tarihi seçiniz"
                      setFieldValue={setFieldValue}
                      format="##/##"
                      mask="_"
                      onFocus={handleFocus}
                    />
                    <InputBase
                      label="CVV"
                      component={PatternFormatInput}
                      isClearable
                      inputClassName="min-h-[40px] rounded-md border"
                      name="CVV"
                      placeholder="CVV giriniz"
                      format="###"
                      onFocus={handleFocus}
                    />
                    <InputBase
                      label="Taksit"
                      component={ReactSelect}
                      isClearable
                      inputClassName="min-h-[40px] rounded-md border"
                      name="InstallmentCount"
                      placeholder="Taksit seçiniz"
                    />
                    <div className="col-span-2 mt-2.5">
                      <ApprovalCheckboxInput
                        setFieldValue={setFieldValue}
                        name="KvkkApproval"
                        approvalType={ApprovalType.POLICY}
                      />
                    </div>
                  </Form>
                  <div className="order-1 lg:order-2">
                    <CreditCards values={values} focusedInput={focusedInput} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end w-full mt-5">
            <button
              onClick={() => console.log("ödeme yap")}
              className="btn btn-primary py-2.5 px-5"
            >
              Ödeme Yap
            </button>
          </div>
        </>
      )}
    </Formik>
  );
};

export default OfferPaymentForm;
