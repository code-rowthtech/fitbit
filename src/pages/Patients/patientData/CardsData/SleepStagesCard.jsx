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

    console.log("Processing data for date:", currentDate, "Is today:", isToday);

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

    console.log("Selected sleep session index:", selectedSessionIndex);
    console.log("Sleep data source:", sleepDataSource);
    console.log("Levels data length:", levelsData.length);

    // If still no data, return null
    if (!levelsData || levelsData.length === 0) {
      console.log("No sleep levels data found for timeline", {
        FilterData,
        currentDate,
        isToday,
        sleepSessions: FilterData?.data?.[0]?.sleepData?.length || 0,
      });
      return null;
    }

    console.log(
      "Processing sleep data for date:",
      currentDate,
      "Data length:",
      levelsData.length,
      "Is today:",
      isToday
    );

    // Calculate total sleep duration and start/end times
    const startTime = new Date(levelsData[0].dateTime);
    console.log("Start time:", startTime);
    const lastItem = levelsData[levelsData.length - 1];
    const endTime = new Date(
      new Date(lastItem.dateTime).getTime() + lastItem.seconds * 1000
    );
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
      bedtime: startTime.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      wakeup: endTime.toLocaleTimeString("en-IN", {
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
  console.log("Sleep data:", sleepData);

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

      {/* Enhanced Timeline */}
      <div
        className="flex-grow-1 position-relative"
        style={{
          background: "white",
          borderRadius: "8px",
          padding: "12px",
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
            }}
          >
            Sleep Stages Distribution
          </h6>
        </div>

        {/* Dotted vertical lines connecting sleep stages */}
        {sleepData.transitionPoints?.length > 0 && (
          <div
            className="position-absolute"
            style={{
              top: "50px",
              left: "12px",
              right: "12px",
              bottom: "12px",
              pointerEvents: "none",
              zIndex: 1,
            }}
          >
            {sleepData.transitionPoints.map((position, index) => (
              <div
                key={index}
                style={{
                  position: "absolute",
                  left: `${position}%`,
                  top: "0",
                  bottom: "0",
                  width: "1px",
                  background:
                    "repeating-linear-gradient(to bottom, #666 0px, #666 2px, transparent 2px, transparent 6px)",
                  opacity: 0.5,
                }}
              />
            ))}
          </div>
        )}

        {/* Dotted vertical lines at sleep stage transitions */}
        {sleepData.transitionPoints?.length > 0 && (
          <div
            className="position-absolute"
            style={{
              top: "50px",
              left: "12px",
              right: "12px",
              bottom: "12px",
              pointerEvents: "none",
              zIndex: 1,
            }}
          >
            {sleepData.transitionPoints.map((position, index) => (
              <div
                key={index}
                style={{
                  position: "absolute",
                  left: `${position}%`,
                  top: "0",
                  bottom: "0",
                  width: "1px",
                  background:
                    "repeating-linear-gradient(to bottom, #999 0px, #999 2px, transparent 2px, transparent 6px)",
                  opacity: 0.6,
                }}
              />
            ))}
          </div>
        )}
        {Object.entries(sleepData.stages).map(
          ([stageName, stageData], index) => (
            <div
              key={stageName}
              className="mb-3 position-relative"
              style={{
                background: `${stageData.color}08`,
                borderRadius: "8px",
                padding: "8px",
                border: `1px solid ${stageData.color}20`,
                zIndex: 2,
              }}
            >
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="d-flex align-items-center">
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      backgroundColor: stageData.color,
                      borderRadius: "3px",
                      marginRight: "8px",
                      boxShadow: `0 2px 4px ${stageData.color}40`,
                    }}
                  ></div>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "700",
                      color: "#003465",
                      textTransform: "capitalize",
                      minWidth: "50px",
                    }}
                  >
                    {stageName === "wake" ? "Awake" : stageName}
                  </span>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#666",
                      fontWeight: "500",
                      backgroundColor: "white",
                      padding: "2px 6px",
                      borderRadius: "6px",
                    }}
                  >
                    {stageData.duration}
                  </span>
                  <span
                    style={{
                      fontSize: "10px",
                      color: "white",
                      fontWeight: "700",
                      backgroundColor: stageData.color,
                      padding: "3px 6px",
                      borderRadius: "8px",
                      minWidth: "35px",
                      textAlign: "center",
                      boxShadow: `0 2px 4px ${stageData.color}40`,
                    }}
                  >
                    {stageData.percentage}%
                  </span>
                </div>
              </div>
              <div
                className="position-relative"
                style={{
                  height: "20px",
                  backgroundColor: "white",
                  borderRadius: "10px",
                  border: `2px solid ${stageData.color}20`,
                  overflow: "hidden",
                  boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                {stageData.segments.map((segment, segIndex) => (
                  <div
                    key={segIndex}
                    style={{
                      position: "absolute",
                      left: `${segment.start}%`,
                      width: `${segment.width}%`,
                      height: "100%",
                      background: `linear-gradient(135deg, ${stageData.color} 0%, ${stageData.color}CC 100%)`,
                      borderRadius: "2px",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      boxShadow: `0 1px 3px ${stageData.color}60`,
                    }}
                    onMouseEnter={(e) =>
                      handleMouseEnter(e, stageName, segment)
                    }
                    onMouseLeave={handleMouseLeave}
                  />
                ))}
                {/* Enhanced Grid lines */}
                {[25, 50, 75].map((position) => (
                  <div
                    key={position}
                    style={{
                      position: "absolute",
                      left: `${position}%`,
                      top: "0",
                      bottom: "0",
                      width: "1px",
                      backgroundColor: "#003465",
                      opacity: 0.2,
                    }}
                  />
                ))}
              </div>
            </div>
          )
        )}
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
        value: item.value ? `${item.value} minutes` : "0 stages",
      };
    });

    return { labels, data, tableData };
  };

  const chartData = getChartData() || { labels: [], data: [], tableData: [] };

  // Get navigation label based on active tab
  const getNavigationLabel = () => {
    if (!currentDate) return "Current Period";

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
        {expandedCard === "sleepStages" ? (
          <div className="row p-3">
            <div className="col-8 pe-2">
              <div
                className="border rounded-2"
                style={{
                  padding: "5px",
                  backgroundColor: "#F6FAFF",
                  height: "500px",
                }}
              >
                {activeTab === "Day" ? (
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
                    className="px-3 py-2 rounded-pill text-center flex-fill"
                    style={{
                      backgroundColor:
                        tab === activeTab ? "#003465" : "transparent",
                      color: tab === activeTab ? "white" : "#003465",
                      cursor: "pointer",
                      fontSize: "11px",
                      fontWeight: "500",
                      transition: "all 0.2s ease",
                      border: "none",
                      minWidth: "45px",
                    }}
                    onClick={() => handleTabChange(tab)}
                    onMouseEnter={(e) => {
                      if (tab !== activeTab) {
                        e.target.style.backgroundColor = "#E8F2FF";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (tab !== activeTab) {
                        e.target.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    {tab}
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
                    backgroundColor: "white",
                    border: "1px solid #003465",
                    borderRadius: "4px",
                    color: "#003465",
                  }}
                  onClick={() => handleNavigation("prev")}
                >
                  <IoChevronBack style={{ fontSize: "12px" }} />
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
                    backgroundColor: isNextDisabled() ? "#f5f5f5" : "white",
                    border: `1px solid ${
                      isNextDisabled() ? "#ccc" : "#003465"
                    }`,
                    borderRadius: "4px",
                    color: isNextDisabled() ? "#ccc" : "#003465",
                    cursor: isNextDisabled() ? "not-allowed" : "pointer",
                  }}
                  onClick={() => handleNavigation("next")}
                  disabled={isNextDisabled()}
                >
                  <IoChevronForward style={{ fontSize: "12px" }} />
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
                {chartData.tableData.length > 0 ? (
                  chartData.tableData.map((item, index) => (
                    <div
                      key={`${activeTab}-${item.period}-${index}`}
                      className="d-flex justify-content-between p-2 mb-1"
                      style={{
                        backgroundColor: "white",
                        fontSize: "10px",
                        borderRadius: "2px",
                        border: "1px solid #E8F2FF",
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
            className="rounded-3 px-2 mt-1 d-flex flex-column"
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
                    className="fw-bold"
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
                className="mb-0"
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
                    className="fw-bold"
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
                    className="fw-bold"
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
        )}
      </div>
    </div>
  );
};

export default SleepStagesCard;
