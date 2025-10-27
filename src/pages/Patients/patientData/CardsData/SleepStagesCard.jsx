import React, { useEffect, useState } from "react";
import { IoIosExpand } from "react-icons/io";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { Bar } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { getPatientSleepStages } from "../../../../redux/patientsDashboard/action";

// Sleep Journey Chart Component
const SleepJourneyChart = ({
  FilterData,
  currentDate,
  selectedSessionIndex = 0,
}) => {
  const [tooltip, setTooltip] = React.useState({
    show: false,
    content: "",
    x: 0,
    y: 0,
  });

  // Process API data to create timeline
  const processApiData = () => {
    let sleepDataSource = null;
    let levelsData = [];

    // Check if this is today's data or past data
    const selectedDate = new Date(currentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    const isToday = selectedDate.getTime() === today.getTime();

    if (isToday && FilterData?.todayData?.sleepData?.[0]?.levels?.data) {
      // Today's data
      sleepDataSource = FilterData.todayData.sleepData[0];
      levelsData = sleepDataSource.levels.data;
    } else if (FilterData?.data?.[0]?.sleepData) {
      // Past data - use selected session index
      const sleepSessions = FilterData.data[0].sleepData;

      if (sleepSessions[selectedSessionIndex]?.levels?.data) {
        sleepDataSource = sleepSessions[selectedSessionIndex];
        levelsData = sleepDataSource.levels.data;
      }
    }

    // If still no data, return null
    if (!levelsData || levelsData.length === 0) {
      return null;
    }

    // Calculate total sleep duration and start/end times
    const startTime = new Date(sleepDataSource.startTime);
    const endTime = new Date(sleepDataSource.endTime);
    const totalDurationMs = endTime - startTime;

    // Group segments by sleep stage
    const stageGroups = { wake: [], light: [], deep: [], rem: [] };
    const stageTotals = { wake: 0, light: 0, deep: 0, rem: 0 };

    levelsData.forEach((item, index) => {
      const level = item.level === "awake" ? "wake" : item.level;
      if (!stageGroups[level]) return;

      const startMs = new Date(item.dateTime) - startTime;
      const startPercent = (startMs / totalDurationMs) * 100;
      const widthPercent = ((item.seconds * 1000) / totalDurationMs) * 100;

      const startTimeStr = new Date(item.dateTime).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "UTC",
      });
      const endTimeStr = new Date(
        new Date(item.dateTime).getTime() + item.seconds * 1000
      ).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "UTC",
      });

      stageGroups[level].push({
        start: startPercent,
        width: widthPercent,
        time: `${startTimeStr}-${endTimeStr}`,
        duration: item.seconds,
      });

      stageTotals[level] += item.seconds;
    });

    // Format durations
    const formatDuration = (seconds) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    };

    const totalSeconds = Object.values(stageTotals).reduce((a, b) => a + b, 0);

    return {
      bedtime: startTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "UTC",
      }),
      wakeup: endTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "UTC",
      }),
      totalSleep: formatDuration(totalSeconds),
      stages: {
        wake: {
          duration: formatDuration(stageTotals.wake),
          color: "#E67E22",
          percentage: Math.round((stageTotals.wake / totalSeconds) * 100),
          segments: stageGroups.wake,
        },
        light: {
          duration: formatDuration(stageTotals.light),
          color: "#3498DB",
          percentage: Math.round((stageTotals.light / totalSeconds) * 100),
          segments: stageGroups.light,
        },
        deep: {
          duration: formatDuration(stageTotals.deep),
          color: "#2C3E50",
          percentage: Math.round((stageTotals.deep / totalSeconds) * 100),
          segments: stageGroups.deep,
        },
        rem: {
          duration: formatDuration(stageTotals.rem),
          color: "#9B59B6",
          percentage: Math.round((stageTotals.rem / totalSeconds) * 100),
          segments: stageGroups.rem,
        },
      },
    };
  };

  const sleepData = React.useMemo(
    () => processApiData(),
    [FilterData, currentDate, selectedSessionIndex]
  );

  // If no detailed sleep data, show message
  if (!sleepData) {
    return (
      <div className="h-100 d-flex align-items-center justify-content-center flex-column">
        <span style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>
          No detailed sleep data available
        </span>
        <span style={{ fontSize: "10px", color: "#999" }}>
          Timeline view requires sleep stage data
        </span>
      </div>
    );
  }

  const handleMouseEnter = (e, stageName, segment) => {
    const rect = e.target.getBoundingClientRect();
    setTooltip({
      show: true,
      content: `${stageName.toUpperCase()}: ${segment.time} (${
        segment.width
      }% of night)`,
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ show: false, content: "", x: 0, y: 0 });
  };

  return (
    <div
      className="h-100 d-flex flex-column"
      style={{
        padding: "8px",
        position: "relative",
        background: "linear-gradient(135deg, #F8FBFF 0%, #E8F2FF 100%)",
        borderRadius: "8px",
      }}
    >
      {/* Sleep stages summary */}
      <div className="mt-1">
        <div className="row g-2">
          {Object.entries(sleepData.stages).map(([stageName, stageData]) => (
            <div key={stageName} className="col-3">
              <div
                className="text-center p-2"
                style={{
                  background: `${stageData.color}10`,
                  borderRadius: "6px",
                  border: `1px solid ${stageData.color}30`,
                }}
              >
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: "600",
                    color: stageData.color,
                    textTransform: "uppercase",
                    marginBottom: "2px",
                  }}
                >
                  {stageName === "wake" ? "WAKE" : stageName}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    color: "#003465",
                  }}
                >
                  {stageData.duration}
                </div>
                <div
                  style={{
                    fontSize: "9px",
                    color: "#666",
                  }}
                >
                  {stageData.percentage}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Custom Tooltip */}
      {tooltip.show && (
        <div
          style={{
            position: "fixed",
            left: tooltip.x,
            top: tooltip.y,
            transform: "translateX(-50%) translateY(-100%)",
            background: "linear-gradient(135deg, #003465 0%, #004080 100%)",
            color: "white",
            padding: "8px 12px",
            borderRadius: "8px",
            fontSize: "11px",
            fontWeight: "600",
            zIndex: 1000,
            whiteSpace: "nowrap",
            boxShadow:
              "0 4px 12px rgba(0,52,101,0.3), 0 2px 4px rgba(0,0,0,0.1)",
            pointerEvents: "none",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          {tooltip.content}
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: "6px solid #003465",
            }}
          />
        </div>
      )}
    </div>
  );
};

const SleepStagesCard = ({
  patientId,
  expandedCard,
  onCardExpand,
  activeTab,
  onTabChange,
  currentDate,
  onDateChange,
  formatDate,
}) => {
  const dispatch = useDispatch();
  const [selectedSessionIndex, setSelectedSessionIndex] = useState(0);
  const FilterData = useSelector(
    (state) => state?.getPatientSleepStages?.data?.response?.data
  );
  const AverageData = useSelector(
    (state) => state?.getPatientSleepStages?.data?.response
  );
  const Loading = useSelector((state) => state?.getPatientSleepStages?.loading);

  // Initial API call when component mounts
  useEffect(() => {
    if (patientId && currentDate) {
      const date = new Date(currentDate);
      let start, end;

      switch (activeTab) {
        case "Day":
          start = end = new Date(date);
          break;
        case "Week":
          start = new Date(date);
          start.setDate(date.getDate() - date.getDay());
          end = new Date(start);
          end.setDate(start.getDate() + 6);
          break;
        case "Month":
          start = new Date(date.getFullYear(), date.getMonth(), 1);
          end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
          break;
        case "Year":
          start = new Date(date.getFullYear(), 0, 1);
          end = new Date(date.getFullYear(), 11, 31);
          break;
      }

      const payload = {
        patientId: patientId,
        start: formatDate(start),
        end: formatDate(end),
        field: "sleep",
      };
      if (activeTab === "Year") payload.period = "year";
      dispatch(getPatientSleepStages(payload));
    }
  }, [patientId, activeTab, currentDate, dispatch, formatDate]);

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: "white",
        border: "1px solid #e9ecef",
        borderRadius: "8px",
        minHeight: expandedCard === "sleepStages" ? "550px" : "245px",
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
          <span
            style={{
              fontSize: "12px",
              fontWeight: "600",
              color: "#003465",
              marginLeft: "8px",
            }}
          >
            Sleep Stages
          </span>
        </div>
        <div className="d-flex">
          <IoIosExpand
            style={{
              fontSize: "16px",
              color: "#003465",
              marginLeft: "6px",
              cursor: "pointer",
            }}
            onClick={() => onCardExpand("sleepStages")}
          />
        </div>
      </div>
      <div className="p-1 pt-0">
        <div
          className={`rounded-3 px-2 mt-1 d-flex flex-column ${
            Loading ? "placeholder-glow" : ""
          }`}
          style={{ backgroundColor: "#F8FBFF", height: "200px" }}
        >
          <div className="d-flex justify-content-center mb-2">
            <div
              className="position-relative"
              style={{ width: "120px", height: "120px" }}
            >
              <svg width="120" height="120" className="position-absolute">
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  fill="none"
                  stroke="#E8F2FF"
                  strokeWidth="6"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  fill="none"
                  stroke="#003465"
                  strokeWidth="4"
                  strokeDasharray="301"
                  strokeDashoffset={
                    301 -
                    ((AverageData?.todayData?.value || 0) /
                      (AverageData?.stats?.average || 480)) *
                      301
                  }
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <div className="position-absolute top-50 start-50 translate-middle text-center">
                <div
                  className={`fw-bold ${
                    Loading ? "placeholder rounded-1" : ""
                  }`}
                  style={{ fontSize: "16px", color: "#003465" }}
                >
                  {AverageData?.todayData?.value || 0}
                </div>
                <div
                  style={{
                    fontSize: "9px",
                    color: "#666",
                    fontWeight: "500",
                  }}
                >
                  Minutes
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mb-2">
            <p
              className={`mb-0 ${Loading ? "placeholder rounded-1" : ""}`}
              style={{ fontSize: "10px", color: "#666", fontWeight: "500" }}
            >
              Sleep minutes today
            </p>
          </div>

          <div className="row g-1">
            <div className="col-6">
              <div
                className="text-center py-1 px-2 rounded-2"
                style={{
                  backgroundColor: "white",
                  border: "1px solid #E8F2FF",
                }}
              >
                <div
                  className={`fw-bold ${
                    Loading ? "placeholder rounded-1" : ""
                  }`}
                  style={{ fontSize: "14px", color: "#003465" }}
                >
                  {AverageData?.todayData?.value || 0}
                </div>
                <div
                  style={{
                    fontSize: "9px",
                    color: "#666",
                    fontWeight: "500",
                  }}
                >
                  Today
                </div>
              </div>
            </div>
            <div className="col-6">
              <div
                className="text-center py-1 px-2 rounded-2"
                style={{
                  backgroundColor: "white",
                  border: "1px solid #E8F2FF",
                }}
              >
                <div
                  className={`fw-bold ${
                    Loading ? "placeholder rounded-1" : ""
                  }`}
                  style={{ fontSize: "14px", color: "#003465" }}
                >
                  {Math.round((AverageData?.stats?.average || 0) / 60) || 8}h
                </div>
                <div
                  style={{
                    fontSize: "9px",
                    color: "#666",
                    fontWeight: "500",
                  }}
                >
                  Avg Daily
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SleepStagesCard;
