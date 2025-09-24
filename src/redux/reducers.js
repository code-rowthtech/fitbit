import { combineReducers } from 'redux';

import Auth from './auth/reducers';
import { createDoctorReducer, getAllDoctors, updateDoctor, getStatesReducer, getCitiesReducer, getSkillsReducer, createSkillsReducer, getCategoryReducer, getSpecializationsReducer, createSpecializationsReducer, getSpecializationsCategoryReducer } from './doctors/reducer';
import { createAllergiesReducer, createPatientReducer, getAllergiesReducer, getAllPatients, getPatientByIdReducer, updatePatient } from './patients/reducer';
import { createReportReducer, getAllReports, getReportById, updateReportReducer, downloadReportReducer } from './reports/reducer';
import { connectToFitbit, getFilterData, getPatientActivity, getPatientBodyFat, getPatientDevices, getPatientFood, getPatientGpsTracking, getPatientHeart, getPatientProfile, getPatientSleep, getPatientWater, getPatientWeight } from './patientsDashboard/reducer';

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
    getSpecializationsCategoryReducer,
    
    //Patients
    createPatientReducer,
    getAllPatients,
    updatePatient,
    getPatientByIdReducer,
    getAllergiesReducer,
    createAllergiesReducer,

    // Reports
    getAllReports,
    getReportById,
    createReportReducer,
    updateReportReducer,
    downloadReportReducer,

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
    getFilterData,
});
