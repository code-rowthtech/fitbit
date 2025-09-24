import REPORT_TYPES from './constant';
import { all, fork, put, takeEvery, call, takeLatest } from 'redux-saga/effects';
import { getAllReportsApi, getReportByIdApi, createReportApi, updateReportApi, downloadReportApi } from './api';
import { toast } from 'react-toastify';

function* getAllReportsFunction({ payload }) {
    try {
        yield put({
            type: REPORT_TYPES.GET_ALL_REPORTS_LOADING,
            payload: {},
        });
        const response = yield call(getAllReportsApi, { payload });

        if (response?.data && response?.data?.status === 200) {
            yield put({
                type: REPORT_TYPES.GET_ALL_REPORTS_SUCCESS,
                payload: response.data,
            });
        } else {
            yield put({
                type: REPORT_TYPES.GET_ALL_REPORTS_ERROR,
                payload: response.data,
            });
        }
    } catch (error) {
        yield put({
            type: REPORT_TYPES.GET_ALL_REPORTS_ERROR,
            payload: { message: error?.message },
        });
    }
}

function* getReportByIdFunction({ payload }) {
    try {
        yield put({
            type: REPORT_TYPES.GET_REPORT_BY_ID_LOADING,
            payload: {},
        });
        const response = yield call(getReportByIdApi, { payload });

        if (response?.data && response?.data?.status === 200) {
            yield put({
                type: REPORT_TYPES.GET_REPORT_BY_ID_SUCCESS,
                payload: response.data,
            });
        } else {
            yield put({
                type: REPORT_TYPES.GET_REPORT_BY_ID_ERROR,
                payload: response.data,
            });
        }
    } catch (error) {
        yield put({
            type: REPORT_TYPES.GET_REPORT_BY_ID_ERROR,
            payload: { message: error?.message },
        });
    }
}

function* createReportFunction(data) {
    try {
        yield put({
            type: REPORT_TYPES.CREATE_REPORT_LOADING,
            payload: {},
        });
        const response = yield call(createReportApi, data);
        if (response.data.status === 201) {
            yield put({
                type: REPORT_TYPES.CREATE_REPORT_SUCCESS,
                payload: response.data,
            });
        } else {
            yield put({
                type: REPORT_TYPES.CREATE_REPORT_ERROR,
                payload: response.data,
            });
        }
    } catch (error) {
        yield put({
            type: REPORT_TYPES.CREATE_REPORT_ERROR,
            payload: error,
        });
    }
}

function* updateReportFunction(data) {
    try {
        yield put({
            type: REPORT_TYPES.UPDATE_REPORT_LOADING,
            payload: {},
        });
        const response = yield call(updateReportApi, data);
        if (response.data.report.status === 200) {
            yield put({
                type: REPORT_TYPES.UPDATE_REPORT_SUCCESS,
                payload: response.data,
            });
        } else {
            yield put({
                type: REPORT_TYPES.UPDATE_REPORT_ERROR,
                payload: response.data,
            });
        }
    } catch (error) {
        yield put({
            type: REPORT_TYPES.UPDATE_REPORT_ERROR,
            payload: error,
        });
    }
}

export function* getAllReportsSaga() {
    yield takeEvery(REPORT_TYPES.GET_ALL_REPORTS, getAllReportsFunction);
}

export function* getReportByIdSaga() {
    yield takeEvery(REPORT_TYPES.GET_REPORT_BY_ID, getReportByIdFunction);
}

export function* createReportSaga() {
    yield takeEvery(REPORT_TYPES.CREATE_REPORT, createReportFunction);
}

export function* updateReportSaga() {
    yield takeLatest(REPORT_TYPES.UPDATE_REPORT, updateReportFunction);
}

function* downloadReportFunction({ payload }) {
    try {
        yield put({
            type: REPORT_TYPES.DOWNLOAD_REPORT_LOADING,
            payload: {},
        });
        const response = yield call(downloadReportApi, { payload });

        if (response?.status === 200 && response.data) {
            // Handle download directly in saga
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(response.data);
            link.download = `report-${payload.month}.csv`;
            link.click();
            
            yield put({
                type: REPORT_TYPES.DOWNLOAD_REPORT_SUCCESS,
                payload: { success: true },
            });
        } else {
            yield put({
                type: REPORT_TYPES.DOWNLOAD_REPORT_ERROR,
                payload: { message: 'Download failed' },
            });
        }
    } catch (error) {
        yield put({
            type: REPORT_TYPES.DOWNLOAD_REPORT_ERROR,
            payload: { message: error?.message },
        });
    }
}

export function* downloadReportSaga() {
    yield takeEvery(REPORT_TYPES.DOWNLOAD_REPORT, downloadReportFunction);
}

function* ReportSaga() {
    yield all([
        fork(getAllReportsSaga),
        fork(getReportByIdSaga),
        fork(createReportSaga),
        fork(updateReportSaga),
        fork(downloadReportSaga),
    ]);
}

export default ReportSaga;