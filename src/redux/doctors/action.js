import DOCTOR_TYPES from "./constant";

export const getAllDoctors = (data) => ({
    type: DOCTOR_TYPES.GET_ALL_DOCTORS,
    payload: data
})

export const createDoctor = (data) => ({
    type: DOCTOR_TYPES.CREATE_DOCTOR,
    payload: data
})

export const updateDoctor = (data) => ({
    type: DOCTOR_TYPES.UPDATE_DOCTOR,
    payload: data
})

export const resetCreateDoctor = () => ({
    type: DOCTOR_TYPES.CREATE_DOCTOR_RESET
})

export const resetUpdateDoctor = () => ({
    type: DOCTOR_TYPES.UPDATE_DOCTOR_RESET
})

export const getStates = () => ({
    type: DOCTOR_TYPES.GET_STATES
})

export const getCities = (stateId) => ({
    type: DOCTOR_TYPES.GET_CITIES,
    payload: stateId
})

