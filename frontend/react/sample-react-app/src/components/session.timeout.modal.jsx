import { sessionTimeoutDedicatedWorker } from "@/dedicatedWorkers";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "./modal";

export default function SessionTimeoutModal({ onHide }) {
  const navigate = useNavigate();
  const [timer, setTimer] = useState(300);
  const [showModal, setShowModal] = useState();
  const timeoutModalChannel = new BroadcastChannel("timeoutModal");

  timeoutModalChannel.onmessage = (event) => {
    if (event?.data !== showModal) setShowModal(Boolean(event?.data));
  };
  const logout = (state) => {
    navigate("/logout", {
      replace: true,
      options: { state },
    });
  };

  useEffect(() => {
    if (showModal) {
      const countdownWorker = new Worker(sessionTimeoutDedicatedWorker);
      countdownWorker.postMessage({ time: timer });
      countdownWorker.onmessage = function ({ data }) {
        if (data === 0) {
          countdownWorker.terminate();
          document.title = `Oturum sonlandı...`;
          logout({
            message:
              "Oturum zaman aşımına uğradı! Lütfen tekrar giriş yaparak devam edin.",
          });
        } else {
          setTimer(data);
          document.title = `🕒 ${data} Oturumunuz sonlanmak üzere`;
        }
      };

      return () => {
        countdownWorker.terminate();
        document.title = `Oturum sonlandı...`;
      };
    }
  }, [showModal]);

  return (
    <Modal className="session-timeout-modal" open={showModal} onClose={onHide}>
      <div className="text-container">
        <p>
          İşlem yapılmadığı için oturumunuz{" "}
          <span className="time-text">{timer}</span> saniye sonra
          kapatılacaktır.
        </p>
        <p>Yenilemek ister misiniz?</p>
      </div>
      <div className="modal-footer">
        <button
          className="btn btn-primary"
          onClick={() => {
            onHide();
            setTimer(300);
            timeoutModalChannel.postMessage(false);
          }}
        >
          Evet
        </button>
        <button
          className="btn btn-danger"
          onClick={() => {
            timeoutModalChannel.postMessage(false);
            logout();
            setTimer(300);
          }}
        >
          Hayır
        </button>
      </div>
    </Modal>
  );
}
