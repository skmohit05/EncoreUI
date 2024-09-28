// import { configureStore} from '@reduxjs/toolkit';
import { configureStore, combineReducers  } from '@reduxjs/toolkit';
import logger from 'redux-logger'

import jobsSlice from './slices/jobsSlice';
import candidatesSlice from './slices/candidatesSlice';
import loginSlice from './slices/loginSlice';
import signupSlice from './slices/signupSlice';
import userSlice from './slices/userSlice';
import jobseekerSlice from './slices/jobseekerSlice';
import employerSlice from './slices/employerSlice';
import otpSlice from './slices/otpSlice';

const combinedReducers = combineReducers({
  jobsState: jobsSlice.reducer,
  candidatesState: candidatesSlice.reducer,
  loginState: loginSlice.reducer,
  signupState: signupSlice.reducer,
  userState: userSlice.reducer,
  jobseekerState: jobseekerSlice.reducer,
  employerState: employerSlice.reducer,
  otpState: otpSlice.reducer,
});

const deletegateReducer = (state, action) => {
  if (action.type === 'logout/fulfilled') {
    state = undefined; //eslint-disable-line
  }
  return combinedReducers(state, action);
};

const store = configureStore ({
  reducer: deletegateReducer,
  middleware: (getDefaultMiddleware) =>
    process.env.NODE_ENV !== 'production' ? getDefaultMiddleware().concat(logger) : getDefaultMiddleware(),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
