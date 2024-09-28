import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import _ from "lodash";
import { doDelete, doGet, doPost, doPut } from "../commons";
import { newJobEntry } from "../util/dataUtil";
import { fetchJobs } from "./jobsSlice";

const handleGetExtInfoFulfilled = (state, action) => {
  if (!_.isArray(action.payload.json)) {
    state.extInfo = action.payload;
  }
};

const handleGetJobsInfoFulfilled = (state, action) => {
  if (!_.isArray(action.payload.json)) {
    if(!_.isEmpty(action.payload)){
      state.jobsInfo = action.payload;
    } else {
      state.jobsInfo = [newJobEntry];
    }
  }
};

const handleSaveExtInfoFulfilled = (state, action) => {
  if (!_.isArray(action.payload.json)) {
    state.saveExtInfoStatus = "success";
    state.extInfo = action.payload;
  } else {
    state.saveExtInfoErrMsg = action.payload[0];
  }

  state.saveExtInfoLoading = false;
};

const handleSaveExtInfoPending = (state, action) => {
  state.saveExtInfoLoading = true;
};

const handleSaveExtInfoRejected = (state, action) => {
  state.saveExtInfoLoading = false;
  state.saveExtInfoStatus = "failed";
  state.saveExtInfoErrMsg =
    _.isArray(action.payload.json) && action.payload.json[0]
      ? action.payload[0]
      : "Error while updating profile!";
};

const handleSaveJobsInfoFulfilled = (state, action) => {
  if (!_.isArray(action.payload.json)) {
    state.formStatus = "success";
    state.jobsInfo = action.payload;
  } else {
    state.formErrMsg = action.payload[0];
  }

  state.formLoading = false;
};

const handleSaveJobsInfoPending = (state, action) => {
  state.formLoading = true;
};

const handleSaveJobsInfoRejected = (state, action) => {
  state.formLoading = false;
  state.formStatus = "failed";
  state.formErrMsg =
    _.isArray(action.payload.json) && action.payload.json[0]
      ? action.payload[0]
      : "Error while updating job information!";
};

const handleDeleteJobInfoFulfilled = (state, action) => {
  if (!_.isArray(action.payload.json)) {
    state.jobsInfo = state.jobsInfo.filter(job => job.medicalJobSeekerJobInfoId !== action.payload);
  }
};

export const getJobseekerExtInfo = createAsyncThunk("extInfo", async (userId) => {
  try {
    const response = await doGet(["api", "jobSeekers", userId, "extendedInfo"]);
    const json = await response.json();
    return json;
  } catch (err) {
    return err;
  }
});

export const getJobsInfo = createAsyncThunk("jobsInfo", async (userId) => {
  try {
    const response = await doGet(["api", "jobSeekers", userId, "jobInfos"]);
    const json = await response.json();
    return json;
  } catch (err) {
    return err;
  }
});

export const saveExtInfo = createAsyncThunk(
  "saveExtInfo",
  async (extInfo, { rejectWithValue, getState }) => {
    try {
      const response = await doPut(
        ["api", "jobSeekers", getState().loginState.userId, "extendedInfo"],
        extInfo
      );
      const json = await response.json();
      return json;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const saveJobsInfo = createAsyncThunk(
  "saveJobsInfo",
  async (jobsInfo, { rejectWithValue, getState }) => {
    try {
      const reqBody = _.map(jobsInfo, job => ({
        ...job, 
        beds: job.beds === 'NA' ? 0 : job.beds,
        ors: job.ors === 'NA' ? 0 : job.ors,
        peers: job.peers === 'NA' ? 0 : job.peers,
        nurses: job.nurses === 'NA' ? 0 : job.nurses,
        avgPatientsInMonth: job.avgPatientsInMonth === 'NA' ? 0 : job.avgPatientsInMonth,
      }));
      const response = await doPost(
        ["api", "jobSeekers", getState().loginState.userId, "jobInfos"],
        reqBody
      );
      const json = await response.json();
      return json;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const saveJobInfoLocally = (jobInfo) => async (dispatch) => {
  dispatch(saveJobsLocally(jobInfo));
};

export const deleteJobInfo = createAsyncThunk(
  "deleteJobInfo",
  async (jobInfoId, { getState }) => {
    try {
      const response = await doDelete([
        "api",
        "jobSeekers",
        getState().loginState.userId,
        "jobInfos",
        jobInfoId,
      ]);
      return jobInfoId;
    } catch (err) {
      return err;
    }
  }
);

const prepareExtInfoBody = (extInfo) => {
  let stateLevelInfo = {};
  _.map(extInfo.stateLevelInfo, (sli) => {
    if (!_.isEmpty(sli.stateLicenseCode)) {
      stateLevelInfo[sli.stateLicenseCode] = {
        prescriptionAuthority: sli.prescriptionAuthority,
        licenseExpirationDate: sli.licenseExpirationDate,
      };
    }
  });
  const extInfoBody = {
    address1: extInfo.address1,
    address2: extInfo.address2,
    city: extInfo.city,
    state: extInfo.stateCode,
    zip: extInfo.zip,
    title: extInfo.title,
    specialityType: extInfo.specialty,
    malpractice: extInfo.malpractice,
    boardActions: extInfo.boardActions,
    disciplinaryActions: extInfo.disciplinaryActions,
    lossOfPrivileges: extInfo.lossOfPrivileges,
    epicExperience: extInfo.epicExperience,
    malpracticeInfo: extInfo.malpracticeInfo,
    boardActionsInfo: extInfo.boardActionsInfo,
    disciplinaryActionsInfo: extInfo.disciplinaryActionsInfo,
    lossOfPrivilegesInfo: extInfo.lossOfPrivilegesInfo,
    epicExperienceYears: extInfo.epicExperienceYears,
    jobPreferenceType: extInfo.jobPreference,
    travel: extInfo.travel,
    travelStatePreference: extInfo.travelStatePreference,
    shiftPreferenceType: extInfo.shiftPreference,
    callPreference: extInfo.callPreference,
    governmentAssignment: extInfo.governmentAssignment,
    stateLevelInfo,
    compensation: extInfo.compensation,
    yearsExperience: extInfo.yearsExperience
  };

  return extInfoBody;
};

export const clearErrors = () => async (dispatch) => {
  dispatch(clearErrorsSuccess());
};

export const saveExtInfoState = (extInfoState) => async (dispatch) => {
  const extInfo = prepareExtInfoBody(extInfoState);
  await dispatch(saveExtInfo(extInfo));
  const jobSearch = {
    title: extInfo.title,
    specialty: extInfo.specialityType,
    stateCode: extInfo.state
  }

  dispatch(fetchJobs(jobSearch));
};

const jobseekerSlice = createSlice({
  name: "jobseekerSlice",
  initialState: {
    extInfo: {},
    jobsInfo: [],
    saveExtInfoLoading: false,
    saveExtInfoStatus: "none",
    saveExtInfoErrMsg: "none",
    formLoading: false,
    formStatus: "none",
    formErrMsg: "none",
  },
  reducers: {
    clearErrorsSuccess: (state, action) => {
      state.saveExtInfoStatus = "none";
      state.saveExtInfoErrMsg = "none";
      state.saveExtInfoLoading = false;
      state.formStatus = "none";
      state.formErrMsg = "none";
      state.formLoading = false;
    },
    saveJobsLocally: (state, action) => {
      state.jobsInfo = action.payload;
    }
  },
  extraReducers: {
    "extInfo/fulfilled": handleGetExtInfoFulfilled,
    "jobsInfo/fulfilled": handleGetJobsInfoFulfilled,
    "saveExtInfo/fulfilled": handleSaveExtInfoFulfilled,
    "saveExtInfo/pending": handleSaveExtInfoPending,
    "saveExtInfo/rejected": handleSaveExtInfoRejected,
    "saveJobsInfo/fulfilled": handleSaveJobsInfoFulfilled,
    "saveJobsInfo/pending": handleSaveJobsInfoPending,
    "saveJobsInfo/rejected": handleSaveJobsInfoRejected,
    "deleteJobInfo/fulfilled": handleDeleteJobInfoFulfilled,
  },
});

const { clearErrorsSuccess, saveJobsLocally } = jobseekerSlice.actions;
export default jobseekerSlice;
