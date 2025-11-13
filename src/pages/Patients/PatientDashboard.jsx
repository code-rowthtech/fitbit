import React, { useEffect, useState } from "react";
import "./PatientDashboard.css";
import { useParams, useSearchParams } from "react-router-dom";
import PatientDetails from "./patientData/PatientDetails";
import ActivityData from "./patientData/ActivityData";
import HeartRateData from "./patientData/HeartRateData";
import ExerciseData from "./patientData/ExerciseData";
import NutritionData from "./patientData/NutritionData";
import SleepData from "./patientData/SleepData";
import PatientReport from "./patientData/PatientReport";
import PatientNotes from "./patientData/PatientNotes";
import { useDispatch, useSelector } from "react-redux";
import CreatePatientModal from "../../components/CreatePatientModal";
import { getPatientById } from "../../redux/actions";

const PatientDashboard = () => {
  const dispatch = useDispatch();
  const { id: pathId } = useParams();
  const [searchParams] = useSearchParams();
  const patientId =
    pathId || searchParams.get("id") || searchParams.get("patientId");
  const userInfo = JSON.parse(localStorage.getItem("user"));
  const UserRole = userInfo?.role;
  const FitbitConnection = useSelector(
    (state) => state?.getPatientByIdReducer?.data?.data?.patient?.fitbitStatus
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const [expandedSubCard, setExpandedSubCard] = useState(null);
  const [expandedReport, setExpandedReport] = useState(false);
  const [activeTab, setActiveTab] = useState("Activity Data");
  const id = patientId;

  const handleCardExpand = (cardName, subCardName = null) => {
    if (expandedCard === cardName) {
      setExpandedCard(null);
      setExpandedSubCard(null);
    } else {
      setExpandedCard(cardName);
      setExpandedSubCard(subCardName);
      const cardToTabMap = {
        "activity": "Activity Data",
        "sleep": "Sleep Data",
        "heartrate": "Heart Rate And Body Metrics",
        "exercise": "Exercise Data",
        "nutrition": "Nutrition"
      };
      setActiveTab(cardToTabMap[cardName] || activeTab);
    }
  };

  const handleExpandedCardSwitch = (cardName) => {
    setExpandedCard(cardName);
  };

  const handleTabChange = (newTab) => {
    const wasExpanded = !!expandedCard;
    setActiveTab(newTab);
    if (wasExpanded) {
      const tabToCardMap = {
        "Activity Data": "activity",
        "Sleep Data": "sleep",
        "Heart Rate And Body Metrics": "heartrate",
        "Exercise Data": "exercise",
        "Nutrition": "nutrition"
      };
      setExpandedCard(tabToCardMap[newTab] || null);
      setExpandedSubCard(null);
    }
  };

  const handleReportExpand = () => {
    setExpandedReport(!expandedReport);
  };

  useEffect(() => {
    // Reset all states when patient changes
    setShowReports(false);
    setShowNotes(false);
    setExpandedCard(null);
    setExpandedReport(false);
    setActiveTab("Activity Data");
    
    dispatch(getPatientById(id));
  }, [id, dispatch]);

  useEffect(() => {
    const handleCreatePatientEvent = () => {
      setShowCreateModal(true);
    };

    window.addEventListener("createPatient", handleCreatePatientEvent);
    return () =>
      window.removeEventListener("createPatient", handleCreatePatientEvent);
  }, []);

 

  if (patientId === "undefined") {
    return (
      <div
        className="container-fluid pt-2 d-flex align-items-center"
        style={{ minHeight: "90vh" }}
      >
        <div className="row justify-content-center w-100">
          <div className="col-lg-12 col-md-12">
            <p className="text-center">
              {UserRole === "doctor"
                ? "This doctor currently has no patient assigned. Please add one to view patient data."
                : "No patient added yet"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div key={patientId} className="container-fluid patient-dashboard pt-3 px-3">
      {/* Patient Details Section - Hide when report is expanded */}
      {!expandedReport && (
        <div className="row justify-content-center">
          <div className="col-lg-12 col-md-12 mb-1">
            <PatientDetails
              onShowReports={() => setShowReports(!showReports)}
              showReports={showReports}
              onShowNotes={() => setShowNotes(!showNotes)}
              showNotes={showNotes}
              activeTab={activeTab}
              setActiveTab={handleTabChange}
              accordionOpen={!!expandedCard}
            />
          </div>
        </div>
      )}

      {showReports ? (
        <div className="row justify-content-center">
          <div className="col-lg-12 col-md-12 mb-1">
            <PatientReport
              isExpanded={expandedReport}
              onExpand={handleReportExpand}
            />
          </div>
        </div>
      ) : showNotes ? (
        <div className="row justify-content-center">
          <div className="col-lg-12 col-md-12 mb-1">
            <PatientNotes />
          </div>
        </div>
      ) : (
        <>
          {FitbitConnection === "Not Connected" ||
          FitbitConnection === "Pending" ? (
            <div className="row justify-content-center">
              <div className="col-lg-12 col-md-12 mb-1">
                <p
                  className="text-center mt-5 pt-5"
                  style={{ color: "#003465" }}
                >
                  This patient is not connected to Fitbit yet...
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Render active tab first */}
              {activeTab === "Activity Data" &&
                (!expandedCard || expandedCard === "activity") && (
                  <div className="row justify-content-center">
                    <div className="col-lg-12 col-md-12 mb-1">
                      <ActivityData
                        isExpanded={expandedCard === "activity"}
                        onExpand={(subCard) => handleCardExpand("activity", subCard)}
                        initialExpandedCard={expandedCard === "activity" ? (expandedSubCard || "steps") : null}
                      />
                    </div>
                  </div>
                )}
              {activeTab === "Sleep Data" &&
                (!expandedCard || expandedCard === "sleep") && (
                  <div className="row justify-content-center">
                    <div className="col-lg-12 col-md-12 mb-1">
                      <SleepData
                        isExpanded={expandedCard === "sleep"}
                        onExpand={(subCard) => handleCardExpand("sleep", subCard)}
                        initialExpandedCard={expandedCard === "sleep" ? (expandedSubCard || "sleepStages") : null}
                      />
                    </div>
                  </div>
                )}
              {activeTab === "Heart Rate And Body Metrics" &&
                (!expandedCard || expandedCard === "heartrate") && (
                  <div className="row justify-content-center">
                    <div className="col-lg-12 col-md-12 mb-1">
                      <HeartRateData
                        isExpanded={expandedCard === "heartrate"}
                        onExpand={(subCard) => handleCardExpand("heartrate", subCard)}
                        initialExpandedCard={expandedCard === "heartrate" ? (expandedSubCard || "restingHeartRate") : null}
                      />
                    </div>
                  </div>
                )}
             
              {activeTab === "Exercise Data" &&
                (!expandedCard || expandedCard === "exercise") && (
                  <div className="row justify-content-center">
                    <div className="col-lg-12 col-md-12 mb-1">
                      <ExerciseData
                        isExpanded={expandedCard === "exercise"}
                        onExpand={(subCard) => handleCardExpand("exercise", subCard)}
                        initialExpandedCard={expandedCard === "exercise" ? (expandedSubCard || "sessions") : null}
                      />
                    </div>
                  </div>
                )}
              {activeTab === "Nutrition" &&
                (!expandedCard || expandedCard === "nutrition") && (
                  <div className="row justify-content-center">
                    <div className="col-lg-12 col-md-12 mb-1">
                      <NutritionData
                        isExpanded={expandedCard === "nutrition"}
                        onExpand={(subCard) => handleCardExpand("nutrition", subCard)}
                        initialExpandedCard={expandedCard === "nutrition" ? (expandedSubCard || "calories") : null}
                      />
                    </div>
                  </div>
                )}

              {/* Render other tabs below active tab */}
              {activeTab !== "Activity Data" &&
                (!expandedCard || expandedCard === "activity") && (
                  <div className="row justify-content-center">
                    <div className="col-lg-12 col-md-12 mb-1">
                      <ActivityData
                        isExpanded={expandedCard === "activity"}
                        onExpand={(subCard) => handleCardExpand("activity", subCard)}
                        initialExpandedCard={null}
                      />
                    </div>
                  </div>
                )}
              {activeTab !== "Sleep Data" &&
                (!expandedCard || expandedCard === "sleep") && (
                  <div className="row justify-content-center">
                    <div className="col-lg-12 col-md-12 mb-1">
                      <SleepData
                        isExpanded={expandedCard === "sleep"}
                        onExpand={(subCard) => handleCardExpand("sleep", subCard)}
                        initialExpandedCard={null}
                      />
                    </div>
                  </div>
                )}
              {activeTab !== "Heart Rate And Body Metrics" &&
                (!expandedCard || expandedCard === "heartrate") && (
                  <div className="row justify-content-center">
                    <div className="col-lg-12 col-md-12 mb-1">
                      <HeartRateData
                        isExpanded={expandedCard === "heartrate"}
                        onExpand={(subCard) => handleCardExpand("heartrate", subCard)}
                        initialExpandedCard={null}
                      />
                    </div>
                  </div>
                )}
              
              {activeTab !== "Exercise Data" &&
                (!expandedCard || expandedCard === "exercise") && (
                  <div className="row justify-content-center">
                    <div className="col-lg-12 col-md-12 mb-1">
                      <ExerciseData
                        isExpanded={expandedCard === "exercise"}
                        onExpand={(subCard) => handleCardExpand("exercise", subCard)}
                        initialExpandedCard={null}
                      />
                    </div>
                  </div>
                )}
              {activeTab !== "Nutrition" &&
                (!expandedCard || expandedCard === "nutrition") && (
                  <div className="row justify-content-center">
                    <div className="col-lg-12 col-md-12">
                      <NutritionData
                        isExpanded={expandedCard === "nutrition"}
                        onExpand={(subCard) => handleCardExpand("nutrition", subCard)}
                        initialExpandedCard={null}
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
  );
};

export default PatientDashboard;
