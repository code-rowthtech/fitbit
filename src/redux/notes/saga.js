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

function* getNotesFunction({ payload }) {
  try {
    yield put({
      type: NOTES_TYPES.GET_NOTES_LOADING,
      payload: {},
    });
    const response = yield call(getNotesApi, { payload });

    if (response?.data && response?.data?.status === 200) {
      yield put({
        type: NOTES_TYPES.GET_NOTES_SUCCESS,
        payload: response.data,
      });
    } else {
      yield put({
        type: NOTES_TYPES.GET_NOTES_ERROR,
        payload: response.data,
      });
    }
  } catch (error) {
    yield put({
      type: NOTES_TYPES.GET_NOTES_ERROR,
      payload: { message: error?.message },
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

function* NotesSaga() {
  yield all([
    fork(addNotesSaga),
    fork(getNotesSaga),
    fork(updateNotesSaga),
    fork(deleteNotesSaga),
  ]);
}

export default NotesSaga;