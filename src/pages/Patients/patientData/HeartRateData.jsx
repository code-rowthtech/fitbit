import React, { useState, useEffect } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { getMasterData } from "../../../redux/notes/action";
import RestingHeartRateCard from "./CardsData/RestingHeartRateCard";
import WeightCard from "./CardsData/WeightCard";

const HeartRateData = ({ isExpanded, onExpand }) => {
  const dispatch = useDispatch();
  const { id: pathId } = useParams();
  const [searchParams] = useSearchParams();
  const patientId =
    pathId || searchParams.get("id") || searchParams.get("patientId");
  const [isOpen, setIsOpen] = useState(true);
  
  const masterDataState = useSelector((state) => state.getMasterDataReducer);
  const fieldKey = 'HeartRateBodyMetrics';
  const [expandedCard, setExpandedCard] = useState(null);
  const [heartRateActiveTab, setHeartRateActiveTab] = useState("Week");
  const [weightActiveTab, setWeightActiveTab] = useState("Week");
  const [currentDate, setCurrentDate] = useState(new Date());

  const formatDate = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    dispatch(getMasterData({ type: 'HeartRateBodyMetrics' }, fieldKey));
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
      id="heartRateAccordion"
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
                Heart Rate And Body Metrics
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
              {/* Resting Heart Rate Card */}
              {(!expandedCard || expandedCard === "restingHeartRate") && (
                <RestingHeartRateCard
                  patientId={patientId}
                  masterDataId={masterDataId}
                  expandedCard={expandedCard}
                  onCardExpand={handleCardExpand}
                  activeTab={heartRateActiveTab}
                  onTabChange={setHeartRateActiveTab}
                  currentDate={currentDate}
                  onDateChange={setCurrentDate}
                  formatDate={formatDate}
                />
              )}

              {/* Weight Card */}
              {(!expandedCard || expandedCard === "weight") && (
                <WeightCard
                  patientId={patientId}
                  masterDataId={masterDataId}
                  expandedCard={expandedCard}
                  onCardExpand={handleCardExpand}
                  activeTab={weightActiveTab}
                  onTabChange={setWeightActiveTab}
                  currentDate={currentDate}
                  onDateChange={setCurrentDate}
                  formatDate={formatDate}
                />
              )}

              {!expandedCard && <div style={{ flex: 1 }}></div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeartRateData;
