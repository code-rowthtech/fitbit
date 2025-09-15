import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { Provider } from 'react-redux';
// import store from './redux/store';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './layouts/Layout';
import Login from './pages/Login';
import SignUp from './pages/ForgotPassword/SignUp';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import VerifyOTP from './pages/ForgotPassword/VerifyOTP';
import ChangePassword from './pages/ForgotPassword/ChangePassword';
import Dashboard from './pages/Dashboard';
import Doctors from './pages/Doctors/Doctors';
import Patients from './pages/Patients/Patients';
import PatientDashboard from './pages/Patients/PatientDashboard';
import Notes from './pages/Notes/Notes';
import NotFound from './pages/NotFound';
import { SidebarProvider } from './contexts/SidebarContext';
import './styles/layout.css';

function App() {
  return (
      <Router>
        <SidebarProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/change-password" element={<ChangePassword />} />
          {/* <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Layout pageName="Dashboard">
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } 
          /> */}
          <Route 
            path="/doctors" 
            element={
              <ProtectedRoute>
                <Layout pageName="Doctors">
                  <Doctors />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/patients" 
            element={
              <ProtectedRoute>
                <Layout pageName="Patients">
                  <Patients />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/patient-dashboard/:id" 
            element={
              <ProtectedRoute>
                <Layout pageName="Patient Dashboard">
                  <PatientDashboard />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/notes" 
            element={
              <ProtectedRoute>
                <Layout pageName="Notes">
                  <Notes />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </SidebarProvider>
      </Router>
  );
}

export default App;
