import React, { useState, useRef, useEffect } from "react";
import BMI_Icon from "../../../assets/images/PatientDashboard/BMI.png";
import BodyFat_Icon from "../../../assets/images/PatientDashboard/body fat percentage.png";
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
import WeightCard from "./CardsData/WeightCard";
import { useParams, useSearchParams } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const WeightBodyMetrics = ({ isExpanded, onExpand }) => {
  const { id: pathId } = useParams();
  const [searchParams] = useSearchParams();
  const patientId =
    pathId || searchParams.get("id") || searchParams.get("patientId");
  const [isOpen, setIsOpen] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const [activeTab, setActiveTab] = useState("Week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const datePickerRef = useRef(null);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

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
      id="weightBodyMetricsAccordion"
      style={{ backgroundColor: "white" }}
    >
      <div className="accordion-item" style={{ border: "none" }}>
        <h2 className="accordion-header">
          <div
            className="py-2 d-flex align-items-center justify-content-between"
            // style={{ backgroundColor: "#f8f9fa", padding: "16px 20px" }}
            style={{ backgroundColor: "white", padding: "16px 20px" }}
          >
            <div className="d-flex align-items-center">
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  marginRight: "15px",
                }}
              >
                Weight and Body Metrics
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
              {/* Weight Card */}
              {(!expandedCard || expandedCard === "weight") && (
                <WeightCard
                  patientId={patientId}
                  expandedCard={expandedCard}
                  onCardExpand={handleCardExpand}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  currentDate={currentDate}
                  onDateChange={setCurrentDate}
                  formatDate={formatDate}
                />
              )}

              {/* BMI Card */}
              {(!expandedCard || expandedCard === "bmi") && (
                <div
                  style={{
                    flex: 1,
                    backgroundColor: "white",
                    border: "1px solid #e9ecef",
                    borderRadius: "8px",
                    minHeight: expandedCard === "bmi" ? "550px" : "245px",
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
                        src={BMI_Icon}
                        alt="BMI"
                        className="mx-2"
                        style={{ width: "19px", height: "19px" }}
                      />
                      <span style={{ fontSize: "12px", fontWeight: "600" }}>
                        BMI
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
                        onClick={() => handleCardExpand("bmi")}
                      />
                    </div>
                  </div>
                  <div className="p-1 pt-0">
                    {expandedCard === "bmi" ? (
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
                                    data: [
                                      22.7, 22.9, 22.6, 23.0, 22.8, 22.7, 22.9,
                                    ],
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
                                    beginAtZero: false,
                                    min: 22,
                                    max: 24,
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
                                BMI Summary
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
                                BMI is in normal healthy range
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
                                    22.8
                                  </div>
                                  <div
                                    style={{ fontSize: "12px", color: "#666" }}
                                  >
                                    Current BMI
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
                                    18.5-24.9
                                  </div>
                                  <div
                                    style={{ fontSize: "12px", color: "#666" }}
                                  >
                                    Normal Range
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
                                      22.8
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
                                      Category
                                    </span>
                                    <span
                                      className="fw-bold text-success"
                                      style={{ color: "#003465" }}
                                    >
                                      Normal
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
                              Avg- 22.8
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
                            const bmi = {
                              Monday: "22.7",
                              Tuesday: "22.9",
                              Wednesday: "22.6",
                              Thursday: "23.0",
                              Friday: "22.8",
                              Saturday: "22.7",
                              Sunday: "22.9",
                            }[day];
                            const bmiValue = parseFloat(bmi);
                            const colorClass =
                              bmiValue >= 18.5 && bmiValue <= 24.9
                                ? "text-success"
                                : bmiValue <= 29.9
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
                                  {bmi}
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

              {/* Body Fat Percentage Card */}
              {(!expandedCard || expandedCard === "bodyFat") && (
                <div
                  style={{
                    flex: 1,
                    backgroundColor: "white",
                    border: "1px solid #e9ecef",
                    borderRadius: "8px",
                    minHeight: expandedCard === "bodyFat" ? "550px" : "245px",
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
                        src={BodyFat_Icon}
                        alt="Body Fat Percentage"
                        className="mx-2"
                        style={{ width: "19px", height: "19px" }}
                      />
                      <span style={{ fontSize: "12px", fontWeight: "600" }}>
                        Body Fat Percentage
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
                        onClick={() => handleCardExpand("bodyFat")}
                      />
                    </div>
                  </div>
                  <div className="p-1 pt-0">
                    {expandedCard === "bodyFat" ? (
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
                                    data: [
                                      15.1, 15.3, 15.0, 15.4, 15.2, 15.1, 15.3,
                                    ],
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
                                    beginAtZero: false,
                                    min: 14.5,
                                    max: 16,
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
                                Body Fat Summary
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
                                Body fat percentage is optimal
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
                                    15.2%
                                  </div>
                                  <div
                                    style={{ fontSize: "12px", color: "#666" }}
                                  >
                                    Current %
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
                                    10-18%
                                  </div>
                                  <div
                                    style={{ fontSize: "12px", color: "#666" }}
                                  >
                                    Healthy Range
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
                                      15.2%
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
                                      Status
                                    </span>
                                    <span
                                      className="fw-bold text-success"
                                      style={{ color: "#003465" }}
                                    >
                                      Optimal
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
                              Avg- 15.2%
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
                            const bodyFat = {
                              Monday: "15.1",
                              Tuesday: "15.3",
                              Wednesday: "15.0",
                              Thursday: "15.4",
                              Friday: "15.2",
                              Saturday: "15.1",
                              Sunday: "15.3",
                            }[day];
                            const fatValue = parseFloat(bodyFat);
                            const colorClass =
                              fatValue >= 10 && fatValue <= 18
                                ? "text-success"
                                : fatValue <= 25
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
                                  {bodyFat}%
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

export default WeightBodyMetrics;
