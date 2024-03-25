import { Requests } from "@app/api";
import { InputBase } from "@components/Inputs/InputBase";
import { TextArea } from "@components/Inputs/TextArea";
import Modal from "@components/modal";
import { MySwalData } from "@libs/myswaldata";
import { getEntityUrl } from "@libs/parser";
import { resErrorMessage } from "@libs/utils";
import { setLoading } from "@slices/dynamicStyleSlice";
import { OfferCancelModalFormSchema } from "@validations/offer.cancel.modal.form.validation";
import { Form, Formik } from "formik";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export const OfferCancelModalButton = ({
  row,
  show,
  onClose,
  data,
  component,
  field,
  handleRefresh,
}) => {
  const dispatch = useDispatch();
  const MySwal = withReactContent(Swal);
  const [formValues, setFormValues] = useState({ Result: "" });

  const formSubmit = async (values) => {
    try {
      const url = getEntityUrl({
        api: {
          port: 8141,
          url: "Offers/UpdateCancelationStatus",
        },
      });

      const content = {
        OfferId: row?.Id,
        ...values,
      };
      dispatch(setLoading(true));
      const response = await Requests().CommonRequest.put({
        url,
        content,
      });

      if (response && response.data && response.data.IsSuccess) {
        handleRefresh && handleRefresh();
        onClose && onClose();
      }
      dispatch(setLoading(false));
    } catch (error) {
      const errorMessage = resErrorMessage(error);
      MySwal.fire(MySwalData("warning", { text: errorMessage }));
      dispatch(setLoading(false));
    }
  };

  return (
    <Modal size="md" open={show} onClose={onClose} title={component?.title}>
      <Formik
        enableReinitialize
        initialValues={formValues}
        validationSchema={OfferCancelModalFormSchema}
        onSubmit={formSubmit}
      >
        {({ values }) => (
          <Form>
            <InputBase
              label="Gerekçe"
              component={TextArea}
              inputClassName="!p-1.5"
              name="Result"
              placeholder="Gerekçe giriniz"
              rows={2}
            />
            <button className="btn btn-primary mx-auto my-2.5">
              Teklif İptal
            </button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default OfferCancelModalButton;
