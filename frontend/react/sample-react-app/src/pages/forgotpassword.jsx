import bg from "@/assets/captcha-bg.png";
import { Requests } from "@app/api";
import { settings } from "@app/settings";
import Input from "@components/Inputs/Input";
import { InputBase } from "@components/Inputs/InputBase";
import Icon from "@components/icon";
import Loading from "@libs/loading";
import { getEntityUrl } from "@libs/parser";
import { checkIf, randomString, resErrorMessage } from "@libs/utils";
import { setPopup } from "@slices/selectionSlice";
import { ForgotPasswordFormSchema } from "@validations/forgot.password.validation";
import { Form, Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const canvasRef = useRef(null);

  const [formValues, setFormValues] = useState({
    Email: "",
    userCaptcha: "",
    captcha: "",
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    let random = randomString(5).toUpperCase();
    setFormValues({ ...formValues, captcha: random });
  }, []);

  useEffect(() => {
    if (checkIf(formValues.captcha)) {
      const canvas = canvasRef.current;
      var ctx = canvas.getContext("2d");
      let img = new Image();
      img.src = bg;
      img.style.opacity = "0.75";
      img.onload = function () {
        let ptrn = ctx.createPattern(img, "repeat");
        ctx.fillStyle = ptrn;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = "35px Arial, sans-serif";
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;

        const angles = [-20, 10, -15, 5, -25]; // Döndürme açıları (derece cinsinden)

        for (let i = 0; i < 5; i++) {
          ctx.save(); // Geçerli dönüşüm matrisini kaydedin
          ctx.translate(10 + i * 25, 45); // Metin başlangıç konumunu ayarlayın
          ctx.rotate((angles[i] * Math.PI) / 180); // Metni döndürün (radyan cinsinden)

          ctx.strokeText(formValues.captcha[i], 0, 0); // Metni çizin
          ctx.restore(); // Önceki dönüşüm matrisini geri yükleyin
        }
      };
    }
  }, [formValues.captcha]);

  const handleForgotPassword = async (values) => {
    try {
      const url = getEntityUrl({
        api: { port: 8141, url: "Authentications/ForgotPassword" },
      });
      setLoading(true);

      const response = await Requests().CommonRequest.post({
        url: url,
        content: { Email: values.email },
      });

      if (response && response?.data && response.data?.IsSuccess) {
        dispatch(
          setPopup({
            display: true,
            class: "success",
            message: {
              title: "BİLGİ",
              body: "Şifre değiştirme linki e-posta adresinize başarıyla gönderildi. Lütfen kontrol ediniz.",
            },
          })
        );
        setLoading(false);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      let random = randomString(5).toUpperCase();
      setFormValues({ ...formValues, captcha: random });
      const errorMsg = resErrorMessage(error);
      dispatch(
        setPopup({
          display: true,
          class: "warning",
          message: {
            body: errorMsg,
          },
        })
      );
    }
  };

  const refreshCaptcha = (values) => {
    let random = randomString(5).toUpperCase();
    setFormValues({ ...values, captcha: random });
  };
  return (
    <>
      {loading && <Loading />}
      <div className="flex h-[calc(100vh-64px)] w-full flex-col items-center justify-center bg-company-primary text-sm text-white lg:text-base">
        <div className="flex flex-1 flex-shrink-0 items-center">
          <div className="mx-4 w-full rounded-md bg-white md:w-[450px]">
            <div className="flex w-full flex-col items-center justify-center  rounded-md rounded-b-none border-[1px] border-dotted border-b-summer-sky">
              <div className="flex justify-between items-center gap-x-10">
                <img
                  alt="login-logo"
                  src={settings.login.logo}
                  className="h-20 w-44 object-cover"
                />
                <img
                  alt="login-logo"
                  src="/company-logo.svg"
                  className="h-20 w-32 object-contain"
                />
              </div>
            </div>
            <Formik
              enableReinitialize
              initialValues={formValues}
              validationSchema={ForgotPasswordFormSchema}
              onSubmit={(values) => handleForgotPassword(values)}
            >
              {({ handleSubmit, values }) => (
                <Form
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSubmit();
                    }
                  }}
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-y-2.5 px-5 py-3 text-black md:px-10 lg:py-12"
                >
                  <h4 className="m-0 text-base">
                    Şifrenizi almak için lütfen e-posta adresinizi giriniz.
                  </h4>
                  <InputBase
                    label="E-posta adresi"
                    component={Input}
                    inputClassName="h-10 rounded-md border border-link-water px-2.5"
                    name="EmailAddress"
                    placeholder="E-posta adresi giriniz."
                  />

                  <div className="mt-2 flex flex-col">
                    <div className="flex flex-col gap-x-1 lg:flex-row">
                      <div className="flex flex-col">
                        <div className="flex items-end">
                          <canvas
                            ref={canvasRef}
                            width="150"
                            height="65"
                            className="bg-red-500"
                          />
                          <button
                            onClick={() => refreshCaptcha(values)}
                            type="button"
                            className="btn ml-0.5 bg-summer-sky p-1.5 drop-shadow-none"
                          >
                            <Icon icon="HiOutlineRefresh" />
                          </button>
                        </div>
                        <span className="text-xs">
                          * Görselde yer alan güvenlik kodunu giriniz.
                        </span>
                      </div>
                      <InputBase
                        label="Güvenlik Kodu"
                        placeholder="Güvenlik Kodu"
                        component={Input}
                        inputClassName="h-10 rounded-md border border-link-water px-2.5 uppercase mt-1.5"
                        name="userCaptcha"
                        maxLength={5}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col justify-end gap-y-3">
                    <Link
                      to="/login"
                      className="mt-3 flex w-24 items-center gap-x-1 text-dodger-blue"
                    >
                      <Icon icon="MdOutlineKeyboardBackspace" />
                      Geri Dön
                    </Link>
                    <button
                      type="submit"
                      className=" h-12 w-full cursor-pointer rounded-md border-none bg-navy-blue text-sm font-medium text-white hover:opacity-90"
                    >
                      ŞİFREMİ GÖNDER
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
