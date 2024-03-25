// import Routes from '@app/routes';
import {
  checkCurrentReleaseDedicatedWorker,
  isValidDedicatedWorker,
  refreshTokenDedicatedWorker,
} from "@/dedicatedWorkers";
import { MASTER_IDENTIFIER } from "@app/constant";
import HandleException from "@components/PageComponents/handle.exception";
import ResourcesProvider from "@contexts/ResourceProvider";
import { AppContext } from "@libs/context";
import Loading from "@libs/loading";
import { getEntityUrl } from "@libs/parser";
import { Toastr } from "@libs/toastr";
import { checkIdentifierUrl, checkIf } from "@libs/utils";
import Router from "@routes/router";
import {
  resetPopup,
  resetReleaseInfo,
  setIdentifier,
  setReleaseInfo,
} from "@slices/selectionSlice";
import { fetchIsValid, reset, set, setUserSettings } from "@slices/userSlice";
import { Suspense, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const popup = useSelector((state) => state.selection.popup);
  const releaseInfo = useSelector((state) => state.selection.releaseInfo);
  const releaseNoteInfo = useSelector(
    (state) => state.selection.releaseNoteInfo
  );
  const userSettings = useSelector((state) => state.user.userSettings);
  const { loading } = useSelector((state) => state.dynamicStyle);

  const [isAuthenticated, setAuthenticated] = useState({
    progress: true,
    result: false,
  });
  const [explode, setExplode] = useState(true);

  const handleToastrClose = () => {
    dispatch(resetPopup());
  };

  useEffect(() => {
    let companyIdentifier = checkIdentifierUrl();
    dispatch(setIdentifier(companyIdentifier));
    isValid();
  }, []);

  const isValid = () => {
    const user = checkIf(localStorage.getItem("user"))
      ? JSON.parse(localStorage.getItem("user"))
      : null;
    const token = localStorage.getItem("token");
    if (token) {
      // setAuthenticated({ progress: false, result: true });
      // dispatch(set(user));
      dispatch(fetchIsValid()).then((response) => {
        if (response.payload && checkIf(user)) {
          // setAuthenticated({ progress: false });
          setAuthenticated(() => ({ progress: false, result: true }));
          dispatch(set(user));
        } else {
          navigate("/logout", {
            message:
              "Oturum yenilenirken bir hata ile karşılaşıldı! Lütfen tekrar giriş yapın.",
          });
        }
      });
    } else {
      setAuthenticated((state) => ({
        ...state,
        progress: false,
        result: false,
      }));
    }
  };

  useEffect(() => {
    const userSettingsLocal =
      checkIf(localStorage.getItem("userSettings")) &&
      localStorage.getItem("userSettings") !== "undefined"
        ? JSON.parse(localStorage.getItem("userSettings"))
        : userSettings;
    dispatch(setUserSettings(userSettingsLocal));
  }, [window.localStorage.getItem("userSettings")]);

  useEffect(() => {
    if (isAuthenticated.result) {
      const user = checkIf(localStorage.getItem("user"))
        ? JSON.parse(localStorage.getItem("user"))
        : null;
      dispatch(set(user));

      // Workers
      const isValidWorker = new Worker(isValidDedicatedWorker);
      const refreshTokenWorker = new Worker(refreshTokenDedicatedWorker);
      const checkCurrentReleaseWorker = new Worker(
        checkCurrentReleaseDedicatedWorker
      );

      // Token & URL
      let initialToken = localStorage.getItem("token");
      let initialRefreshToken = localStorage.getItem("refreshToken");
      const isValidUrl = getEntityUrl({
        api: { port: 8141, url: `Authentications/IsValid` },
      });
      const checkCurrentReleaseUrl = getEntityUrl({
        api: { port: 8083, url: `ReleaseInfos/CheckCurrentReleaseRequest` },
      });
      const refreshTokenUrl = getEntityUrl({
        api: { port: 8141, url: `Authentications/CheckRefreshToken` },
      });

      //Workers postMessages
      isValidWorker.postMessage({
        url: isValidUrl,
        token: initialToken,
        type: "start",
      });

      refreshTokenWorker.postMessage({
        url: refreshTokenUrl,
        refreshToken: initialRefreshToken,
        type: "start",
      });
      checkCurrentReleaseWorker.postMessage({
        url: checkCurrentReleaseUrl,
        token: initialToken,
        identifier: MASTER_IDENTIFIER,
        type: "start",
      });

      //Workers onmessages
      isValidWorker.onmessage = ({ data }) => {
        if (data.IsSuccess === false) {
          isValid();
        }
      };
      refreshTokenWorker.onmessage = ({ data }) => {
        if (data.successful === true) {
          const { Headers } = data;
          const newToken = Headers.find(
            (header) => header.Key === "Authorization"
          ).Value;
          const refreshToken = data?.loginUser?.RefreshToken;
          localStorage.setItem("token", newToken);
          localStorage.setItem("refreshToken", refreshToken);
          isValidWorker.postMessage({
            url: isValidUrl,
            token: newToken,
            type: "refresh",
          });
          refreshTokenWorker.postMessage({
            url: refreshTokenUrl,
            refreshToken,
            type: "refresh",
          });
          checkCurrentReleaseWorker.postMessage({
            url: checkCurrentReleaseUrl,
            token: newToken,
            identifier: MASTER_IDENTIFIER,
            type: "refresh",
          });
          setAuthenticated({ progress: false, result: true });
        } else {
          ["token", "user", "refreshToken"].forEach((key) =>
            localStorage.clear(key)
          );
          dispatch(reset());
          setAuthenticated({ progress: false, result: false });
          refreshTokenWorker.terminate();
          isValidWorker.terminate();
          checkCurrentReleaseWorker.terminate();
        }
      };
      checkCurrentReleaseWorker.onmessage = ({ data }) => {
        if (data.IsSuccess === true) {
          dispatch(setReleaseInfo(data?.Data));
        } else {
          dispatch(resetReleaseInfo());
        }
      };
    }
  }, [isAuthenticated.result]);

  const ErrorFallback = () => {
    setExplode(false);
    return <HandleException />;
  };

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => setExplode(true)}
    >
      {explode ? (
        <AppContext.Provider value={{ isAuthenticated, setAuthenticated }}>
          <ResourcesProvider>
            <Suspense fallback={<Loading />}>
              {loading && <Loading />}
              <Router />
              <Toastr onClose={handleToastrClose} {...popup} />
            </Suspense>
          </ResourcesProvider>
        </AppContext.Provider>
      ) : (
        <HandleException />
      )}
    </ErrorBoundary>
  );
}

export default App;
