import * as Yup from "yup";

export const OfferCancelModalFormSchema = Yup.object().shape({
  Result: Yup.string().required("Bu alan zorunludur."),
});
