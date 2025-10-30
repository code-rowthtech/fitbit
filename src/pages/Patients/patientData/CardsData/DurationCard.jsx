import React, { useEffect, useState } from "react";
import Duration_Icon from "../../../../assets/images/PatientDashboard/duration.png";
import { IoIosExpand } from "react-icons/io";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { Bar } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import {
  getPatientSleep,
  getPatientSleepStages,
} from "../../../../redux/patientsDashboard/action";
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
      // console.log("No sleep levels data found for timeline", {
      //   FilterData,
      //   currentDate,
      //   isToday,
      //   sleepSessions: FilterData?.data?.[0]?.sleepData?.length || 0,
      // });
      return null;
    }

    // Calculate total sleep duration and start/end times
    const startTime = new Date(levelsData[0].dateTime);
    const lastItem = levelsData[levelsData.length - 1];
    const endTime = new Date(
      new Date(lastItem.dateTime).getTime() + lastItem.seconds * 1000
    );
    const totalDurationMs = endTime - startTime;

    // Group segments by sleep stage
    const stageGroups = { wake: [], light: [], deep: [], rem: [] };
    const stageTotals = { wake: 0, light: 0, deep: 0, rem: 0 };

    levelsData.forEach((item, index) => {
      let level = item.level;
      // Map nap levels to standard sleep stages
      if (level === "awake") level = "wake";
      if (level === "asleep") level = "light";
      if (level === "restless") level = "wake";

      if (!stageGroups[level]) return;

      const startMs = new Date(item.dateTime) - startTime;
      const startPercent = (startMs / totalDurationMs) * 100;
      const widthPercent = ((item.seconds * 1000) / totalDurationMs) * 100;

      const startTimeStr = new Date(item.dateTime).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      const endTimeStr = new Date(
        new Date(item.dateTime).getTime() + item.seconds * 1000
      ).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
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

    // Calculate transition points for dotted lines
    const transitionPoints = [];
    levelsData.forEach((item, index) => {
      if (index > 0) {
        const prevLevel =
          levelsData[index - 1].level === "awake"
            ? "wake"
            : levelsData[index - 1].level;
        const currentLevel = item.level === "awake" ? "wake" : item.level;
        if (prevLevel !== currentLevel) {
          const transitionMs = new Date(item.dateTime) - startTime;
          const transitionPercent = (transitionMs / totalDurationMs) * 100;
          transitionPoints.push(transitionPercent);
        }
      }
    });

    return {
      bedtime: startTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      wakeup: endTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
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
      transitionPoints,
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
      {/* Enhanced Header */}
      <div
        className="mb-3"
        style={{
          background: "white",
          borderRadius: "8px",
          padding: "8px",
          boxShadow: "0 2px 4px rgba(0,52,101,0.08)",
        }}
      >
        {/* Enhanced Time Labels */}
        <div
          className="d-flex justify-content-between align-items-center pt-2"
          style={{
            borderTop: "2px solid #E8F2FF",
            background:
              "linear-gradient(90deg, #F8FBFF 0%, #E8F2FF 50%, #F8FBFF 100%)",
            borderRadius: "8px",
            padding: "8px 12px",
          }}
        >
          <div className="text-center">
            <div
              style={{ fontSize: "12px", fontWeight: "700", color: "#003465" }}
            >
              {sleepData.bedtime}
            </div>
            <div style={{ fontSize: "9px", color: "#666", fontWeight: "500" }}>
              Sleep Start
            </div>
          </div>
          <div className="text-center">
            <div style={{ fontSize: "11px", fontWeight: "600", color: "#666" }}>
              Sleep Journey
            </div>
            <div style={{ fontSize: "8px", color: "#999" }}>Timeline</div>
          </div>
          <div className="text-center">
            <div
              style={{ fontSize: "12px", fontWeight: "700", color: "#003465" }}
            >
              {sleepData.wakeup}
            </div>
            <div style={{ fontSize: "9px", color: "#666", fontWeight: "500" }}>
              Wake Up
            </div>
          </div>
        </div>
      </div>

      {/* Sleep Cycle Chart */}
      <div
        className="flex-grow-1 position-relative"
        style={{
          background: "white",
          borderRadius: "8px",
          padding: "16px",
          boxShadow: "0 2px 4px rgba(0,52,101,0.08)",
        }}
      >
        <div className="mb-3">
          <h6
            style={{
              fontSize: "13px",
              fontWeight: "600",
              color: "#003465",
              marginBottom: "8px",
              textAlign: "center",
            }}
          >
            CYCLES OF SLEEP
          </h6>
        </div>

        {/* Sleep Cycle Visualization */}
        <div
          className="position-relative"
          style={{ height: "250px", margin: "15px 0 10px 0" }}
        >
          {/* Y-axis labels */}
          <div
            className="position-absolute"
            style={{ left: "0", top: "0", bottom: "0", width: "80px" }}
          >
            {Object.entries(sleepData.stages).map(
              ([stageName, stageData], index) => {
                const stageOrder = { wake: 0, light: 1, deep: 2, rem: 3 };
                const yPosition = (stageOrder[stageName] || 0) * 50 + 20;
                return (
                  <div
                    key={stageName}
                    className="position-absolute d-flex align-items-center"
                    style={{
                      top: `${yPosition + 10}px`,
                      right: stageName === "wake" ? "32px" : "10px",
                      fontSize: "10px",
                      fontWeight: "600",
                      color: stageData.color,
                      textTransform: "uppercase",
                    }}
                  >
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        backgroundColor: stageData.color,
                        borderRadius: "50%",
                        marginRight: "6px",
                      }}
                    />
                    {stageName === "wake"
                      ? "WAKE"
                      : stageName === "light"
                      ? "LIGHT SLEEP"
                      : stageName === "deep"
                      ? "DEEP SLEEP"
                      : "REM SLEEP"}
                  </div>
                );
              }
            )}
          </div>

          {/* Chart area */}
          <div
            className="position-absolute"
            style={{ left: "80px", right: "0", top: "0", bottom: "0" }}
          >
            {/* Stage transition lines */}
            {sleepData.transitionPoints
              ?.map((position, index) => {
                // Get the stages at this transition point
                let fromStage = null;
                let toStage = null;

                // Find which stages are active before and after this transition
                Object.entries(sleepData.stages).forEach(
                  ([stageName, stageData]) => {
                    stageData.segments.forEach((segment) => {
                      const segmentEnd = segment.start + segment.width;
                      if (Math.abs(segmentEnd - position) < 0.1) {
                        fromStage = stageName;
                      }
                      if (Math.abs(segment.start - position) < 0.1) {
                        toStage = stageName;
                      }
                    });
                  }
                );

                if (!fromStage || !toStage || fromStage === toStage)
                  return null;

                const stageOrder = { wake: 0, light: 1, deep: 2, rem: 3 };
                const fromY = stageOrder[fromStage] * 50 + 20 + 9;
                const toY = stageOrder[toStage] * 50 + 20 + 9;

                return (
                  <div
                    key={`transition-${index}`}
                    className="position-absolute"
                    style={{
                      left: `${position}%`,
                      top: `${Math.min(fromY, toY)}px`,
                      height: `${Math.abs(toY - fromY)}px`,
                      width: "1px",
                      background:
                        "repeating-linear-gradient(to bottom, #999 0px, #999 2px, transparent 2px, transparent 4px)",
                      opacity: 0.7,
                    }}
                  />
                );
              })
              .filter(Boolean)}

            {/* Sleep stage bars */}
            {Object.entries(sleepData.stages).map(([stageName, stageData]) => {
              const stageOrder = { wake: 0, light: 1, deep: 2, rem: 3 };
              const yPosition = (stageOrder[stageName] || 0) * 50 + 20;

              return stageData.segments.map((segment, segIndex) => (
                <div
                  key={`${stageName}-${segIndex}`}
                  className="position-absolute"
                  style={{
                    left: `${segment.start}%`,
                    width: `${segment.width}%`,
                    top: `${yPosition}px`,
                    height: "18px",
                    background: `linear-gradient(135deg, ${stageData.color} 0%, ${stageData.color}E6 50%, ${stageData.color} 100%)`,
                    borderRadius: "9px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: `0 3px 8px ${stageData.color}50, inset 0 1px 0 rgba(255,255,255,0.3)`,
                    border: `1px solid ${stageData.color}80`,
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-1px)";
                    e.target.style.boxShadow = `0 4px 12px ${stageData.color}60, inset 0 1px 0 rgba(255,255,255,0.4)`;
                    handleMouseEnter(e, stageName, segment);
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = `0 3px 8px ${stageData.color}50, inset 0 1px 0 rgba(255,255,255,0.3)`;
                    handleMouseLeave();
                  }}
                />
              ));
            })}
          </div>
        </div>

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

const DurationCard = ({
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
  const [isNavigating, setIsNavigating] = useState(false);
  const [isTabSwitching, setIsTabSwitching] = useState(false);
  const FilterData = useSelector(
    (state) => state?.getPatientSleepStages?.data?.response?.data
  );

  let durationData = useSelector(
    (state) =>
      state?.getPatientSleepStages?.data?.response?.todayData?.sleepData
  );
  console.log(durationData, "durationData");
  const AverageData = useSelector(
    (state) => state?.getPatientSleepStages?.data?.response
  );

  const Loading = useSelector((state) => state?.getPatientSleepStages?.loading);

  // Reset loading states when data loading completes
  useEffect(() => {
    if (!Loading) {
      setIsNavigating(false);
      setIsTabSwitching(false);
    }
  }, [Loading]);

  // console.log(AverageData, "AverageData");

  // Initial API call when component mounts
  useEffect(() => {
    if (patientId) {
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
      // if (activeTab === "Month")  // payload.period = "month";
      if (activeTab === "Year") payload.period = "year";
      dispatch(getPatientSleepStages(payload));
    }
  }, [patientId, dispatch, formatDate]);

  // Get chart data based on active tab and API response
  const getChartData = () => {
    if (!FilterData || FilterData.length === 0) {
      return { labels: [], data: [], tableData: [] };
    }

    const apiData = FilterData;

    const labels = apiData.map((item) => {
      if (activeTab === "Month" && item.date.includes("Week")) {
        const weekMatch = item.date.match(/Week (\d+)/);
        return weekMatch ? `Week ${weekMatch[1]}` : item.date;
      }

      const date = new Date(item.date);
      switch (activeTab) {
        case "Day":
          return date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          });
        case "Week":
          return date.toLocaleDateString("en-US", { weekday: "short" });
        case "Month":
          return date.toLocaleDateString("en-US", { day: "numeric" });
        case "Year":
          return date.toLocaleDateString("en-US", { month: "short" });
        default:
          return date.toLocaleDateString();
      }
    });

    const data = apiData.map((item) => item.value);

    const tableData = apiData.map((item) => {
      let period;

      if (activeTab === "Month" && item.date.includes("Week")) {
        const weekMatch = item.date.match(/Week (\d+)/);
        period = weekMatch ? `Week ${weekMatch[1]}` : item.date;
      } else {
        const date = new Date(item.date);
        switch (activeTab) {
          case "Day":
            period = date.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            });
            break;
          case "Week":
            period = date.toLocaleDateString("en-US", { weekday: "long" });
            break;
          case "Month":
            period = date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
            break;
          case "Year":
            period = date.toLocaleDateString("en-US", { month: "long" });
            break;
          default:
            period = date.toLocaleDateString();
        }
      }

      return {
        period,
        value: item.value
          ? activeTab === "Year"
            ? `${Math.round(item.value)}m (${Math.floor(
                item.value / 60
              )}hr ${Math.round(item.value % 60)}m)`
            : `${item.value}m 
        (${Math.floor(item.value / 60)}hr ${item.value % 60}m)`
          : "0m (0hr 0m)",
      };
    });

    return { labels, data, tableData };
  };

  const chartData = getChartData() || { labels: [], data: [], tableData: [] };

  // Get navigation label based on active tab
  const getNavigationLabel = () => {
    const date = new Date(currentDate);

    switch (activeTab) {
      case "Day":
        return date.toLocaleDateString("en-US", {
          weekday: "long",
          month: "short",
          day: "numeric",
        });
      case "Week":
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return `${startOfWeek.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })} - ${endOfWeek.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })}`;
      case "Month":
        return date.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        });
      case "Year":
        return date.getFullYear().toString();
      default:
        return "Current Period";
    }
  };

  // Check if next navigation would go to future
  const isNextDisabled = () => {
    const today = new Date();
    const testDate = new Date(currentDate);

    switch (activeTab) {
      case "Day":
        testDate.setDate(testDate.getDate() + 1);
        return testDate > today;
      case "Week":
        testDate.setDate(testDate.getDate() + 7);
        return testDate > today;
      case "Month":
        testDate.setMonth(testDate.getMonth() + 1);
        return testDate > today;
      case "Year":
        testDate.setFullYear(testDate.getFullYear() + 1);
        return testDate > today;
      default:
        return false;
    }
  };

  // Handle navigation
  const handleNavigation = (direction) => {
    if (direction === "next" && isNextDisabled()) return;
    if (isNavigating) return;

    setIsNavigating(true);
    setSelectedSessionIndex(0); // Reset to first session
    const newDate = new Date(currentDate);

    switch (activeTab) {
      case "Day":
        newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
        break;
      case "Week":
        newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
        break;
      case "Month":
        newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
        break;
      case "Year":
        newDate.setFullYear(
          newDate.getFullYear() + (direction === "next" ? 1 : -1)
        );
        break;
    }

    onDateChange(newDate);

    // Calculate new date range based on the new current date
    let start, end;
    switch (activeTab) {
      case "Day":
        start = end = new Date(newDate);
        break;
      case "Week":
        start = new Date(newDate);
        start.setDate(newDate.getDate() - newDate.getDay());
        end = new Date(start);
        end.setDate(start.getDate() + 6);
        break;
      case "Month":
        start = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
        end = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0);
        break;
      case "Year":
        start = new Date(newDate.getFullYear(), 0, 1);
        end = new Date(newDate.getFullYear(), 11, 31);
        break;
    }

    // Fetch new data after navigation
    setTimeout(() => {
      if (patientId) {
        const payload = {
          patientId: patientId,
          start: formatDate(start),
          end: formatDate(end),
          field: "sleep",
        };
        // if (activeTab === "Month")  // payload.period = "month";
        if (activeTab === "Year") payload.period = "year";
        dispatch(getPatientSleepStages(payload));
      }
    }, 0);
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    if (isTabSwitching || tab === activeTab) return;

    setIsTabSwitching(true);
    setSelectedSessionIndex(0); // Reset to first session
    onTabChange(tab);
    // Fetch data for new tab
    setTimeout(() => {
      if (patientId) {
        const date = new Date(currentDate);
        let start, end;

        switch (tab) {
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
        // if (tab === "Month")  // payload.period = "month";
        if (tab === "Year") payload.period = "year";
        dispatch(getPatientSleepStages(payload));
      }
    }, 0);
  };

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: "white",
        border: "1px solid #e9ecef",
        borderRadius: "8px",
        minHeight: expandedCard === "duration" ? "550px" : "245px",
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
            src={Duration_Icon}
            alt="Duration"
            className="mx-2"
            style={{ width: "19px", height: "19px" }}
          />
          <span
            style={{
              fontSize: "12px",
              fontWeight: "600",
              color: "#003465",
            }}
          >
            Duration
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
            onClick={() => onCardExpand("duration")}
          />
        </div>
      </div>
      <div className="p-1 pt-0">
        {expandedCard === "duration" ? (
          <div className="row p-3">
            <div className="col-8 pe-2">
              <div
                className="border rounded-2"
                style={{
                  padding: "5px",
                  backgroundColor: "#F6FAFF",
                  height: "500px",
                  position: "relative",
                }}
              >
                {Loading || isNavigating || isTabSwitching ? (
                  <div className="d-flex flex-column h-100">
                    <div className="position-relative flex-grow-1">
                      <div
                        className="position-absolute"
                        style={{
                          left: "0",
                          top: "0",
                          bottom: "30px",
                          width: "30px",
                        }}
                      >
                        {[...Array(6)].map((_, i) => (
                          <div
                            key={i}
                            className="placeholder rounded-1 mb-3"
                            style={{ height: "8px", width: "25px" }}
                          ></div>
                        ))}
                      </div>
                      <div
                        className="position-absolute"
                        style={{
                          left: "40px",
                          right: "0",
                          top: "0",
                          bottom: "30px",
                        }}
                      >
                        <svg
                          width="100%"
                          height="100%"
                          className="placeholder-glow"
                        >
                          {[...Array(5)].map((_, i) => (
                            <line
                              key={`grid-${i}`}
                              x1="0"
                              y1={`${(i + 1) * 20}%`}
                              x2="100%"
                              y2={`${(i + 1) * 20}%`}
                              stroke="#E8F2FF"
                              strokeWidth="1"
                            />
                          ))}
                          {[...Array(8)].map((_, i) => (
                            <rect
                              key={`bar-${i}`}
                              x={`${i * 12 + 5}%`}
                              y={`${60 - (Math.sin(i) * 20 + 20)}%`}
                              width="8%"
                              height={`${Math.sin(i) * 20 + 20}%`}
                              fill="#E8F2FF"
                              className="placeholder"
                              rx="3"
                            />
                          ))}
                        </svg>
                      </div>
                      <div
                        className="position-absolute d-flex justify-content-between"
                        style={{
                          left: "40px",
                          right: "0",
                          bottom: "0",
                          height: "20px",
                        }}
                      >
                        {[...Array(6)].map((_, i) => (
                          <div
                            key={i}
                            className="placeholder rounded-1"
                            style={{ height: "8px", width: "20px" }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : activeTab === "Day" ? (
                  <SleepJourneyChart
                    key={`${currentDate}-${activeTab}-${selectedSessionIndex}`}
                    FilterData={AverageData}
                    currentDate={currentDate}
                    selectedSessionIndex={selectedSessionIndex}
                  />
                ) : (
                  <Bar
                    data={{
                      labels: chartData.labels,
                      datasets: [
                        {
                          data: chartData.data,
                          backgroundColor: "#003465",
                          borderRadius: 3,
                          barThickness: 15,
                        },
                      ],
                    }}
                    options={{
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                      },
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
                      onClick:
                        activeTab === "Year"
                          ? (event, elements) => {
                              if (elements.length > 0) {
                                const clickedIndex = elements[0].index;
                                const clickedMonth = clickedIndex;
                                const newDate = new Date(
                                  currentDate.getFullYear(),
                                  clickedMonth,
                                  1
                                );
                                onDateChange(newDate);
                                handleTabChange("Month");
                              }
                            }
                          : undefined,
                    }}
                  />
                )}
              </div>
            </div>
            <div
              className="col-4 ps-2 border rounded-2"
              style={{
                backgroundColor: "#F8FBFF",
                maxHeight: "500px",
                overflowY: "auto",
              }}
            >
              {/* Tabs Row */}
              <div
                className="d-flex justify-content-center my-3 p-0 rounded-pill"
                style={{ backgroundColor: "#F0F7FF", gap: "4px" }}
              >
                {["Day", "Week", "Month", "Year"].map((tab, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 rounded-pill text-center flex-fill d-flex align-items-center justify-content-center"
                    style={{
                      backgroundColor:
                        tab === activeTab ? "#003465" : "transparent",
                      color: tab === activeTab ? "white" : "#003465",
                      cursor: isTabSwitching ? "not-allowed" : "pointer",
                      fontSize: "11px",
                      fontWeight: "500",
                      transition: "all 0.2s ease",
                      border: "none",
                      minWidth: "45px",
                      opacity: isTabSwitching && tab !== activeTab ? 0.6 : 1,
                    }}
                    onClick={() => handleTabChange(tab)}
                    onMouseEnter={(e) => {
                      if (tab !== activeTab && !isTabSwitching) {
                        e.target.style.backgroundColor = "#E8F2FF";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (tab !== activeTab && !isTabSwitching) {
                        e.target.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    {isTabSwitching && tab === activeTab ? (
                      <div className="d-flex align-items-center gap-1">
                        <div
                          className="spinner-border"
                          style={{
                            width: "10px",
                            height: "10px",
                            borderWidth: "1px",
                          }}
                        ></div>
                        <span>{tab}</span>
                      </div>
                    ) : (
                      tab
                    )}
                  </div>
                ))}
              </div>

              {/* Date Navigation Row */}
              <div
                className="d-flex align-items-center justify-content-between mb-2 p-2"
                style={{ backgroundColor: "#E8F2FF", borderRadius: "4px" }}
              >
                <button
                  className="btn p-1 d-flex align-items-center justify-content-center"
                  style={{
                    width: "24px",
                    height: "24px",
                    backgroundColor: isNavigating ? "#f5f5f5" : "white",
                    border: `1px solid ${isNavigating ? "#ccc" : "#003465"}`,
                    borderRadius: "4px",
                    color: isNavigating ? "#ccc" : "#003465",
                    cursor: isNavigating ? "not-allowed" : "pointer",
                  }}
                  onClick={() => handleNavigation("prev")}
                  disabled={isNavigating}
                >
                  {isNavigating ? (
                    <div
                      className="spinner-border"
                      style={{
                        width: "8px",
                        height: "8px",
                        borderWidth: "1px",
                      }}
                    ></div>
                  ) : (
                    <IoChevronBack style={{ fontSize: "12px" }} />
                  )}
                </button>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "#003465",
                  }}
                >
                  {getNavigationLabel()}
                </span>
                <button
                  className="btn p-1 d-flex align-items-center justify-content-center"
                  style={{
                    width: "24px",
                    height: "24px",
                    backgroundColor:
                      isNextDisabled() || isNavigating ? "#f5f5f5" : "white",
                    border: `1px solid ${
                      isNextDisabled() || isNavigating ? "#ccc" : "#003465"
                    }`,
                    borderRadius: "4px",
                    color:
                      isNextDisabled() || isNavigating ? "#ccc" : "#003465",
                    cursor:
                      isNextDisabled() || isNavigating
                        ? "not-allowed"
                        : "pointer",
                  }}
                  onClick={() => handleNavigation("next")}
                  disabled={isNextDisabled() || isNavigating}
                >
                  {isNavigating ? (
                    <div
                      className="spinner-border"
                      style={{
                        width: "8px",
                        height: "8px",
                        borderWidth: "1px",
                      }}
                    ></div>
                  ) : (
                    <IoChevronForward style={{ fontSize: "12px" }} />
                  )}
                </button>
              </div>

              {/* Average Row */}
              <div
                className="d-flex justify-content-between p-2 mb-1"
                style={{
                  backgroundColor: "#E8F2FF",
                  fontSize: "10px",
                  fontWeight: "600",
                }}
              >
                <span style={{ color: "#003465" }}>Average</span>
                <span style={{ color: "#003465" }}>
                  {Math.round((AverageData?.stats?.average || 0) / 60)}h{" "}
                  {Math.round((AverageData?.stats?.average || 0) % 60)}m
                </span>
              </div>

              {/* Data Rows */}
              <div
                style={{
                  maxHeight: "340px",
                  overflowY: "auto",
                  paddingRight: "4px",
                  scrollbarWidth: "thin",
                  scrollbarColor: "#003465 #E8F2FF",
                }}
                className="custom-scroll"
              >
                {Loading || isNavigating || isTabSwitching ? (
                  [...Array(8)].map((_, index) => (
                    <div
                      key={`skeleton-${index}`}
                      className="d-flex justify-content-between p-2 mb-1 placeholder-glow"
                      style={{
                        backgroundColor: "white",
                        fontSize: "10px",
                        borderRadius: "2px",
                        border: "1px solid #E8F2FF",
                      }}
                    >
                      <span
                        className="placeholder rounded-1"
                        style={{ width: "60px", height: "10px" }}
                      ></span>
                      <span
                        className="placeholder rounded-1"
                        style={{ width: "40px", height: "10px" }}
                      ></span>
                    </div>
                  ))
                ) : chartData.tableData.length > 0 ? (
                  chartData.tableData.map((item, index) => (
                    <div
                      key={`${activeTab}-${item.period}-${index}`}
                      className="d-flex justify-content-between p-2 mb-1"
                      style={{
                        backgroundColor: "white",
                        fontSize: "10px",
                        borderRadius: "2px",
                        border: "1px solid #E8F2FF",
                        cursor:
                          activeTab === "Year" || activeTab === "Month"
                            ? "pointer"
                            : "default",
                      }}
                      onClick={() => {
                        if (activeTab === "Year") {
                          const newDate = new Date(
                            currentDate.getFullYear(),
                            index,
                            1
                          );
                          onDateChange(newDate);
                          onTabChange("Month");
                        } else if (activeTab === "Month") {
                          // Extract day number from period like "Oct 15" -> 15
                          const dayMatch = item.period.match(/\d+/);
                          if (dayMatch) {
                            const clickedDay = parseInt(dayMatch[0]);
                            const clickedDate = new Date(
                              currentDate.getFullYear(),
                              currentDate.getMonth(),
                              clickedDay
                            );
                            onDateChange(clickedDate);
                            onTabChange("Day");
                          }
                        }
                      }}
                    >
                      <span style={{ color: "#003465" }}>{item.period}</span>
                      <span style={{ color: "#003465" }}>{item.value}</span>
                    </div>
                  ))
                ) : (
                  <div
                    className="d-flex justify-content-center align-items-center p-4"
                    style={{ color: "#666", fontSize: "12px" }}
                  >
                    Data not found
                  </div>
                )}
              </div>

              {/* Sleep Session Cards - Only for Day tab and past days */}
              {activeTab === "Day" &&
                (() => {
                  const selectedDate = new Date(currentDate);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0); // Reset time to start of day
                  selectedDate.setHours(0, 0, 0, 0); // Reset time to start of day
                  const isPastDay = selectedDate < today;
                  let sleepSessions = [];

                  // Only show sleep sessions for past days, not today or future
                  if (isPastDay && AverageData?.data?.[0]?.sleepData) {
                    sleepSessions = AverageData.data[0].sleepData;
                  }

                  if (sleepSessions && sleepSessions.length > 1) {
                    return (
                      <div className="mb-2">
                        <div
                          className="text-center mb-2 p-1"
                          style={{
                            fontSize: "10px",
                            fontWeight: "600",
                            color: "#003465",
                            backgroundColor: "#E8F2FF",
                            borderRadius: "4px",
                          }}
                        >
                          Sleep Sessions
                        </div>
                        {sleepSessions.map((session, index) => {
                          const startTime = new Date(session.startTime);
                          const endTime = new Date(session.endTime);
                          const duration = Math.round(
                            (endTime - startTime) / (1000 * 60)
                          );
                          const hours = Math.floor(duration / 60);
                          const minutes = duration % 60;

                          const isMainSleep =
                            session.isMainSleep || duration > 180; // 3+ hours considered main sleep
                          const sessionType = isMainSleep
                            ? "Main Sleep"
                            : "Nap";

                          return (
                            <div
                              key={index}
                              className="p-2 mb-1 rounded-2"
                              style={{
                                backgroundColor:
                                  selectedSessionIndex === index
                                    ? "#003465"
                                    : "white",
                                color:
                                  selectedSessionIndex === index
                                    ? "white"
                                    : "#003465",
                                border: `1px solid ${
                                  selectedSessionIndex === index
                                    ? "#003465"
                                    : "#E8F2FF"
                                }`,
                                cursor: "pointer",
                                fontSize: "10px",
                                transition: "all 0.2s ease",
                              }}
                              onClick={() => setSelectedSessionIndex(index)}
                            >
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  <div
                                    style={{
                                      fontWeight: "600",
                                      fontSize: "9px",
                                    }}
                                  >
                                    {sessionType}
                                  </div>
                                  <div
                                    style={{ fontSize: "8px", opacity: 0.8 }}
                                  >
                                    {startTime.toLocaleTimeString("en-US", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: false,
                                    })}{" "}
                                    -{" "}
                                    {endTime.toLocaleTimeString("en-US", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: false,
                                    })}
                                  </div>
                                </div>
                                <div
                                  style={{ fontWeight: "600", fontSize: "9px" }}
                                >
                                  {hours > 0
                                    ? `${hours}h ${minutes}m`
                                    : `${minutes}m`}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  }
                  return null;
                })()}
            </div>
          </div>
        ) : (
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
                      Math.min(
                        1,
                        durationData?.length
                          ? durationData.reduce(
                              (total, session) => total + session.minutesAsleep,
                              0
                            ) /
                              60 /
                              8
                          : 0
                      ) *
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
                    {Math.min(
                      100,
                      Math.round(
                        ((durationData?.length
                          ? durationData.reduce(
                              (total, session) => total + session.minutesAsleep,
                              0
                            ) / 60
                          : 0) /
                          8) *
                          100
                      )
                    )}
                    %
                  </div>
                  <div
                    style={{
                      fontSize: "9px",
                      color: "#666",
                      fontWeight: "500",
                    }}
                  >
                    Complete
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mb-2">
              <p
                className={`mb-0 ${Loading ? "placeholder rounded-1" : ""}`}
                style={{ fontSize: "10px", color: "#666", fontWeight: "500" }}
              >
                {Math.max(
                  0,
                  Math.round(
                    (8 -
                      (durationData?.length
                        ? durationData.reduce(
                            (total, session) => total + session.minutesAsleep,
                            0
                          ) / 60
                        : 0)) *
                      10
                  ) / 10
                )}
                h to reach daily goal
              </p>
            </div>

            <div className="row g-1 ">
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
                    {durationData?.length
                      ? Math.round(
                          (durationData.reduce(
                            (total, session) => total + session.minutesAsleep,
                            0
                          ) /
                            60) *
                            10
                        ) / 10
                      : "-"}
                    h
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
                    {AverageData?.goals?.duration || 8}h
                  </div>
                  <div
                    style={{
                      fontSize: "9px",
                      color: "#666",
                      fontWeight: "500",
                    }}
                  >
                    Goal
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DurationCard;
