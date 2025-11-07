import React, { useState, useRef, useEffect } from "react";
import { Offcanvas } from "react-bootstrap";
import {
  FaBell,
  FaExclamationTriangle,
  FaInfoCircle,
  FaCheckCircle,
  FaCalendarAlt,
  FaFilter,
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { DateRangePicker } from "react-date-range";
import { getAlerts } from "../../../redux/notes/action";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const PatientAlertsOffCanvas = ({ show, onHide }) => {
  const dispatch = useDispatch();
  const { id: pathId } = useParams();
  const [searchParams] = useSearchParams();
  const patientId =
    pathId || searchParams.get("id") || searchParams.get("patientId");

  const PatientData = useSelector(
    (state) => state?.getPatientByIdReducer?.data?.data?.patient
  );

  const alertsData = useSelector((state) => state?.getAlertsReducer);
  const alerts = alertsData?.data?.data || [];

  const [dateFilter, setDateFilter] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [hasDateFilter, setHasDateFilter] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [severityFilter, setSeverityFilter] = useState([]);
  const [showSeverityFilter, setShowSeverityFilter] = useState(false);
  const calendarRef = useRef(null);
  const severityRef = useRef(null);

  useEffect(() => {
    if (show && patientId) {
      const params = { patientId, page: currentPage, limit: 10 };
      if (hasDateFilter) {
        const formatDate = (date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        };
        params.startDate = formatDate(dateFilter[0].startDate);
        params.endDate = formatDate(dateFilter[0].endDate);
      }
      if (severityFilter.length > 0) {
        params.severity = severityFilter.join(",");
      }

      dispatch(getAlerts(params));
    }
  }, [
    dispatch,
    show,
    patientId,
    hasDateFilter,
    dateFilter,
    currentPage,
    severityFilter,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [hasDateFilter, dateFilter, severityFilter]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
      if (severityRef.current && !severityRef.current.contains(event.target)) {
        setShowSeverityFilter(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getSeverityIcon = (severity) => {
    switch (severity?.toLowerCase()) {
      case "critical":
        return (
          <FaExclamationTriangle
            className="text-danger"
            style={{ fontSize: "14px" }}
          />
        );
      case "high":
        return <FaExclamationTriangle className="text-warning" />;
      case "medium":
        return <FaInfoCircle className="text-info" />;
      case "low":
        return <FaCheckCircle className="text-success" />;
      case "info":
        return <FaCheckCircle className="text-success" />;
      default:
        return <FaBell className="text-secondary" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case "critical":
        return { bg: "#ffebee", border: "#f44336", text: "#d32f2f" };
      case "high":
        return { bg: "#fff3e0", border: "#ff9800", text: "#f57c00" };
      case "medium":
        return { bg: "#e3f2fd", border: "#2196f3", text: "#1976d2" };
      case "low":
        return { bg: "#e8f5e8", border: "#4caf50", text: "#388e3c" };
      case "info":
        return { bg: "#e8f5e8", border: "#4caf50", text: "#388e3c" };
      default:
        return { bg: "#f5f5f5", border: "#9e9e9e", text: "#616161" };
    }
  };

  const displayAlerts = alerts.length > 0 ? alerts : [];

  return (
    <>
      <Offcanvas
        show={show}
        onHide={() => {
          setSeverityFilter([]);
          setDateFilter([
            {
              startDate: new Date(),
              endDate: new Date(),
              key: "selection",
            },
          ]);
          setHasDateFilter(false);
          setShowCalendar(false);
          setShowSeverityFilter(false);
          onHide();
        }}
        placement="end"
        style={{ width: "500px" }}
      >
        <Offcanvas.Header
          closeButton
          style={{
            backgroundColor: "#F6FAFF",
            borderBottom: "1px solid #e9ecef",
          }}
        >
          <div className="d-flex justify-content-between align-items-center w-100 me-3">
            <Offcanvas.Title
              className="d-flex align-items-center gap-2"
              style={{ color: "#003465", fontSize: "18px", fontWeight: "600" }}
            >
              <FaBell size={18} />
              {PatientData?.firstName} {PatientData?.lastName}
              {alertsData?.data?.total > 0 && (
                <span
                  style={{ fontSize: "12px", fontWeight: "400", color: "#666" }}
                >

                  ({alertsData?.data?.total})

                </span>
              )}
            </Offcanvas.Title>
            <div className="d-flex align-items-center gap-2 position-relative">
              <FaFilter
                size={14}
                style={{
                  color: severityFilter.length > 0 ? "#ff6b35" : "#003465",
                  cursor: "pointer",
                }}
                onClick={() => setShowSeverityFilter(!showSeverityFilter)}
              />
              {severityFilter.length > 0 && (
                <span
                  style={{
                    fontSize: "10px",
                    color: "#ff6b35",
                    fontWeight: "500",
                  }}
                >
                  {severityFilter
                    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
                    .join(", ")}
                </span>
              )}
              <FaCalendarAlt
                size={16}
                style={{ color: "#003465", cursor: "pointer" }}
                onClick={() => setShowCalendar(!showCalendar)}
              />
              {hasDateFilter && (
                <span
                  style={{
                    fontSize: "12px",
                    color: "#003465",
                    fontWeight: "500",
                  }}
                >
                  {dateFilter[0].startDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  -{" "}
                  {dateFilter[0].endDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              )}
              {hasDateFilter && (
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => {
                    setDateFilter([
                      {
                        startDate: new Date(),
                        endDate: new Date(),
                        key: "selection",
                      },
                    ]);
                    setHasDateFilter(false);
                  }}
                  style={{ fontSize: "10px", padding: "2px 6px" }}
                >
                  Clear
                </button>
              )}
              {showSeverityFilter && (
                <div
                  ref={severityRef}
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: "0px",
                    zIndex: 1000,
                    backgroundColor: "white",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    padding: "12px",
                    minWidth: "180px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#003465",
                      marginBottom: "8px",
                    }}
                  >
                    Filter by Severity
                  </div>
                  {["critical", "high", "medium", "low", "info"].map((severity) => {
                    const colors = getSeverityColor(severity);
                    const isSelected = severityFilter.includes(severity);
                    return (
                      <div
                        key={severity}
                        onClick={() => {
                          setSeverityFilter((prev) =>
                            isSelected
                              ? prev.filter((s) => s !== severity)
                              : [...prev, severity]
                          );
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "6px 8px",
                          borderRadius: "4px",
                          cursor: "pointer",
                          backgroundColor: isSelected
                            ? colors.bg
                            : "transparent",
                          border: `1px solid ${isSelected ? colors.border : "transparent"
                            }`,
                          marginBottom: "4px",
                          fontSize: "11px",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => { }}
                          style={{ margin: 0, accentColor: colors.border }}
                        />
                        <span
                          style={{
                            color: colors.text,
                            fontWeight: "500",
                            textTransform: "capitalize",
                          }}
                        >
                          {severity}
                        </span>
                      </div>
                    );
                  })}
                  {severityFilter.length > 0 && (
                    <button
                      onClick={() => setSeverityFilter([])}
                      style={{
                        width: "100%",
                        padding: "4px 8px",
                        fontSize: "10px",
                        backgroundColor: "#f8f9fa",
                        border: "1px solid #dee2e6",
                        borderRadius: "4px",
                        cursor: "pointer",
                        marginTop: "8px",
                      }}
                    >
                      Clear All
                    </button>
                  )}
                </div>
              )}
              {showCalendar && (
                <div
                  ref={calendarRef}
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    zIndex: 1000,
                    backgroundColor: "white",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  }}
                >
                  <DateRangePicker
                    ranges={dateFilter}
                    onChange={(ranges) => {
                      setDateFilter([ranges.selection]);
                      setHasDateFilter(true);
                    }}
                    rangeColors={["#003465"]}
                    showSelectionPreview={true}
                    moveRangeOnFirstSelection={false}
                  />
                </div>
              )}
            </div>
          </div>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0">
          <div
            className="p-3"
            style={{ height: "calc(100vh - 80px)", overflowY: "auto" }}
          >
            {alertsData?.loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="text-muted mt-3">Loading alerts...</p>
              </div>
            ) : displayAlerts.length === 0 ? (
              <div className="text-center py-5">
                <FaBell size={48} className="text-muted mb-3" />
                <p className="text-muted mb-3">No alerts available</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {displayAlerts.map((alert) => {
                  const colors = getSeverityColor(alert.severity);
                  return (
                    <div
                      key={alert._id}
                      className="card border-0 shadow-sm border-start border-4"
                      style={{
                        borderRadius: "8px",
                        background: `linear-gradient(135deg, ${colors.bg} 0%, #ffffff 100%)`,
                        borderLeftColor: colors.border,
                      }}
                    >
                      <div className="card-body p-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div className="d-flex align-items-center gap-2 flex-grow-1">
                            <div>{getSeverityIcon(alert.severity)}</div>
                            <div className="flex-grow-1">
                              <div className="d-flex align-items-center gap-2 mb-0 mt-1">
                                <h6
                                  className="mb-0 fw-bold"
                                  style={{ fontSize: "13px", color: "#003465" }}
                                >
                                  {alert.title}
                                </h6>
                                <span
                                  className="badge px-2 py-1"
                                  style={{
                                    fontSize: "9px",
                                    backgroundColor: colors.bg,
                                    color: colors.text,
                                    border: `1px solid ${colors.border}`,
                                  }}
                                >
                                  {alert.severity?.toUpperCase()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div
                          className="mb-2 text-muted ps-4"
                          style={{ fontSize: "12px", lineHeight: "1.4" }}
                        >
                          {alert.description}
                        </div>

                        <div
                          className="d-flex justify-content-between align-items-center pt-2 ps-4"
                          style={{
                            borderTop: "1px solid #f0f0f0",
                            fontSize: "10px",
                          }}
                        >
                          <div className="d-flex align-items-center gap-1">
                            <div
                              className="rounded-circle d-flex align-items-center justify-content-center"
                              style={{
                                width: "18px",
                                height: "18px",
                                backgroundColor: "#003465",
                                color: "white",
                                fontSize: "8px",
                                fontWeight: "bold",
                              }}
                            >
                              {alert.doctorId?.firstName?.charAt(0)}
                              {alert.doctorId?.lastName?.charAt(0)}
                            </div>
                            <span className="text-muted">
                              {alert.doctorId?.firstName}{" "}
                              {alert.doctorId?.lastName}
                            </span>
                          </div>
                          <span className="text-muted">
                            {new Date(alert.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {alertsData?.data?.totalPages > 1 && displayAlerts.length > 0 && (
              <div
                className="d-flex justify-content-between align-items-center mt-3 pt-3"
                style={{ borderTop: "1px solid #e9ecef" }}
              >
                {currentPage > 1 ? (
                  <button
                    className="btn btn-sm"
                    onClick={() => {
                      setCurrentPage((prev) => Math.max(1, prev - 1));
                    }}
                    style={{
                      fontSize: "12px",
                      backgroundColor: "#003465",
                      color: "white",
                      border: "1px solid #003465",
                    }}
                  >
                    Previous
                  </button>
                ) : (
                  <div></div>
                )}
                <span style={{ fontSize: "12px", color: "#003465" }}>
                  Page {currentPage} of {alertsData.data.totalPages}
                </span>
                {currentPage < alertsData.data.totalPages ? (
                  <button
                    className="btn btn-sm"
                    onClick={() => {
                      setCurrentPage((prev) =>
                        Math.min(alertsData.data.totalPages, prev + 1)
                      );
                    }}
                    style={{
                      fontSize: "12px",
                      backgroundColor: "#003465",
                      color: "white",
                      border: "1px solid #003465",
                    }}
                  >
                    Next
                  </button>
                ) : (
                  <div></div>
                )}
              </div>
            )}
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default PatientAlertsOffCanvas;
