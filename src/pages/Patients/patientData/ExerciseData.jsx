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
import { getMasterData } from "../../../redux/notes/action";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";

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

const ExerciseData = ({ isExpanded, onExpand, initialExpandedCard }) => {
  const dispatch = useDispatch();
  const { id: pathId } = useParams();
  const [searchParams] = useSearchParams();
  const patientId =
    pathId || searchParams.get("id") || searchParams.get("patientId");
  const [isOpen, setIsOpen] = useState(true);
  
  const masterDataState = useSelector((state) => state.getMasterDataReducer);
  const fieldKey = 'ExerciseData';
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);

  useEffect(() => {
    if (initialExpandedCard && !expandedCard) {
      setExpandedCard(initialExpandedCard);
    }
  }, [initialExpandedCard]);
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

  useEffect(() => {
    dispatch(getMasterData({ type: 'ExerciseData' }, fieldKey));
  }, [dispatch]);

  const masterDataId = masterDataState?.data?.[fieldKey]?.masterData?._id;

  const handleCardExpand = (cardType) => {
    if (expandedCard === cardType) {
      setExpandedCard(null);
      onExpand(null);
    } else {
      setExpandedCard(cardType);
      onExpand(cardType);
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
            className="pt-2 pb-0 d-flex align-items-center justify-content-between"
            // style={{ backgroundColor: "#f8f9fa", padding: "16px 20px" }}
            style={{ backgroundColor: "white", padding: "16px 20px" }}
          >
            <div className="d-flex align-items-center flex-grow-1">
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  marginRight: "15px",
                }}
              >
                Exercise Data
              </span>
              {expandedCard && (
                <div className="d-flex gap-2 ms-3">
                  {[
                    { key: "sessions", label: "Sessions" },
                    { key: "gpsTracking", label: "GPS Tracking" },
                    { key: "elevation", label: "Elevation" },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      className="btn btn-sm"
                      style={{
                        fontSize: "12px",
                        fontWeight: "500",
                        padding: "4px 12px",
                        backgroundColor: expandedCard === tab.key ? "#003465" : "#E8F2FF",
                        color: expandedCard === tab.key ? "white" : "#003465",
                        border: "none",
                        borderRadius: "4px",
                        transition: "all 0.2s ease",
                      }}
                      onClick={() => setExpandedCard(tab.key)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              )}
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
                  patientId={patientId}
                  masterDataId={masterDataId}
                  expandedCard={expandedCard}
                  onCardExpand={handleCardExpand}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  currentDate={currentDate}
                  onDateChange={setCurrentDate}
                  formatDate={formatDate}
                />
              )}

              {/* GPS Tracking Card */}
              {(!expandedCard || expandedCard === "gpsTracking") && (
                <GPSTrackingCard
                  patientId={patientId}
                  masterDataId={masterDataId}
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
                  patientId={patientId}
                  masterDataId={masterDataId}
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
