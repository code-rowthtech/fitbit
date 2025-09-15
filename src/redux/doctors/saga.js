import DOCTOR_TYPES from './constant';
import { all, fork, put, takeEvery, call, takeLatest } from 'redux-saga/effects';
import { getAllDoctorsApi, createDoctorApi, updateDoctorApi, getStatesApi, getCitiesApi } from './api';
import { toast } from 'react-toastify';

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

function* createDoctorFunction(data) {
    try {
        yield put({
            type: DOCTOR_TYPES.CREATE_DOCTOR_LOADING,
            payload: {},
        });
        const response = yield call(createDoctorApi, data);
        if (response.data.doctor.status === 201) {
            // ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: DOCTOR_TYPES.CREATE_DOCTOR_SUCCESS,
                payload: response.data,
            });
            // yield put({
            //     type: DOCTOR_TYPES.CREATE_DOCTOR_RESET,
            //     payload: {},
            // });
        } else {
            yield put({
                type: DOCTOR_TYPES.CREATE_DOCTOR_ERROR,
                payload: response.data,
            });
        }
    } catch (error) {
        // ToastHandle(error, 'danger');
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
            payload: {},
        });
        const response = yield call(updateDoctorApi, data);
        if (response.data.doctor.status === 200) {
            // ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: DOCTOR_TYPES.UPDATE_DOCTOR_SUCCESS,
                payload: response.data,
            });
            // yield put({
            //     type: DOCTOR_TYPES.UPDATE_DOCTOR_RESET,
            //     payload: {},
            // });
        } else {
            yield put({
                type: DOCTOR_TYPES.UPDATE_DOCTOR_ERROR,
                payload: response.data,
            });
        }
    } catch (error) {
        // ToastHandle(error, 'danger');
        yield put({
            type: DOCTOR_TYPES.UPDATE_DOCTOR_ERROR,
            payload: error,
        });
    }
}

function* getStatesFunction() {
    try {
        yield put({
            type: DOCTOR_TYPES.GET_STATES_LOADING,
            payload: {},
        });
        const response = yield call(getStatesApi);
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

export function* getAllDoctorsSaga() {
    yield takeEvery(DOCTOR_TYPES.GET_ALL_DOCTORS, getAllDoctorsFunction);
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


function* DoctorSaga() {
    yield all([
        fork(getAllDoctorsSaga),
        fork(createDoctorSaga),
        fork(updateDoctorSaga),
        fork(getStatesSaga),
        fork(getCitiesSaga),
    ]);
}

export default DoctorSaga;
