import { InputBase } from "@components/Inputs/InputBase";
import ReactSelect from "@components/Inputs/ReactSelect";
import { Form, Formik } from "formik";
import { useState } from "react";

function PrintsViewTab() {
  const [formValues, setFormValues] = useState({ PrintsType: "" });

  const [printTypeOptions, setPrintTypeOptions] = useState([
    {
      value: 1,
      label: "Genel Poliçe",
    },
    {
      value: 2,
      label: "Poliçe Sertifika",
    },
    {
      value: 3,
      label: "Poliçe Makbuz",
    },
  ]);

  return (
    <Formik
      enableReinitialize
      initialValues={formValues}
      onSubmit={(values) => submit(values)}
    >
      {({ handleSubmit, setFieldValue }) => (
        <Form
          onSubmit={handleSubmit}
          className="flex w-full gap-x-5 items-center gap-y-2.5 px-5 py-3 mt-3 text-black md:px-10"
        >
          <div className="w-full max-w-72">
            <InputBase
              label="Mektup Kaynağı"
              component={ReactSelect}
              options={printTypeOptions}
              inputClassName="min-h-[40px] rounded-md border"
              name="EndorsementType"
              placeholder="Mektup kaynağı seçiniz."
              setFieldValue={setFieldValue}
            />
          </div>

          <div className="flex ">
            <button
              type="submit"
              className=" mt-5 px-5 max-w-44 h-10 cursor-pointer rounded-md border-none bg-navy-blue text-sm font-medium text-white hover:opacity-90"
            >
              Basım Al
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default PrintsViewTab;
