import React, { useState, useRef, useEffect } from "react";
import Activity_Min from "../../../assets/images/PatientDashboard/Active Minutes.png";
import Calories_Icon from "../../../assets/images/PatientDashboard/Calories Burned.png";
import HeartRate_Icon from "../../../assets/images/PatientDashboard/heart rate.png";
import Distance_Icon from "../../../assets/images/PatientDashboard/distance.png";
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
import { getFilterData } from "../../../redux/patientsDashboard/action";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import StepsCard from "./CardsData/StepsCard";
import ActiveMinCard from "./CardsData/ActiveMinCard";
import CaloriesCard from "./CardsData/CaloriesCard";
import HeartRateCard from "./CardsData/HeartRateCard";
import DistanceCard from "./CardsData/DistanceCard";
import "./ActivityData.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ActivityData = ({ isExpanded, onExpand }) => {
  const dispatch = useDispatch();
  const { id: pathId } = useParams();
  const [searchParams] = useSearchParams();
  const patientId =
    pathId || searchParams.get("id") || searchParams.get("patientId");
  const [isOpen, setIsOpen] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const [activeTab, setActiveTab] = useState("Week");
  const [currentDate, setCurrentDate] = useState(new Date());

  // Initialize dateRange based on current week
  const initializeWeekRange = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return {
      startDate: startOfWeek,
      endDate: endOfWeek,
      key: "selection",
    };
  };

  const [dateRange, setDateRange] = useState([initializeWeekRange()]);
  const datePickerRef = useRef(null);

  // Get date range based on active tab and current date
  const getDateRange = () => {
    const date = new Date(currentDate);

    switch (activeTab) {
      case "Day":
        return {
          start: new Date(date),
          end: new Date(date),
        };
      case "Week":
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return {
          start: startOfWeek,
          end: endOfWeek,
        };
      case "Month":
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        return {
          start: startOfMonth,
          end: endOfMonth,
        };
      case "Year":
        const startOfYear = new Date(date.getFullYear(), 0, 1);
        const endOfYear = new Date(date.getFullYear(), 11, 31);
        return {
          start: startOfYear,
          end: endOfYear,
        };
      default:
        return { start: new Date(), end: new Date() };
    }
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (patientId) {
      const { start, end } = getDateRange();
      const payload = {
        patientId: patientId,
        start: formatDate(start),
        end: formatDate(end),
        field: "steps",
      };
      // if (activeTab === "Month")  // payload.period = "month";
      if (activeTab === "Year") payload.period = "year";
      dispatch(getFilterData(payload));
    }
  }, [patientId, currentDate, activeTab]);

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
      id="activityAccordion"
      style={{ backgroundColor: "white" }}
    >
      <div className="accordion-item" style={{ border: "none" }}>
        <h2 className="accordion-header">
          <div
            className="py-2 d-flex align-items-center justify-content-between"
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
                Activity Data
              </span>
              {/* <div ref={datePickerRef} style={{ position: "relative" }}>
                <button
                  className="form-control rounded-3 border-0 text-start d-flex justify-content-between align-items-center"
                  style={{
                    fontSize: "10px",
                    height: "26px",
                    width: "170px",
                    color: "#003465",
                    backgroundColor: "transparent",
                  }}
                  onClick={() => setShowDatePicker(!showDatePicker)}
                >
                  <span>
                    {dateRange[0].startDate.toLocaleDateString()} -{" "}
                    {dateRange[0].endDate.toLocaleDateString()}
                  </span>
                  <IoCalendarClearOutline
                    style={{
                      fontSize: "15px",
                      color: "#003465",
                      marginLeft: "10px",
                    }}
                  />
                </button>
                {showDatePicker && (
                  <div
                    style={{
                      position: "absolute",
                      top: "40px",
                      zIndex: 1000,
                      backgroundColor: "white",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                    }}
                  >
                    <DateRangePicker
                      ranges={dateRange}
                      onChange={(ranges) => {
                        const { startDate, endDate } = ranges.selection;
                        const daysDiff = Math.ceil(
                          (endDate - startDate) / (1000 * 60 * 60 * 24)
                        );

                        if (daysDiff <= 7) {
                          setDateRange([ranges.selection]);
                          if (patientId) {
                            const payload = {
                              patientId: patientId,
                              start: formatDate(startDate),
                              end: formatDate(endDate),
                              field: "steps",
                            };
                            if (activeTab === "Month")  // payload.period = "month";
                            if (activeTab === "Year") payload.period = "year";
                            dispatch(getFilterData(payload));
                          }
                        }
                      }}
                      maxDate={new Date()}
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
              {/* Steps Card */}
              {(!expandedCard || expandedCard === "steps") && (
                <StepsCard
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

              {/* Active Mins Card */}
              {(!expandedCard || expandedCard === "activeMins") && (
                <ActiveMinCard
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

              {/* Calories Card */}
              {(!expandedCard || expandedCard === "calories") && (
                <CaloriesCard
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

              {/* Heart Rate Card */}
              {(!expandedCard || expandedCard === "heartRate") && (
                <HeartRateCard
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

              {/* Distance Card */}
              {(!expandedCard || expandedCard === "distance") && (
                <DistanceCard
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityData;
