import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import _ from "lodash";
import { doGet } from "../commons";

const handleGetAnonymousCandidatesCountFulfilled = (state, action) => {
  if (!_.isArray(action.payload.json)) {
    state.anonymousCandidateSearchCount = action.payload;
    state.loading = false;
  }
};

const handleGetAnonymousCandidatesCountPending = (state, action) => {
  state.loading = true;
};

const handleGetAnonymousCandidatesCountRejected = (state, action) => {
  state.loading = false;
};

const handleGetCandidatesFulfilled = (state, action) => {
  if (!_.isArray(action.payload.json)) {
    state.candidates = action.payload;
  }
  state.loading = false;
};

const handleGetCandidatesPending = (state, action) => {
  state.loading = true;
};

const handleGetCandidatesRejected = (state, action) => {
  state.loading = false;
};

export const getAnonymousCandidatesCount = createAsyncThunk(
  "getAnonymousCandidatesCount",
  async ({ title, specialty, stateCode }) => {
    try {
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
      const response = await doGet(["api", "candidates"], queryParams);
      const json = await response.json();
      return json;
    } catch (err) {
      return err;
    }
  }
);

export const getCandidates = createAsyncThunk(
  "getCandidates",
  async (
    {
      title,
      specialty,
      stateCode,
      P1,
      P1value,
      P2,
      P2value,
      P3,
      P3value,
      P4,
      P4value,
      P5,
      P5value,
    },
    { getState }
  ) => {
    try {
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
      if (!_.isNil(P1)) {
        queryParams["P1"] = P1;
      }
      if (!_.isNil(P1value)) {
        queryParams["P1value"] = P1value;
      }
      if (!_.isNil(P2)) {
        queryParams["P2"] = P2;
      }
      if (!_.isNil(P2value)) {
        queryParams["P2value"] = P2value;
      }
      if (!_.isNil(P3)) {
        queryParams["P3"] = P3;
      }
      if (!_.isNil(P3value)) {
        queryParams["P3value"] = P3value;
      }
      if (!_.isNil(P4)) {
        queryParams["P4"] = P4;
      }
      if (!_.isNil(P4value)) {
        queryParams["P4value"] = P4value;
      }
      if (!_.isNil(P5)) {
        queryParams["P5"] = P5;
      }
      if (!_.isNil(P5value)) {
        queryParams["P5value"] = P5value;
      }
      const response = await doGet(
        ["api", "employers", getState().loginState.userId, "candidates"],
        queryParams
      );
      const json = await response.json();
      return json;
    } catch (err) {
      return err;
    }
  }
);

export const clearErrors = () => async (dispatch) => {
  dispatch(clearErrorsSuccess());
};

export const setPriorityFeatures = (priorityFeatures) => async (dispatch) => {
  dispatch(setPriorityFeaturesSuccess(priorityFeatures));
};

const candidatesSlice = createSlice({
  name: "candidatesSlice",
  initialState: {
    candidates: [],
    searchCondition: "",
    priorityFeatures: {},
    loading: false,
  },
  reducers: {
    clearErrorsSuccess: (state, action) => {},
    setPriorityFeaturesSuccess: (state, action) => {
      state.priorityFeatures = action.payload;
    },
  },
  extraReducers: {
    "getAnonymousCandidatesCount/fulfilled":
      handleGetAnonymousCandidatesCountFulfilled,
    "getAnonymousCandidatesCount/pending":
      handleGetAnonymousCandidatesCountPending,
    "getAnonymousCandidatesCount/rejected":
      handleGetAnonymousCandidatesCountRejected,
    "getCandidates/fulfilled": handleGetCandidatesFulfilled,
    "getCandidates/pending": handleGetCandidatesPending,
    "getCandidates/rejected": handleGetCandidatesRejected,
  },
});

const { clearErrorsSuccess, setPriorityFeaturesSuccess } =
  candidatesSlice.actions;
export default candidatesSlice;
