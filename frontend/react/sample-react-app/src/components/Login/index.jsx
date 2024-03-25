import bg from "@/assets/captcha-bg.png";
import useAppContext from "@libs/context";
import { getEntityUrl } from "@libs/parser";
import { checkIfIsEmpty, randomString, resErrorMessage } from "@libs/utils";
import { setPopup } from "@slices/selectionSlice";
import { LoginFormSchema } from "@validations/login.form.validation";
import { Form, Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import { Requests } from "@app/api";
import { settings } from "@app/settings";
import Input from "@components/Inputs/Input";
import { InputBase } from "@components/Inputs/InputBase";
import Icon from "@components/icon";
import OneTimePasswordModal from "@components/one.time.password";
import Loading from "@libs/loading";
import { fetchLogin } from "@slices/userSlice";
import PhoneNumberSelectModal from "./phone.number.select.modal";

function Index() {
  const canvasRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const { isAuthenticated, setAuthenticated } = useAppContext();
  const refreshLoginChannel = new BroadcastChannel("refreshLogin");

  const [personnelId, setPersonnelId] = useState(null);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState(null);
  const [phoneNumberSelectModal, setPhoneNumberSelectModal] = useState({
    show: false,
    phoneNumbers: [],
  });

  const [oneTimePasswordModal, setOneTimePasswordModal] = useState({
    show: false,
    resend: null,
  });

  const returnUrl = new URLSearchParams(location.search).get("returnUrl");

  const sendMessage = (e) => {
    refreshLoginChannel.postMessage(e);
  };

  const [formValues, setFormValues] = useState({
    username: "",
    password: "",
    userCaptcha: "",
    captcha: "",
  });

  useEffect(() => {
    createCaptcha();
  }, []);

  useEffect(() => {
    if (checkIfIsEmpty(formValues.captcha)) {
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

  useEffect(() => {
    if (isAuthenticated.result) {
      sendMessage({ value: "login" });
      navigate("/");
    }
  }, []);

  //kullanıcıya ait telefon numaralarını al
  const getPhoneNumberForUser = async (values) => {
    try {
      if (checkIfIsEmpty(values.UserId)) {
        const url = getEntityUrl({
          api: {
            port: 8141,
            url: `Authentications/GetUserPhoneNumbersByUserId?id=${values.UserId}`,
          },
        });
        setLoading(true);
        const response = await Requests().CommonRequest.get({
          url,
        });
        const data = response?.data;
        const isSuccess = data && Array.isArray(data) && data.length > 0;
        if (isSuccess) {
          const phoneNumbers = data.map((p) => {
            return { label: p.PhoneNumber, value: p.PhoneNumber };
          });
          setPhoneNumberSelectModal({ show: true, phoneNumbers });
        }

        setLoading(false);
      }
    } catch (error) {
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
      setLoading(false);
    }
  };

  //kullanıcı adı ve şifre ile kullanıcı id değerini al
  const login = async (values, _) => {
    try {
      const url = getEntityUrl({
        api: { port: 8141, url: `Authentications/Login` },
      });

      const content = {
        Username: values.username,
        Password: values.password,
      };

      setLoading(true);
      const response = await Requests().CommonRequest.post({ url, content });
      if (response.data?.IsSuccess) {
        getPhoneNumberForUser(response.data?.Data);
        setPersonnelId(response.data?.Data?.UserId);
        setLoading(false);
      }
    } catch (error) {
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
      setLoading(false);
    }
  };

  //kullanıcının seçtiği telefona otp gönder
  const sendOtp = async (values) => {
    try {
      if (checkIfIsEmpty(personnelId)) {
        const content = {
          UserId: personnelId,
          ...values,
        };

        const url = getEntityUrl({
          api: {
            port: 8141,
            url: `Authentications/SendOtp`,
          },
        });
        setLoading(true);
        const response = await Requests().CommonRequest.post({
          url,
          content,
        });

        if (response.data?.IsSuccess) {
          setOneTimePasswordModal({ show: true });
        }

        setLoading(false);
      }
    } catch (error) {
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
      setLoading(false);
    }
  };

  const loginByOtp = async (otpCode) => {
    try {
      if (checkIfIsEmpty(personnelId)) {
        const content = {
          UserId: personnelId,
          OtpCode: otpCode,
        };

        const url = getEntityUrl({
          api: {
            port: 8141,
            url: `Authentications/LoginByOtp`,
          },
        });
        setLoading(true);
        const response = await dispatch(
          fetchLogin({
            url,
            content,
            loading: true,
          })
        );
        if (response && response.payload && response.payload?.data?.IsSuccess) {
          setAuthenticated({ progress: false, result: true });
        } else {
          dispatch(
            setPopup({
              display: true,
              class: "warning",
              message: {
                body: response?.error?.message,
              },
            })
          );
        }
        setLoading(false);
      }
    } catch (error) {
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
      setLoading(false);
    }
  };

  const createCaptcha = () => {
    let random = randomString(5).toUpperCase();
    setFormValues({ ...formValues, captcha: random });
  };

  const refreshCaptcha = (values) => {
    let random = randomString(5).toUpperCase();
    setFormValues({ ...values, captcha: random });
  };

  if (isAuthenticated.progress === false && isAuthenticated.result) {
    const redirectUrl = checkIfIsEmpty(returnUrl) ? returnUrl : "/";
    return <Navigate to={redirectUrl} />;
  }

  return (
    <div
      style={{
        background: settings.login.backgroundColor,
      }}
      className="flex h-[calc(100vh-64px)] w-full flex-col items-center justify-center bg-company-primary text-sm text-white lg:text-base"
    >
      {loading && <Loading />}
      <div className="flex w-full flex-1 flex-shrink-0 items-center md:w-auto">
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
            <h4 className="text-md my-0 h-full w-full text-center font-semibold text-denim">
              WEB GİRİŞ EKRANI
            </h4>
          </div>
          <Formik
            enableReinitialize
            initialValues={formValues}
            validationSchema={LoginFormSchema}
            onSubmit={(values) => login(values)}
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
                <InputBase
                  label="Kullanıcı Adı"
                  component={Input}
                  inputClassName="h-10 rounded-md border border-link-water px-2.5"
                  name="username"
                  placeholder="Kullanıcı adı giriniz."
                />
                <InputBase
                  label="Şifre"
                  component={Input}
                  inputClassName="h-10 rounded-md border border-link-water px-2.5"
                  type="password"
                  name="password"
                  placeholder="Şifre giriniz."
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
                <div className="flex w-full flex-col items-end justify-end">
                  <button
                    type="submit"
                    className="mt-2.5 h-12 w-full cursor-pointer rounded-md border-none bg-navy-blue text-sm font-medium text-white hover:opacity-90"
                  >
                    GİRİŞ
                  </button>
                  <Link
                    to="/forgotpassword"
                    type="submit"
                    className="mt-2.5 h-12 w-full cursor-pointer rounded-md flex items-center justify-center border-none bg-danger text-sm font-medium text-white hover:opacity-90"
                  >
                    ŞİFREMİ UNUTTUM
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      {phoneNumberSelectModal.show && (
        <PhoneNumberSelectModal
          open={phoneNumberSelectModal.show}
          onHide={() => setPhoneNumberSelectModal({ show: false })}
          sendOtp={sendOtp}
          phoneNumbers={phoneNumberSelectModal.phoneNumbers}
        />
      )}
      {oneTimePasswordModal.show && (
        <OneTimePasswordModal
          open={oneTimePasswordModal.show}
          onHide={() => setOneTimePasswordModal({ show: false })}
          resend={{
            service: {
              url: "Authentications/ReSendOtp",
              baseName: "BaseApiName",
            },
            content: {
              PersonnelId: personnelId,
              PhoneNumber: selectedPhoneNumber,
            },
          }}
          verifyOtp={(data) => loginByOtp(data)}
        />
      )}
    </div>
  );
}

export default Index;
