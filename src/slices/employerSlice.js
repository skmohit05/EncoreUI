import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import _ from "lodash";
import { doGet, doPost, doPut } from "../commons";
import { priorityFeatures1, priorityFeatures2 } from "../util/dataUtil";
import { getCandidates, setPriorityFeatures } from "./candidatesSlice";
import { saveUserInfo } from "./userSlice";

const handleGetExtInfoFulfilled = (state, action) => {
  if (!_.isArray(action.payload.json)) {
    state.extInfo = action.payload;
  }
};

const handleGetEmployerJobPostingsFulfilled = (state, action) => {
  if (!_.isArray(action.payload.json)) {
    state.jobPostings = action.payload;
  }
};

const handleSaveExtInfoFulfilled = (state, action) => {
  if (!_.isArray(action.payload.json)) {
    state.extInfoFormStatus = "success";
    state.extInfo = action.payload;
  } else {
    state.formErrMsg = action.payload[0];
  }

  state.formLoading = false;
};

const handleSaveExtInfoPending = (state, action) => {
  state.formLoading = true;
};

const handleSaveExtInfoRejected = (state, action) => {
  state.formLoading = false;
  state.extInfoFormStatus = "failed";
  state.formErrMsg =
    _.isArray(action.payload.json) && action.payload.json[0]
      ? action.payload[0]
      : "Error while updating profile!";
};

const handleSaveJobPostingFulfilled = (state, action) => {
  if (!_.isArray(action.payload.json)) {
    state.jobPostingFormStatus = "success";
    state.title = action.payload[0].title;
    state.speciality = action.payload[0].speciality;
  } else {
    state.formErrMsg = action.payload[0];
  }

  state.formLoading = false;
};

const handleSaveJobPostingPending = (state, action) => {
  state.formLoading = true;
};

const handleSaveJobPostingRejected = (state, action) => {
  state.formLoading = false;
  state.jobPostingFormStatus = "failed";
  state.formErrMsg =
    _.isArray(action.payload.json) && action.payload.json[0]
      ? action.payload[0]
      : "Error while updating profile!";
};

const handleSaveJobPostingAndFilterCandidatesFulfilled = (state, action) => {
  state.formLoading = false;
};

export const getEmployerExtInfo = createAsyncThunk(
  "extInfo",
  async (userId) => {
    try {
      const response = await doGet([
        "api",
        "employers",
        userId,
        "extendedInfo",
      ]);
      const json = await response.json();
      return json;
    } catch (err) {
      return err;
    }
  }
);

export const getEmployerJobPostings = createAsyncThunk(
  "getEmployerJobPostings",
  async (userId) => {
    try {
      const response = await doGet([
        "api",
        "employers",
        userId,
        "jobs",
      ]);
      const json = await response.json();
      return json;
    } catch (err) {
      return err;
    }
  }
);

export const saveExtInfo = createAsyncThunk(
  "saveExtInfo",
  async (extInfo, { rejectWithValue, getState }) => {
    try {
      const response = await doPut(
        ["api", "employers", getState().loginState.userId, "extendedInfo"],
        extInfo
      );
      const json = await response.json();
      return json;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const saveJobPostingAndFilterCandidates = createAsyncThunk(
  "saveJobPostingAndFilterCandidates",
  async (jobPosting, { rejectWithValue, dispatch, getState }) => {
    const {
      priorityFeatureType1,
      priorityFeatureType2,
      priorityFeatureType3,
      priorityFeatureType4,
      priorityFeatureType5,
      yearsExperience,
      compensation,
      supervised,
      prescriptionAuthorityNeeded,
      assignmentShiftType,
    } = jobPosting;
    const P1 = _.find(priorityFeatures1, ["name", priorityFeatureType1]).desc;
    const P2 = _.find(priorityFeatures1, ["name", priorityFeatureType2]).desc;
    const P3 = _.find(priorityFeatures2, ["name", priorityFeatureType3]).desc;
    const P4 = _.find(priorityFeatures2, ["name", priorityFeatureType4]).desc;
    const P5 = _.find(priorityFeatures2, ["name", priorityFeatureType5]).desc;
    let P1value = "";
    let P2value = "";
    let P3value = "";
    let P4value = "";
    let P5value = "";
    if (P1 === "Years of Experience") {
      P1value = yearsExperience;
      P2value = compensation;
    } else {
      P1value = compensation;
      P2value = yearsExperience;
    }

    const facilityType = getState().userState.user.organization.facilityType;
    const malpracticeCandidateAcceptable =
      getState().employerState.extInfo.malpracticeCandidateAcceptable;
    const valueMap = [
      { name: "Supervision", value: supervised },
      {
        name: "PrescriptionAuthority",
        value: prescriptionAuthorityNeeded,
      },
      { name: "AssignmentShift", value: assignmentShiftType },
      {
        name: "MalpracticeCandidate",
        value: malpracticeCandidateAcceptable,
      },
      {
        name: "FacilityType",
        value: facilityType,
      },
    ];

    P3value = _.find(valueMap, ["name", jobPosting.priorityFeatureType3]).value;
    P4value = _.find(valueMap, ["name", jobPosting.priorityFeatureType4]).value;
    P5value = _.find(valueMap, ["name", jobPosting.priorityFeatureType5]).value;
    const filter = {
      title: jobPosting.title,
      specialty: jobPosting.speciality,
      stateCode: getState().employerState.extInfo.state,
      P1,
      P2,
      P3,
      P4,
      P5,
      P1value,
      P2value,
      P3value,
      P4value,
      P5value,
    };
    const priorityFeatures = {
      priorityFeatureType1,
      priorityFeatureType2,
      priorityFeatureType3,
      priorityFeatureType4,
      priorityFeatureType5,
      yearsExperience,
      compensation,
      supervised,
      prescriptionAuthorityNeeded,
      assignmentShiftType,
      malpracticeCandidateAcceptable,
      facilityType,
    };
    await dispatch(setPriorityFeatures(priorityFeatures));
    await dispatch(getCandidates(filter));

    const extInfo = getState().employerState.extInfo;
    const jobPostingUpdated = {...jobPosting, 
      state: extInfo.state,
      compensationType: "Hourly",
      malpracticeCoverage: extInfo.malpracticeCoverage,
      credentialingCoverage: extInfo.credentialingCoverage,
      licensingCoverage: extInfo.licenseCoverage,
      malpracticeAccepted: extInfo.malpracticeCandidateAcceptable,
      postedDate: _.isNil(jobPosting.postedDate) ? new Date() : jobPosting.postedDate,
      expiryDate: jobPosting.assignmentFromDate,
      updatedDate: new Date()
    };
    await dispatch(saveJobPosting(jobPostingUpdated));
    await dispatch(getEmployerJobPostings(getState().loginState.userId));
  }
);

export const saveJobPosting = createAsyncThunk(
  "saveJobPosting",
  async (jobPosting, { rejectWithValue, getState }) => {
    try {
      const response = await doPost(
        ["api", "employers", getState().loginState.userId, "jobs"],
        [jobPosting]
      );
      const json = await response.json();
      return json;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const saveExtInfoState =
  (extInfoState, userInfo) => async (dispatch) => {
    await dispatch(saveExtInfo(extInfoState));
    await dispatch(saveUserInfo(userInfo));
  };

export const clearErrors = () => async (dispatch) => {
  dispatch(clearErrorsSuccess());
};

export const editJob = (job, history) => async (dispatch) => {
  await dispatch(editJobSuccess(job));
  history.push('/jobPosting');
};

const employerSlice = createSlice({
  name: "employerSlice",
  initialState: {
    extInfo: {},
    jobPostings: [],
    title: "",
    speciality: "",
    formLoading: false,
    extInfoFormStatus: "none",
    jobPostingFormStatus: "none",
    formErrMsg: "none",
  },
  reducers: {
    clearErrorsSuccess: (state, action) => {
      state.extInfoFormStatus = "none";
      state.jobPostingFormStatus = "none";
      state.formErrMsg = "none";
      state.formLoading = false;
      state.editJob = undefined;
    },
    editJobSuccess: (state, action) => {
      state.editJob = action.payload;
    },
  },
  extraReducers: {
    "extInfo/fulfilled": handleGetExtInfoFulfilled,
    "getEmployerJobPostings/fulfilled": handleGetEmployerJobPostingsFulfilled,
    "saveExtInfo/fulfilled": handleSaveExtInfoFulfilled,
    "saveExtInfo/pending": handleSaveExtInfoPending,
    "saveExtInfo/rejected": handleSaveExtInfoRejected,
    "saveJobPosting/fulfilled": handleSaveJobPostingFulfilled,
    "saveJobPosting/pending": handleSaveJobPostingPending,
    "saveJobPosting/rejected": handleSaveJobPostingRejected,
    "saveJobPostingAndFilterCandidates/fulfilled":
      handleSaveJobPostingAndFilterCandidatesFulfilled,
  },
});

const { clearErrorsSuccess, editJobSuccess } = employerSlice.actions;
export default employerSlice;
