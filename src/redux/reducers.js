import { combineReducers } from 'redux';

import Auth from './auth/reducers';
import { createDoctorReducer, getAllDoctors, updateDoctor, getStatesReducer, getCitiesReducer, getSkillsReducer, createSkillsReducer, getCategoryReducer, getSpecializationsReducer, createSpecializationsReducer } from './doctors/reducer';
import { createAllergiesReducer, createPatientReducer, getAllergiesReducer, getAllPatients, getPatientByIdReducer, updatePatient } from './patients/reducer';
import { createNoteReducer, getAllNotes, getNoteById, updateNoteReducer } from './notes/reducer';
import { connectToFitbit, getPatientActivity, getPatientBodyFat, getPatientDevices, getPatientFood, getPatientGpsTracking, getPatientHeart, getPatientProfile, getPatientSleep, getPatientWater, getPatientWeight } from './patientsDashboard/reducer';

export default combineReducers({
    // Auth
    Auth,

    // Doctors
    createDoctorReducer,
    getAllDoctors,
    updateDoctor,
    getStatesReducer,
    getCitiesReducer,
    getSkillsReducer,
    createSkillsReducer,
    getCategoryReducer,
    getSpecializationsReducer,
    createSpecializationsReducer,
    
    //Patients
    createPatientReducer,
    getAllPatients,
    updatePatient,
    getPatientByIdReducer,
    getAllergiesReducer,
    createAllergiesReducer,

    // Notes
    getAllNotes,
    getNoteById,
    createNoteReducer,
    updateNoteReducer,

    // Patient-Dashboard
    getPatientProfile,
    getPatientActivity,
    getPatientSleep,
    getPatientWater,
    getPatientHeart,
    getPatientWeight,
    getPatientBodyFat,
    getPatientFood,
    getPatientDevices,
    getPatientGpsTracking,
    connectToFitbit,
});
