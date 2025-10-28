import { all } from 'redux-saga/effects';
import authSaga from './auth/saga';
import DoctorSaga from './doctors/saga';
import PatientSaga from './patients/saga';
import ReportSaga from './reports/saga';
import PatientDashboardSaga from './patientsDashboard/saga';
import NotesSaga from './notes/saga';

export default function* rootSaga() {
  yield all([
    authSaga(),
    DoctorSaga(),
    PatientSaga(),
    ReportSaga(),
    PatientDashboardSaga(),
    NotesSaga(),
  ]);
}
