import * as URL from "../../constants/endpoint"
import { APICore } from "../../helpers/api/apiCore"
const api = new APICore()

export function getAllNotesApi(data) {
    const params = new URLSearchParams();
    return api.get(`${URL.GET_NOTES}?${params.toString()}`);
}

export function getNoteByIdApi(data) {
    return api.get(`${URL.GET_NOTE}/${data.payload.noteId}`);
}

export function createNoteApi(data) {
    return api.create(URL.NOTES, data.payload)
}

export function updateNoteApi(data) {
    return api.update(`${URL.UPDATE_NOTE}/${data.payload.noteId}`, data.payload.body)
}

