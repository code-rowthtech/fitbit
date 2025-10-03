import React, { useState, useRef, useEffect } from "react";
import ExerciseSessions_Icon from "../../../assets/images/PatientDashboard/Exercise sessions.png";
import GPSTracking_Icon from "../../../assets/images/PatientDashboard/GPS tracking.png";
import Elevation_Icon from "../../../assets/images/PatientDashboard/elevation.png";
import { IoCalendarClearOutline } from "react-icons/io5";
import { Table } from "react-bootstrap";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { IoIosExpand } from "react-icons/io";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ExerciseData = ({ isExpanded, onExpand }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const datePickerRef = useRef(null);

  const handleCardExpand = (cardType) => {
    if (expandedCard === cardType) {
      setExpandedCard(null);
      onExpand();
    } else {
      setExpandedCard(cardType);
      onExpand();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target)
      ) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="accordion"
      id="exerciseDataAccordion"
      style={{ backgroundColor: "white" }}
    >
      <div className="accordion-item" style={{ border: "none" }}>
        <h2 className="accordion-header">
          <div
            className="py-2 d-flex align-items-center justify-content-between"
            style={{ backgroundColor: "#f8f9fa", padding: "16px 20px" }}
          >
            <div className="d-flex align-items-center">
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  marginRight: "15px",
                }}
              >
                Exercise Data
              </span>
              {/* <div ref={datePickerRef} style={{ position: 'relative' }}>
                                <button
                                    className="form-control rounded-3 border-0 text-start d-flex justify-content-between align-items-center"
                                    style={{ fontSize: '10px', height: '26px', width: '170px', color: '#003465', backgroundColor: 'transparent' }}
                                    onClick={() => setShowDatePicker(!showDatePicker)}
                                >
                                    <span>{dateRange[0].startDate.toLocaleDateString()} - {dateRange[0].endDate.toLocaleDateString()}</span>
                                    <IoCalendarClearOutline style={{ fontSize: '15px', color: '#003465', marginLeft: '10px' }} />
                                </button>
                                {showDatePicker && (
                                    <div style={{ position: 'absolute', top: '40px', zIndex: 1000, backgroundColor: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                                        <DateRangePicker
                                            ranges={dateRange}
                                            onChange={(ranges) => setDateRange([ranges.selection])}
                                        />
                                    </div>
                                )}
                            </div> */}
            </div>
            <div
              onClick={() => setIsOpen(!isOpen)}
              style={{ cursor: "pointer", fontSize: "18px", color: "#121212" }}
            >
              {isOpen ? (
                <IoChevronUp className="fs-4" />
              ) : (
                <IoChevronDown className="fs-4" />
              )}
            </div>
          </div>
        </h2>
        <div className={`accordion-collapse collapse ${isOpen ? "show" : ""}`}>
          <div
            className="accordion-body"
            style={{
              backgroundColor: "transparent",
              border: "none",
              padding: "10px",
            }}
          >
            <div
              className={
                expandedCard ? "d-flex flex-column gap-3" : "d-flex gap-3"
              }
            >
              {/* Exercise Sessions Card */}
              {(!expandedCard || expandedCard === "sessions") && (
                <div
                  style={{
                    flex: 1,
                    backgroundColor: "white",
                    border: "1px solid #e9ecef",
                    borderRadius: "8px",
                    minHeight: expandedCard === "sessions" ? "550px" : "245px",
                    transition: "min-height 0.3s ease",
                  }}
                >
                  <div
                    className="d-flex align-items-center justify-content-between mb-0 p-2 border-1"
                    style={{
                      backgroundColor: "#E0ECF8",
                      borderTopLeftRadius: "7px",
                      borderTopRightRadius: "7px",
                    }}
                  >
                    <div>
                      <img
                        src={ExerciseSessions_Icon}
                        alt="Exercise Sessions"
                        className="mx-2"
                        style={{ width: "19px", height: "19px" }}
                      />
                      <span style={{ fontSize: "12px", fontWeight: "600" }}>
                        Exercise Sessions
                      </span>
                    </div>
                    <div className="d-flex">
                      <IoCalendarClearOutline
                        style={{
                          fontSize: "16px",
                          color: "#003465",
                          marginLeft: "8px",
                        }}
                      />
                      <IoIosExpand
                        style={{
                          fontSize: "16px",
                          color: "#003465",
                          marginLeft: "6px",
                          cursor: "pointer",
                        }}
                        onClick={() => handleCardExpand("sessions")}
                      />
                    </div>
                  </div>
                  <div className="p-1 pt-0">
                    {expandedCard === "sessions" ? (
                      <div className="row p-3">
                        <div className="col-8 pe-2">
                          <div
                            className="border rounded-2"
                            style={{
                              padding: "10px",
                              backgroundColor: "#F6FAFF",
                              height: "500px",
                            }}
                          >
                            <Bar
                              data={{
                                labels: [
                                  "Mon",
                                  "Tue",
                                  "Wed",
                                  "Thu",
                                  "Fri",
                                  "Sat",
                                  "Sun",
                                ],
                                datasets: [
                                  {
                                    data: [1, 0, 1, 1, 1, 1, 0],
                                    backgroundColor: "#003465",
                                    borderRadius: 3,
                                    barThickness: 35,
                                  },
                                ],
                              }}
                              options={{
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: {
                                  x: {
                                    grid: { display: false },
                                    ticks: { color: "#666", fontSize: 10 },
                                  },
                                  y: {
                                    beginAtZero: true,
                                    max: 2,
                                    grid: { color: "#f0f0f0" },
                                    ticks: {
                                      color: "#666",
                                      fontSize: 10,
                                      stepSize: 1,
                                    },
                                  },
                                },
                                categoryPercentage: 0.6,
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-4 ps-2">
                          <div
                            className="border rounded-2 p-3 d-flex flex-column"
                            style={{
                              backgroundColor: "#F6FAFF",
                              height: "500px",
                            }}
                          >
                            <div className="mb-3">
                              <p
                                className="fw-bold mb-0"
                                style={{ color: "#003465", fontSize: "14px" }}
                              >
                                Exercise Sessions Summary
                              </p>
                            </div>
                            <div className="d-flex justify-content-center mb-4">
                              <div
                                className="position-relative"
                                style={{ width: "180px", height: "180px" }}
                              >
                                <svg
                                  width="180"
                                  height="180"
                                  className="position-absolute"
                                >
                                  <circle
                                    cx="90"
                                    cy="90"
                                    r="75"
                                    fill="none"
                                    stroke="#E0ECF8"
                                    strokeWidth="12"
                                  />
                                  <circle
                                    cx="90"
                                    cy="90"
                                    r="75"
                                    fill="none"
                                    stroke="#003465"
                                    strokeWidth="10"
                                    strokeDasharray="471"
                                    strokeDashoffset="134"
                                    strokeLinecap="round"
                                    transform="rotate(-90 90 90)"
                                  />
                                </svg>
                                <div className="position-absolute top-50 start-50 translate-middle text-center">
                                  <div
                                    className="fw-bold"
                                    style={{
                                      fontSize: "24px",
                                      color: "#003465",
                                    }}
                                  >
                                    71%
                                  </div>
                                  <div
                                    style={{
                                      fontSize: "14px",
                                      color: "#003465",
                                    }}
                                  >
                                    Goal
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-center mb-4">
                              <p
                                className="mb-0"
                                style={{ fontSize: "13px", color: "#666" }}
                              >
                                2 more sessions to reach weekly goal
                              </p>
                            </div>
                            <div className="row mb-4">
                              <div className="col-6">
                                <div
                                  className="text-center p-2 rounded"
                                  style={{ backgroundColor: "white" }}
                                >
                                  <div
                                    className="fw-bold"
                                    style={{
                                      fontSize: "18px",
                                      color: "#003465",
                                    }}
                                  >
                                    5
                                  </div>
                                  <div
                                    style={{ fontSize: "12px", color: "#666" }}
                                  >
                                    This Week
                                  </div>
                                </div>
                              </div>
                              <div className="col-6">
                                <div
                                  className="text-center p-2 rounded"
                                  style={{ backgroundColor: "white" }}
                                >
                                  <div
                                    className="fw-bold"
                                    style={{
                                      fontSize: "18px",
                                      color: "#003465",
                                    }}
                                  >
                                    7
                                  </div>
                                  <div
                                    style={{ fontSize: "12px", color: "#666" }}
                                  >
                                    Weekly Goal
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="mt-auto">
                              <div className="row">
                                <div className="col-12 mb-2">
                                  <div
                                    className="d-flex justify-content-between align-items-center p-2 rounded"
                                    style={{
                                      backgroundColor: "white",
                                      fontSize: "12px",
                                    }}
                                  >
                                    <span style={{ color: "#666" }}>
                                      Active Days
                                    </span>
                                    <span
                                      className="fw-bold"
                                      style={{ color: "#003465" }}
                                    >
                                      5/7
                                    </span>
                                  </div>
                                </div>
                                <div className="col-12">
                                  <div
                                    className="d-flex justify-content-between align-items-center p-2 rounded"
                                    style={{
                                      backgroundColor: "white",
                                      fontSize: "12px",
                                    }}
                                  >
                                    <span style={{ color: "#666" }}>
                                      Streak
                                    </span>
                                    <span
                                      className="fw-bold"
                                      style={{ color: "#003465" }}
                                    >
                                      3 days
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Table
                        className=" fw-bold mb-0 mt-1"
                        style={{
                          width: "100%",
                          fontSize: "10px",
                          borderCollapse: "collapse",
                          border: "1px solid #E0E0E0",
                          borderBottom: "transparent",
                        }}
                      >
                        <tbody>
                          <tr>
                            <td
                              className="p-1"
                              style={{
                                color: "#121212",
                                backgroundColor: "#F3F3F3",
                                borderBottom: "1px solid #E0E0E0",
                              }}
                            >
                              Current Week
                            </td>
                            <td
                              className="p-1 text-success"
                              style={{
                                fontWeight: "600",
                                textAlign: "right",
                                borderLeft: "1px solid #E0E0E0",
                                backgroundColor: "#F3F3F3",
                                borderBottom: "1px solid #E0E0E0",
                              }}
                            >
                              Total- 5 sessions
                            </td>
                          </tr>
                          {[
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday",
                            "Saturday",
                            "Sunday",
                          ].map((day) => {
                            const sessions = {
                              Monday: "1",
                              Tuesday: "0",
                              Wednesday: "1",
                              Thursday: "1",
                              Friday: "1",
                              Saturday: "1",
                              Sunday: "0",
                            }[day];
                            const sessionValue = parseInt(sessions);
                            const colorClass =
                              sessionValue >= 1
                                ? "text-success"
                                : "text-danger";
                            return (
                              <tr key={day}>
                                <td
                                  className="p-1"
                                  style={{
                                    color: "#121212",
                                    borderBottom: "1px solid #E0E0E0",
                                    backgroundColor: "#F9FAFB",
                                  }}
                                >
                                  {day}
                                </td>
                                <td
                                  className={`p-1 ${colorClass}`}
                                  style={{
                                    textAlign: "right",
                                    borderBottom: "1px solid #E0E0E0",
                                    borderLeft: "1px solid #E0E0E0",
                                    backgroundColor: "#F9FAFB",
                                  }}
                                >
                                  {sessions} session
                                  {sessions !== "1" ? "s" : ""}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    )}
                  </div>
                </div>
              )}

              {/* GPS Tracking Card */}
              {(!expandedCard || expandedCard === "gps") && (
                <div
                  style={{
                    flex: 1,
                    backgroundColor: "white",
                    border: "1px solid #e9ecef",
                    borderRadius: "8px",
                    minHeight: expandedCard === "gps" ? "550px" : "245px",
                    transition: "min-height 0.3s ease",
                  }}
                >
                  <div
                    className="d-flex align-items-center justify-content-between mb-0 p-2 border-1"
                    style={{
                      backgroundColor: "#E0ECF8",
                      borderTopLeftRadius: "7px",
                      borderTopRightRadius: "7px",
                    }}
                  >
                    <div>
                      <img
                        src={GPSTracking_Icon}
                        alt="GPS Tracking"
                        className="mx-2"
                        style={{ width: "19px", height: "19px" }}
                      />
                      <span style={{ fontSize: "12px", fontWeight: "600" }}>
                        GPS Tracking
                      </span>
                    </div>
                    <div className="d-flex">
                      <IoCalendarClearOutline
                        style={{
                          fontSize: "16px",
                          color: "#003465",
                          marginLeft: "8px",
                        }}
                      />
                      <IoIosExpand
                        style={{
                          fontSize: "16px",
                          color: "#003465",
                          marginLeft: "6px",
                          cursor: "pointer",
                        }}
                        onClick={() => handleCardExpand("gps")}
                      />
                    </div>
                  </div>
                  <div className="p-1 pt-0">
                    {expandedCard === "gps" ? (
                      <div className="row p-3">
                        <div className="col-8 pe-2">
                          <div
                            className="border rounded-2"
                            style={{
                              padding: "10px",
                              backgroundColor: "#F6FAFF",
                              height: "500px",
                            }}
                          >
                            <Bar
                              data={{
                                labels: [
                                  "Mon",
                                  "Tue",
                                  "Wed",
                                  "Thu",
                                  "Fri",
                                  "Sat",
                                  "Sun",
                                ],
                                datasets: [
                                  {
                                    data: [3.5, 0.0, 2.8, 3.1, 3.6, 4.2, 0.0],
                                    backgroundColor: "#003465",
                                    borderRadius: 3,
                                    barThickness: 35,
                                  },
                                ],
                              }}
                              options={{
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: {
                                  x: {
                                    grid: { display: false },
                                    ticks: { color: "#666", fontSize: 10 },
                                  },
                                  y: {
                                    beginAtZero: true,
                                    max: 5,
                                    grid: { color: "#f0f0f0" },
                                    ticks: { color: "#666", fontSize: 10 },
                                  },
                                },
                                categoryPercentage: 0.6,
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-4 ps-2">
                          <div
                            className="border rounded-2 p-3 d-flex flex-column"
                            style={{
                              backgroundColor: "#F6FAFF",
                              height: "500px",
                            }}
                          >
                            <div className="mb-3">
                              <p
                                className="fw-bold mb-0"
                                style={{ color: "#003465", fontSize: "14px" }}
                              >
                                GPS Tracking Summary
                              </p>
                            </div>
                            <div className="d-flex justify-content-center mb-4">
                              <div
                                className="position-relative"
                                style={{ width: "180px", height: "180px" }}
                              >
                                <svg
                                  width="180"
                                  height="180"
                                  className="position-absolute"
                                >
                                  <circle
                                    cx="90"
                                    cy="90"
                                    r="75"
                                    fill="none"
                                    stroke="#E0ECF8"
                                    strokeWidth="12"
                                  />
                                  <circle
                                    cx="90"
                                    cy="90"
                                    r="75"
                                    fill="none"
                                    stroke="#003465"
                                    strokeWidth="10"
                                    strokeDasharray="471"
                                    strokeDashoffset="118"
                                    strokeLinecap="round"
                                    transform="rotate(-90 90 90)"
                                  />
                                </svg>
                                <div className="position-absolute top-50 start-50 translate-middle text-center">
                                  <div
                                    className="fw-bold"
                                    style={{
                                      fontSize: "24px",
                                      color: "#003465",
                                    }}
                                  >
                                    75%
                                  </div>
                                  <div
                                    style={{
                                      fontSize: "14px",
                                      color: "#003465",
                                    }}
                                  >
                                    Goal
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-center mb-4">
                              <p
                                className="mb-0"
                                style={{ fontSize: "13px", color: "#666" }}
                              >
                                Good weekly distance coverage
                              </p>
                            </div>
                            <div className="row mb-4">
                              <div className="col-6">
                                <div
                                  className="text-center p-2 rounded"
                                  style={{ backgroundColor: "white" }}
                                >
                                  <div
                                    className="fw-bold"
                                    style={{
                                      fontSize: "18px",
                                      color: "#003465",
                                    }}
                                  >
                                    17.2
                                  </div>
                                  <div
                                    style={{ fontSize: "12px", color: "#666" }}
                                  >
                                    Total km
                                  </div>
                                </div>
                              </div>
                              <div className="col-6">
                                <div
                                  className="text-center p-2 rounded"
                                  style={{ backgroundColor: "white" }}
                                >
                                  <div
                                    className="fw-bold"
                                    style={{
                                      fontSize: "18px",
                                      color: "#003465",
                                    }}
                                  >
                                    4.2
                                  </div>
                                  <div
                                    style={{ fontSize: "12px", color: "#666" }}
                                  >
                                    Best Day
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="mt-auto">
                              <div className="row">
                                <div className="col-12 mb-2">
                                  <div
                                    className="d-flex justify-content-between align-items-center p-2 rounded"
                                    style={{
                                      backgroundColor: "white",
                                      fontSize: "12px",
                                    }}
                                  >
                                    <span style={{ color: "#666" }}>
                                      Daily Average
                                    </span>
                                    <span
                                      className="fw-bold"
                                      style={{ color: "#003465" }}
                                    >
                                      3.2 km
                                    </span>
                                  </div>
                                </div>
                                <div className="col-12">
                                  <div
                                    className="d-flex justify-content-between align-items-center p-2 rounded"
                                    style={{
                                      backgroundColor: "white",
                                      fontSize: "12px",
                                    }}
                                  >
                                    <span style={{ color: "#666" }}>
                                      Active Days
                                    </span>
                                    <span
                                      className="fw-bold"
                                      style={{ color: "#003465" }}
                                    >
                                      5/7
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Table
                        className=" fw-bold mb-0 mt-1"
                        style={{
                          width: "100%",
                          fontSize: "10px",
                          borderCollapse: "collapse",
                          border: "1px solid #E0E0E0",
                          borderBottom: "transparent",
                        }}
                      >
                        <tbody>
                          <tr>
                            <td
                              className="p-1"
                              style={{
                                color: "#121212",
                                backgroundColor: "#F3F3F3",
                                borderBottom: "1px solid #E0E0E0",
                              }}
                            >
                              Current Week
                            </td>
                            <td
                              className="p-1 text-success"
                              style={{
                                fontWeight: "600",
                                textAlign: "right",
                                borderLeft: "1px solid #E0E0E0",
                                backgroundColor: "#F3F3F3",
                                borderBottom: "1px solid #E0E0E0",
                              }}
                            >
                              Avg- 3.2 km
                            </td>
                          </tr>
                          {[
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday",
                            "Saturday",
                            "Sunday",
                          ].map((day) => {
                            const distance = {
                              Monday: "3.5",
                              Tuesday: "0.0",
                              Wednesday: "2.8",
                              Thursday: "3.1",
                              Friday: "3.6",
                              Saturday: "4.2",
                              Sunday: "0.0",
                            }[day];
                            const distanceValue = parseFloat(distance);
                            const colorClass =
                              distanceValue >= 3.0
                                ? "text-success"
                                : distanceValue > 0
                                ? "text-warning"
                                : "text-danger";
                            return (
                              <tr key={day}>
                                <td
                                  className="p-1"
                                  style={{
                                    color: "#121212",
                                    borderBottom: "1px solid #E0E0E0",
                                    backgroundColor: "#F9FAFB",
                                  }}
                                >
                                  {day}
                                </td>
                                <td
                                  className={`p-1 ${colorClass}`}
                                  style={{
                                    textAlign: "right",
                                    borderBottom: "1px solid #E0E0E0",
                                    borderLeft: "1px solid #E0E0E0",
                                    backgroundColor: "#F9FAFB",
                                  }}
                                >
                                  {distance} km
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    )}
                  </div>
                </div>
              )}

              {/* Elevation Card */}
              {(!expandedCard || expandedCard === "elevation") && (
                <div
                  style={{
                    flex: 1,
                    backgroundColor: "white",
                    border: "1px solid #e9ecef",
                    borderRadius: "8px",
                    minHeight: expandedCard === "elevation" ? "550px" : "245px",
                    transition: "min-height 0.3s ease",
                  }}
                >
                  <div
                    className="d-flex align-items-center justify-content-between mb-0 p-2 border-1"
                    style={{
                      backgroundColor: "#E0ECF8",
                      borderTopLeftRadius: "7px",
                      borderTopRightRadius: "7px",
                    }}
                  >
                    <div>
                      <img
                        src={Elevation_Icon}
                        alt="Elevation"
                        className="mx-2"
                        style={{ width: "19px", height: "19px" }}
                      />
                      <span style={{ fontSize: "12px", fontWeight: "600" }}>
                        Elevation
                      </span>
                    </div>
                    <div className="d-flex">
                      <IoCalendarClearOutline
                        style={{
                          fontSize: "16px",
                          color: "#003465",
                          marginLeft: "8px",
                        }}
                      />
                      <IoIosExpand
                        style={{
                          fontSize: "16px",
                          color: "#003465",
                          marginLeft: "6px",
                          cursor: "pointer",
                        }}
                        onClick={() => handleCardExpand("elevation")}
                      />
                    </div>
                  </div>
                  <div className="p-1 pt-0">
                    {expandedCard === "elevation" ? (
                      <div className="row p-3">
                        <div className="col-8 pe-2">
                          <div
                            className="border rounded-2"
                            style={{
                              padding: "10px",
                              backgroundColor: "#F6FAFF",
                              height: "500px",
                            }}
                          >
                            <Bar
                              data={{
                                labels: [
                                  "Mon",
                                  "Tue",
                                  "Wed",
                                  "Thu",
                                  "Fri",
                                  "Sat",
                                  "Sun",
                                ],
                                datasets: [
                                  {
                                    data: [145, 0, 98, 132, 156, 178, 0],
                                    backgroundColor: "#003465",
                                    borderRadius: 3,
                                    barThickness: 35,
                                  },
                                ],
                              }}
                              options={{
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: {
                                  x: {
                                    grid: { display: false },
                                    ticks: { color: "#666", fontSize: 10 },
                                  },
                                  y: {
                                    beginAtZero: true,
                                    max: 200,
                                    grid: { color: "#f0f0f0" },
                                    ticks: { color: "#666", fontSize: 10 },
                                  },
                                },
                                categoryPercentage: 0.6,
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-4 ps-2">
                          <div
                            className="border rounded-2 p-3 d-flex flex-column"
                            style={{
                              backgroundColor: "#F6FAFF",
                              height: "500px",
                            }}
                          >
                            <div className="mb-3">
                              <p
                                className="fw-bold mb-0"
                                style={{ color: "#003465", fontSize: "14px" }}
                              >
                                Elevation Summary
                              </p>
                            </div>
                            <div className="d-flex justify-content-center mb-4">
                              <div
                                className="position-relative"
                                style={{ width: "180px", height: "180px" }}
                              >
                                <svg
                                  width="180"
                                  height="180"
                                  className="position-absolute"
                                >
                                  <circle
                                    cx="90"
                                    cy="90"
                                    r="75"
                                    fill="none"
                                    stroke="#E0ECF8"
                                    strokeWidth="12"
                                  />
                                  <circle
                                    cx="90"
                                    cy="90"
                                    r="75"
                                    fill="none"
                                    stroke="#003465"
                                    strokeWidth="10"
                                    strokeDasharray="471"
                                    strokeDashoffset="94"
                                    strokeLinecap="round"
                                    transform="rotate(-90 90 90)"
                                  />
                                </svg>
                                <div className="position-absolute top-50 start-50 translate-middle text-center">
                                  <div
                                    className="fw-bold"
                                    style={{
                                      fontSize: "24px",
                                      color: "#003465",
                                    }}
                                  >
                                    80%
                                  </div>
                                  <div
                                    style={{
                                      fontSize: "14px",
                                      color: "#003465",
                                    }}
                                  >
                                    Challenge
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-center mb-4">
                              <p
                                className="mb-0"
                                style={{ fontSize: "13px", color: "#666" }}
                              >
                                Good elevation challenge this week
                              </p>
                            </div>
                            <div className="row mb-4">
                              <div className="col-6">
                                <div
                                  className="text-center p-2 rounded"
                                  style={{ backgroundColor: "white" }}
                                >
                                  <div
                                    className="fw-bold"
                                    style={{
                                      fontSize: "18px",
                                      color: "#003465",
                                    }}
                                  >
                                    709
                                  </div>
                                  <div
                                    style={{ fontSize: "12px", color: "#666" }}
                                  >
                                    Total m
                                  </div>
                                </div>
                              </div>
                              <div className="col-6">
                                <div
                                  className="text-center p-2 rounded"
                                  style={{ backgroundColor: "white" }}
                                >
                                  <div
                                    className="fw-bold"
                                    style={{
                                      fontSize: "18px",
                                      color: "#003465",
                                    }}
                                  >
                                    178
                                  </div>
                                  <div
                                    style={{ fontSize: "12px", color: "#666" }}
                                  >
                                    Peak m
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="mt-auto">
                              <div className="row">
                                <div className="col-12 mb-2">
                                  <div
                                    className="d-flex justify-content-between align-items-center p-2 rounded"
                                    style={{
                                      backgroundColor: "white",
                                      fontSize: "12px",
                                    }}
                                  >
                                    <span style={{ color: "#666" }}>
                                      Daily Average
                                    </span>
                                    <span
                                      className="fw-bold"
                                      style={{ color: "#003465" }}
                                    >
                                      125m
                                    </span>
                                  </div>
                                </div>
                                <div className="col-12">
                                  <div
                                    className="d-flex justify-content-between align-items-center p-2 rounded"
                                    style={{
                                      backgroundColor: "white",
                                      fontSize: "12px",
                                    }}
                                  >
                                    <span style={{ color: "#666" }}>
                                      Hill Days
                                    </span>
                                    <span
                                      className="fw-bold"
                                      style={{ color: "#003465" }}
                                    >
                                      5/7
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Table
                        className=" fw-bold mb-0 mt-1"
                        style={{
                          width: "100%",
                          fontSize: "10px",
                          borderCollapse: "collapse",
                          border: "1px solid #E0E0E0",
                          borderBottom: "transparent",
                        }}
                      >
                        <tbody>
                          <tr>
                            <td
                              className="p-1"
                              style={{
                                color: "#121212",
                                backgroundColor: "#F3F3F3",
                                borderBottom: "1px solid #E0E0E0",
                              }}
                            >
                              Current Week
                            </td>
                            <td
                              className="p-1 text-success"
                              style={{
                                fontWeight: "600",
                                textAlign: "right",
                                borderLeft: "1px solid #E0E0E0",
                                backgroundColor: "#F3F3F3",
                                borderBottom: "1px solid #E0E0E0",
                              }}
                            >
                              Avg- 125m
                            </td>
                          </tr>
                          {[
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday",
                            "Saturday",
                            "Sunday",
                          ].map((day) => {
                            const elevation = {
                              Monday: "145",
                              Tuesday: "0",
                              Wednesday: "98",
                              Thursday: "132",
                              Friday: "156",
                              Saturday: "178",
                              Sunday: "0",
                            }[day];
                            const elevationValue = parseInt(elevation);
                            const colorClass =
                              elevationValue >= 100
                                ? "text-success"
                                : elevationValue > 0
                                ? "text-warning"
                                : "text-danger";
                            return (
                              <tr key={day}>
                                <td
                                  className="p-1"
                                  style={{
                                    color: "#121212",
                                    borderBottom: "1px solid #E0E0E0",
                                    backgroundColor: "#F9FAFB",
                                  }}
                                >
                                  {day}
                                </td>
                                <td
                                  className={`p-1 ${colorClass}`}
                                  style={{
                                    textAlign: "right",
                                    borderBottom: "1px solid #E0E0E0",
                                    borderLeft: "1px solid #E0E0E0",
                                    backgroundColor: "#F9FAFB",
                                  }}
                                >
                                  {elevation}m
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseData;
