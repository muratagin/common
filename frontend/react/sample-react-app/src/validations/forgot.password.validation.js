import * as Yup from "yup";

export const ForgotPasswordFormSchema = Yup.object().shape({
  EmailAddress: Yup.string()
    // .email('Geçerli bir e-posta adresi giriniz.')
    .required("E-posta adresi zorunludur."),
  userCaptcha: Yup.string()
    .required("Güvenlik kodu giriniz.")
    .test(
      "is-uppercase-match",
      "Güvenlik kodları uyuşmuyor.",
      function (value) {
        // userCaptcha ve captcha'yı büyük harfe dönüştürerek karşılaştırın
        return value &&
          value?.toUpperCase() === this.parent.captcha?.toUpperCase()
          ? true
          : false;
      }
    ),
  captcha: Yup.string().required("Güvenlik kodu zorunludur."),
});
