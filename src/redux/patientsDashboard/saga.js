import PATIENT_DASHBOARD_TYPES from "./constant";
import { all, fork, put, takeEvery, call } from "redux-saga/effects";
import {
  getPatientProfileApi,
  getPatientActivityApi,
  getPatientSleepApi,
  getPatientCaloriesBurnedApi,
  getPatientDistanceApi,
  getPatientSleepEfficiencyApi,
  getPatientWaterApi,
  getPatientHeartApi,
  getPatientWeightApi,
  getPatientBodyFatApi,
  getPatientFoodApi,
  getPatientDevicesApi,
  getPatientGpsTrackingApi,
  connectToFitbitApi,
  getPatientActiveMinApi,
  getPatientHeartRateApi,
  getFilterDataApi,
  getPatientCaloriesConsumedApi,
  getPatientSleepStagesApi,
  getExerciseSessionsApi,
} from "./api";
import { toast } from "react-toastify";

function* getPatientProfileFunction({ payload }) {
  try {
    yield put({
      type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_PROFILE_LOADING,
      payload: {},
    });
    const response = yield call(getPatientProfileApi, { payload });

    if (
      (response?.data && response?.data?.status === 200) ||
      (response?.data && response?.data?.status === 203)
    ) {
      yield put({
        type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_PROFILE_SUCCESS,
        payload: response.data,
      });
    } else {
      yield put({
        type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_PROFILE_ERROR,
        payload: response.data,
      });
    }
  } catch (error) {
    yield put({
      type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_PROFILE_ERROR,
      payload: { message: error?.message },
    });
  }
}

function* getPatientActivityFunction({ payload }) {
  try {
    yield put({
      type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_ACTIVITY_LOADING,
      payload: {},
    });
    const response = yield call(getPatientActivityApi, { payload });

    if (response?.data && response?.data?.status === 200) {
      yield put({
        type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_ACTIVITY_SUCCESS,
        payload: response.data,
      });
    } else {
      yield put({
        type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_ACTIVITY_ERROR,
        payload: response.data,
      });
    }
  } catch (error) {
    yield put({
      type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_ACTIVITY_ERROR,
      payload: { message: error?.message },
    });
  }
}

function* getPatientSleepFunction({ payload }) {
  try {
    yield put({
      type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_SLEEP_LOADING,
      payload: {},
    });
    const response = yield call(getPatientSleepApi, { payload });
    console.log("getPatientSleepFunction response:", response);

    if (response?.data && response?.data?.status === 200) {
      yield put({
        type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_SLEEP_SUCCESS,
        payload: response.data,
      });
    } else {
      yield put({
        type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_SLEEP_ERROR,
        payload: response.data,
      });
    }
  } catch (error) {
    yield put({
      type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_SLEEP_ERROR,
      payload: { message: error?.message },
    });
  }
}

function* getPatientCaloriesBurnedFunction({ payload }) {
  try {
    yield put({
      type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_CALORIES_BURNED_LOADING,
      payload: {},
    });
    const response = yield call(getPatientCaloriesBurnedApi, { payload });

    if (response?.data && response?.data?.status === 200) {
      yield put({
        type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_CALORIES_BURNED_SUCCESS,
        payload: response.data,
      });
    } else {
      yield put({
        type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_CALORIES_BURNED_ERROR,
        payload: response.data,
      });
    }
  } catch (error) {
    yield put({
      type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_CALORIES_BURNED_ERROR,
      payload: { message: error?.message },
    });
  }
}

function* getPatientDistanceFunction({ payload }) {
  try {
    yield put({
      type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_DISTANCE_LOADING,
      payload: {},
    });
    const response = yield call(getPatientDistanceApi, { payload });

    if (response?.data && response?.data?.status === 200) {
      yield put({
        type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_DISTANCE_SUCCESS,
        payload: response.data,
      });
    } else {
      yield put({
        type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_DISTANCE_ERROR,
        payload: response.data,
      });
    }
  } catch (error) {
    yield put({
      type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_DISTANCE_ERROR,
      payload: { message: error?.message },
    });
  }
}

function* getPatientSleepEfficiencyFunction({ payload }) {
  try {
    yield put({
      type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_SLEEP_EFFICIENCY_LOADING,
      payload: {},
    });
    const response = yield call(getPatientSleepEfficiencyApi, { payload });

    if (response?.data && response?.data?.status === 200) {
      yield put({
        type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_SLEEP_EFFICIENCY_SUCCESS,
        payload: response.data,
      });
    } else {
      yield put({
        type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_SLEEP_EFFICIENCY_ERROR,
        payload: response.data,
      });
    }
  } catch (error) {
    yield put({
      type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_SLEEP_EFFICIENCY_ERROR,
      payload: { message: error?.message },
    });
  }
}

function* getPatientWaterFunction({ payload }) {
  try {
    yield put({
      type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_WATER_LOADING,
      payload: {},
    });
    const response = yield call(getPatientWaterApi, { payload });

    if (response?.data && response?.data?.status === 200) {
      yield put({
        type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_WATER_SUCCESS,
        payload: response.data,
      });
    } else {
      yield put({
        type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_WATER_ERROR,
        payload: response.data,
      });
    }
  } catch (error) {
    yield put({
      type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_WATER_ERROR,
      payload: { message: error?.message },
    });
  }
}

function* getPatientHeartFunction({ payload }) {
  try {
    yield put({
      type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_HEART_LOADING,
      payload: {},
    });
    const response = yield call(getPatientHeartApi, { payload });

    if (response?.data && response?.data?.status === 200) {
      yield put({
        type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_HEART_SUCCESS,
        payload: response.data,
      });
    } else {
      yield put({
        type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_HEART_ERROR,
        payload: response.data,
      });
    }
  } catch (error) {
    yield put({
      type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_HEART_ERROR,
      payload: { message: error?.message },
    });
  }
}

function* getPatientWeightFunction({ payload }) {
  try {
    yield put({
      type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_WEIGHT_LOADING,
      payload: {},
    });
    const response = yield call(getPatientWeightApi, { payload });

    if (response?.data && response?.data?.status === 200) {
      yield put({
        type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_WEIGHT_SUCCESS,
        payload: response.data,
      });
    } else {
      yield put({
        type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_WEIGHT_ERROR,
        payload: response.data,
      });
    }
  } catch (error) {
    yield put({
      type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_WEIGHT_ERROR,
      payload: { message: error?.message },
    });
  }
}

function* getPatientBodyFatFunction({ payload }) {
  try {
    yield put({
      type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_BODY_FAT_LOADING,
      payload: {},
    });
    const response = yield call(getPatientBodyFatApi, { payload });

    if (response?.data && response?.data?.status === 200) {
      yield put({
        type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_BODY_FAT_SUCCESS,
        payload: response.data,
      });
    } else {
      yield put({
        type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_BODY_FAT_ERROR,
        payload: response.data,
      });
    }
  } catch (error) {
    yield put({
      type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_BODY_FAT_ERROR,
      payload: { message: error?.message },
    });
  }
}

function* getPatientFoodFunction({ payload }) {
  try {
    yield put({
      type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_FOOD_LOADING,
      payload: {},
    });
    const response = yield call(getPatientFoodApi, { payload });

    if (response?.data && response?.data?.status === 200) {
      yield put({
        type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_FOOD_SUCCESS,
        payload: response.data,
      });
    } else {
      yield put({
        type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_FOOD_ERROR,
        payload: response.data,
      });
    }
  } catch (error) {
    yield put({
      type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_FOOD_ERROR,
      payload: { message: error?.message },
    });
  }
}

function* getPatientDevicesFunction({ payload }) {
  try {
    yield put({
      type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_DEVICES_LOADING,
      payload: {},
    });
    const response = yield call(getPatientDevicesApi, { payload });

    if (response?.data && response?.data?.status === 200) {
      yield put({
        type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_DEVICES_SUCCESS,
        payload: response.data,
      });
    } else {
      yield put({
        type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_DEVICES_ERROR,
        payload: response.data,
      });
    }
  } catch (error) {
    yield put({
      type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_DEVICES_ERROR,
      payload: { message: error?.message },
    });
  }
}

function* getPatientGpsTrackingFunction({ payload }) {
  try {
    yield put({
      type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_GPS_TRACKING_LOADING,
      payload: {},
    });
    const response = yield call(getPatientGpsTrackingApi, { payload });

    if (response?.data && response?.data?.status === 200) {
      yield put({
        type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_GPS_TRACKING_SUCCESS,
        payload: response.data,
      });
    } else {
      yield put({
        type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_GPS_TRACKING_ERROR,
        payload: response.data,
      });
    }
  } catch (error) {
    yield put({
      type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_GPS_TRACKING_ERROR,
      payload: { message: error?.message },
    });
  }
}

function* connectToFitbitFunction({ payload }) {
  try {
    yield put({
      type: PATIENT_DASHBOARD_TYPES.CONNECT_TO_FITBIT_LOADING,
      payload: {},
    });
    const response = yield call(connectToFitbitApi, { payload });
    if (response?.data && response?.status === 200) {
      toast.info(response.data.message);
      yield put({
        type: PATIENT_DASHBOARD_TYPES.CONNECT_TO_FITBIT_SUCCESS,
        payload: response.data,
      });
    } else {
      yield put({
        type: PATIENT_DASHBOARD_TYPES.CONNECT_TO_FITBIT_ERROR,
        payload: response.data,
      });
    }
  } catch (error) {
    yield put({
      type: PATIENT_DASHBOARD_TYPES.CONNECT_TO_FITBIT_ERROR,
      payload: { message: error?.message },
    });
  }
}

function* getPatientActiveMinFunction({ payload }) {
  try {
    yield put({
      type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_ACTIVE_MIN_LOADING,
      payload: {},
    });
    const response = yield call(getPatientActiveMinApi, { payload });

    if (response?.data && response?.data?.status === 200) {
      yield put({
        type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_ACTIVE_MIN_SUCCESS,
        payload: response.data,
      });
    } else {
      yield put({
        type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_ACTIVE_MIN_ERROR,
        payload: response.data,
      });
    }
  } catch (error) {
    yield put({
      type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_ACTIVE_MIN_ERROR,
      payload: { message: error?.message },
    });
  }
}

function* getPatientHeartRateFunction({ payload }) {
  try {
    yield put({
      type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_HEART_RATE_LOADING,
      payload: {},
    });
    const response = yield call(getPatientHeartRateApi, { payload });

    if (response?.data && response?.data?.status === 200) {
      yield put({
        type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_HEART_RATE_SUCCESS,
        payload: response.data,
      });
    } else {
      yield put({
        type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_HEART_RATE_ERROR,
        payload: response.data,
      });
    }
  } catch (error) {
    yield put({
      type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_HEART_RATE_ERROR,
      payload: { message: error?.message },
    });
  }
}

function* getFilterDataFunction({ payload }) {
  try {
    yield put({
      type: PATIENT_DASHBOARD_TYPES.GET_FILTER_DATA_LOADING,
      payload: {},
    });
    const response = yield call(getFilterDataApi, { payload });

    if (response?.data && response?.data?.status === 200) {
      yield put({
        type: PATIENT_DASHBOARD_TYPES.GET_FILTER_DATA_SUCCESS,
        payload: response.data,
      });
    } else {
      yield put({
        type: PATIENT_DASHBOARD_TYPES.GET_FILTER_DATA_ERROR,
        payload: response.data,
      });
    }
  } catch (error) {
    yield put({
      type: PATIENT_DASHBOARD_TYPES.GET_FILTER_DATA_ERROR,
      payload: { message: error?.message },
    });
  }
}

function* getPatientCaloriesConsumedFunction({ payload }) {
  try {
    yield put({
      type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_CALORIES_CONSUMED_LOADING,
      payload: {},
    });
    const response = yield call(getPatientCaloriesConsumedApi, { payload });

    if (response?.data && response?.data?.status === 200) {
      yield put({
        type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_CALORIES_CONSUMED_SUCCESS,
        payload: response.data,
      });
    } else {
      yield put({
        type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_CALORIES_CONSUMED_ERROR,
        payload: response.data,
      });
    }
  } catch (error) {
    yield put({
      type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_CALORIES_CONSUMED_ERROR,
      payload: { message: error?.message },
    });
  }
}

function* getPatientSleepStagesFunction({ payload }) {
  try {
    yield put({
      type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_SLEEP_STAGES_LOADING,
      payload: {},
    });
    const response = yield call(getPatientSleepStagesApi, { payload });

    if (response?.data && response?.data?.status === 200) {
      yield put({
        type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_SLEEP_STAGES_SUCCESS,
        payload: response.data,
      });
    } else {
      yield put({
        type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_SLEEP_STAGES_ERROR,
        payload: response.data,
      });
    }
  } catch (error) {
    yield put({
      type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_SLEEP_STAGES_ERROR,
      payload: { message: error?.message },
    });
  }
}

function* getExerciseSessionsFunction({ payload }) {
  try {
    yield put({
      type: PATIENT_DASHBOARD_TYPES.GET_EXERCISE_SESSIONS_LOADING,
      payload: {},
    });
    const response = yield call(getExerciseSessionsApi, { payload });

    if (response?.data && response?.data?.status === 200) {
      yield put({
        type: PATIENT_DASHBOARD_TYPES.GET_EXERCISE_SESSIONS_SUCCESS,
        payload: response.data,
      });
    } else {
      yield put({
        type: PATIENT_DASHBOARD_TYPES.GET_EXERCISE_SESSIONS_ERROR,
        payload: response.data,
      });
    }
  } catch (error) {
    yield put({
      type: PATIENT_DASHBOARD_TYPES.GET_EXERCISE_SESSIONS_ERROR,
      payload: { message: error?.message },
    });
  }
}

export function* getPatientProfileSaga() {
  yield takeEvery(
    PATIENT_DASHBOARD_TYPES.GET_PATIENT_PROFILE,
    getPatientProfileFunction
  );
}

export function* getPatientActivitySaga() {
  yield takeEvery(
    PATIENT_DASHBOARD_TYPES.GET_PATIENT_ACTIVITY,
    getPatientActivityFunction
  );
}

export function* getPatientSleepSaga() {
  yield takeEvery(
    PATIENT_DASHBOARD_TYPES.GET_PATIENT_SLEEP,
    getPatientSleepFunction
  );
}

export function* getPatientCaloriesBurnedSaga() {
  yield takeEvery(
    PATIENT_DASHBOARD_TYPES.GET_PATIENT_CALORIES_BURNED,
    getPatientCaloriesBurnedFunction
  );
}

export function* getPatientDistanceSaga() {
  yield takeEvery(
    PATIENT_DASHBOARD_TYPES.GET_PATIENT_DISTANCE,
    getPatientDistanceFunction
  );
}

export function* getPatientSleepEfficiencySaga() {
  yield takeEvery(
    PATIENT_DASHBOARD_TYPES.GET_PATIENT_SLEEP_EFFICIENCY,
    getPatientSleepEfficiencyFunction
  );
}

export function* getPatientWaterSaga() {
  yield takeEvery(
    PATIENT_DASHBOARD_TYPES.GET_PATIENT_WATER,
    getPatientWaterFunction
  );
}

export function* getPatientHeartSaga() {
  yield takeEvery(
    PATIENT_DASHBOARD_TYPES.GET_PATIENT_HEART,
    getPatientHeartFunction
  );
}

export function* getPatientWeightSaga() {
  yield takeEvery(
    PATIENT_DASHBOARD_TYPES.GET_PATIENT_WEIGHT,
    getPatientWeightFunction
  );
}

export function* getPatientBodyFatSaga() {
  yield takeEvery(
    PATIENT_DASHBOARD_TYPES.GET_PATIENT_BODY_FAT,
    getPatientBodyFatFunction
  );
}

export function* getPatientFoodSaga() {
  yield takeEvery(
    PATIENT_DASHBOARD_TYPES.GET_PATIENT_FOOD,
    getPatientFoodFunction
  );
}

export function* getPatientDevicesSaga() {
  yield takeEvery(
    PATIENT_DASHBOARD_TYPES.GET_PATIENT_DEVICES,
    getPatientDevicesFunction
  );
}

export function* getPatientGpsTrackingSaga() {
  yield takeEvery(
    PATIENT_DASHBOARD_TYPES.GET_PATIENT_GPS_TRACKING,
    getPatientGpsTrackingFunction
  );
}

export function* connectToFitbitSaga() {
  yield takeEvery(
    PATIENT_DASHBOARD_TYPES.CONNECT_TO_FITBIT,
    connectToFitbitFunction
  );
}

export function* getPatientActiveMinSaga() {
  yield takeEvery(
    PATIENT_DASHBOARD_TYPES.GET_PATIENT_ACTIVE_MIN,
    getPatientActiveMinFunction
  );
}

export function* getPatientHeartRateSaga() {
  yield takeEvery(
    PATIENT_DASHBOARD_TYPES.GET_PATIENT_HEART_RATE,
    getPatientHeartRateFunction
  );
}

export function* getFilterDataSaga() {
  yield takeEvery(
    PATIENT_DASHBOARD_TYPES.GET_FILTER_DATA,
    getFilterDataFunction
  );
}

export function* getPatientCaloriesConsumedSaga() {
  yield takeEvery(
    PATIENT_DASHBOARD_TYPES.GET_PATIENT_CALORIES_CONSUMED,
    getPatientCaloriesConsumedFunction
  );
}

export function* getPatientSleepStagesSaga() {
  yield takeEvery(
    PATIENT_DASHBOARD_TYPES.GET_PATIENT_SLEEP_STAGES,
    getPatientSleepStagesFunction
  );
}

export function* getExerciseSessionsSaga() {
  yield takeEvery(
    PATIENT_DASHBOARD_TYPES.GET_EXERCISE_SESSIONS,
    getExerciseSessionsFunction
  );
}

function* PatientDashboardSaga() {
  yield all([
    fork(getPatientProfileSaga),
    fork(getPatientActivitySaga),
    fork(getPatientSleepSaga),
    fork(getPatientCaloriesBurnedSaga),
    fork(getPatientDistanceSaga),
    fork(getPatientSleepEfficiencySaga),
    fork(getPatientWaterSaga),
    fork(getPatientHeartSaga),
    fork(getPatientWeightSaga),
    fork(getPatientBodyFatSaga),
    fork(getPatientFoodSaga),
    fork(getPatientDevicesSaga),
    fork(getPatientGpsTrackingSaga),
    fork(connectToFitbitSaga),
    fork(getPatientActiveMinSaga),
    fork(getPatientHeartRateSaga),
    fork(getFilterDataSaga),
    fork(getPatientCaloriesConsumedSaga),
    fork(getPatientSleepStagesSaga),
    fork(getExerciseSessionsSaga),
  ]);
}

export default PatientDashboardSaga;
