import NOTES_TYPES from "./constant";

export const addNotes = (data) => ({
  type: NOTES_TYPES.ADD_NOTES,
  payload: data,
});

export const getNotes = (data, fieldKey) => ({
  type: NOTES_TYPES.GET_NOTES,
  payload: { ...data, fieldKey },
});

export const updateNotes = (data) => ({
  type: NOTES_TYPES.UPDATE_NOTES,
  payload: data,
});

export const deleteNotes = (data) => ({
  type: NOTES_TYPES.DELETE_NOTES,
  payload: data,
});

export const resetAddNotes = () => ({
  type: NOTES_TYPES.ADD_NOTES_RESET,
});

export const resetUpdateNotes = () => ({
  type: NOTES_TYPES.UPDATE_NOTES_RESET,
});

export const resetDeleteNotes = () => ({
  type: NOTES_TYPES.DELETE_NOTES_RESET,
});

export const getAlerts = (data) => ({
  type: NOTES_TYPES.GET_ALERTS,
  payload: data,
});

export const resetGetAlerts = () => ({
  type: NOTES_TYPES.GET_ALERTS_RESET,
});

export const getMasterData = (data) => ({
  type: NOTES_TYPES.GET_MASTER_DATA,
  payload: data,
});

export const resetGetMasterData = () => ({
  type: NOTES_TYPES.GET_MASTER_DATA_RESET,
});