import REPORT_TYPES from "./constant";
import {
  all,
  fork,
  put,
  takeEvery,
  call,
  takeLatest,
} from "redux-saga/effects";
import {
  getAllReportsApi,
  getReportByIdApi,
  createReportApi,
  updateReportApi,
  downloadReportApi,
  getYearlyReportsApi,
  downloadYearlyReportApi,
} from "./api";
import { toast } from "react-toastify";

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
    const errorMessage =
      error?.response?.data?.message || error || "An error occurred";
    toast.error(errorMessage);
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
    const errorMessage =
      error?.response?.data?.message || error?.message || "An error occurred";
    toast.error(errorMessage);
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
      const link = document.createElement("a");
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
        payload: { message: "Download failed" },
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

function* getYearlyReportsFunction({ payload }) {
  try {
    yield put({
      type: REPORT_TYPES.GET_YEARLY_REPORTS_LOADING,
      payload: {},
    });
    const response = yield call(getYearlyReportsApi, { payload });

    if (response?.data && response?.data?.status === 200) {
      yield put({
        type: REPORT_TYPES.GET_YEARLY_REPORTS_SUCCESS,
        payload: response.data,
      });
    } else {
      yield put({
        type: REPORT_TYPES.GET_YEARLY_REPORTS_ERROR,
        payload: response.data,
      });
    }
  } catch (error) {
    yield put({
      type: REPORT_TYPES.GET_YEARLY_REPORTS_ERROR,
      payload: { message: error?.message },
    });
  }
}

function* downloadYearlyReportFunction({ payload }) {
  try {
    yield put({
      type: REPORT_TYPES.DOWNLOAD_YEARLY_REPORT_LOADING,
      payload: {},
    });
    const response = yield call(downloadYearlyReportApi, { payload });

    if (response?.status === 200 && response.data) {
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(response.data);
      link.download = `yearly-report-${payload.year}.csv`;
      link.click();

      yield put({
        type: REPORT_TYPES.DOWNLOAD_YEARLY_REPORT_SUCCESS,
        payload: { success: true },
      });
    } else {
      yield put({
        type: REPORT_TYPES.DOWNLOAD_YEARLY_REPORT_ERROR,
        payload: { message: "Download failed" },
      });
    }
  } catch (error) {
    yield put({
      type: REPORT_TYPES.DOWNLOAD_YEARLY_REPORT_ERROR,
      payload: { message: error?.message },
    });
  }
}

export function* getYearlyReportsSaga() {
  yield takeEvery(REPORT_TYPES.GET_YEARLY_REPORTS, getYearlyReportsFunction);
}

export function* downloadYearlyReportSaga() {
  yield takeEvery(
    REPORT_TYPES.DOWNLOAD_YEARLY_REPORT,
    downloadYearlyReportFunction
  );
}

function* ReportSaga() {
  yield all([
    fork(getAllReportsSaga),
    fork(getReportByIdSaga),
    fork(createReportSaga),
    fork(updateReportSaga),
    fork(downloadReportSaga),
    fork(getYearlyReportsSaga),
    fork(downloadYearlyReportSaga),
  ]);
}

export default ReportSaga;
