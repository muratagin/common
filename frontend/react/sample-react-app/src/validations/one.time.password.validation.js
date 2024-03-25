import * as Yup from "yup";

export const OneTimePasswordFormSchema = Yup.object().shape({
  OtpCode: Yup.string()
    .required("Otp kodu zorunludur.")
    .min(6, "Otp kodu eksik veya hatalı."),
});
