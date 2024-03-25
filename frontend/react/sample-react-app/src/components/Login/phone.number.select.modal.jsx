import { InputBase } from "@components/Inputs/InputBase";
import ReactSelect from "@components/Inputs/ReactSelect";
import Modal from "@components/modal";
import { PhoneNumberSelectedFormSchema } from "@validations/phone.number.selected.validation";
import { Form, Formik } from "formik";
import { useState } from "react";

function PhoneNumberSelectModal({
  open,
  onHide,
  sendOtp,
  phoneNumbers,
  ...props
}) {
  const [formValues, setFormValues] = useState({
    PhoneNumber: null,
  });

  return (
    <Modal open={open} onClose={onHide} {...props}>
      <div className="flex justify-center flex-col py-5">
        <div className="text-matter-horn text-center gap-y-2 flex flex-col">
          <h1 className="text-xl font-bold">Telefon Numarası Seçimi</h1>
          <p>Tek seferlik şifre gönderilecek telefon numarasını seçiniz.</p>
        </div>
        <Formik
          enableReinitialize
          initialValues={formValues}
          validationSchema={PhoneNumberSelectedFormSchema}
          onSubmit={(values) => sendOtp(values)}
        >
          {({ handleSubmit, setFieldValue }) => (
            <Form
              onSubmit={handleSubmit}
              className="flex flex-col gap-y-2.5 px-5 py-3 mt-3 text-black md:px-10"
            >
              <InputBase
                label="Telefon Numarası"
                component={ReactSelect}
                options={phoneNumbers}
                inputClassName="min-h-[40px] rounded-md border"
                name="PhoneNumber"
                placeholder="Telefon numarası seçiniz."
                setFieldValue={setFieldValue}
              />

              <div className="flex w-full justify-center">
                <button
                  type="submit"
                  className="mt-7 max-w-56 h-12 w-full cursor-pointer rounded-md border-none bg-company-primary text-sm font-medium text-white hover:opacity-90"
                >
                  ONAYLA VE DEVAM ET
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
}

export default PhoneNumberSelectModal;
