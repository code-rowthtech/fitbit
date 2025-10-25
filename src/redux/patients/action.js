import PATIENT_TYPES from "./constant";

export const getAllPatients = (data) => ({
  type: PATIENT_TYPES.GET_ALL_PATIENTS,
  payload: data,
});

export const getPatientById = (data) => ({
  type: PATIENT_TYPES.GET_PATIENT_BY_ID,
  payload: data,
});

export const createPatient = (data) => {
  // console.log("Action - Creating patient with data:", data);
  return {
    type: PATIENT_TYPES.CREATE_PATIENT,
    payload: data,
  };
};

export const updatePatient = (data) => ({
  type: PATIENT_TYPES.UPDATE_PATIENT,
  payload: data,
});

export const resetCreatePatient = () => ({
  type: PATIENT_TYPES.CREATE_PATIENT_RESET,
});

export const resetUpdatePatient = () => ({
  type: PATIENT_TYPES.UPDATE_PATIENT_RESET,
});

export const getAllergies = () => ({
  type: PATIENT_TYPES.GET_ALLERGIES,
});

export const createAllergies = (data) => ({
  type: PATIENT_TYPES.CREATE_ALLERGIES,
  payload: data,
});

export const resetCreateAllergies = () => ({
  type: PATIENT_TYPES.CREATE_ALLERGIES_RESET,
});
