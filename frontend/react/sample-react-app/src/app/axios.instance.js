import { setLoading, setRequestCount } from "@slices/dynamicStyleSlice";
import axios from "axios";
import store from "./store";
/* Projede kullanılan tüm crud işlemlerinin yapılandırıldığı fonksiyon */

let instanceAxios;
const reqCountIncrement = () => {
  let reqCount = store.getState()?.dynamicStyle?.requestCount;
  store.dispatch(setLoading(true));
  store.dispatch(setRequestCount(reqCount + 1));
};
const reqCountDecrement = () => {
  let reqCount = store.getState()?.dynamicStyle?.requestCount;
  store.dispatch(setRequestCount(reqCount - 1));
  if (reqCount - 1 <= 0) {
    store.dispatch(setLoading(false));
    store.dispatch(setRequestCount(0));
  }
};
export const AxiosInstance = () => {
  if (instanceAxios) {
    let token = localStorage.getItem("token");
    instanceAxios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    return instanceAxios;
  } else {
    instanceAxios = axios.create();
    instanceAxios.defaults.headers.common["Accept-Language"] = "en";
    //instanceAxios.defaults.headers.common['CompanyIdentifier'] = '85ee5631-ab92-4ae3-8ffa-81c89e752117'

    let token = localStorage.getItem("token");
    if (token !== null && typeof token !== "undefined") {
      instanceAxios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
    }

    // Request interceptor
    instanceAxios.interceptors.request.use(
      function (config) {
        // Do something before request is
        if (config.loading === true) {
          reqCountIncrement();
        }
        if (config.headers.IsLazyLoading === false) {
          config.headers["IsLazyLoading"] = false;
        } else if (config.method === "get") {
          config.headers["IsLazyLoading"] = true;
        } else if (
          config.method === "post" &&
          config.headers.IsLazyLoading === true
        ) {
          config.headers["IsLazyLoading"] = true;
        } else {
          config.headers["IsLazyLoading"] = false;
        }
        return config;
      },
      function (error) {
        // Do something with request error
        return Promise.reject(error);
      }
    );

    // Response interceptor
    instanceAxios.interceptors.response.use(
      function (response) {
        const { config } = response;
        if (config.loading === true) {
          reqCountDecrement();
        }
        // Do something with response data
        return response;
      },
      function (error) {
        if (!error.status) {
          // Network Error
          reqCountDecrement();
        }
        const config = error?.response?.config;
        if (config && config.loading === true) {
          reqCountDecrement();
        }
        // if (
        //   error?.response?.status === 403 &&
        //   window.location.pathname !== '/logout' &&
        //   window.location.pathname !== '/'
        // ) {
        //   setTimeout(() => {
        //     window.location.href = '/';
        //   }, 2000);
        // }

        // Do something with response error
        //let responseMessage = error.response.data?.messages.join(' ')
        //dispatch(setUserPopup({ display: true, title: 'Error Fetching Shops', message: error.message, explanation: '', class: 'danger' }))

        return Promise.reject(error);
      }
    );

    return instanceAxios;
  }
};
