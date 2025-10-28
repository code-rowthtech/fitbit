import React, { useEffect, useState } from "react";
import "./PatientDetails.css";
import {
  FaChevronDown,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { FiPhone } from "react-icons/fi";
import { MdOutlineMailOutline } from "react-icons/md";
import { GrLocation } from "react-icons/gr";
import { TbUserEdit } from "react-icons/tb";
import UpdatePatientModal from "../../../components/UpdatePatientModal";
import stepsIcon from "../../../assets/images/PatientDashboard/Steps.png";
import heartRateIcon from "../../../assets/images/PatientDashboard/heart rate.png";
import sleepIcon from "../../../assets/images/PatientDashboard/Sleep stages.png";
import waterIntakeIcon from "../../../assets/images/PatientDashboard/water intake.png";
import { getPatientById } from "../../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { connectToFitbit } from "../../../redux/patientsDashboard/action";

const PatientDetails = ({
  onShowReports,
  showReports,
  activeTab,
  setActiveTab,
  accordionOpen: externalAccordionOpen,
}) => {
  const dispatch = useDispatch();

  const [accordionOpen, setAccordionOpen] = useState(true);
  const isAccordionOpen =
    externalAccordionOpen !== undefined ? externalAccordionOpen : accordionOpen;
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const { id: pathId } = useParams();
  const [searchParams] = useSearchParams();
  const id = pathId || searchParams.get("id") || searchParams.get("patientId");
  const PatientData = useSelector(
    (state) => state?.getPatientByIdReducer?.data?.data?.patient
  );
  // console.log("PatientData", PatientData);
  const isLoading = useSelector(
    (state) => state?.getPatientByIdReducer?.loading
  );
  const UpdateResponse = useSelector(
    (state) => state?.updatePatient?.data?.status
  );
  const ConnectionStatus = useSelector(
    (state) => state?.connectToFitbit?.data?.success
  );
  const connectionLoading = useSelector(
    (state) => state?.connectToFitbit?.loading
  );
  const FitbitConectionStatus = PatientData?.fitbitStatus;
  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  const tabs = [
    "Activity Data",
    "Sleep Data",
    "Heart Rate",
    "Weight & Body Metrics",
    "Exercise Data",
    "Nutrition",
  ];

  useEffect(() => {
    dispatch(getPatientById(id));
  }, [id]);

  useEffect(() => {
    if (UpdateResponse === 200) {
      dispatch(getPatientById(id));
    }
  }, [UpdateResponse]);

  // useEffect(() => {
  //   dispatch(getPatientProfile())
  // }, [dispatch]);

  // useEffect(() => {
  //   if (id) {
  //     dispatch(getPatientProfile({ id: id }))
  //   }
  // }, [id]);

  useEffect(() => {
    if (ConnectionStatus === true) {
      dispatch(getPatientById(id));
    }
  }, [ConnectionStatus]);

  return (
    <div
      className="pb-1"
      style={{
        backgroundColor: "white",
        // border: '1px solid #e9ecef',
        // borderBottom: 'none',
        borderTopLeftRadius: "10px",
        borderTopRightRadius: "10px",
      }}
    >
      {!showReports && !isAccordionOpen && (
        <div>
          {/* tab section */}
          <div className="d-flex patient-tabs">
            {tabs.map((tab, index) => (
              <div
                key={tab}
                className={`patient-tab fw-semibold flex-fill ${
                  activeTab === tab ? "active" : "inactive"
                }`}
                onClick={() => setActiveTab(tab)}
                style={{
                  cursor: "pointer",
                  ...(index === 0 && { borderTopLeftRadius: "10px" }),
                  ...(index === tabs.length - 1 && {
                    borderTopRightRadius: "10px",
                  }),
                }}
              >
                <div
                  className={`patient-tab-content ${
                    index === 0 || index === tabs.length - 1 ? "straight" : ""
                  }`}
                >
                  {tab}
                  {/* <span className="patient-tab-arrow"><FaChevronDown /></span> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="accordion m-2" id="patientAccordion">
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className={`accordion-button border-bottom py-0 ps-0 custom-accordion-button ${
                !accordionOpen ? "collapsed" : ""
              }`}
              type="button"
              style={{
                backgroundColor: "#F6FAFF",
                border: "none",
                overflow: "hidden",
                boxShadow: "none",
                pointerEvents: "none",
              }}
            >
              <div className="d-flex justify-content-between align-items-center w-100 me-3">
                <div className="d-flex align-items-center">
                  <div
                    className="pe-5 py-2"
                    style={{
                      backgroundColor: "#E0ECF8",
                      borderRight: "4px solid #E0ECF8",
                      transform: "skewX(-20deg)",
                      overflow: "hidden",
                      marginLeft: "-5px",
                    }}
                  >
                    <div style={{ transform: "skewX(20deg)" }}>
                      <span
                        className="ps-3"
                        style={{
                          color: "#6c757d",
                          fontSize: "12px",
                          marginRight: "8px",
                        }}
                      >
                        Patients ID:
                      </span>
                      <span
                        className={`${
                          isLoading ? "placeholder rounded-1 " : ""
                        }`}
                        style={{
                          color: "#007bff",
                          fontSize: "12px",
                          fontWeight: "500",
                        }}
                      >
                        {PatientData?.patientId}
                      </span>
                    </div>
                  </div>
                  <div className="ps-3">
                    <span
                      style={{
                        color: "#6c757d",
                        fontSize: "12px",
                        marginRight: "8px",
                      }}
                    >
                      Date Added:
                    </span>
                    <span
                      className={`${isLoading ? "placeholder rounded-1 " : ""}`}
                      style={{ fontSize: "12px" }}
                    >
                      {formatDate(PatientData?.registrationDate)}
                    </span>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  {FitbitConectionStatus === "Pending" ? (
                    <span
                      className="me-3 fw-bold p-1 rounded-1"
                      style={{
                        color: "#003465",
                        fontSize: "12px",
                        border: "1px solid #003465",
                        pointerEvents: "auto",
                      }}
                    >
                      Connection Pending
                    </span>
                  ) : FitbitConectionStatus === "Not Connected" ? (
                    <button
                      className="btn btn-sm me-3 fw-bold"
                      style={{
                        fontSize: "12px",
                        padding: "4px 12px",
                        borderRadius: "4px",
                        backgroundColor: "#003465",
                        color: "white",
                        border: "1px solid #003465",
                        pointerEvents: "auto",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(connectToFitbit({ patientId: id }));
                      }}
                      disabled={connectionLoading}
                    >
                      {connectionLoading ? "Connecting" : "Connect to Fitbit"}
                    </button>
                  ) : FitbitConectionStatus === "Connected" ? (
                    <span
                      className="me-3 fw-bold p-1 rounded-1"
                      style={{
                        color: "#003465",
                        fontSize: "12px",
                        border: "1px solid #003465",
                        pointerEvents: "auto",
                      }}
                    >
                      Connected
                    </span>
                  ) : null}
                  <TbUserEdit
                    className="border rounded-2 p-1"
                    title="Edit Patient"
                    style={{
                      fontSize: "26px",
                      color: "#003465",
                      cursor: "pointer",
                      marginRight: "18px",
                      transition: "all 0.2s ease",
                      pointerEvents: "auto",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#E0ECF8";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "transparent";
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowUpdateModal(true);
                    }}
                  />
                  <span
                    className="fw-semibold"
                    style={{
                      color: "#003465",
                      fontSize: "12px",
                      marginRight: "8px",
                      textDecoration: "underline",
                      cursor: "pointer",
                      pointerEvents: "auto",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onShowReports();
                    }}
                  >
                    {showReports ? "Back" : "All Reports"}
                  </span>
                  <FaChevronDown
                    className="ms-2"
                    style={{
                      fontSize: "16px",
                      color: "#003465",
                      cursor: "pointer",
                      transform: accordionOpen
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                      pointerEvents: "auto",
                    }}
                    onClick={() => setAccordionOpen(!accordionOpen)}
                  />
                </div>
              </div>
            </button>
          </h2>
          <div
            className={`accordion-collapse collapse ${
              accordionOpen ? "show" : ""
            } ${isLoading ? "placeholder-glow " : ""}`}
            style={{ display: accordionOpen ? "block" : "none" }}
          >
            <div
              className="accordion-body py-2"
              style={{ backgroundColor: "#F6FAFF" }}
            >
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  {PatientData?.avatar ? (
                    <img
                      src={PatientData?.avatar}
                      alt="Patient Avatar"
                      className={`me-3 ${isLoading ? "placeholder " : ""}`}
                      style={{
                        width: "76px",
                        height: "84px",
                        borderRadius: "12px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      className={`me-3 d-flex align-items-center justify-content-center ${
                        isLoading ? "placeholder " : ""
                      }`}
                      style={{
                        width: "76px",
                        height: "84px",
                        backgroundColor: "#E0ECF8",
                        color: "#16213D",
                        fontSize: "20px",
                        fontWeight: "bold",
                        borderRadius: "12px",
                      }}
                    >
                      {getInitials(
                        PatientData?.firstName + " " + PatientData?.lastName
                      )}
                    </div>
                  )}
                  <div>
                    <div
                      className={`d-flex align-items-center ${
                        isLoading ? "placeholder rounded-1" : ""
                      }`}
                      style={{ gap: "16px" }}
                    >
                      <h4
                        className="mb-0 pe-3 text-capitalize "
                        style={{
                          fontSize: "18px",
                          fontWeight: "600",
                          borderRight: "1px solid #000000",
                        }}
                      >
                        {PatientData?.firstName} {PatientData?.lastName}
                      </h4>
                      <span
                        className="pe-3 fw-bold text-dark text-capitalize"
                        style={{
                          fontSize: "14px",
                          color: "#6c757d",
                          borderRight: "1px solid #000000",
                        }}
                      >
                        {PatientData?.gender}
                      </span>
                      <span
                        className="pe-3 fw-bold text-dark"
                        style={{
                          fontSize: "14px",
                          color: "#6c757d",
                          borderRight: "1px solid #000000",
                        }}
                      >
                        {formatDate(PatientData?.dateOfBirth)}
                      </span>
                      <span
                        className="fw-bold text-dark"
                        style={{ fontSize: "14px", color: "#6c757d" }}
                      >
                        {PatientData?.age ||
                          (PatientData?.dateOfBirth
                            ? new Date().getFullYear() -
                              new Date(PatientData.dateOfBirth).getFullYear()
                            : "N/A")}{" "}
                        Years Old
                      </span>
                    </div>
                    <div
                      className="d-flex align-items-center mt-3"
                      style={{ gap: "16px" }}
                    >
                      <div className="d-flex align-items-center">
                        <FiPhone
                          style={{
                            fontSize: "12px",
                            marginRight: "4px",
                            color: "#003465",
                          }}
                        />
                        <span
                          className={`${
                            isLoading ? "placeholder rounded-1 " : ""
                          }`}
                          style={{ fontSize: "12px", color: "#6c757d" }}
                        >
                          {PatientData?.phoneNumber}
                        </span>
                      </div>
                      <div className="d-flex align-items-center">
                        <MdOutlineMailOutline
                          style={{
                            fontSize: "12px",
                            marginRight: "4px",
                            color: "#003465",
                          }}
                        />
                        <span
                          className={`${
                            isLoading ? "placeholder rounded-1 " : ""
                          }`}
                          style={{ fontSize: "12px", color: "#6c757d" }}
                        >
                          {PatientData?.email}
                        </span>
                      </div>
                      <div className="d-flex align-items-center">
                        <GrLocation
                          style={{
                            fontSize: "12px",
                            marginRight: "4px",
                            color: "#003465",
                          }}
                        />
                        <span
                          className={`${
                            isLoading ? "placeholder rounded-1 " : ""
                          }`}
                          style={{ fontSize: "12px", color: "#6c757d" }}
                        >
                          {(PatientData?.address?.city?.name || "N/A") +
                            "-" +
                            (PatientData?.address?.state?.name || "N/A")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-flex" style={{ gap: "18px" }}>
                  <div
                    className="d-flex align-items-center p-3 rounded-1 position-relative"
                    style={{
                      gap: "20px",
                      width: "9vw",
                      backgroundColor:
                        PatientData?.weeklyFitbitData?.avgSteps?.type ===
                        "normal"
                          ? "#F0FFF0"
                          : "#FFF0F0",
                      border:
                        PatientData?.weeklyFitbitData?.avgSteps?.type ===
                        "normal"
                          ? "1px solid #28a745"
                          : "1px solid #dc3545",
                      boxShadow:
                        PatientData?.weeklyFitbitData?.avgSteps?.type ===
                        "normal"
                          ? "0 4px 8px rgba(40, 167, 69, 0.3)"
                          : "0 4px 8px rgba(220, 53, 69, 0.3)",
                    }}
                  >
                    <img
                      src={stepsIcon}
                      alt="Steps"
                      style={{ width: "24px", height: "24px" }}
                    />
                    <div>
                      <div
                        className="text-nowrap"
                        style={{
                          fontSize: "12px",
                          color: "#6c757d",
                          marginBottom: "2px",
                        }}
                      >
                        Avg Steps
                      </div>
                      <div
                        style={{ fontSize: "16px", fontWeight: "600" }}
                        className={`${
                          isLoading ? "placeholder rounded-1" : ""
                        }`}
                      >
                        {PatientData?.weeklyFitbitData?.avgSteps?.value ||
                          (typeof PatientData?.weeklyFitbitData?.avgSteps ===
                          "number"
                            ? PatientData?.weeklyFitbitData?.avgSteps
                            : null) ||
                          "-"}{" "}
                        <span
                          style={{
                            fontSize: "10px",
                            color: "#6c757d",
                            fontWeight: "normal",
                            marginBottom: "2px",
                          }}
                        >
                          <span style={{ fontWeight: "bold", color: "black" }}>
                            steps
                          </span>
                          <span
                            style={{ fontSize: "8px", fontWeight: "normal" }}
                          >
                            /Week
                          </span>
                        </span>
                      </div>
                    </div>
                    {PatientData?.weeklyFitbitData?.avgSteps?.type ===
                    "normal" ? (
                      <FaCheckCircle
                        style={{
                          position: "absolute",
                          bottom: "4px",
                          right: "4px",
                          color: "#28a745",
                          fontSize: "14px",
                        }}
                      />
                    ) : (
                      <FaExclamationTriangle
                        style={{
                          position: "absolute",
                          bottom: "4px",
                          right: "4px",
                          color: "#de1c1c",
                          fontSize: "14px",
                        }}
                      />
                    )}
                  </div>
                  <div
                    className="d-flex align-items-center p-3 rounded-1 position-relative"
                    style={{
                      gap: "16px",
                      width: "9vw",
                      backgroundColor:
                        PatientData?.weeklyFitbitData?.heartRate?.type ===
                          "normal" ||
                        (!PatientData?.weeklyFitbitData?.heartRate?.type &&
                          parseInt(
                            PatientData?.weeklyFitbitData?.heartRate?.value ||
                              80
                          ) >= 60 &&
                          parseInt(
                            PatientData?.weeklyFitbitData?.heartRate?.value ||
                              80
                          ) <= 100)
                          ? "#F0FFF0"
                          : "#FFF0F0",
                      border:
                        PatientData?.weeklyFitbitData?.heartRate?.type ===
                          "normal" ||
                        (!PatientData?.weeklyFitbitData?.heartRate?.type &&
                          parseInt(
                            PatientData?.weeklyFitbitData?.heartRate?.value ||
                              80
                          ) >= 60 &&
                          parseInt(
                            PatientData?.weeklyFitbitData?.heartRate?.value ||
                              80
                          ) <= 100)
                          ? "1px solid #28a745"
                          : "1px solid #dc3545",
                      boxShadow:
                        PatientData?.weeklyFitbitData?.heartRate?.type ===
                          "normal" ||
                        (!PatientData?.weeklyFitbitData?.heartRate?.type &&
                          parseInt(
                            PatientData?.weeklyFitbitData?.heartRate?.value ||
                              80
                          ) >= 60 &&
                          parseInt(
                            PatientData?.weeklyFitbitData?.heartRate?.value ||
                              80
                          ) <= 100)
                          ? "0 4px 8px rgba(40, 167, 69, 0.3)"
                          : "0 4px 8px rgba(220, 53, 69, 0.3)",
                    }}
                  >
                    <img
                      src={heartRateIcon}
                      alt="Heart Rate"
                      style={{ width: "26px", height: "26px" }}
                    />
                    <div>
                      <div
                        className="text-nowrap"
                        style={{
                          fontSize: "12px",
                          color: "#6c757d",
                          marginBottom: "2px",
                        }}
                      >
                        Avg Heart Rate
                      </div>
                      <div
                        style={{ fontSize: "16px", fontWeight: "600" }}
                        className={`${
                          isLoading ? "placeholder rounded-1" : ""
                        }`}
                      >
                        {PatientData?.weeklyFitbitData?.heartRate?.value ||
                          (typeof PatientData?.weeklyFitbitData?.heartRate ===
                          "number"
                            ? PatientData?.weeklyFitbitData?.heartRate
                            : null) ||
                          "80"}{" "}
                        <span
                          style={{
                            fontSize: "10px",
                            color: "#6c757d",
                            fontWeight: "normal",
                            marginBottom: "2px",
                          }}
                        >
                          <span style={{ fontWeight: "bold", color: "black" }}>
                            bpm
                          </span>
                          <span
                            style={{ fontSize: "8px", fontWeight: "normal" }}
                          >
                            /Week
                          </span>
                        </span>
                      </div>
                    </div>
                    {PatientData?.weeklyFitbitData?.heartRate?.type ===
                      "normal" ||
                    (!PatientData?.weeklyFitbitData?.heartRate?.type &&
                      parseInt(
                        PatientData?.weeklyFitbitData?.heartRate?.value || 80
                      ) >= 60 &&
                      parseInt(
                        PatientData?.weeklyFitbitData?.heartRate?.value || 80
                      ) <= 100) ? (
                      <FaCheckCircle
                        style={{
                          position: "absolute",
                          bottom: "4px",
                          right: "4px",
                          color: "#28a745",
                          fontSize: "14px",
                        }}
                      />
                    ) : (
                      <FaExclamationTriangle
                        style={{
                          position: "absolute",
                          bottom: "4px",
                          right: "4px",
                          color: "#de1c1c",
                          fontSize: "14px",
                        }}
                      />
                    )}
                  </div>
                  <div
                    className="d-flex align-items-center p-3 rounded-1 position-relative"
                    style={{
                      gap: "16px",
                      width: "9vw",
                      backgroundColor:
                        PatientData?.weeklyFitbitData?.avgSleepDuration
                          ?.type === "normal"
                          ? "#F0FFF0"
                          : "#FFF0F0",
                      border:
                        PatientData?.weeklyFitbitData?.avgSleepDuration
                          ?.type === "normal"
                          ? "1px solid #28a745"
                          : "1px solid #dc3545",
                      boxShadow:
                        PatientData?.weeklyFitbitData?.avgSleepDuration
                          ?.type === "normal"
                          ? "0 4px 8px rgba(40, 167, 69, 0.3)"
                          : "0 4px 8px rgba(220, 53, 69, 0.3)",
                    }}
                  >
                    <img
                      src={sleepIcon}
                      alt="Sleep"
                      style={{ width: "24px", height: "24px" }}
                    />
                    <div>
                      <div
                        className="text-nowrap"
                        style={{
                          fontSize: "12px",
                          color: "#6c757d",
                          marginBottom: "2px",
                        }}
                      >
                        Avg Sleep Min
                      </div>
                      <div
                        style={{ fontSize: "16px", fontWeight: "600" }}
                        className={`${
                          isLoading ? "placeholder rounded-1" : ""
                        }`}
                      >
                        {PatientData?.weeklyFitbitData?.avgSleepDuration
                          ?.value ||
                          (typeof PatientData?.weeklyFitbitData
                            ?.avgSleepDuration === "number"
                            ? PatientData?.weeklyFitbitData?.avgSleepDuration
                            : null) ||
                          "-"}{" "}
                        <span
                          style={{
                            fontSize: "10px",
                            color: "#6c757d",
                            fontWeight: "normal",
                            marginBottom: "2px",
                          }}
                        >
                          <span style={{ fontWeight: "bold", color: "black" }}>
                            min
                          </span>
                          <span
                            style={{ fontSize: "8px", fontWeight: "normal" }}
                          >
                            /Week
                          </span>
                        </span>
                      </div>
                    </div>
                    {PatientData?.weeklyFitbitData?.avgSleepDuration?.type ===
                    "normal" ? (
                      <FaCheckCircle
                        style={{
                          position: "absolute",
                          bottom: "4px",
                          right: "4px",
                          color: "#28a745",
                          fontSize: "14px",
                        }}
                      />
                    ) : (
                      <FaExclamationTriangle
                        style={{
                          position: "absolute",
                          bottom: "4px",
                          right: "4px",
                          color: "#de1c1c",
                          fontSize: "14px",
                        }}
                      />
                    )}
                  </div>
                  <div
                    className="d-flex align-items-center p-3 rounded-1 position-relative"
                    style={{
                      gap: "16px",
                      width: "9vw",
                      backgroundColor:
                        PatientData?.weeklyFitbitData?.avgWater?.type ===
                        "normal"
                          ? "#F0FFF0"
                          : "#FFF0F0",
                      border:
                        PatientData?.weeklyFitbitData?.avgWater?.type ===
                        "normal"
                          ? "1px solid #28a745"
                          : "1px solid #dc3545",
                      boxShadow:
                        PatientData?.weeklyFitbitData?.avgWater?.type ===
                        "normal"
                          ? "0 4px 8px rgba(40, 167, 69, 0.3)"
                          : "0 4px 8px rgba(220, 53, 69, 0.3)",
                    }}
                  >
                    <img
                      src={waterIntakeIcon}
                      alt="Water Intake"
                      style={{ width: "24px", height: "24px" }}
                    />
                    <div>
                      <div
                        className="text-nowrap"
                        style={{
                          fontSize: "12px",
                          color: "#6c757d",
                          marginBottom: "2px",
                        }}
                      >
                        Avg Water Intake
                      </div>
                      <div
                        style={{ fontSize: "16px", fontWeight: "600" }}
                        className={`${
                          isLoading ? "placeholder rounded-1" : ""
                        }`}
                      >
                        {PatientData?.weeklyFitbitData?.avgWater?.value ||
                          (typeof PatientData?.weeklyFitbitData?.avgWater ===
                          "number"
                            ? PatientData?.weeklyFitbitData?.avgWater
                            : null) ||
                          "-"}{" "}
                        <span
                          style={{
                            fontSize: "10px",
                            color: "#6c757d",
                            fontWeight: "normal",
                            marginBottom: "2px",
                          }}
                        >
                          <span style={{ fontWeight: "bold", color: "black" }}>
                            ml
                          </span>
                          <span
                            style={{ fontSize: "8px", fontWeight: "normal" }}
                          >
                            /Week
                          </span>
                        </span>
                      </div>
                    </div>
                    {PatientData?.weeklyFitbitData?.avgWater?.type ===
                    "normal" ? (
                      <FaCheckCircle
                        style={{
                          position: "absolute",
                          bottom: "4px",
                          right: "4px",
                          color: "#28a745",
                          fontSize: "14px",
                        }}
                      />
                    ) : (
                      <FaExclamationTriangle
                        style={{
                          position: "absolute",
                          bottom: "4px",
                          right: "4px",
                          color: "#de1c1c",
                          fontSize: "14px",
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <UpdatePatientModal
        show={showUpdateModal}
        onHide={() => setShowUpdateModal(false)}
        patientId={id}
      />
    </div>
  );
};

export default PatientDetails;
