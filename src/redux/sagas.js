import { all } from 'redux-saga/effects';
import authSaga from './auth/saga';
import DoctorSaga from './doctors/saga';
import PatientSaga from './patients/saga';
import NoteSaga from './notes/saga';
import PatientDashboardSaga from './patientsDashboard/saga';

export default function* rootSaga() {
  yield all([
    authSaga(),
    DoctorSaga(),
    PatientSaga(),
    NoteSaga(),
    PatientDashboardSaga(),
  ]);
}
