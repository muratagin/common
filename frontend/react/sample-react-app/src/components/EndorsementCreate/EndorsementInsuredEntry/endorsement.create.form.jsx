import { Checkbox } from "@components/Inputs/Checkbox";
import { APPROVAL_INFO, tabNames } from "@components/OfferCreateCommon/data";
import { useEndorsementContext } from "@contexts/EndorsementCreateProvider";
import { FieldArray, Form, Formik } from "formik";
import { useState } from "react";
import { ApprovalModal } from "../../OfferCreateCommon/approval.modal";
import InsuredForm from "./insured.form";

function EndorsementCreateForm() {
  const { handleChangeTab } = useEndorsementContext();
  const [formValues, setFormValues] = useState({
    KVKK: false,
    InsuredList: [
      {
        IdentityNo: "",
        DateOfBirth: "",
        IsTransition: false,
      },
    ],
  });

  const formSubmit = (values) => {
    console.log("values", values);
    handleChangeTab(tabNames[1]);
  };

  return (
    <Formik initialValues={formValues} enableReinitialize onSubmit={formSubmit}>
      {({ setFieldValue, handleChange, values }) => (
        <Form className="flex flex-col my-5 gap-y-2.5 container mx-auto">
          <div className="max-w-xl">
            <Checkbox
              setFieldValue={setFieldValue}
              name="KVKK"
              label="Acente Bilgilendirme formunu okudum, anladım ve kabul ediyorum."
              ModalComponent={ApprovalModal}
              modal={{
                title: APPROVAL_INFO.Label,
                content: APPROVAL_INFO.Content,
              }}
              showModal={true}
            />
          </div>

          {/*Sigortalılar */}
          <FieldArray name="InsuredList">
            {({ insert, remove, push }) => (
              <>
                {values.InsuredList?.length > 0 &&
                  values.InsuredList.map((value, index) => (
                    <InsuredForm
                      setFieldValue={setFieldValue}
                      value={value}
                      key={index}
                      index={index}
                      remove={(index) => remove(index)}
                      insuredCount={values.InsuredList?.length}
                    />
                  ))}
                <div>
                  <button
                    type="button"
                    className="btn btn-success rounded-md text-white py-2 px-3.5 font-semibold mt-2.5"
                    onClick={() => {
                      push({
                        IdentityNo: "",
                        DateOfBirth: "",
                        IsTransition: false,
                      });
                    }}
                  >
                    Sigortalı Ekle
                  </button>
                </div>
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

export default EndorsementCreateForm;
