import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import _ from "lodash";

import { setAuthToken, doPostBasicAuth, doPost } from "./../commons";
import { getJobseekerExtInfo, getJobsInfo } from "./jobseekerSlice";
import { fetchAppliedJobs, fetchJobs, fetchSavedJobs } from "./jobsSlice";
import { getEmployerExtInfo, getEmployerJobPostings } from "./employerSlice";
import { getUserInfo } from "./userSlice";
import { getCandidates } from "./candidatesSlice";

const handleLoginFulfilled = (state, action) => {
  state.lnAuthStatus = "success";
  // state.loading = false;
  state.userId = action.payload.userId;
  state.userType = action.payload.userType;
  state.userName = action.payload.userName;
  if (action.payload.title != null) {
    state.title = action.payload.title;
  }
  if (action.payload.specialityType != null) {
    state.specialty = action.payload.specialityType;
  }
  if (action.payload.state != null) {
    state.stateCode = action.payload.state;
  }
};

const handleLoginPending = (state, action) => {
  state.loading = true;
};

const handleLoginRejected = (state, action) => {
  state.loading = false;
  state.lnAuthStatus = "failed";
};

const handleLoginAndInitializeAppFulfilled = (state, action) => {
  state.loading = false;
  state.userDataInitialized = true;
};

const handleLoginAndInitializeAppPending = (state, action) => {
  state.loading = true;
};

const handleLoginAndInitializeAppRejected = (state, action) => {
  state.loading = false;
};

const handleLogoutFulfilled = (state, action) => {
  state.lnAuthStatus = "none";
  state.userId = "";
  state.loading = false;
};

const handleLogoutPending = (state, action) => {};

const handleLogoutRejected = (state, action) => {};

export const loginAndInitializeApp = createAsyncThunk(
  "loginAndInitializeApp",
  async (payload, { rejectWithValue, dispatch, getState }) => {
    await dispatch(login(payload));
    const lnState = getState().loginState;
    if (lnState.userType === "JobSeeker") {
      const extInfo = await dispatch(getJobseekerExtInfo(lnState.userId));
      if (!(extInfo.type === "extInfo/fulfilled" && extInfo.payload.status === 404)) {
        await dispatch(fetchJobs(lnState));
        await dispatch(fetchSavedJobs(lnState.userId));
        await dispatch(fetchAppliedJobs(lnState.userId));
        await dispatch(getJobsInfo(lnState.userId));
      }
    } else if (lnState.userType === "Employer") {
      const extInfo = await dispatch(getEmployerExtInfo(lnState.userId));
      if (!(extInfo.type === "extInfo/fulfilled" && extInfo.payload.status === 404)) {
        await dispatch(getCandidates(lnState));
      }
      await dispatch(getEmployerJobPostings(lnState.userId));
    }
    await dispatch(getUserInfo(lnState.userId));
  }
);

export const login = createAsyncThunk(
  "login",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = payload == null ?
        await doPost(["api", "auth", "refreshtoken"]) :
        await doPostBasicAuth(["api", "auth", "login"], payload.email, payload.password);
      const json = await response.json();
      setAuthToken(json.accessToken);
      return json;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const logout = createAsyncThunk(
  "logout",
  async () => {
    try {
      await doPost(["api", "auth", "logout"], {});
    } catch (err) {
    } finally {
      setAuthToken(null);
    }
  }
);

export const clearErrors = () => async (dispatch) => {
  dispatch(clearErrorsSuccess());
};

export const updateJobSearch =
  (title, specialty, stateCode) => async (dispatch) => {
    dispatch(updateJobSearchSuccess({ title, specialty, stateCode }));
  };

const loginSlice = createSlice({
  name: "loginSlice",
  initialState: {
    lnAuthStatus: "none", //other values - 'success', 'failed',
    loading: false,
    userId: "",
    userName: "",
    userType: "",
    title: "",
    specialty: "",
    stateCode: "",
    userDataInitialized: false
  },
  reducers: {
    clearErrorsSuccess: (state, action) => {
      if (state.lnAuthStatus === "failed") {
        state.lnAuthStatus = "none";
      }
    },
    updateJobSearchSuccess: (state, action) => {
      state.title = action.payload.title;
      state.specialty = action.payload.specialty;
      state.stateCode = action.payload.stateCode;
    },
  },
  extraReducers: {
    "login/fulfilled": handleLoginFulfilled,
    "login/pending": handleLoginPending,
    "login/rejected": handleLoginRejected,
    "logout/fulfilled": handleLogoutFulfilled,
    "logout/pending": handleLogoutPending,
    "logout/rejected": handleLogoutRejected,
    "loginAndInitializeApp/fulfilled": handleLoginAndInitializeAppFulfilled,
    "loginAndInitializeApp/pending": handleLoginAndInitializeAppPending,
    "loginAndInitializeApp/rejected": handleLoginAndInitializeAppRejected,
  },
});

const { clearErrorsSuccess, updateJobSearchSuccess } = loginSlice.actions;
export default loginSlice;
