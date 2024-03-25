import useAppContext from "@libs/context";
import { MySwalData } from "@libs/myswaldata";
import { reset } from "@slices/userSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function Logout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setAuthenticated } = useAppContext();
  const MySwal = withReactContent(Swal);
  useEffect(() => {
    const forReturn = setTimeout(() => {
      logout();
    });
    return () => {
      clearTimeout(forReturn);
    };
  }, []);
  let location = useLocation();
  let errMessage = location?.state?.message;

  const logout = () => {
    let timerInterval;

    MySwal.fire(
      MySwalData("custom", {
        title: "UYARI",
        icon: "error",
        html: `${
          errMessage
            ? `<p style="color:red;"> ${errMessage}</p>`
            : "Oturum zaman aşımına uğradı!"
        } <br/> <strong></strong> saniye içinde giriş ekranına yönlendirileceksiniz... <br/> <br/> <button id="goToHome" class="btn btn-success mx-auto outline-none">
        Giriş Ekranına Git`,
        showConfirmButton: false,
        allowOutsideClick: false,
        timer: 10000,
        timerProgressBar: true,

        didOpen: () => {
          const content = Swal.getHtmlContainer();
          const $ = content.querySelector.bind(content);
          const goToHome = $("#goToHome");

          goToHome.addEventListener("click", () => {
            localStorage.clear();
            dispatch(reset());
            setAuthenticated({ progress: false, result: false });
            navigate({
              to: "/login",
              options: {
                state: { message: errMessage },
              },
            });
            Swal.close();
          });

          timerInterval = setInterval(() => {
            Swal.getHtmlContainer().querySelector("strong").textContent = (
              Swal.getTimerLeft() / 1000
            ).toFixed(0);
          }, 100);
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
      })
    ).then((result) => {
      localStorage.clear();
      dispatch(reset());
      setAuthenticated({ progress: false, result: false });
      navigate({
        pathname: "/login",
        options: { replace: true, state: { message: errMessage } },
      });
      Swal.close();
    });
  };
  return <></>;
}

export default Logout;
