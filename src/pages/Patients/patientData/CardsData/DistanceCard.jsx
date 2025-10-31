import React, { useState, useEffect } from "react";
import Distance_Icon from "../../../../assets/images/PatientDashboard/distance.png";
import { IoIosExpand } from "react-icons/io";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { Bar } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { getPatientDistance } from "../../../../redux/patientsDashboard/action";

const DistanceCard = ({
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
  const [isNavigating, setIsNavigating] = useState(false);
  const [isTabSwitching, setIsTabSwitching] = useState(false);
  const DistanceData = useSelector(
    (state) => state?.getPatientDistance?.data?.response?.data
  );
  const DistanceStatsData = useSelector(
    (state) => state?.getPatientDistance?.data?.response?.targetRange
  );
  const AverageData = useSelector(
    (state) => state?.getPatientDistance?.data?.response
  );
  const IntradayData = useSelector(
    (state) =>
      state?.getPatientDistance?.data?.response?.todayData?.intradayData
  );
  const Loading = useSelector((state) => state?.getPatientDistance?.loading);

  // Reset loading states when data loading completes
  useEffect(() => {
    if (!Loading) {
      setIsNavigating(false);
      setIsTabSwitching(false);
    }
  }, [Loading]);

  // Get chart data based on active tab and API response
  const getChartData = () => {
    // For Day tab, use intraday data if available
    if (activeTab === "Day" && IntradayData && IntradayData.length > 0) {
      const labels = IntradayData.map((item) => {
        // Convert "12 AM to 1 AM" to "12 AM"
        return item.timeRange.split(" to ")[0];
      });

      const data = IntradayData.map((item) => item.distance);

      const tableData = IntradayData.map((item) => ({
        period: item.timeRange,
        value: `${item.distance.toFixed(2)} km`,
      }));

      return { labels, data, tableData };
    }

    // For other tabs, use regular data
    if (!DistanceData || DistanceData.length === 0) {
      return { labels: [], data: [], tableData: [] };
    }

    const apiData = DistanceData;

    const labels = apiData.map((item) => {
      if (activeTab === "Month" && item.date.includes("Week")) {
        const weekMatch = item.date.match(/Week (\d+)/);
        return weekMatch ? `Week ${weekMatch[1]}` : item.date;
      }

      const date = new Date(item.date);
      switch (activeTab) {
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
        value: item.value ? `${item.value.toFixed(2)} km` : "0 km",
      };
    });

    return { labels, data, tableData };
  };

  const chartData = getChartData();

  // Fetch distance data on component mount and when dependencies change
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
        field: "distance",
      };
      if (activeTab === "Year") payload.period = "year";
      dispatch(getPatientDistance(payload));
    }
  }, [patientId, currentDate, activeTab, dispatch, formatDate]);

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
          field: "distance",
        };
        if (activeTab === "Year") payload.period = "year";
        dispatch(getPatientDistance(payload));
      }
    }, 0);
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    if (isTabSwitching || tab === activeTab) return;

    setIsTabSwitching(true);

    // Determine the date to use for the new tab
    let dateToUse = new Date(currentDate);
    if (tab === "Year") {
      const currentYear = new Date(currentDate).getFullYear();
      dateToUse = new Date(currentYear, 0, 1);
      onDateChange(dateToUse);
    }

    onTabChange(tab);
    // Fetch data for new tab
    setTimeout(() => {
      if (patientId) {
        const date = dateToUse;
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
            // Ensure we use the correct month from the current date
            const month = date.getMonth();
            const year = date.getFullYear();
            start = new Date(year, month, 1);
            end = new Date(year, month + 1, 0);
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
          field: "distance",
        };
        if (tab === "Year") payload.period = "year";
        dispatch(getPatientDistance(payload));
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
        minHeight: expandedCard === "distance" ? "550px" : "245px",
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
            src={Distance_Icon}
            alt="Distance"
            className="mx-2"
            style={{ width: "19px", height: "19px" }}
          />
          <span
            style={{ fontSize: "12px", fontWeight: "600", color: "#003465" }}
          >
            Distance
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
            onClick={() => onCardExpand("distance")}
          />
        </div>
      </div>
      <div className="p-1 pt-0">
        {expandedCard === "distance" ? (
          <div className="row p-3">
            <div className="col-8 pe-2">
              <div
                className="border rounded-2"
                style={{
                  padding: "10px",
                  backgroundColor: "#F6FAFF",
                  height: "500px",
                  position: "relative",
                }}
              >
                {Loading || isNavigating || isTabSwitching ? (
                  <div className="d-flex flex-column h-100">
                    {/* Chart Skeleton */}
                    <div className="position-relative flex-grow-1">
                      {/* Y-axis skeleton */}
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

                      {/* Chart area skeleton */}
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
                          {/* Grid lines */}
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

                          {/* Skeleton bars */}
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

                      {/* X-axis skeleton */}
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
                ) : (
                  <Bar
                    key={`chart-${activeTab}-${chartData.data.length}`}
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
                      onClick:
                        activeTab === "Year"
                          ? (event, elements) => {
                              if (elements.length > 0) {
                                const clickedIndex = elements[0].index;
                                const clickedMonth = DistanceData[clickedIndex];
                                if (clickedMonth) {
                                  // Parse date more carefully to avoid timezone issues
                                  const dateStr = clickedMonth.date;
                                  let monthDate;

                                  if (dateStr.includes("-")) {
                                    // Handle YYYY-MM-DD format
                                    const [year, month] = dateStr
                                      .split("-")
                                      .map(Number);
                                    monthDate = new Date(year, month - 1, 1); // month is 0-indexed
                                  } else {
                                    // Fallback to original parsing
                                    const originalDate = new Date(dateStr);
                                    monthDate = new Date(
                                      originalDate.getFullYear(),
                                      originalDate.getMonth(),
                                      1
                                    );
                                  }
                                  onDateChange(monthDate);
                                  // Use setTimeout to ensure date change takes effect
                                  setTimeout(() => {
                                    handleTabChange("Month");
                                  }, 0);
                                }
                              }
                            }
                          : activeTab === "Month"
                          ? (event, elements) => {
                              if (elements.length > 0) {
                                const clickedIndex = elements[0].index;
                                const clickedDay = DistanceData[clickedIndex];
                                if (clickedDay) {
                                  // Parse date more carefully to avoid timezone issues
                                  const dateStr = clickedDay.date;
                                  let dayDate;

                                  if (dateStr.includes("-")) {
                                    // Handle YYYY-MM-DD format
                                    const [year, month, day] = dateStr
                                      .split("-")
                                      .map(Number);
                                    dayDate = new Date(year, month - 1, day); // month is 0-indexed
                                  } else {
                                    // Fallback to original parsing
                                    dayDate = new Date(dateStr);
                                  }

                                  onDateChange(dayDate);
                                  // Use setTimeout to ensure date change takes effect
                                  setTimeout(() => {
                                    handleTabChange("Day");
                                  }, 0);
                                }
                              }
                            }
                          : undefined,
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          callbacks: {
                            afterBody:
                              activeTab === "Week" && DistanceStatsData
                                ? () => [
                                    `Min: ${parseInt(DistanceStatsData.min)}`,
                                    `Max: ${parseInt(DistanceStatsData.max)}`,
                                  ]
                                : activeTab === "Day" && IntradayData
                                ? (context) => {
                                    const dataIndex = context[0]?.dataIndex;
                                    return dataIndex !== undefined &&
                                      IntradayData[dataIndex]
                                      ? [
                                          `Time: ${IntradayData[dataIndex].timeRange}`,
                                        ]
                                      : [];
                                  }
                                : activeTab === "Month" && DistanceData
                                ? (context) => {
                                    const dataIndex = context[0]?.dataIndex;
                                    return dataIndex !== undefined &&
                                      DistanceData[dataIndex]
                                      ? [
                                          `Days: ${DistanceData[dataIndex].dayRange}`,
                                        ]
                                      : [];
                                  }
                                : activeTab === "Year"
                                ? () => ["Click to view month details"]
                                : activeTab === "Month"
                                ? () => ["Click to view day details"]
                                : undefined,
                          },
                        },
                      },
                      scales: {
                        x: {
                          grid: { display: false },
                          ticks: {
                            color: "#666",
                            fontSize: 10,
                            maxRotation: activeTab === "Day" ? 45 : 0,
                            minRotation: activeTab === "Day" ? 45 : 0,
                          },
                        },
                        y: {
                          beginAtZero: true,
                          min:
                            activeTab === "Week" && DistanceStatsData
                              ? Math.min(
                                  0,
                                  parseFloat(DistanceStatsData.min) - 0.5
                                )
                              : 0,
                          max:
                            activeTab === "Week" && DistanceStatsData
                              ? Math.max(
                                  ...chartData.data,
                                  parseFloat(DistanceStatsData.max) + 0.5
                                )
                              : undefined,
                          grid: { color: "#f0f0f0" },
                          ticks: { color: "#666", fontSize: 10 },
                        },
                      },
                      categoryPercentage: 0.6,
                      onHover:
                        activeTab === "Year" || activeTab === "Month"
                          ? (event, elements, chart) => {
                              chart.canvas.style.cursor =
                                elements.length > 0 ? "pointer" : "default";
                            }
                          : undefined,
                    }}
                  />
                )}
              </div>
            </div>
            <div
              className="col-4 ps-2 border rounded-2"
              style={{ backgroundColor: "#F8FBFF" }}
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
                  {AverageData?.stats?.average
                    ? `${AverageData.stats.average} km`
                    : "-"}
                </span>
              </div>

              {/* Min/Max Rows - Only show in Week tab */}
              {activeTab === "Week" && DistanceStatsData && (
                <>
                  <div
                    className="d-flex justify-content-between p-2 mb-1"
                    style={{
                      backgroundColor: "#FFE8E8",
                      fontSize: "10px",
                      fontWeight: "600",
                    }}
                  >
                    <span style={{ color: "#ff6b6b" }}>Min</span>
                    <span style={{ color: "#ff6b6b" }}>
                      {parseFloat(DistanceStatsData.min).toFixed(2)} km
                    </span>
                  </div>
                  <div
                    className="d-flex justify-content-between p-2 mb-1"
                    style={{
                      backgroundColor: "#E8F8E8",
                      fontSize: "10px",
                      fontWeight: "600",
                    }}
                  >
                    <span style={{ color: "#51cf66" }}>Max</span>
                    <span style={{ color: "#51cf66" }}>
                      {parseFloat(DistanceStatsData.max).toFixed(2)} km
                    </span>
                  </div>
                </>
              )}

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
                  // Table skeleton
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
                      onClick={
                        activeTab === "Year"
                          ? () => {
                              const clickedMonth = DistanceData[index];
                              if (clickedMonth) {
                                // Parse date more carefully to avoid timezone issues
                                const dateStr = clickedMonth.date;
                                let monthDate;

                                if (dateStr.includes("-")) {
                                  // Handle YYYY-MM-DD format
                                  const [year, month] = dateStr
                                    .split("-")
                                    .map(Number);
                                  monthDate = new Date(year, month - 1, 1); // month is 0-indexed
                                } else {
                                  // Fallback to original parsing
                                  const originalDate = new Date(dateStr);
                                  monthDate = new Date(
                                    originalDate.getFullYear(),
                                    originalDate.getMonth(),
                                    1
                                  );
                                }
                                onDateChange(monthDate);
                                // Use setTimeout to ensure date change takes effect
                                setTimeout(() => {
                                  handleTabChange("Month");
                                }, 0);
                              }
                            }
                          : activeTab === "Month"
                          ? () => {
                              const clickedDay = DistanceData[index];
                              if (clickedDay) {
                                // Parse date more carefully to avoid timezone issues
                                const dateStr = clickedDay.date;
                                let dayDate;

                                if (dateStr.includes("-")) {
                                  // Handle YYYY-MM-DD format
                                  const [year, month, day] = dateStr
                                    .split("-")
                                    .map(Number);
                                  dayDate = new Date(year, month - 1, day); // month is 0-indexed
                                } else {
                                  // Fallback to original parsing
                                  dayDate = new Date(dateStr);
                                }

                                onDateChange(dayDate);
                                // Use setTimeout to ensure date change takes effect
                                setTimeout(() => {
                                  handleTabChange("Day");
                                }, 0);
                              }
                            }
                          : undefined
                      }
                      onMouseEnter={
                        activeTab === "Year" || activeTab === "Month"
                          ? (e) => {
                              e.target.style.backgroundColor = "#F0F7FF";
                            }
                          : undefined
                      }
                      onMouseLeave={
                        activeTab === "Year" || activeTab === "Month"
                          ? (e) => {
                              e.target.style.backgroundColor = "white";
                            }
                          : undefined
                      }
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
                      ((AverageData?.todayData?.value || 0) /
                        (AverageData?.goals?.distance || 1)) *
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
                    {Math.round(
                      ((AverageData?.todayData?.value || 0) /
                        (AverageData?.goals?.distance || 1)) *
                        100
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
                  (AverageData?.goals?.distance || 0) -
                    (AverageData?.todayData?.value || 0)
                ).toFixed(2)}{" "}
                km to reach daily goal
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
                    {AverageData?.todayData?.value
                      ? `${AverageData.todayData.value.toFixed(2)}`
                      : "-"}
                  </div>
                  <div
                    style={{
                      fontSize: "9px",
                      color: "#666",
                      fontWeight: "500",
                    }}
                  >
                    Today (km)
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
                    {AverageData?.goals?.distance
                      ? AverageData.goals.distance.toFixed(2)
                      : "-"}
                  </div>
                  <div
                    style={{
                      fontSize: "9px",
                      color: "#666",
                      fontWeight: "500",
                    }}
                  >
                    Goal (km)
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

export default DistanceCard;
