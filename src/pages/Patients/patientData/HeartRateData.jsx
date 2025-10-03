import React, { useState, useRef, useEffect } from "react";
import RestingHeartRate_Icon from "../../../assets/images/PatientDashboard/heart rate.png";
import ContinuousHeartRate_Icon from "../../../assets/images/PatientDashboard/continuous heart rate.png";
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

const HeartRateData = ({ isExpanded, onExpand }) => {
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
      id="heartRateAccordion"
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
                Heart Rate Data
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
              {/* Resting Heart Rate Card */}
              {(!expandedCard || expandedCard === "resting") && (
                <div
                  style={{
                    flex: 1,
                    backgroundColor: "white",
                    border: "1px solid #e9ecef",
                    borderRadius: "8px",
                    minHeight: expandedCard === "resting" ? "550px" : "245px",
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
                        src={RestingHeartRate_Icon}
                        alt="Resting Heart Rate"
                        className="mx-2"
                        style={{ width: "19px", height: "19px" }}
                      />
                      <span style={{ fontSize: "12px", fontWeight: "600" }}>
                        Resting Heart Rate
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
                        onClick={() => handleCardExpand("resting")}
                      />
                    </div>
                  </div>
                  <div className="p-1 pt-0">
                    {expandedCard === "resting" ? (
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
                                    data: [60, 62, 61, 64, 63, 61, 63],
                                    backgroundColor: "#003465",
                                    borderRadius: 3,
                                    barThickness: 15,
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
                                Resting HR Summary
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
                                    strokeDashoffset="47"
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
                                    90%
                                  </div>
                                  <div
                                    style={{
                                      fontSize: "14px",
                                      color: "#003465",
                                    }}
                                  >
                                    Healthy
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-center mb-4">
                              <p
                                className="mb-0"
                                style={{ fontSize: "13px", color: "#666" }}
                              >
                                Excellent resting heart rate
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
                                    62
                                  </div>
                                  <div
                                    style={{ fontSize: "12px", color: "#666" }}
                                  >
                                    Current BPM
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
                                    60-65
                                  </div>
                                  <div
                                    style={{ fontSize: "12px", color: "#666" }}
                                  >
                                    Target Range
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
                                      Weekly Average
                                    </span>
                                    <span
                                      className="fw-bold"
                                      style={{ color: "#003465" }}
                                    >
                                      62 bpm
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
                                      Lowest
                                    </span>
                                    <span
                                      className="fw-bold"
                                      style={{ color: "#003465" }}
                                    >
                                      60 bpm
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
                              Avg- 62 bpm
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
                            const restingHR = {
                              Monday: "60",
                              Tuesday: "62",
                              Wednesday: "61",
                              Thursday: "64",
                              Friday: "63",
                              Saturday: "61",
                              Sunday: "63",
                            }[day];
                            const hrValue = parseInt(restingHR);
                            const colorClass =
                              hrValue >= 60 && hrValue <= 65
                                ? "text-success"
                                : hrValue <= 70
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
                                  {restingHR} bpm
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

              {/* Continuous Heart Rate Card */}
              {(!expandedCard || expandedCard === "continuous") && (
                <div
                  style={{
                    flex: 1,
                    backgroundColor: "white",
                    border: "1px solid #e9ecef",
                    borderRadius: "8px",
                    minHeight:
                      expandedCard === "continuous" ? "550px" : "245px",
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
                        src={ContinuousHeartRate_Icon}
                        alt="Continuous Heart Rate"
                        className="mx-2"
                        style={{ width: "19px", height: "19px" }}
                      />
                      <span style={{ fontSize: "12px", fontWeight: "600" }}>
                        Continuous Heart Rate
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
                        onClick={() => handleCardExpand("continuous")}
                      />
                    </div>
                  </div>
                  <div className="p-1 pt-0">
                    {expandedCard === "continuous" ? (
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
                                    data: [72, 76, 74, 78, 75, 73, 77],
                                    backgroundColor: "#003465",
                                    borderRadius: 3,
                                    barThickness: 15,
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
                                Continuous HR Summary
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
                                    strokeDashoffset="71"
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
                                    85%
                                  </div>
                                  <div
                                    style={{
                                      fontSize: "14px",
                                      color: "#003465",
                                    }}
                                  >
                                    Normal
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-center mb-4">
                              <p
                                className="mb-0"
                                style={{ fontSize: "13px", color: "#666" }}
                              >
                                Heart rate within normal range
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
                                    75
                                  </div>
                                  <div
                                    style={{ fontSize: "12px", color: "#666" }}
                                  >
                                    Avg BPM
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
                                    78
                                  </div>
                                  <div
                                    style={{ fontSize: "12px", color: "#666" }}
                                  >
                                    Peak BPM
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
                                      Weekly Average
                                    </span>
                                    <span
                                      className="fw-bold"
                                      style={{ color: "#003465" }}
                                    >
                                      75 bpm
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
                                    <span style={{ color: "#666" }}>Zone</span>
                                    <span
                                      className="fw-bold text-success"
                                      style={{ color: "#003465" }}
                                    >
                                      Healthy
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
                              Avg- 75 bpm
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
                            const continuousHR = {
                              Monday: "72",
                              Tuesday: "76",
                              Wednesday: "74",
                              Thursday: "78",
                              Friday: "75",
                              Saturday: "73",
                              Sunday: "77",
                            }[day];
                            const hrValue = parseInt(continuousHR);
                            const colorClass =
                              hrValue >= 70 && hrValue <= 80
                                ? "text-success"
                                : hrValue <= 85
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
                                  {continuousHR} bpm
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
              {/* Empty card to maintain width */}
              {!expandedCard && <div style={{ flex: 1 }}></div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeartRateData;
