import DOCTOR_TYPES from "./constant";

export const getAllDoctors = (data) => (
  {
    type: DOCTOR_TYPES.GET_ALL_DOCTORS,
    payload: data,
  }
);

export const getSingleDoctor = (data) => ({
  type: DOCTOR_TYPES.GET_SINGLE_DOCTOR,
  payload: data,
});

export const createDoctor = (data) => ({
  type: DOCTOR_TYPES.CREATE_DOCTOR,
  payload: data,
});

export const updateDoctor = (data) => ({
  type: DOCTOR_TYPES.UPDATE_DOCTOR,
  payload: data,
});

export const resetCreateDoctor = () => ({
  type: DOCTOR_TYPES.CREATE_DOCTOR_RESET,
});

export const resetUpdateDoctor = () => ({
  type: DOCTOR_TYPES.UPDATE_DOCTOR_RESET,
});

export const getStates = (data) => ({
  type: DOCTOR_TYPES.GET_STATES,
  payload: data,
});

export const getCities = (stateId) => ({
  type: DOCTOR_TYPES.GET_CITIES,
  payload: stateId,
});

export const getSkills = (data) => ({
  type: DOCTOR_TYPES.GET_SKILLS,
  payload: data,
});

export const createSkills = (data) => ({
  type: DOCTOR_TYPES.CREATE_SKILLS,
  payload: data,
});

export const getCategory = (data) => ({
  type: DOCTOR_TYPES.GET_CATEGORY,
  payload: data,
});

export const getSpecializations = (data) => ({
  type: DOCTOR_TYPES.GET_SPECIALIZATIONS,
  payload: data,
});

export const createSpecializations = (data) => ({
  type: DOCTOR_TYPES.CREATE_SPECIALIZATIONS,
  payload: data,
});

export const getSpecializationsCategory = (data) => ({
  type: DOCTOR_TYPES.GET_SPECIALIZATIONS_CATEGORY,
  payload: data,
});

export const createDegree = (data) => ({
  type: DOCTOR_TYPES.CREATE_DEGREE,
  payload: data,
});

export const getQualification = (data) => ({
  type: DOCTOR_TYPES.GET_QUALIFICATION,
  payload: data,
});
