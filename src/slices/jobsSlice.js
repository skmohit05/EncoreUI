import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import _ from "lodash";

import { doGet, doPut, doDelete } from "./../commons";

const handleFetchJobsFulfilled = (state, action) => {
  // state.activePage = 1;
  // const start = 0;
  // const end = start + state.pageSize;
  state.jobs = action.payload;
  // state.totalPages = _.floor(_.size(action.payload) / state.pageSize, 0) + 1;
  state.loading = false;
};

const handleFetchJobsPending = (state, action) => {
  state.jobs = [];
  state.loading = true;
};

const handleFetchJobsRejected = (state, action) => {
  state.loading = false;
};

const handleAddJobFulfilled = (state, action) => {
  let jobs = [];
  jobs.push(action.payload);
  jobs.push(...state.savedJobs);
  state.savedJobs = jobs;
  state.saveJobStatus = "saved";
};

const handleApplyJobFulfilled = (state, action) => {
  state.appliedJobs.push(action.payload);
  // state.savedJobs = state.savedJobs.filter(job => job.jobPostingId !== action.payload.jobPostingId);
  state.saveJobStatus = "applied";
};

const handleFetchSavedJobsFulfilled = (state, action) => {
  state.savedJobs = action.payload;
};

const handleFetchAppliedJobsFulfilled = (state, action) => {
  state.appliedJobs = action.payload;
};

const handleUnsaveJobFulfilled = (state, action) => {
  state.savedJobs = state.savedJobs.filter((item) => item.jobPostingId !== action.payload);
  state.saveJobStatus = "unsaved";
};

// const handleChangeActivePage = (state, action) => {
//   const activePage = action.payload;

//   // state.jobs = _.slice(action.payload, start, end);
//   // state.activePage = activePage;
//   // state.totalPages = _.floor(_.size(action.payload) / state.pageSize, 0) + 1;
//   // state.loading = false;
// }

export const fetchJobs = createAsyncThunk(
  "fetchJobs",
  async (
    { title, specialty, stateCode },
    { rejectWithValue, getState }
  ) => {
    try {
      const {userId, userType} = getState().loginState;
      const queryParams = {};
      if (!_.isNil(title)) {
        queryParams["title"] = title;
      }
      if (!_.isEmpty(specialty)) {
        queryParams["speciality"] = specialty;
      }
      if (!_.isNil(stateCode)) {
        queryParams["location"] = stateCode;
      }

      let url;
      if (userId != "" && userType === "JobSeeker") {
        url = ["api", "jobseekers", userId, "jobs"];
      } else {
        url = ["api", "jobs"];
      }
      const response = await doGet(url, queryParams);
      const json = await response.json();
      return json;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const addJob = createAsyncThunk(
  "addJob",
  async ({ job, userId }, { rejectWithValue }) => {
    try {
      const url = [
        "api",
        "jobseekers",
        userId,
        "savedJobs",
        job.medicalEmployerJobPostingId,
      ];
      const savedJob = {
        jobPostingId: job.medicalEmployerJobPostingId,
        jobPostingDetails: job,
        savedDate: new Date(),
      };

      const response = await doPut(url, savedJob);
      const json = await response.json();
      return json;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const applyJob = createAsyncThunk(
  "applyJob",
  async (job, { rejectWithValue, getState }) => {
    try {
      const url = [
        "api",
        "jobseekers",
        getState().loginState.userId,
        "application",
        "jobs",
        job.medicalEmployerJobPostingId,
      ];

      const applyJobBody = {
        jobPostingId: job.medicalEmployerJobPostingId,
        jobPostingDetails: job,
        appliedDate: new Date(),
        accepted: false,
        startDate: job.assignmentFromDate,
        endDate: job.assignmentToDate,
        compensation: job.compensation,
        compensationType: job.compensationType,
        malpracticeCoverage: job.malpracticeCoverage,
        credentialingCoverage: job.credentialingCoverage,
        licenseCoverage: job.licensingCoverage,
        travelHousingCoverage: job.travelHousingCoverage,
        jobCompletedAsPerAgreement: false,
      };

      const response = await doPut(url, applyJobBody);
      const json = await response.json();
      return json;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const unsaveJob = createAsyncThunk(
  "unsaveJob",
  async ({ job, userId }, { rejectWithValue }) => {
    try {
      const url = [
        "api",
        "jobseekers",
        userId,
        "savedJobs",
        job.medicalEmployerJobPostingId,
      ];
      const response = await doDelete(url);
      return job.medicalEmployerJobPostingId;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const fetchSavedJobs = createAsyncThunk(
  "fetchSavedJobs",
  async (userId, { rejectWithValue }) => {
    try {
      const url = ["api", "jobseekers", userId, "savedJobs"];
      const response = await doGet(url);
      const json = await response.json();
      return json;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const fetchAppliedJobs = createAsyncThunk(
  "fetchAppliedJobs",
  async (userId, { rejectWithValue }) => {
    try {
      const url = ["api", "jobseekers", userId, "application", "jobs"];
      const response = await doGet(url);
      const json = await response.json();
      return json;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const clearSavedUnsavedJobStatus = () => async (dispatch) => {
  dispatch(clearJobStatus());
};

const jobsSlice = createSlice({
  name: "jobsSlice",
  initialState: {
    jobs: [],
    searchCondition: "",
    loading: false,
    savedJobs: [],
    appliedJobs: [],
    saveJobStatus: "none",
    applyJobStatus: "none",
  },
  reducers: {
    clearJobStatus: (state, action) => {
      state.saveJobStatus = "none";
    },
  },
  extraReducers: {
    "fetchJobs/fulfilled": handleFetchJobsFulfilled,
    "fetchJobs/pending": handleFetchJobsPending,
    "fetchJobs/rejected": handleFetchJobsRejected,
    "addJob/fulfilled": handleAddJobFulfilled,
    "applyJob/fulfilled": handleApplyJobFulfilled,
    "fetchSavedJobs/fulfilled": handleFetchSavedJobsFulfilled,
    "fetchAppliedJobs/fulfilled": handleFetchAppliedJobsFulfilled,
    "unsaveJob/fulfilled": handleUnsaveJobFulfilled,
  },
});

export const { clearJobStatus } = jobsSlice.actions;
export default jobsSlice;

//GET REST API: /api/jobs?age=60&title=Physician&specialty=Anesthesiology&location=Ohio (age, title, specialty and location (state) are the query params. Age = 60 means job posted in the last 60 days.)
