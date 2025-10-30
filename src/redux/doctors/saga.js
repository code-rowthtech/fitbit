import DOCTOR_TYPES from "./constant";
import {
  all,
  fork,
  put,
  takeEvery,
  call,
  takeLatest,
} from "redux-saga/effects";
import {
  getAllDoctorsApi,
  getSingleDoctorApi,
  createDoctorApi,
  updateDoctorApi,
  getStatesApi,
  getCitiesApi,
  getSkillsApi,
  createSkillsApi,
  getCategoryApi,
  getSpecializationsApi,
  createSpecializationsApi,
  getSpecializationsCategoryApi,
  createDegreeApi,
  getQualificationApi,
} from "./api";
import { toast } from "react-toastify";

function* getAllDoctorsFunction({ payload }) {
  try {
    yield put({
      type: DOCTOR_TYPES.GET_ALL_DOCTORS_LOADING,
      payload: {},
    });
    const response = yield call(getAllDoctorsApi, { payload });

    if (response?.data && response?.data?.status === 200) {
      yield put({
        type: DOCTOR_TYPES.GET_ALL_DOCTORS_SUCCESS,
        payload: response.data,
      });
    } else {
      yield put({
        type: DOCTOR_TYPES.GET_ALL_DOCTORS_ERROR,
        payload: response.data,
      });
    }
  } catch (error) {
    yield put({
      type: DOCTOR_TYPES.GET_ALL_DOCTORS_ERROR,
      payload: { message: error?.message },
    });
  }
}

function* getSingleDoctorFunction() {
  try {
    yield put({
      type: DOCTOR_TYPES.GET_SINGLE_DOCTOR_LOADING,
      payload: {},
    });
    const response = yield call(getSingleDoctorApi);

    if (response?.data && response?.data?.status === 200) {
      yield put({
        type: DOCTOR_TYPES.GET_SINGLE_DOCTOR_SUCCESS,
        payload: response.data,
      });
    } else {
      yield put({
        type: DOCTOR_TYPES.GET_SINGLE_DOCTOR_ERROR,
        payload: response.data,
      });
    }
  } catch (error) {
    yield put({
      type: DOCTOR_TYPES.GET_SINGLE_DOCTOR_ERROR,
      payload: { message: error?.message },
    });
  }
}

export function* createDoctorFunction(data) {
  try {
    yield put({
      type: DOCTOR_TYPES.CREATE_DOCTOR_LOADING,
    });

    const response = yield call(createDoctorApi, data);
    // console.log("Create doctor response:", response);

    // ✅ Success case (check HTTP status)
    if (response.status === 201 || response?.data?.doctor?.status === 201) {
      toast.success(response?.data?.message || "Doctor created successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      yield put({
        type: DOCTOR_TYPES.CREATE_DOCTOR_SUCCESS,
        payload: response.data,
      });
    } else {
      // ✅ Handle expected API errors gracefully
      const errorMessage =
        response?.data?.message ||
        "Failed to create doctor. Please check the details.";

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });

      yield put({
        type: DOCTOR_TYPES.CREATE_DOCTOR_ERROR,
        payload: response.data,
      });
    }
  } catch (error) {
    // console.error("Error creating doctor:", error);

    // ✅ Extract a proper error message from response or fallback
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Error creating doctor.";

    toast.error(errorMessage, {
      position: "top-right",
      autoClose: 4000,
    });

    yield put({
      type: DOCTOR_TYPES.CREATE_DOCTOR_ERROR,
      payload: error,
    });
  }
}

function* updateDoctorFunction(data) {
  try {
    yield put({
      type: DOCTOR_TYPES.UPDATE_DOCTOR_LOADING,
    });

    const response = yield call(updateDoctorApi, data);
    // console.log("Update doctor response:", response?.data);

    // ✅ Corrected condition
    if (response?.data?.status === 200) {
      toast.success(response?.data?.message || "Doctor updated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      yield put({
        type: DOCTOR_TYPES.UPDATE_DOCTOR_SUCCESS,
        payload: response.data,
      });
    } else {
      const errorMessage =
        response?.data?.message ||
        "Failed to update doctor. Please check the details.";

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });

      yield put({
        type: DOCTOR_TYPES.UPDATE_DOCTOR_ERROR,
        payload: response.data,
      });
    }
  } catch (error) {
    toast.error(error?.response?.data?.message || "Something went wrong!", {
      position: "top-right",
      autoClose: 4000,
    });

    yield put({
      type: DOCTOR_TYPES.UPDATE_DOCTOR_ERROR,
      payload: error,
    });
  }
}

function* getStatesFunction({ payload }) {
  try {
    yield put({
      type: DOCTOR_TYPES.GET_STATES_LOADING,
      payload: {},
    });
    const response = yield call(getStatesApi, payload);
    if (response?.data && response?.data?.status === 200) {
      yield put({
        type: DOCTOR_TYPES.GET_STATES_SUCCESS,
        payload: response.data,
      });
    } else {
      yield put({
        type: DOCTOR_TYPES.GET_STATES_ERROR,
        payload: response.data,
      });
    }
  } catch (error) {
    yield put({
      type: DOCTOR_TYPES.GET_STATES_ERROR,
      payload: { message: error?.message },
    });
  }
}

function* getCitiesFunction({ payload }) {
  try {
    yield put({
      type: DOCTOR_TYPES.GET_CITIES_LOADING,
      payload: {},
    });
    const response = yield call(getCitiesApi, payload);
    if (response?.data && response?.data?.status === 200) {
      yield put({
        type: DOCTOR_TYPES.GET_CITIES_SUCCESS,
        payload: response.data,
      });
    } else {
      yield put({
        type: DOCTOR_TYPES.GET_CITIES_ERROR,
        payload: response.data,
      });
    }
  } catch (error) {
    yield put({
      type: DOCTOR_TYPES.GET_CITIES_ERROR,
      payload: { message: error?.message },
    });
  }
}

function* getSkillsFunction({ payload }) {
  try {
    yield put({
      type: DOCTOR_TYPES.GET_SKILLS_LOADING,
      payload: {},
    });
    const response = yield call(getSkillsApi, payload);
    if (response?.data && response?.data?.status === 200) {
      yield put({
        type: DOCTOR_TYPES.GET_SKILLS_SUCCESS,
        payload: response.data,
      });
    } else {
      yield put({
        type: DOCTOR_TYPES.GET_SKILLS_ERROR,
        payload: response.data,
      });
    }
  } catch (error) {
    yield put({
      type: DOCTOR_TYPES.GET_SKILLS_ERROR,
      payload: { message: error?.message },
    });
  }
}

function* createSkillsFunction(data) {
  try {
    yield put({
      type: DOCTOR_TYPES.CREATE_SKILLS_LOADING,
      payload: {},
    });
    const response = yield call(createSkillsApi, data);
    if (response?.data?.status === 201) {
      yield put({
        type: DOCTOR_TYPES.CREATE_SKILLS_SUCCESS,
        payload: response.data,
      });
    } else {
      yield put({
        type: DOCTOR_TYPES.CREATE_SKILLS_ERROR,
        payload: response.data,
      });
    }
  } catch (error) {
    yield put({
      type: DOCTOR_TYPES.CREATE_SKILLS_ERROR,
      payload: error,
    });
  }
}

function* getCategoryFunction({ payload }) {
  try {
    yield put({
      type: DOCTOR_TYPES.GET_CATEGORY_LOADING,
      payload: {},
    });
    const response = yield call(getCategoryApi, payload);
    if (response?.data && response?.data?.status === 200) {
      yield put({
        type: DOCTOR_TYPES.GET_CATEGORY_SUCCESS,
        payload: response.data,
      });
    } else {
      yield put({
        type: DOCTOR_TYPES.GET_CATEGORY_ERROR,
        payload: response.data,
      });
    }
  } catch (error) {
    yield put({
      type: DOCTOR_TYPES.GET_CATEGORY_ERROR,
      payload: { message: error?.message },
    });
  }
}

function* getSpecializationsFunction({ payload }) {
  try {
    yield put({
      type: DOCTOR_TYPES.GET_SPECIALIZATIONS_LOADING,
      payload: {},
    });
    const response = yield call(getSpecializationsApi, payload);
    if (response?.data && response?.data?.status === 200) {
      yield put({
        type: DOCTOR_TYPES.GET_SPECIALIZATIONS_SUCCESS,
        payload: response.data,
      });
    } else {
      yield put({
        type: DOCTOR_TYPES.GET_SPECIALIZATIONS_ERROR,
        payload: response.data,
      });
    }
  } catch (error) {
    yield put({
      type: DOCTOR_TYPES.GET_SPECIALIZATIONS_ERROR,
      payload: { message: error?.message },
    });
  }
}

function* createSpecializationsFunction(data) {
  try {
    yield put({
      type: DOCTOR_TYPES.CREATE_SPECIALIZATIONS_LOADING,
      payload: {},
    });
    const response = yield call(createSpecializationsApi, data);
    // console.log("Create specialization response:", response);
    if (response?.data?.status === 201) {
      yield put({
        type: DOCTOR_TYPES.CREATE_SPECIALIZATIONS_SUCCESS,
        payload: response.data,
      });
    } else {
      const errorMessage =
        response?.data?.message ||
        "Failed to create specialization. Please check the details.";

      // console.log(errorMessage, "errorMessageerrorMessage");

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });

      yield put({
        type: DOCTOR_TYPES.CREATE_SPECIALIZATIONS_ERROR,
        payload: response.data,
      });
    }
  } catch (error) {
    // console.log("Error creating specialization:", error);

    toast.error(error, {
      position: "top-right",
      autoClose: 4000,
    });

    yield put({
      type: DOCTOR_TYPES.CREATE_SPECIALIZATIONS_ERROR,
      payload: error,
    });
  }
}

function* getSpecializationsCategoryFunction({ payload }) {
  try {
    yield put({
      type: DOCTOR_TYPES.GET_SPECIALIZATIONS_CATEGORY_LOADING,
      payload: {},
    });
    const response = yield call(getSpecializationsCategoryApi, payload);
    if (response?.data && response?.data?.status === 200) {
      yield put({
        type: DOCTOR_TYPES.GET_SPECIALIZATIONS_CATEGORY_SUCCESS,
        payload: response.data,
      });
    } else {
      yield put({
        type: DOCTOR_TYPES.GET_SPECIALIZATIONS_CATEGORY_ERROR,
        payload: response.data,
      });
    }
  } catch (error) {
    yield put({
      type: DOCTOR_TYPES.GET_SPECIALIZATIONS_CATEGORY_ERROR,
      payload: { message: error?.message },
    });
  }
}

function* createDegreeFunction(data) {
  try {
    yield put({
      type: DOCTOR_TYPES.CREATE_DEGREE_LOADING,
      payload: {},
    });
    const response = yield call(createDegreeApi, data);
    if (response?.data?.status === 201) {
      yield put({
        type: DOCTOR_TYPES.CREATE_DEGREE_SUCCESS,
        payload: response.data,
      });
    } else {
      yield put({
        type: DOCTOR_TYPES.CREATE_DEGREE_ERROR,
        payload: response.data,
      });
    }
  } catch (error) {
    yield put({
      type: DOCTOR_TYPES.CREATE_DEGREE_ERROR,
      payload: error,
    });
  }
}

function* getQualificationFunction({ payload }) {
  try {
    yield put({
      type: DOCTOR_TYPES.GET_QUALIFICATION_LOADING,
      payload: {},
    });
    const response = yield call(getQualificationApi, payload);
    if (response?.data && response?.data?.status === 200) {
      yield put({
        type: DOCTOR_TYPES.GET_QUALIFICATION_SUCCESS,
        payload: response.data,
      });
    } else {
      yield put({
        type: DOCTOR_TYPES.GET_QUALIFICATION_ERROR,
        payload: response.data,
      });
    }
  } catch (error) {
    yield put({
      type: DOCTOR_TYPES.GET_QUALIFICATION_ERROR,
      payload: { message: error?.message },
    });
  }
}

export function* getAllDoctorsSaga() {
  yield takeEvery(DOCTOR_TYPES.GET_ALL_DOCTORS, getAllDoctorsFunction);
}

export function* getSingleDoctorSaga() {
  yield takeEvery(DOCTOR_TYPES.GET_SINGLE_DOCTOR, getSingleDoctorFunction);
}

export function* createDoctorSaga() {
  yield takeEvery(DOCTOR_TYPES.CREATE_DOCTOR, createDoctorFunction);
}

export function* updateDoctorSaga() {
  yield takeLatest(DOCTOR_TYPES.UPDATE_DOCTOR, updateDoctorFunction);
}

export function* getStatesSaga() {
  yield takeEvery(DOCTOR_TYPES.GET_STATES, getStatesFunction);
}

export function* getCitiesSaga() {
  yield takeEvery(DOCTOR_TYPES.GET_CITIES, getCitiesFunction);
}

export function* getSkillsSaga() {
  yield takeEvery(DOCTOR_TYPES.GET_SKILLS, getSkillsFunction);
}

export function* createSkillsSaga() {
  yield takeEvery(DOCTOR_TYPES.CREATE_SKILLS, createSkillsFunction);
}

export function* getCategorySaga() {
  yield takeEvery(DOCTOR_TYPES.GET_CATEGORY, getCategoryFunction);
}

export function* getSpecializationsSaga() {
  yield takeEvery(DOCTOR_TYPES.GET_SPECIALIZATIONS, getSpecializationsFunction);
}

export function* createSpecializationsSaga() {
  yield takeEvery(
    DOCTOR_TYPES.CREATE_SPECIALIZATIONS,
    createSpecializationsFunction
  );
}

export function* getSpecializationsCategorySaga() {
  yield takeEvery(
    DOCTOR_TYPES.GET_SPECIALIZATIONS_CATEGORY,
    getSpecializationsCategoryFunction
  );
}

export function* createDegreeSaga() {
  yield takeEvery(DOCTOR_TYPES.CREATE_DEGREE, createDegreeFunction);
}

export function* getQualificationSaga() {
  yield takeEvery(DOCTOR_TYPES.GET_QUALIFICATION, getQualificationFunction);
}

function* DoctorSaga() {
  yield all([
    fork(getAllDoctorsSaga),
    fork(getSingleDoctorSaga),
    fork(createDoctorSaga),
    fork(updateDoctorSaga),
    fork(getStatesSaga),
    fork(getCitiesSaga),
    fork(getSkillsSaga),
    fork(createSkillsSaga),
    fork(getCategorySaga),
    fork(getSpecializationsSaga),
    fork(createSpecializationsSaga),
    fork(getSpecializationsCategorySaga),
    fork(createDegreeSaga),
    fork(getQualificationSaga),
  ]);
}

export default DoctorSaga;
