import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import _ from "lodash";

import {
  doPut,
  getEncryptedPassWordString,
} from "./../commons";
import { otpClearErrors, verifyOtp } from "./otpSlice";

const handleSignupFulfilled = (state, action) => {
  state.userRegistrationStatus = "success";
  state.userId = action.payload.userId;
  state.userRegisterationLoading = false;
  state.verifyOtpStatus = "none";
  state.verifyOtpLoading = false;
  state.sendOtpStatus = "none";
  state.sendOtpLoading = false;
};

const handleSignupPending = (state, action) => {
  state.userRegisterationLoading = true;
};

const handleSignupRejected = (state, action) => {
  state.userRegisterationLoading = false;
  state.userRegistrationStatus = "failed";
  state.userRegistrationErrMsg =
    action.payload.json !== null
      ? action.payload.json[0]
      : "User registration failed!";
};

export const signup = createAsyncThunk(
  "signup",
  async (
    { userId, password, email, firstName, lastName, userType },
    { rejectWithValue }
  ) => {
    try {
      const registrationBody = {
        email,
        password: getEncryptedPassWordString(password),
        userId,
        userType: "JobSeeker",
        firstName,
        lastName,
        status: "Active",
        userType,
      };
      const response = await doPut(
        ["api", "users", userId, "register"],
        registrationBody
      );
      const json = await response.json();
      return json;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const verifyOtpAndSignup = createAsyncThunk(
  "verifyOtpAndSignup",
  async (
    { email, verificationCode, password, firstName, lastName, userType },
    { rejectWithValue, dispatch, getState }
  ) => {
    const verifyOtpBody = { email, verificationCode, requestType: 'Registration' };
    await dispatch(verifyOtp(verifyOtpBody));
    let otpState = getState().otpState;
    if (otpState.verifyOtpStatus === "success") {
      const signupBody = {
        userId: otpState.userId,
        password,
        email,
        firstName,
        lastName,
        userType,
      };
      dispatch(signup(signupBody));
    }
  }
);

export const clearErrors = () => async (dispatch) => {
  await dispatch(otpClearErrors());
  await dispatch(clearErrorsSuccess());
};

const signupSlice = createSlice({
  name: "signupSlice",
  initialState: {
    userId: "",
    email: "",
    userRegistrationStatus: "none", //other values - 'success', 'failed'
    userRegisterationLoading: false,
    userRegistrationErrMsg: "none",
  },
  reducers: {
    clearErrorsSuccess: (state, action) => {
      state.userRegistrationStatus = "none";
      state.userRegisterationLoading = false;
      state.userRegistrationErrMsg = "none";
    },
  },
  extraReducers: {
    "signup/fulfilled": handleSignupFulfilled,
    "signup/pending": handleSignupPending,
    "signup/rejected": handleSignupRejected,
  },
});

const { clearErrorsSuccess } = signupSlice.actions;
export default signupSlice;
