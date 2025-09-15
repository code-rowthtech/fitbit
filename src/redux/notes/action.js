import NOTE_TYPES from "./constant";

export const getAllNotes = (data) => ({
    type: NOTE_TYPES.GET_ALL_NOTES,
    payload: data
})

export const getNoteById = (data) => ({
    type: NOTE_TYPES.GET_NOTE_BY_ID,
    payload: data
})

export const createNote = (data) => ({
    type: NOTE_TYPES.CREATE_NOTE,
    payload: data
})

export const updateNote = (data) => ({
    type: NOTE_TYPES.UPDATE_NOTE,
    payload: data
})

export const resetCreateNote = () => ({
    type: NOTE_TYPES.CREATE_NOTE_RESET
})

export const resetUpdateNote = () => ({
    type: NOTE_TYPES.UPDATE_NOTE_RESET
})

