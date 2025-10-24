import { all, fork, put, takeEvery, call } from "redux-saga/effects";

import {
  login as loginApi,
  logout as logoutApi,
  signup as signupApi,
  forgotPassword as forgotPasswordApi,
  forgotPasswordConfirm,
} from "../../services/authService";
import { authApiResponseSuccess, authApiResponseError } from "./actions";
import { AuthActionTypes } from "./constants";
import { setAuthorization } from "../../helpers/api/apiCore";
import { clearAuthData } from "../../utils/tokenUtils";
import api from "../../services/api";

/**
 * Login the user
 * @param {*} payload - username and password
 */

function* login({ payload: { username, password } }) {
  try {
    const response = yield call(loginApi, {
      email: username,
      password: password,
    });
    // console.log("Login Response:", response); // Debug log
    if (response?.status === 200) {
      const userData = {
        id: response?.data?.user?.id,
        username: response?.data?.user?.name,
        email: response?.data?.user?.email,
        role: response?.data?.user?.role,
        token: response?.data?.token,
        profilePic: response?.data?.user?.profilePicture,
        patientId: response?.data?.user?.patientId,
      };
      localStorage.setItem("token", response?.data?.token);
      localStorage.setItem("user", JSON.stringify(userData));
      sessionStorage.setItem("fitbit_user", JSON.stringify(userData));
      setAuthorization(response?.data?.token);
      yield put(authApiResponseSuccess(AuthActionTypes.LOGIN_USER, userData));
    } else {
      const errorMessage = response?.data?.message || "Login failed";
      yield put(authApiResponseError(AuthActionTypes.LOGIN_USER, errorMessage));
    }
  } catch (error) {
    const errorMessage =
      error?.response?.data?.error ||
      error?.message ||
      "Network error occurred";
    yield put(authApiResponseError(AuthActionTypes.LOGIN_USER, errorMessage));
  }
}

/**
 * Logout the user
 */
function* logout() {
  try {
    try {
      yield call(logoutApi);
    } catch (apiError) {
      console.warn("Logout API call failed:", apiError);
    }
    yield put(authApiResponseSuccess(AuthActionTypes.LOGOUT_USER, {}));

    // Use utility function to clear auth data
    clearAuthData();

    // Clear authorization header
    setAuthorization(null);
  } catch (error) {
    // Use utility function to clear auth data even on error
    clearAuthData();
    yield put(
      authApiResponseError(
        AuthActionTypes.LOGOUT_USER,
        error?.message || "Logout failed"
      )
    );
  }
}

function* signup({ payload: { fullname, email, password } }) {
  try {
    const response = yield call(signupApi, { fullname, email, password });
    const user = response.data;
    yield put(authApiResponseSuccess(AuthActionTypes.SIGNUP_USER, user));
  } catch (error) {
    yield put(authApiResponseError(AuthActionTypes.SIGNUP_USER, error));
  }
}

function* forgotPassword({ payload: { username } }) {
  try {
    const response = yield call(forgotPasswordApi, { username });
    yield put(
      authApiResponseSuccess(AuthActionTypes.FORGOT_PASSWORD, response.data)
    );
  } catch (error) {
    yield put(authApiResponseError(AuthActionTypes.FORGOT_PASSWORD, error));
  }
}

function* forgotPasswordChange({ payload: { data } }) {
  try {
    const response = yield call(forgotPasswordConfirm, data);
    yield put(
      authApiResponseSuccess(
        AuthActionTypes.FORGOT_PASSWORD_CHANGE,
        response.data
      )
    );
  } catch (error) {
    yield put(
      authApiResponseError(AuthActionTypes.FORGOT_PASSWORD_CHANGE, error)
    );
  }
}

export function* watchLoginUser() {
  yield takeEvery(AuthActionTypes.LOGIN_USER, login);
}

export function* watchLogout() {
  yield takeEvery(AuthActionTypes.LOGOUT_USER, logout);
}

export function* watchSignup() {
  yield takeEvery(AuthActionTypes.SIGNUP_USER, signup);
}

export function* watchForgotPassword() {
  yield takeEvery(AuthActionTypes.FORGOT_PASSWORD, forgotPassword);
}

export function* watchForgotPasswordChange() {
  yield takeEvery(AuthActionTypes.FORGOT_PASSWORD_CHANGE, forgotPasswordChange);
}

function* authSaga() {
  yield all([
    fork(watchLoginUser),
    fork(watchLogout),
    fork(watchSignup),
    fork(watchForgotPassword),
    fork(watchForgotPasswordChange),
  ]);
}

export default authSaga;
