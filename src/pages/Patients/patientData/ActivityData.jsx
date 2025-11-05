import React, { useState, useEffect } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { getMasterData } from "../../../redux/notes/action";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import StepsCard from "./CardsData/StepsCard";
import ActiveMinCard from "./CardsData/ActiveMinCard";
import CaloriesCard from "./CardsData/CaloriesCard";
import DistanceCard from "./CardsData/DistanceCard";
import "./ActivityData.css";

const ActivityData = ({ isExpanded, onExpand }) => {
  const dispatch = useDispatch();
  const { id: pathId } = useParams();
  const [searchParams] = useSearchParams();
  const patientId =
    pathId || searchParams.get("id") || searchParams.get("patientId");
  const [isOpen, setIsOpen] = useState(true);
  const masterDataState = useSelector((state) => state.getMasterDataReducer);
  const fieldKey = 'ActivityData';
  const [expandedCard, setExpandedCard] = useState(null);
  const [activeTab, setActiveTab] = useState("Week");
  const [currentDate, setCurrentDate] = useState(new Date());

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  useEffect(() => {
    dispatch(getMasterData({ type: 'ActivityData' }, fieldKey));
  }, [dispatch]);

  const masterDataId = masterDataState?.data?.[fieldKey]?.masterData?._id;

  const handleCardExpand = (cardType) => {
    if (expandedCard === cardType) {
      setExpandedCard(null);
      onExpand();
    } else {
      setExpandedCard(cardType);
      onExpand();
    }
  };

  return (
    <div
      className="accordion"
      id="activityAccordion"
      style={{ backgroundColor: "white" }}
    >
      <div className="accordion-item" style={{ border: "none" }}>
        <h2 className="accordion-header">
          <div
            className="pt-2 pb-0 d-flex align-items-center justify-content-between"
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

              {/* Active Mins Card */}
              {(!expandedCard || expandedCard === "activeMins") && (
                <ActiveMinCard
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

              {/* Calories Card */}
              {(!expandedCard || expandedCard === "calories") && (
                <CaloriesCard
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

              {/* Distance Card */}
              {(!expandedCard || expandedCard === "distance") && (
                <DistanceCard
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityData;
