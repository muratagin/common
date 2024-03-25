import * as Yup from "yup";

export const PhoneNumberSelectedFormSchema = Yup.object().shape({
  PhoneNumber: Yup.string().required("Telefon numarası seçimi zorunludur."),
});
