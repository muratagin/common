import * as Yup from 'yup';

export const LoginFormSchema = Yup.object().shape({
  username: Yup.string().required('Kullanıcı adı zorunludur'),
  password: Yup.string().required('Şifre zorunludur.'),
  userCaptcha: Yup.string()
    .required('Güvenlik kodu giriniz.')
    .test(
      'is-uppercase-match',
      'Güvenlik kodları uyuşmuyor.',
      function (value) {
        // userCaptcha ve captcha'yı büyük harfe dönüştürerek karşılaştırın
        return value &&
          value?.toUpperCase() === this.parent.captcha?.toUpperCase()
          ? true
          : false;
      }
    ),
  captcha: Yup.string().required('Güvenlik kodu zorunludur.'),
});
