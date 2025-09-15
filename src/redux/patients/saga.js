import PATIENT_TYPES from './constant';
import { all, fork, put, takeEvery, call, takeLatest } from 'redux-saga/effects';
import { getAllPatientsApi, createPatientApi, updatePatientApi, getPatientByIdApi, getAllergiesApi } from './api';

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
                payload: response?.data || { message: 'Failed to fetch patient data' },
            });
        }
    } catch (error) {
        yield put({
            type: PATIENT_TYPES.GET_PATIENT_BY_ID_ERROR,
            payload: { message: error?.message || 'An error occurred' },
        });
    }
}

function* createPatientFunction(data) {
    try {
        yield put({
            type: PATIENT_TYPES.CREATE_PATIENT_LOADING,
            payload: {},
        });
        const response = yield call(createPatientApi, data);
        if (response?.data?.patient?.status === 201) {
            yield put({
                type: PATIENT_TYPES.CREATE_PATIENT_SUCCESS,
                payload: response.data,
            });
        } else {
            yield put({
                type: PATIENT_TYPES.CREATE_PATIENT_ERROR,
                payload: response?.data || { message: 'Failed to create patient' },
            });
        }
    } catch (error) {
        yield put({
            type: PATIENT_TYPES.CREATE_PATIENT_ERROR,
            payload: { message: error?.message || 'An error occurred' },
        });
    }
}

function* updatePatientFunction(data) {
    try {
        yield put({
            type: PATIENT_TYPES.UPDATE_PATIENT_LOADING,
            payload: {},
        });
        const response = yield call(updatePatientApi, data);
        if (response?.data?.patient?.status === 200) {
            yield put({
                type: PATIENT_TYPES.UPDATE_PATIENT_SUCCESS,
                payload: response.data,
            });
        } else {
            yield put({
                type: PATIENT_TYPES.UPDATE_PATIENT_ERROR,
                payload: response?.data || { message: 'Failed to update patient' },
            });
        }
    } catch (error) {
        yield put({
            type: PATIENT_TYPES.UPDATE_PATIENT_ERROR,
            payload: { message: error?.message || 'An error occurred' },
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


function* PatientSaga() {
    yield all([
        fork(getAllPatientsSaga),
        fork(createPatientSaga),
        fork(updatePatientSaga),
        fork(getPatientByIdSaga),
        fork(getAllergiesSaga),
    ]);
}

export default PatientSaga;
