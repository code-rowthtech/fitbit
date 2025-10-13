import { combineReducers } from "redux";

import Auth from "./auth/reducers";
import {
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
  createDegreeReducer,
  getQualificationReducer,
} from "./doctors/reducer";
import {
  createAllergiesReducer,
  createPatientReducer,
  getAllergiesReducer,
  getAllPatients,
  getPatientByIdReducer,
  updatePatient,
} from "./patients/reducer";
import {
  createReportReducer,
  getAllReports,
  getReportById,
  updateReportReducer,
  downloadReportReducer,
  getYearlyReports,
  downloadYearlyReportReducer,
} from "./reports/reducer";
import {
  connectToFitbit,
  getFilterData,
  getPatientActiveMin,
  getPatientActivity,
  getPatientBodyFat,
  getPatientCaloriesBurned,
  getPatientCaloriesConsumed,
  getPatientDevices,
  getPatientDistance,
  getPatientFood,
  getPatientGpsTracking,
  getPatientHeart,
  getPatientHeartRate,
  getPatientProfile,
  getPatientSleep,
  getPatientSleepEfficiency,
  getPatientSleepStages,
  getPatientWater,
  getPatientWeight,
} from "./patientsDashboard/reducer";

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
  createDegreeReducer,
  getQualificationReducer,

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
  getYearlyReports,
  downloadYearlyReportReducer,

  // Patient-Dashboard
  getPatientProfile,
  getPatientActivity,
  getPatientSleep,
  getPatientSleepStages,
  getPatientSleepEfficiency,
  getPatientCaloriesBurned,
  getPatientDistance,
  getPatientActiveMin,
  getPatientWater,
  getPatientHeart,
  getPatientWeight,
  getPatientBodyFat,
  getPatientFood,
  getPatientDevices,
  getPatientGpsTracking,
  connectToFitbit,
  getFilterData,
  getPatientHeartRate,
  getPatientCaloriesConsumed,
});
