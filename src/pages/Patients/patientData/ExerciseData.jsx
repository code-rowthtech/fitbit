import React, { useState, useRef, useEffect } from "react";
import { IoCalendarClearOutline } from "react-icons/io5";
import { Table } from "react-bootstrap";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
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

import ExerciseSessionsCard from "./CardsData/ExerciseSessionsCard";
import GPSTrackingCard from "./CardsData/GPSTrackingCard";
import ElevationCard from "./CardsData/ElevationCard";

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
                <ExerciseSessionsCard
                  expandedCard={expandedCard}
                  onCardExpand={handleCardExpand}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  currentDate={currentDate}
                  onDateChange={setCurrentDate}
                />
              )}

              {/* GPS Tracking Card */}
              {(!expandedCard || expandedCard === "gpsTracking") && (
                <GPSTrackingCard
                  expandedCard={expandedCard}
                  onCardExpand={handleCardExpand}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  currentDate={currentDate}
                  onDateChange={setCurrentDate}
                />
              )}

              {/* Elevation Card */}
              {(!expandedCard || expandedCard === "elevation") && (
                <ElevationCard
                  expandedCard={expandedCard}
                  onCardExpand={handleCardExpand}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  currentDate={currentDate}
                  onDateChange={setCurrentDate}
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

export default ExerciseData;