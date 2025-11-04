import NOTES_TYPES from "./constant";
import {
  all,
  fork,
  put,
  takeEvery,
  call,
  takeLatest,
} from "redux-saga/effects";
import {
  addNotesApi,
  getNotesApi,
  updateNotesApi,
  deleteNotesApi,
  getAlertsApi,
  getMasterDataApi,
} from "./api";
import { toast } from "react-toastify";

function* addNotesFunction(data) {
  try {
    yield put({ type: NOTES_TYPES.ADD_NOTES_LOADING });

    const response = yield call(addNotesApi, data);
    const status = response?.status || response?.data?.status;
    const message = response?.data?.message;

    if (status === 201) {
      toast.success(message, {
        position: "top-right",
        autoClose: 3000,
      });

      yield put({
        type: NOTES_TYPES.ADD_NOTES_SUCCESS,
        payload: response.data,
      });
    } else {
      toast.error("Unexpected response from server", {
        position: "top-right",
        autoClose: 4000,
      });

      yield put({
        type: NOTES_TYPES.ADD_NOTES_ERROR,
        payload: response,
      });
    }
  } catch (error) {
    toast.error(error || "Failed to add note", {
      position: "top-right",
      autoClose: 4000,
    });
    yield put({
      type: NOTES_TYPES.ADD_NOTES_ERROR,
      payload: error,
    });
  }
}

function* getNotesFunction(action) {
  try {
    yield put({
      type: NOTES_TYPES.GET_NOTES_LOADING,
      payload: { fieldKey: action.payload.fieldKey },
    });
    const response = yield call(getNotesApi, { payload: action.payload });

    if (response?.data && response?.data?.status === 200) {
      yield put({
        type: NOTES_TYPES.GET_NOTES_SUCCESS,
        payload: { fieldKey: action.payload.fieldKey, data: response.data },
      });
    } else {
      yield put({
        type: NOTES_TYPES.GET_NOTES_ERROR,
        payload: { fieldKey: action.payload.fieldKey, error: response.data?.message || 'Failed to fetch notes' },
      });
    }
  } catch (error) {
    yield put({
      type: NOTES_TYPES.GET_NOTES_ERROR,
      payload: { fieldKey: action.payload.fieldKey, error: error?.message },
    });
  }
}

function* updateNotesFunction(data) {
  try {
    yield put({
      type: NOTES_TYPES.UPDATE_NOTES_LOADING,
      payload: {},
    });

    const response = yield call(updateNotesApi, data);
    const status = response?.status || response?.data?.status;
    const message = response?.data?.message;

    if (status === 200) {
      toast.success(message, {
        position: "top-right",
        autoClose: 3000,
      });

      yield put({
        type: NOTES_TYPES.UPDATE_NOTES_SUCCESS,
        payload: response.data,
      });
    } else {
      toast.error("Unexpected response from server", {
        position: "top-right",
        autoClose: 4000,
      });

      yield put({
        type: NOTES_TYPES.UPDATE_NOTES_ERROR,
        payload: response?.data || { message: "Failed to update note" },
      });
    }
  } catch (error) {
    toast.error(error || "Failed to update note", {
      position: "top-right",
      autoClose: 4000,
    });

    yield put({
      type: NOTES_TYPES.UPDATE_NOTES_ERROR,
      payload: { message: error?.message || "An error occurred" },
    });
  }
}

function* deleteNotesFunction(data) {
  try {
    yield put({
      type: NOTES_TYPES.DELETE_NOTES_LOADING,
      payload: {},
    });

    const response = yield call(deleteNotesApi, data);
    const status = response?.status || response?.data?.status;
    const message = response?.data?.message;

    if (status === 200) {
      toast.success(message, {
        position: "top-right",
        autoClose: 3000,
      });

      yield put({
        type: NOTES_TYPES.DELETE_NOTES_SUCCESS,
        payload: response.data,
      });
    } else {
      toast.error("Unexpected response from server", {
        position: "top-right",
        autoClose: 4000,
      });

      yield put({
        type: NOTES_TYPES.DELETE_NOTES_ERROR,
        payload: response?.data || { message: "Failed to delete note" },
      });
    }
  } catch (error) {
    toast.error(error || "Failed to delete note", {
      position: "top-right",
      autoClose: 4000,
    });

    yield put({
      type: NOTES_TYPES.DELETE_NOTES_ERROR,
      payload: { message: error?.message || "An error occurred" },
    });
  }
}

function* getAlertsFunction({ payload }) {
  try {
    yield put({
      type: NOTES_TYPES.GET_ALERTS_LOADING,
      payload: {},
    });
    const response = yield call(getAlertsApi, { payload });

    if (response?.data && response?.data?.status === 200) {
      yield put({
        type: NOTES_TYPES.GET_ALERTS_SUCCESS,
        payload: response.data,
      });
    } else {
      yield put({
        type: NOTES_TYPES.GET_ALERTS_ERROR,
        payload: response.data,
      });
    }
  } catch (error) {
    yield put({
      type: NOTES_TYPES.GET_ALERTS_ERROR,
      payload: { message: error?.message },
    });
  }
}

function* getMasterDataFunction({ payload }) {
  try {
    yield put({
      type: NOTES_TYPES.GET_MASTER_DATA_LOADING,
      payload: {},
    });
    const response = yield call(getMasterDataApi, { payload });

    if (response?.data && response?.data?.status === 200) {
      yield put({
        type: NOTES_TYPES.GET_MASTER_DATA_SUCCESS,
        payload: response.data,
      });
    } else {
      yield put({
        type: NOTES_TYPES.GET_MASTER_DATA_ERROR,
        payload: response.data,
      });
    }
  } catch (error) {
    yield put({
      type: NOTES_TYPES.GET_MASTER_DATA_ERROR,
      payload: { message: error?.message },
    });
  }
}

export function* addNotesSaga() {
  yield takeEvery(NOTES_TYPES.ADD_NOTES, addNotesFunction);
}

export function* getNotesSaga() {
  yield takeEvery(NOTES_TYPES.GET_NOTES, getNotesFunction);
}

export function* updateNotesSaga() {
  yield takeLatest(NOTES_TYPES.UPDATE_NOTES, updateNotesFunction);
}

export function* deleteNotesSaga() {
  yield takeEvery(NOTES_TYPES.DELETE_NOTES, deleteNotesFunction);
}

export function* getAlertsSaga() {
  yield takeEvery(NOTES_TYPES.GET_ALERTS, getAlertsFunction);
}

export function* getMasterDataSaga() {
  yield takeEvery(NOTES_TYPES.GET_MASTER_DATA, getMasterDataFunction);
}

function* NotesSaga() {
  yield all([
    fork(addNotesSaga),
    fork(getNotesSaga),
    fork(updateNotesSaga),
    fork(deleteNotesSaga),
    fork(getAlertsSaga),
    fork(getMasterDataSaga),
  ]);
}

export default NotesSaga;