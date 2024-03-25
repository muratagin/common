import useAppContext from "@libs/context";
import { fetchExtendToken } from "@slices/userSlice";
import { useIdleTimer } from "react-idle-timer";
import { useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import SessionTimeoutModal from "../session.timeout.modal";
import Footer from "./footer";
import Header from "./header";
import Sidebar from "./sidebar";
// import Sidebar from '@components/sidebar';

export default function MainLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAppContext();
  const timeoutModalChannel = new BroadcastChannel("timeoutModal");
  const refreshLoginChannel = new BroadcastChannel("refreshLogin");

  const sendMessage = (e) => {
    timeoutModalChannel.postMessage(e);
  };

  refreshLoginChannel.onmessage = (event) => {
    // inaktif ekranlar refresh edilmeli
    if (event?.data?.value === "login" && document.hidden) {
      window.location.reload();
    }
  };

  useIdleTimer({
    crossTab: true,
    timeout: 1000 * 60 * 20,
    onIdle: () => {
      sendMessage(isAuthenticated.result);
    },
    debounce: 500,
  });

  const logout = (state) => {
    navigate("/logout", {
      replace: true,
      state,
    });
  };

  const extendToken = async () => {
    dispatch(fetchExtendToken()).then(({ payload }) =>
      payload === true
        ? sendMessage(false)
        : logout({
            message:
              "Oturum yenilenirken bir hata ile karşılaşıldı! Lütfen tekrar giriş yapın.",
          })
    );
  };

  return (
    <>
      <div className="flex h-full max-w-full flex-col justify-center">
        <Header />
        <div className="no-scrollbar flex h-[calc(100vh-80px)] overflow-y-scroll">
          <Sidebar open={open} />
          <div className="no-scrollbar flex h-full w-full flex-col overflow-x-hidden overflow-y-scroll">
            <div className="no-scrollbar main-content mb-2 rounded-2xl">
              <Outlet />
            </div>
            <Footer />
          </div>
        </div>
        <SessionTimeoutModal
          onHide={() => {
            extendToken();
          }}
        />
      </div>
    </>
  );
}
