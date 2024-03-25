const strCode = (code) => {
  let newCode = code.toString();
  newCode = newCode.substring(
    newCode.indexOf("{") + 1,
    newCode.lastIndexOf("}")
  );
  const blob = new Blob([newCode], { type: "application/javascript" });
  return URL.createObjectURL(blob);
};

const isValidWorkerCode = () => {
  let isValidInterval;
  onmessage = function ({ data }) {
    if (data?.type === "refresh") {
      clearInterval(isValidInterval);
    }
    isValidInterval = setInterval(() => {
      fetch(data.url, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Accept-Encoding": "gzip, deflate",
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json;charset=UTF-8",
          Authorization: `Bearer ${data.token}`,
          "Accept-Language": "en",
          IsLazyLoading: false,
        },
        body: JSON.stringify({ Token: data.token }),
      })
        .then((res) => res.json())
        .then((data) => postMessage(data));
    }, 1000 * 60 * 1);
    return () => clearInterval(isValidInterval);
  };
};
const checkCurrentReleaseWorkerCode = () => {
  let checkCurrentReleaseInterval;
  onmessage = function ({ data }) {
    if (data?.type === "refresh") {
      clearInterval(checkCurrentReleaseInterval);
    }
    checkCurrentReleaseInterval = setInterval(() => {
      fetch(data.url, {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Accept-Encoding": "gzip, deflate",
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json;charset=UTF-8",
          Authorization: `Bearer ${data.token}`,
          "Accept-Language": "en",
          IsLazyLoading: false,
          CompanyIdentifier: data?.identifier,
        },
      })
        .then((res) => res.json())
        .then((data) => postMessage(data));
    }, 1000 * 60 * 5);
    return () => clearInterval(checkCurrentReleaseInterval);
  };
};
const refreshTokenWorkerCode = () => {
  let refreshTokenInterval;
  onmessage = function ({ data }) {
    if (data?.type === "refresh") {
      clearInterval(refreshTokenInterval);
    }
    refreshTokenInterval = setInterval(() => {
      fetch(data.url, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Accept-Encoding": "gzip, deflate",
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json;charset=UTF-8",
          "Accept-Language": "en",
          IsLazyLoading: false,
        },
        body: JSON.stringify({ RefreshToken: data.refreshToken }),
      })
        .then((res) => res.json())
        .then((data) => postMessage(data));
    }, 1000 * 60 * 60);
    return () => clearInterval(refreshTokenInterval);
  };
};

const sessionTimeoutWorkerCode = () => {
  let sessionTimeout;
  onmessage = function ({ data }) {
    let time = data?.time || 300;
    sessionTimeout = setInterval(() => {
      time--;
      postMessage(time);
    }, 1000 * 1);
    return () => clearInterval(sessionTimeout);
  };
};
const isValidDedicatedWorker = strCode(isValidWorkerCode);
const checkCurrentReleaseDedicatedWorker = strCode(
  checkCurrentReleaseWorkerCode
);
const refreshTokenDedicatedWorker = strCode(refreshTokenWorkerCode);
const sessionTimeoutDedicatedWorker = strCode(sessionTimeoutWorkerCode);

export {
  checkCurrentReleaseDedicatedWorker,
  isValidDedicatedWorker,
  refreshTokenDedicatedWorker,
  sessionTimeoutDedicatedWorker,
};
