import { ENDORSEMENT_TYPE } from "@app/enum";
import ReactDatePicker from "@components/Inputs/FormikDateInput";
import { InputBase } from "@components/Inputs/InputBase";
import ReactSelect from "@components/Inputs/ReactSelect";
import { Form, Formik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ENDORSEMENT_CANCEL_OPTIONS } from "./data";

export default function EndorsementTypeSelectionModal(props) {
  const navigate = useNavigate();

  const submit = (data) => {
    if (data.EndorsementType != ENDORSEMENT_TYPE.IPTAL) {
      navigate(
        `/endorsement/create/${props?.boundId}?type=${data.EndorsementType}`
      );
    }
  };
  const [formValues, setFormValues] = useState({
    EndorsementType: "",
    StartDate: "",
  });

  const [endorsementTypeOptions, setEndorsementTypeOptions] = useState([
    {
      value: 1,
      label: "Sigortalı Giriş Zeyli",
    },
    {
      value: 2,
      label: "Sigortalı Çıkış Zeyli",
    },
    {
      value: 3,
      label: "Poliçe İptal",
    },
  ]);

  return (
    <Formik
      enableReinitialize
      initialValues={formValues}
      onSubmit={(values) => submit(values)}
    >
      {({ handleSubmit, setFieldValue, values }) => (
        <Form
          onSubmit={handleSubmit}
          className="flex flex-col gap-y-2.5 px-5 py-3 mt-3 text-black md:px-10"
        >
          <div className="grid grid-cols-3 gap-x-2.5">
            <InputBase
              label="Zeyil"
              component={ReactSelect}
              options={endorsementTypeOptions}
              inputClassName="min-h-[40px] rounded-md border"
              name="EndorsementType"
              placeholder="Zeyil seçiniz."
              setFieldValue={setFieldValue}
            />

            {values.EndorsementType == ENDORSEMENT_TYPE.IPTAL && (
              <>
                <InputBase
                  label="İptal Tipi"
                  component={ReactSelect}
                  options={ENDORSEMENT_CANCEL_OPTIONS}
                  inputClassName="min-h-[40px] rounded-md border"
                  name="CancelType"
                  placeholder="İptal tipi seçiniz."
                  setFieldValue={setFieldValue}
                />

                <InputBase
                  label="Başlangıç Tarihi"
                  component={ReactDatePicker}
                  inputClassName="!h-10"
                  name="StartDate"
                  placeholder="Başlangıç tarihi seçiniz"
                  setFieldValue={setFieldValue}
                />
              </>
            )}
          </div>

          <div className="flex w-full justify-center">
            <button
              type="submit"
              className="mt-7 max-w-56 h-12 w-full cursor-pointer rounded-md border-none bg-navy-blue text-sm font-medium text-white hover:opacity-90"
            >
              KAYDET
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
