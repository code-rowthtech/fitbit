import React, { useState, useRef, useEffect } from "react";
import CaloriesConsumed_Icon from "../../../assets/images/PatientDashboard/Calories Burned.png";
import WaterIntake_Icon from "../../../assets/images/PatientDashboard/water intake.png";
import WaterIntakeCard from "./CardsData/WaterIntakeCard";
import { useParams, useSearchParams } from "react-router-dom";
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

const NutritionData = ({ isExpanded, onExpand }) => {
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
      id="nutritionDataAccordion"
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
                Nutrition Data
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
              {/* Calories Consumed Card */}
              {(!expandedCard || expandedCard === "calories") && (
                <div
                  style={{
                    flex: 1,
                    backgroundColor: "white",
                    border: "1px solid #e9ecef",
                    borderRadius: "8px",
                    minHeight: expandedCard === "calories" ? "550px" : "245px",
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
                        src={CaloriesConsumed_Icon}
                        alt="Calories Consumed"
                        className="mx-2"
                        style={{ width: "19px", height: "19px" }}
                      />
                      <span style={{ fontSize: "12px", fontWeight: "600" }}>
                        Calories Consumed
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
                        onClick={() => handleCardExpand("calories")}
                      />
                    </div>
                  </div>
                  <div className="p-1 pt-0">
                    {expandedCard === "calories" ? (
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
                                      2250, 2100, 2300, 2050, 2200, 2400, 1960,
                                    ],
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
                                    beginAtZero: false,
                                    min: 1800,
                                    max: 2600,
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
                                Calories Summary
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
                                    Target
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-center mb-4">
                              <p
                                className="mb-0"
                                style={{ fontSize: "13px", color: "#666" }}
                              >
                                Good calorie intake balance
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
                                    2,180
                                  </div>
                                  <div
                                    style={{ fontSize: "12px", color: "#666" }}
                                  >
                                    Daily Avg
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
                                    2,200
                                  </div>
                                  <div
                                    style={{ fontSize: "12px", color: "#666" }}
                                  >
                                    Target
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
                                      Weekly Total
                                    </span>
                                    <span
                                      className="fw-bold"
                                      style={{ color: "#003465" }}
                                    >
                                      15,260
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
                                      Highest Day
                                    </span>
                                    <span
                                      className="fw-bold"
                                      style={{ color: "#003465" }}
                                    >
                                      2,400
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
                              Avg- 2,180 cal
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
                            const calories = {
                              Monday: "2,250",
                              Tuesday: "2,100",
                              Wednesday: "2,300",
                              Thursday: "2,050",
                              Friday: "2,200",
                              Saturday: "2,400",
                              Sunday: "1,960",
                            }[day];
                            const calorieValue = parseInt(
                              calories.replace(",", "")
                            );
                            const colorClass =
                              calorieValue >= 2000 && calorieValue <= 2500
                                ? "text-success"
                                : calorieValue < 2000
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
                                  {calories} cal
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

              {/* Water Intake Card */}
              {(!expandedCard || expandedCard === "water") && (
                <WaterIntakeCard
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
              {/* Empty card to maintain width */}
              {!expandedCard && <div style={{ flex: 1 }}></div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionData;
