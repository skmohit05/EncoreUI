import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import _ from "lodash";

import {
  doPost,
  doPut,
  setAuthToken,
} from "../commons";

const handleSendOtpFulfilled = (state, action) => {
  state.sendOtpStatus = "success";
  state.sendOtpLoading = false;
};

const handleSendOtpPending = (state, action) => {
  state.sendOtpLoading = true;
};

const handleSendOtpRejected = (state, action) => {
  state.sendOtpLoading = false;
  state.sendOtpStatus = "failed";
  state.sendOtpErrMsg = action.payload.json[0]
    ? action.payload.json[0]
    : "Error while sending otp!";
};

const handleVerifyOtpFulfilled = (state, action) => {
  state.verifyOtpStatus = "success";
  state.verifyOtpLoading = false;
  state.userId = action.payload.userId;
};

const handleVerifyOtpPending = (state, action) => {
  state.verifyOtpLoading = true;
};

const handleVerifyOtpRejected = (state, action) => {
  state.verifyOtpLoading = false;
  state.verifyOtpStatus = "failed";
  state.verifyOtpErrMsg =
    action.payload.json !== null
      ? action.payload.json[0]
      : "Otp verification failed!";
};

export const sendOtp = createAsyncThunk(
  "sendOtp",
  async ({email, requestType}, { rejectWithValue }) => {
    try {
      const registrationOtpBody = {
        emailId: email,
        requestType
      };
      await doPost(["api", "mfa", "otp"], registrationOtpBody);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "verifyOtp",
  async ({ email, verificationCode, requestType }, { rejectWithValue, dispatch }) => {
    try {
      const validateOtpBody = {
        emailId: email,
        otp: verificationCode,
        requestType
      };
      const response = await doPost(
        ["api", "mfa", "otp", "verify"],
        validateOtpBody
      );
      const json = await response.json();
      if(requestType === 'Registration'){
        setAuthToken(json.token);
      }
      return json;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const otpClearErrors = () => async (dispatch) => {
  dispatch(clearErrorsSuccess());
};

const otpSlice = createSlice({
  name: "otpSlice",
  initialState: {
    userId: "",
    verifyOtpStatus: "none", //other values - 'success', 'failed'
    sendOtpStatus: "none", //other values - 'success', 'failed'
    sendOtpLoading: false,
    verifyOtpLoading: false,
    sendOtpErrMsg: "none",
    verifyOtpErrMsg: "none",
  },
  reducers: {
    clearErrorsSuccess: (state, action) => {
      state.userId = "";
      state.verifyOtpStatus = "none";
      state.sendOtpStatus = "none";
      state.sendOtpLoading = false;
      state.verifyOtpLoading = false;
      state.sendOtpErrMsg = "none";
      state.verifyOtpErrMsg = "none";
    },
  },
  extraReducers: {
    "sendOtp/fulfilled": handleSendOtpFulfilled,
    "sendOtp/pending": handleSendOtpPending,
    "sendOtp/rejected": handleSendOtpRejected,
    "verifyOtp/fulfilled": handleVerifyOtpFulfilled,
    "verifyOtp/pending": handleVerifyOtpPending,
    "verifyOtp/rejected": handleVerifyOtpRejected,
  },
});

const { clearErrorsSuccess } = otpSlice.actions;
export default otpSlice;
