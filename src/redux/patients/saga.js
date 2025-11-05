import PATIENT_TYPES from "./constant";
import {
  all,
  fork,
  put,
  takeEvery,
  call,
  takeLatest,
} from "redux-saga/effects";
import {
  getAllPatientsApi,
  createPatientApi,
  updatePatientApi,
  getPatientByIdApi,
  getAllergiesApi,
  createAllergiesApi,
} from "./api";
import { toast } from "react-toastify";

function* getAllPatientsFunction({ payload }) {
  try {
    yield put({
      type: PATIENT_TYPES.GET_ALL_PATIENTS_LOADING,
      payload: {},
    });
    const response = yield call(getAllPatientsApi, { payload });

    if (response?.data && response?.data?.status === 200) {
      yield put({
        type: PATIENT_TYPES.GET_ALL_PATIENTS_SUCCESS,
        payload: response.data,
      });
    } else {
      yield put({
        type: PATIENT_TYPES.GET_ALL_PATIENTS_ERROR,
        payload: response.data,
      });
    }
  } catch (error) {
    yield put({
      type: PATIENT_TYPES.GET_ALL_PATIENTS_ERROR,
      payload: { message: error?.message },
    });
  }
}

function* getPatientByIdFunction({ payload }) {
  try {
    yield put({
      type: PATIENT_TYPES.GET_PATIENT_BY_ID_LOADING,
      payload: {},
    });
    const response = yield call(getPatientByIdApi, { payload });
    if (response?.data?.patient?.status === 200) {
      yield put({
        type: PATIENT_TYPES.GET_PATIENT_BY_ID_SUCCESS,
        payload: response.data,
      });
    } else {
      yield put({
        type: PATIENT_TYPES.GET_PATIENT_BY_ID_ERROR,
        payload: response?.data || { message: "Failed to fetch patient data" },
      });
    }
  } catch (error) {
    yield put({
      type: PATIENT_TYPES.GET_PATIENT_BY_ID_ERROR,
      payload: { message: error?.message || "An error occurred" },
    });
  }
}

export function* createPatientFunction(data) {
  try {
    yield put({ type: PATIENT_TYPES.CREATE_PATIENT_LOADING });

    const response = yield call(createPatientApi, data);
    const status = response?.status || response?.data?.patient?.status || null;
    const message = response?.data?.message;
    if (status === 201) {
      toast.success(message, {
        position: "top-right",
        autoClose: 3000,
      });

      yield put({
        type: PATIENT_TYPES.CREATE_PATIENT_SUCCESS,
        payload: response.data,
      });
    } else {
      // handle unexpected status
      toast.error("Unexpected response from server", {
        position: "top-right",
        autoClose: 4000,
      });

      yield put({
        type: PATIENT_TYPES.CREATE_PATIENT_ERROR,
        payload: response,
      });
    }
  } catch (error) {
    toast.error(error, {
      position: "top-right",
      autoClose: 4000,
    });
    yield put({
      type: PATIENT_TYPES.CREATE_PATIENT_ERROR,
      payload: error,
    });
  }
}

// function* updatePatientFunction(data) {
//   try {
//     yield put({
//       type: PATIENT_TYPES.UPDATE_PATIENT_LOADING,
//       payload: {},
//     });
//     const response = yield call(updatePatientApi, data);
//     if (response?.data?.patient?.status === 200) {
//       yield put({
//         type: PATIENT_TYPES.UPDATE_PATIENT_SUCCESS,
//         payload: response.data,
//       });
//     } else {
//       yield put({
//         type: PATIENT_TYPES.UPDATE_PATIENT_ERROR,
//         payload: response?.data || { message: "Failed to update patient" },
//       });
//     }
//   } catch (error) {
//     yield put({
//       type: PATIENT_TYPES.UPDATE_PATIENT_ERROR,
//       payload: { message: error?.message || "An error occurred" },
//     });
//   }
// }

function* updatePatientFunction(data) {
  try {
    yield put({
      type: PATIENT_TYPES.UPDATE_PATIENT_LOADING,
      payload: {},
    });

    const response = yield call(updatePatientApi, data);
    const status = response?.status || response?.data?.patient?.status;
    const message = response?.data?.message;

    if (status === 200) {
      toast.success(message, {
        position: "top-right",
        autoClose: 3000,
      });

      yield put({
        type: PATIENT_TYPES.UPDATE_PATIENT_SUCCESS,
        payload: response.data,
      });
    } else {
      toast.error("Unexpected response from server", {
        position: "top-right",
        autoClose: 4000,
      });

      yield put({
        type: PATIENT_TYPES.UPDATE_PATIENT_ERROR,
        payload: response?.data || { message: "Failed to update patient" },
      });
    }
  } catch (error) {
    toast.error(error || "Failed to update patient", {
      position: "top-right",
      autoClose: 4000,
    });

    yield put({
      type: PATIENT_TYPES.UPDATE_PATIENT_ERROR,
      payload: { message: error?.message || "An error occurred" },
    });
  }
}

function* getAllergiesFunction() {
  try {
    yield put({
      type: PATIENT_TYPES.GET_ALLERGIES_LOADING,
    });
    const response = yield call(getAllergiesApi);
    if (response?.data && response?.data?.status === 200) {
      yield put({
        type: PATIENT_TYPES.GET_ALLERGIES_SUCCESS,
        payload: response.data,
      });
    } else {
      yield put({
        type: PATIENT_TYPES.GET_ALLERGIES_ERROR,
        payload: response.data,
      });
    }
  } catch (error) {
    yield put({
      type: PATIENT_TYPES.GET_ALLERGIES_ERROR,
      payload: { message: error?.message },
    });
  }
}

function* createAllergiesFunction(data) {
  try {
    yield put({
      type: PATIENT_TYPES.CREATE_ALLERGIES_LOADING,
      payload: {},
    });
    const response = yield call(createAllergiesApi, data);
    if (response?.data?.status === 201) {
      yield put({
        type: PATIENT_TYPES.CREATE_ALLERGIES_SUCCESS,
        payload: response.data,
      });
    } else {
      yield put({
        type: PATIENT_TYPES.CREATE_ALLERGIES_ERROR,
        payload: response?.data || { message: "Failed to create allergies" },
      });
    }
  } catch (error) {
    toast.error(error || "Failed to Create Allergies", {
      position: "top-right",
      autoClose: 4000,
    });
    yield put({
      type: PATIENT_TYPES.CREATE_ALLERGIES_ERROR,
      payload: { message: error?.message || "An error occurred" },
    });
  }
}

export function* getAllPatientsSaga() {
  yield takeEvery(PATIENT_TYPES.GET_ALL_PATIENTS, getAllPatientsFunction);
}

export function* getPatientByIdSaga() {
  yield takeEvery(PATIENT_TYPES.GET_PATIENT_BY_ID, getPatientByIdFunction);
}

export function* createPatientSaga() {
  yield takeEvery(PATIENT_TYPES.CREATE_PATIENT, createPatientFunction);
}

export function* updatePatientSaga() {
  yield takeLatest(PATIENT_TYPES.UPDATE_PATIENT, updatePatientFunction);
}

export function* getAllergiesSaga() {
  yield takeEvery(PATIENT_TYPES.GET_ALLERGIES, getAllergiesFunction);
}

export function* createAllergiesSaga() {
  yield takeEvery(PATIENT_TYPES.CREATE_ALLERGIES, createAllergiesFunction);
}

function* PatientSaga() {
  yield all([
    fork(getAllPatientsSaga),
    fork(createPatientSaga),
    fork(updatePatientSaga),
    fork(getPatientByIdSaga),
    fork(getAllergiesSaga),
    fork(createAllergiesSaga),
  ]);
}

export default PatientSaga;
