import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import _ from "lodash";

import { doGet, doPost, doPut, getEncryptedPassWordString } from "../commons";
import { otpClearErrors, verifyOtp } from "./otpSlice";

const handleGetUserInfoFulfilled = (state, action) => {
  if (!_.isArray(action.payload.json)) {
    state.user = action.payload;
  }
};

const handleSaveUserInfoFulfilled = (state, action) => {
  if (!_.isArray(action.payload.json)) {
    state.saveUserInfoStatus = "success";
    state.user = action.payload;
  } else {
    state.saveUserInfoErrMsg = action.payload[0];
  }

  state.saveUserInfoLoading = false;
};

const handleSaveUserInfoPending = (state, action) => {
  state.saveUserInfoLoading = true;
};

const handleSaveUserInfoRejected = (state, action) => {
  state.saveUserInfoLoading = false;
  state.saveUserInfoStatus = "failed";
  state.saveUserInfoErrMsg =
    _.isArray(action.payload.json) && action.payload.json[0]
      ? action.payload[0]
      : "Error while updating profile!";
};

const handleUpdatePasswordFulfilled = (state, action) => {
  state.updatePasswordStatus = "success";
  state.updatePasswordLoading = false;
};

const handleUpdatePasswordPending = (state, action) => {
  state.updatePasswordLoading = true;
};

const handleUpdatePasswordRejected = (state, action) => {
  state.updatePasswordLoading = false;
  state.updatePasswordStatus = "failed";
  state.updatePasswordErrMsg = action.payload.json[0]
    ? action.payload.json[0]
    : "Error while changing password!";
};

const handleResetPasswordFulfilled = (state, action) => {
  state.resetPasswordStatus = "success";
  state.resetPasswordLoading = false;
  state.verifyOtpStatus = "none";
  state.verifyOtpLoading = false;
  state.sendOtpStatus = "none";
  state.sendOtpLoading = false;
};

const handleResetPasswordPending = (state, action) => {
  state.resetPasswordLoading = true;
};

const handleResetPasswordRejected = (state, action) => {
  state.resetPasswordLoading = false;
  state.resetPasswordStatus = "failed";
  state.resetPasswordErrMsg =
  _.isArray(action.payload.json) && action.payload.json[0]
      ? action.payload.json[0]
      : "Password reset failed!";
};

export const resetPassword = createAsyncThunk(
  "resetPassword",
  async (
    { userId, password, email },
    { rejectWithValue }
  ) => {
    try {
      const resetPasswordBody = {
        userId,
        email,
        password: getEncryptedPassWordString(password),
      };
      const response = await doPost(
        ["api", "users", "resetPassword"],
        resetPasswordBody
      );
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const verifyOtpAndResetPassword = createAsyncThunk(
  "verifyOtpAndResetPassword",
  async (
    { email, verificationCode, password },
    { rejectWithValue, dispatch, getState }
  ) => {
    const verifyOtpBody = { email, verificationCode, requestType: 'PasswordReset' };
    await dispatch(verifyOtp(verifyOtpBody));
    let otpState = getState().otpState;
    if (otpState.verifyOtpStatus === "success") {
      const resetPasswordBody = {
        userId: otpState.userId,
        password,
        email,
      };
      dispatch(resetPassword(resetPasswordBody));
    }
  }
);

export const updatePassword = createAsyncThunk(
  "updatePassword",
  async ({ existingPassword, newPassword }, { rejectWithValue, getState }) => {
    try {
      const updatePasswordBody = {
        existingPassword: getEncryptedPassWordString(existingPassword),
        newPassword: getEncryptedPassWordString(newPassword),
      };
      const response = await doPost(
        ["api", "users", getState().loginState.userId, "changepassword"],
        updatePasswordBody
      );
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getUserInfo = createAsyncThunk("getUser", async (userId) => {
  try {
    const response = await doGet(["api", "users", userId]);
    const json = await response.json();
    return json;
  } catch (err) {
    return err;
  }
});

export const saveUserInfo = createAsyncThunk(
  "saveUserInfo",
  async (userInfo, { rejectWithValue }) => {
    try {
      const response = await doPut(
        ["api", "users", userInfo.userId],
        userInfo
      );
      const json = await response.json();
      return json;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const clearErrors = () => async (dispatch) => {
  await dispatch(otpClearErrors());
  await dispatch(clearErrorsSuccess());
};

const userSlice = createSlice({
  name: "userSlice",
  initialState: {
    user: {},
    saveUserInfoLoading: false,
    saveUserInfoStatus: "none",
    saveUserInfoErrMsg: "none",
    updatePasswordLoading: false,
    updatePasswordStatus: "none",
    updatePasswordErrMsg: "none",
    resetPasswordStatus: "none", //other values - 'success', 'failed'
    resetPasswordLoading: false,
    resetPasswordErrMsg: "none",
  },
  reducers: {
    clearErrorsSuccess: (state, action) => {
      state.updatePasswordStatus = "none";
      state.updatePasswordErrMsg = "none";
      state.updatePasswordLoading = false;
      state.resetPasswordStatus = "none";
      state.resetPasswordLoading = false;
      state.resetPasswordErrMsg = "none";
    },
  },
  extraReducers: {
    "getUser/fulfilled": handleGetUserInfoFulfilled,
    "saveUserInfo/fulfilled": handleSaveUserInfoFulfilled,
    "saveUserInfo/pending": handleSaveUserInfoPending,
    "saveUserInfo/rejected": handleSaveUserInfoRejected,
    "updatePassword/fulfilled": handleUpdatePasswordFulfilled,
    "updatePassword/pending": handleUpdatePasswordPending,
    "updatePassword/rejected": handleUpdatePasswordRejected,
    "resetPassword/fulfilled": handleResetPasswordFulfilled,
    "resetPassword/pending": handleResetPasswordPending,
    "resetPassword/rejected": handleResetPasswordRejected,
  },
});

const { clearErrorsSuccess } = userSlice.actions;
export default userSlice;
