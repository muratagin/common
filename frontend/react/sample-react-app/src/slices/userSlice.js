import { Requests } from "@app/api";
import { AxiosInstance } from "@app/axios.instance";
import { getEntityUrl } from "@libs/parser";
import { checkIfIsEmpty, resErrorMessage } from "@libs/utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import jwtDecode from "jwt-decode";

export const fetchLogin = createAsyncThunk(
  "user/fetchLogin",
  async (data, thunkAPI) => {
    try {
      const response = await Requests().CommonRequest.post(data);

      let token = response.data?.Data?.Token;
      const user = jwtDecode(token);
      const refreshToken = user?.RefreshToken;

      if (
        checkIfIsEmpty(response) &&
        checkIfIsEmpty(response.data) &&
        response.data?.IsSuccess
      ) {
        const axiosInstance = AxiosInstance();
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));
      }
      return response;
    } catch (error) {
      const errorMsg = resErrorMessage(error);
      throw errorMsg;
    }
  }
);

export const fetchIsValid = createAsyncThunk("user/fetchIsValid", async () => {
  try {
    const token = localStorage.getItem("token");
    const url = getEntityUrl({
      api: { port: 8141, url: `Authentications/IsValid` },
    });
    const response = await Requests().CommonRequest.post({
      url,
      content: { Token: token },
    });
    return response.data.IsSuccess;
  } catch (error) {
    const refreshTokenUrl = getEntityUrl({
      api: { port: 8141, url: `Authentications/CheckRefreshToken` },
    });
    let initialRefreshToken = localStorage.getItem("refreshToken");
    const response = await Requests().CommonRequest.post({
      url: refreshTokenUrl,
      content: { RefreshToken: initialRefreshToken },
    });
    if (response?.data?.IsSuccess) {
      const newToken = response?.data?.Data?.Token;

      const user = jwtDecode(newToken);
      const refreshToken = user?.RefreshToken;
      localStorage.setItem("token", newToken);
      localStorage.setItem("refreshToken", refreshToken);
    }
    return response?.data?.IsSuccess;
  }
});

export const fetchExtendToken = createAsyncThunk(
  "user/fetchExtendToken",
  async () => {
    let initialRefreshToken = localStorage.getItem("refreshToken");
    const url = getEntityUrl({
      api: { port: 8141, url: `Authentications/CheckRefreshToken` },
    });
    return await Requests()
      .CommonRequest.post({
        url,
        content: { RefreshToken: initialRefreshToken },
      })
      .then(({ data }) => {
        if (data.HttpStatusCode === 200) {
          const { Headers } = data;
          let newToken = Headers.find(
            (header) => header.Key === "Authorization"
          ).Value;
          let newRefreshToken = data?.loginUser?.RefreshToken;
          const axiosInstance = AxiosInstance();
          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newToken}`;
          localStorage.setItem("token", newToken);
          localStorage.setItem("refreshToken", newRefreshToken);
          return true;
        } else {
          return false;
        }
      });
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {},
    popup: {
      display: false,
      title: "",
      message: "",
      explanation: "",
      class: "",
    },
    userSettings: {
      DataTableSettings: {},
    },
  },
  reducers: {
    set: (state, action) => {
      state.user = action.payload;
    },
    reset: (state) => {
      state.user = {};
    },
    setUserPopup: (state, action) => {
      state.popup = action.payload;
    },
    resetUserPopup: (state) => {
      state.popup = {
        display: false,
        title: "",
        message: "",
        explanation: "",
        class: "",
      };
    },
    setUserSettings: (state, action) => {
      state.userSettings = action.payload;
    },
  },
  extraReducers: {
    [fetchLogin.fulfilled]: (state, action) => {
      // save
      state.user = action.payload.loginUser;
    },
  },
});

export const { set, reset, setUserPopup, resetUserPopup, setUserSettings } =
  userSlice.actions;

export default userSlice.reducer;
