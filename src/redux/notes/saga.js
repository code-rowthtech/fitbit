import NOTE_TYPES from './constant';
import { all, fork, put, takeEvery, call, takeLatest } from 'redux-saga/effects';
import { getAllNotesApi, getNoteByIdApi, createNoteApi, updateNoteApi } from './api';
import { toast } from 'react-toastify';

function* getAllNotesFunction({ payload }) {
    try {
        yield put({
            type: NOTE_TYPES.GET_ALL_NOTES_LOADING,
            payload: {},
        });
        const response = yield call(getAllNotesApi, { payload });

        if (response?.data && response?.data?.status === 200) {
            yield put({
                type: NOTE_TYPES.GET_ALL_NOTES_SUCCESS,
                payload: response.data,
            });
        } else {
            yield put({
                type: NOTE_TYPES.GET_ALL_NOTES_ERROR,
                payload: response.data,
            });
        }
    } catch (error) {
        yield put({
            type: NOTE_TYPES.GET_ALL_NOTES_ERROR,
            payload: { message: error?.message },
        });
    }
}

function* getNoteByIdFunction({ payload }) {
    try {
        yield put({
            type: NOTE_TYPES.GET_NOTE_BY_ID_LOADING,
            payload: {},
        });
        const response = yield call(getNoteByIdApi, { payload });

        if (response?.data && response?.data?.status === 200) {
            yield put({
                type: NOTE_TYPES.GET_NOTE_BY_ID_SUCCESS,
                payload: response.data,
            });
        } else {
            yield put({
                type: NOTE_TYPES.GET_NOTE_BY_ID_ERROR,
                payload: response.data,
            });
        }
    } catch (error) {
        yield put({
            type: NOTE_TYPES.GET_NOTE_BY_ID_ERROR,
            payload: { message: error?.message },
        });
    }
}

function* createNoteFunction(data) {
    try {
        yield put({
            type: NOTE_TYPES.CREATE_NOTE_LOADING,
            payload: {},
        });
        const response = yield call(createNoteApi, data);
        if (response.data.note.status === 201) {
            yield put({
                type: NOTE_TYPES.CREATE_NOTE_SUCCESS,
                payload: response.data,
            });
        } else {
            yield put({
                type: NOTE_TYPES.CREATE_NOTE_ERROR,
                payload: response.data,
            });
        }
    } catch (error) {
        yield put({
            type: NOTE_TYPES.CREATE_NOTE_ERROR,
            payload: error,
        });
    }
}

function* updateNoteFunction(data) {
    try {
        yield put({
            type: NOTE_TYPES.UPDATE_NOTE_LOADING,
            payload: {},
        });
        const response = yield call(updateNoteApi, data);
        if (response.data.note.status === 200) {
            yield put({
                type: NOTE_TYPES.UPDATE_NOTE_SUCCESS,
                payload: response.data,
            });
        } else {
            yield put({
                type: NOTE_TYPES.UPDATE_NOTE_ERROR,
                payload: response.data,
            });
        }
    } catch (error) {
        yield put({
            type: NOTE_TYPES.UPDATE_NOTE_ERROR,
            payload: error,
        });
    }
}

export function* getAllNotesSaga() {
    yield takeEvery(NOTE_TYPES.GET_ALL_NOTES, getAllNotesFunction);
}

export function* getNoteByIdSaga() {
    yield takeEvery(NOTE_TYPES.GET_NOTE_BY_ID, getNoteByIdFunction);
}

export function* createNoteSaga() {
    yield takeEvery(NOTE_TYPES.CREATE_NOTE, createNoteFunction);
}

export function* updateNoteSaga() {
    yield takeLatest(NOTE_TYPES.UPDATE_NOTE, updateNoteFunction);
}

function* NoteSaga() {
    yield all([
        fork(getAllNotesSaga),
        fork(getNoteByIdSaga),
        fork(createNoteSaga),
        fork(updateNoteSaga),
    ]);
}

export default NoteSaga;
