import PATIENT_DASHBOARD_TYPES from './constant';
import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { getPatientProfileApi, getPatientActivityApi, getPatientSleepApi, getPatientWaterApi, getPatientHeartApi, getPatientWeightApi, getPatientBodyFatApi, getPatientFoodApi, getPatientDevicesApi, getPatientGpsTrackingApi, connectToFitbitApi } from './api';
import { toast } from 'react-toastify';

function* getPatientProfileFunction({ payload }) {
    try {
        yield put({
            type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_PROFILE_LOADING,
            payload: {},
        });
        const response = yield call(getPatientProfileApi, { payload });
        console.log(response, 'response')

        if ((response?.data && response?.data?.status === 200) || (response?.data && response?.data?.status === 203)) {
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
            // toast.info(response.data.message)
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

export function* getPatientProfileSaga() {
    yield takeEvery(PATIENT_DASHBOARD_TYPES.GET_PATIENT_PROFILE, getPatientProfileFunction);
}

export function* getPatientActivitySaga() {
    yield takeEvery(PATIENT_DASHBOARD_TYPES.GET_PATIENT_ACTIVITY, getPatientActivityFunction);
}

export function* getPatientSleepSaga() {
    yield takeEvery(PATIENT_DASHBOARD_TYPES.GET_PATIENT_SLEEP, getPatientSleepFunction);
}

export function* getPatientWaterSaga() {
    yield takeEvery(PATIENT_DASHBOARD_TYPES.GET_PATIENT_WATER, getPatientWaterFunction);
}

export function* getPatientHeartSaga() {
    yield takeEvery(PATIENT_DASHBOARD_TYPES.GET_PATIENT_HEART, getPatientHeartFunction);
}

export function* getPatientWeightSaga() {
    yield takeEvery(PATIENT_DASHBOARD_TYPES.GET_PATIENT_WEIGHT, getPatientWeightFunction);
}

export function* getPatientBodyFatSaga() {
    yield takeEvery(PATIENT_DASHBOARD_TYPES.GET_PATIENT_BODY_FAT, getPatientBodyFatFunction);
}

export function* getPatientFoodSaga() {
    yield takeEvery(PATIENT_DASHBOARD_TYPES.GET_PATIENT_FOOD, getPatientFoodFunction);
}

export function* getPatientDevicesSaga() {
    yield takeEvery(PATIENT_DASHBOARD_TYPES.GET_PATIENT_DEVICES, getPatientDevicesFunction);
}

export function* getPatientGpsTrackingSaga() {
    yield takeEvery(PATIENT_DASHBOARD_TYPES.GET_PATIENT_GPS_TRACKING, getPatientGpsTrackingFunction);
}

export function* connectToFitbitSaga() {
    yield takeEvery(PATIENT_DASHBOARD_TYPES.CONNECT_TO_FITBIT, connectToFitbitFunction);
}

function* PatientDashboardSaga() {
    yield all([
        fork(getPatientProfileSaga),
        fork(getPatientActivitySaga),
        fork(getPatientSleepSaga),
        fork(getPatientWaterSaga),
        fork(getPatientHeartSaga),
        fork(getPatientWeightSaga),
        fork(getPatientBodyFatSaga),
        fork(getPatientFoodSaga),
        fork(getPatientDevicesSaga),
        fork(getPatientGpsTrackingSaga),
        fork(connectToFitbitSaga),
    ]);
}

export default PatientDashboardSaga;
