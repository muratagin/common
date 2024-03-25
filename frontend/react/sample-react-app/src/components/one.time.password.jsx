import { CircularProgress } from "@mui/material";
import { OneTimePasswordFormSchema } from "@validations/one.time.password.validation";
import { ErrorMessage, Form, Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import OtpInput from "react-otp-input";
import { useDispatch } from "react-redux";
import Icon from "./icon";
import Modal from "./modal";

const styles = {
  inputStyle: {
    width: "2.7rem",
    height: "2.7rem",
    margin: "0 0.5rem",
    fontSize: "2rem",
    borderRadius: 4,
    border: "1px solid rgba(0,0,0,0.3)",
  },
  containerStyle: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    rowGap: 10,
    columnGap: 2,
  },
};

function OneTimePasswordModal({ open, onHide, verifyOtp, resend, ...props }) {
  const [formValues, setFormValues] = useState({
    OtpCode: null,
  });

  let interval;
  let numInputs = 6;
  const [otpValue, setOtpValue] = useState("");
  const [emptyOtpValue, setEmptyOtpValue] = useState(false);
  const [countDown, setCountDown] = useState(120);
  const [resendLoading, setResendLoading] = useState(false);
  const dispatch = useDispatch();
  const inputRef = useRef();

  useEffect(() => {
    interval = setTimeout(() => {
      setCountDown(countDown - 1);
    }, [1000]);
    if (countDown === 0) clearTimeout(interval);
  }, [countDown]);

  useEffect(() => {
    inputRef.current.focusNextInput();
    setTimeout(() => {
      inputRef.current.focusPrevInput();
    }, 50);
    return () => clearTimeout(interval);
  }, []);

  const resendCode = () => {
    clearTimeout(interval);
    // let { service, content } = resend;

    setResendLoading(true);

    setTimeout(() => {
      setCountDown(120);
      setResendLoading(false);
    }, 1000);
  };

  const callback = (values) => {
    verifyOtp(values.OtpCode);
  };

  return (
    <Modal open={open} onClose={onHide} {...props}>
      <div className="flex justify-center flex-col py-5">
        <div className="text-matter-horn text-center gap-y-2 flex flex-col">
          <Icon icon="FaUnlock" className="text-blue-600 w-10 h-10 mx-auto" />
          <h1 className="text-xl font-bold">Tek Seferlik Şifre Onayı</h1>
          <p>Telefonunuza gelen tek seferlik şifreyi giriniz.</p>
          <p className=" text-2xl font-semibold text-primary">{countDown}</p>
        </div>
        <Formik
          enableReinitialize
          initialValues={formValues}
          validationSchema={OneTimePasswordFormSchema}
          onSubmit={(values) => callback(values)}
        >
          {({ handleSubmit, setFieldValue, values }) => (
            <Form
              onSubmit={handleSubmit}
              className="flex flex-col gap-y-2.5 px-5 py-3 mt-3 text-black md:px-10"
            >
              <div className="d-flex justify-content-center align-items-center m-3">
                <OtpInput
                  shouldAutoFocus
                  containerStyle={styles.containerStyle}
                  ref={inputRef}
                  inputStyle={styles.inputStyle}
                  value={values.OtpCode}
                  numInputs={numInputs}
                  onChange={(value) => setFieldValue("OtpCode", value)}
                  isInputNum={true}
                />
                <ErrorMessage
                  className="pl-1 text-xs text-persian-red"
                  component="span"
                  name="OtpCode"
                />
              </div>
              <div className="flex w-full justify-center">
                <button
                  type="submit"
                  className="mt-7 max-w-56 h-12 w-full cursor-pointer rounded-md border-none bg-company-primary text-sm font-medium text-white hover:opacity-90"
                >
                  ONAYLA VE DEVAM ET
                </button>
              </div>
              {resendLoading ? (
                <div className="mt-3 mx-auto">
                  <CircularProgress color="primary" className="w-4 h-4" />
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    disabled={countDown > 90}
                    onClick={() => resendCode()}
                    className="text-primary"
                  >
                    Telefonunuza şifre gelmediyse tıklayınız.
                  </button>
                  {countDown - 90 > 0 && (
                    <p className="text-danger">
                      Telefonunuza tekrar bildirim almak için {countDown - 90}{" "}
                      saniye beklemeniz gerekmektedir.
                    </p>
                  )}
                </>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
}

export default OneTimePasswordModal;
