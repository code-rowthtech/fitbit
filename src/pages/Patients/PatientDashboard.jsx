import React, { useEffect, useState } from 'react'
import './PatientDashboard.css'
import { useParams, useSearchParams } from 'react-router-dom';
import PatientDetails from './patientData/PatientDetails';
import ActivityData from './patientData/ActivityData';
import HeartRateData from './patientData/HeartRateData';
import WeightBodyMetrics from './patientData/WeightBodyMetrics';
import ExerciseData from './patientData/ExerciseData';
import NutritionData from './patientData/NutritionData';
import SleepData from './patientData/SleepData';
import PatientReport from './patientData/PatientReport';
import { useDispatch, useSelector } from 'react-redux';
import { getPatientProfile } from '../../redux/patientsDashboard/action';
import CreatePatientModal from '../../components/CreatePatientModal';



const PatientDashboard = () => {
  const dispatch = useDispatch();
  const { id: pathId } = useParams();
  const [searchParams] = useSearchParams();
  const patientId = pathId || searchParams.get('id') || searchParams.get('patientId');
  const userInfo = JSON.parse(localStorage.getItem('user'));
  const UserRole = userInfo?.role;
  const PatientProfileData = useSelector((state) => state?.getPatientProfile?.message?.data);
  const FitbitConnection = useSelector((state) => state?.getPatientProfile?.data?.status);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const [expandedReport, setExpandedReport] = useState(false);
  const [activeTab, setActiveTab] = useState('Activity Data');
  const handleCardExpand = (cardName) => {
    setExpandedCard(expandedCard === cardName ? null : cardName);
  };

  const handleReportExpand = () => {
    setExpandedReport(!expandedReport);
  };


  useEffect(() => {
    if (patientId) {
      dispatch(getPatientProfile({ id: patientId }))
    }
  }, [patientId]);

  useEffect(() => {
    const handleCreatePatientEvent = () => {
      setShowCreateModal(true)
    }

    window.addEventListener('createPatient', handleCreatePatientEvent)
    return () => window.removeEventListener('createPatient', handleCreatePatientEvent)
  }, []);

  const patientData = {
    profileImage: 'https://via.placeholder.com/80x80/52C3BF/ffffff?text=JP',
    fullName: 'John Peterson',
    age: 32,
    dateOfBirth: '1992-03-15',
    gender: 'Male',
    height: '5\'10"',
    weight: '75 kg',
    memberSince: 'Jan 2023',
    timeZone: 'EST (UTC-5)'
  }

  if (patientId === "undefined") {
    return (
      <div className="container-fluid pt-2 d-flex align-items-center" style={{ minHeight: '90vh' }} >
        <div className="row justify-content-center w-100">
          <div className="col-lg-12 col-md-12">
            <p className="text-center">
              {UserRole === "doctor"
                ? "This doctor currently has no patient assigned. Please add one to view patient data."
                : "No patient added yet"
              }
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid patient-dashboard pt-3 px-3">
      {/* Patient Details Section - Hide when report is expanded */}
      {!expandedReport && (
        <div className="row justify-content-center">
          <div className="col-lg-12 col-md-12">
            <PatientDetails
              patientData={PatientProfileData || {}}
              onShowReports={() => setShowReports(!showReports)}
              showReports={showReports}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
        </div>
      )}

      {showReports ? (
        <div className="row justify-content-center">
          <div className="col-lg-12 col-md-12">
            <PatientReport
              patientData={patientData}
              isExpanded={expandedReport}
              onExpand={handleReportExpand}
            />
          </div>
        </div>
      ) : (
        <>
          {FitbitConnection === 203 ? (
            <div className="row justify-content-center">
              <div className="col-lg-12 col-md-12">
                <p className="text-center mt-5 pt-5" style={{ color: '#003465' }}>This patient is not connected to Fitbit yet...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Render active tab first */}
              {activeTab === 'Activity Data' && (!expandedCard || expandedCard === 'activity') && (
                <div className="row justify-content-center">
                  <div className="col-lg-12 col-md-12">
                    <ActivityData
                      isExpanded={expandedCard === 'activity'}
                      onExpand={() => handleCardExpand('activity')}
                    />
                  </div>
                </div>
              )}
              {activeTab === 'Sleep Data' && (!expandedCard || expandedCard === 'sleep') && (
                <div className="row justify-content-center">
                  <div className="col-lg-12 col-md-12">
                    <SleepData
                      isExpanded={expandedCard === 'sleep'}
                      onExpand={() => handleCardExpand('sleep')}
                    />
                  </div>
                </div>
              )}
              {activeTab === 'Heart Rate' && (!expandedCard || expandedCard === 'heartrate') && (
                <div className="row justify-content-center">
                  <div className="col-lg-12 col-md-12">
                    <HeartRateData
                      isExpanded={expandedCard === 'heartrate'}
                      onExpand={() => handleCardExpand('heartrate')}
                    />
                  </div>
                </div>
              )}
              {activeTab === 'Weight & Body Metrics' && (!expandedCard || expandedCard === 'weight') && (
                <div className="row justify-content-center">
                  <div className="col-lg-12 col-md-12">
                    <WeightBodyMetrics
                      isExpanded={expandedCard === 'weight'}
                      onExpand={() => handleCardExpand('weight')}
                    />
                  </div>
                </div>
              )}
              {activeTab === 'Exercise Data' && (!expandedCard || expandedCard === 'exercise') && (
                <div className="row justify-content-center">
                  <div className="col-lg-12 col-md-12">
                    <ExerciseData
                      isExpanded={expandedCard === 'exercise'}
                      onExpand={() => handleCardExpand('exercise')}
                    />
                  </div>
                </div>
              )}
              {activeTab === 'Nutrition' && (!expandedCard || expandedCard === 'nutrition') && (
                <div className="row justify-content-center">
                  <div className="col-lg-12 col-md-12">
                    <NutritionData
                      isExpanded={expandedCard === 'nutrition'}
                      onExpand={() => handleCardExpand('nutrition')}
                    />
                  </div>
                </div>
              )}

              {/* Render other tabs below active tab */}
              {activeTab !== 'Activity Data' && (!expandedCard || expandedCard === 'activity') && (
                <div className="row justify-content-center">
                  <div className="col-lg-12 col-md-12">
                    <ActivityData
                      isExpanded={expandedCard === 'activity'}
                      onExpand={() => handleCardExpand('activity')}
                    />
                  </div>
                </div>
              )}
              {activeTab !== 'Sleep Data' && (!expandedCard || expandedCard === 'sleep') && (
                <div className="row justify-content-center">
                  <div className="col-lg-12 col-md-12">
                    <SleepData
                      isExpanded={expandedCard === 'sleep'}
                      onExpand={() => handleCardExpand('sleep')}
                    />
                  </div>
                </div>
              )}
              {activeTab !== 'Heart Rate' && (!expandedCard || expandedCard === 'heartrate') && (
                <div className="row justify-content-center">
                  <div className="col-lg-12 col-md-12">
                    <HeartRateData
                      isExpanded={expandedCard === 'heartrate'}
                      onExpand={() => handleCardExpand('heartrate')}
                    />
                  </div>
                </div>
              )}
              {activeTab !== 'Weight & Body Metrics' && (!expandedCard || expandedCard === 'weight') && (
                <div className="row justify-content-center">
                  <div className="col-lg-12 col-md-12">
                    <WeightBodyMetrics
                      isExpanded={expandedCard === 'weight'}
                      onExpand={() => handleCardExpand('weight')}
                    />
                  </div>
                </div>
              )}
              {activeTab !== 'Exercise Data' && (!expandedCard || expandedCard === 'exercise') && (
                <div className="row justify-content-center">
                  <div className="col-lg-12 col-md-12">
                    <ExerciseData
                      isExpanded={expandedCard === 'exercise'}
                      onExpand={() => handleCardExpand('exercise')}
                    />
                  </div>
                </div>
              )}
              {activeTab !== 'Nutrition' && (!expandedCard || expandedCard === 'nutrition') && (
                <div className="row justify-content-center">
                  <div className="col-lg-12 col-md-12">
                    <NutritionData
                      isExpanded={expandedCard === 'nutrition'}
                      onExpand={() => handleCardExpand('nutrition')}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}

      <CreatePatientModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
      />
    </div>
  )
}

export default PatientDashboard