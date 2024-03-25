import * as Yup from "yup";

export const PhoneNumberEditModalFormSchema = Yup.object().shape({
  MobileNumber: Yup.string()
    .matches(
      /^(\d{10}|\d{1}\s?\d{3}\s?\d{3}\s?\d{2}\s?\d{2})$/,
      "Lütfen geçerli bir telefon numarası giriniz."
    )
    .required("Bu alan zorunludur."),
});
