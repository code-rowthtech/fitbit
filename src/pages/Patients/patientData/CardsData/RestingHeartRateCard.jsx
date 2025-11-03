import React, { useState, useEffect } from "react";
import RestingHeartRate_Icon from "../../../../assets/images/PatientDashboard/heart rate.png";
import { IoIosExpand } from "react-icons/io";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { Line } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { getPatientHeartRate } from "../../../../redux/patientsDashboard/action";

const RestingHeartRateCard = ({
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

  const FilterData = useSelector(
    (state) => state?.getPatientHeartRate?.data?.response?.data
  );
  const HeartRateStatsData = useSelector(
    (state) => state?.getPatientHeartRate?.data?.response?.targetRange
  );
  const AverageData = useSelector(
    (state) => state?.getPatientHeartRate?.data?.response
  );
  const Loading = useSelector((state) => state?.getPatientHeartRate?.loading);
  // Reset loading states when data loading completes
  useEffect(() => {
    if (!Loading) {
      setIsNavigating(false);
      setIsTabSwitching(false);
    }
  }, [Loading]);

  // Fetch data on component mount and when dependencies change
  useEffect(() => {
    if (patientId) {
      const date = new Date(currentDate);
      let start, end;

      switch (activeTab) {
        case "Day":
          start = new Date(date);
          end = new Date(date);
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
        field: "heartRate",
      };
      if (activeTab === "Year") payload.period = "year";
      if (activeTab === "Day") payload.intraday = true;
      dispatch(getPatientHeartRate(payload));
    }
  }, [patientId, currentDate, activeTab, dispatch, formatDate]);

  // Get chart data based on active tab and API response
  const getChartData = () => {
    if (!FilterData || FilterData.length === 0) {
      return { labels: [], data: [], tableData: [] };
    }

    const apiData = FilterData;

    // Handle Day view with heartRateIntraday data
    if (activeTab === "Day" && apiData[0]?.heartRateIntraday) {
      const intradayData = apiData[0].heartRateIntraday;

      // Filter data to show every 30 minutes
      const filteredData = intradayData.filter((item, index) => {
        const time = item.time;
        const minutes = parseInt(time.split(":")[1]);
        return minutes % 30 === 0; // Show data points at 00, 30
      });

      const labels = filteredData.map((item) => item.time);
      const data = filteredData.map((item) => item.value);
      const tableData = filteredData.map((item) => ({
        period: item.time,
        value: item.value ? `${item.value} bpm` : "0 bpm",
      }));
      return { labels, data, tableData };
    }

    const labels = apiData.map((item) => {
      if (activeTab === "Month" && item.date.includes("Week")) {
        const weekMatch = item.date.match(/Week (\d+)/);
        return weekMatch ? `Week ${weekMatch[1]}` : item.date;
      }

      // Parse date reliably without timezone issues
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

    const data = apiData.map((item, index) => {
      // If today's value is 0, use previous day's value
      if (item.value === 0 && index > 0) {
        return apiData[index - 1].value;
      }
      return item.value;
    });

    const tableData = apiData.map((item) => {
      let period;

      if (activeTab === "Month" && item.date.includes("Week")) {
        const weekMatch = item.date.match(/Week (\d+)/);
        period = weekMatch ? `Week ${weekMatch[1]}` : item.date;
      } else {
        // Parse date reliably without timezone issues
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
          case "Day":
            // For Day view, show full date format
            period = date.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            });
            break;
          default:
            period = date.toLocaleDateString();
        }
      }

      return {
        period,
        value: item.value ? `${item.value} bpm` : "0 bpm",
      };
    });

    return { labels, data, tableData };
  };

  const chartData = getChartData();

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
        start = new Date(newDate);
        end = new Date(newDate);
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
          field: "heartRate",
        };
        if (activeTab === "Year") payload.period = "year";
        if (activeTab === "Day") payload.intraday = true;
        dispatch(getPatientHeartRate(payload));
      }
    }, 0);
  };

  const handleTabChange = (tab, specificDate = null) => {
    if (isTabSwitching || tab === activeTab) return;

    setIsTabSwitching(true);
    onTabChange(tab);
    // Fetch data for new tab
    setTimeout(() => {
      if (patientId) {
        const date = new Date(specificDate || currentDate);
        let start, end;

        switch (tab) {
          case "Day":
            start = new Date(date);
            end = new Date(date);
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
          field: "heartRate",
        };
        if (tab === "Year") payload.period = "year";
        if (tab === "Day") payload.intraday = true;
        dispatch(getPatientHeartRate(payload));
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
        minHeight: expandedCard === "restingHeartRate" ? "550px" : "245px",
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
            src={RestingHeartRate_Icon}
            alt="Resting Heart Rate"
            className="mx-2"
            style={{ width: "19px", height: "19px" }}
          />
          <span
            style={{ fontSize: "12px", fontWeight: "600", color: "#003465" }}
          >
            Heart Rate
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
            onClick={() => onCardExpand("restingHeartRate")}
          />
        </div>
      </div>
      <div className="p-1 pt-0">
        {expandedCard === "restingHeartRate" ? (
          <div className="row p-3">
            <div className="col-8 pe-2">
              <div
                className="border rounded-2"
                style={{
                  padding: "15px",
                  backgroundColor: "#FAFCFF",
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

                          {/* Skeleton chart line */}
                          <path
                            d={`M 0 60% Q 25% 40% 50% 50% T 100% 45%`}
                            fill="none"
                            stroke="#E8F2FF"
                            strokeWidth="3"
                            className="placeholder"
                          />

                          {/* Skeleton data points */}
                          {[...Array(8)].map((_, i) => (
                            <circle
                              key={`point-${i}`}
                              cx={`${i * 14 + 5}%`}
                              cy={`${45 + Math.sin(i) * 15}%`}
                              r="3"
                              fill="#E8F2FF"
                              className="placeholder"
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
                  <Line
                    key={`chart-${activeTab}-${chartData.data.length}`}
                    data={{
                      labels: chartData.labels,
                      datasets: [
                        {
                          data: chartData.data,
                          borderColor: "#003465",
                          backgroundColor:
                            activeTab === "Day"
                              ? "rgba(0, 52, 101, 0.05)"
                              : "rgba(0, 52, 101, 0.1)",
                          borderWidth: activeTab === "Day" ? 2 : 2,
                          pointBackgroundColor: "#003465",
                          pointBorderColor: "#ffffff",
                          pointBorderWidth: activeTab === "Day" ? 2 : 1,
                          pointRadius: activeTab === "Day" ? 0 : 3,
                          pointHoverRadius: activeTab === "Day" ? 6 : 5,
                          fill: activeTab === "Day" ? false : true,
                          tension: activeTab === "Day" ? 0.4 : 0.1,
                        },
                      ],
                    }}
                    options={{
                      maintainAspectRatio: false,
                      onClick:
                        activeTab === "Year"
                          ? (event, elements) => {
                              if (elements.length > 0) {
                                const dataIndex = elements[0].index;
                                const monthIndex = dataIndex;
                                const newDate = new Date(
                                  currentDate.getFullYear(),
                                  monthIndex,
                                  1
                                );
                                onDateChange(newDate);
                                handleTabChange("Month", newDate);
                              }
                            }
                          : undefined,
                      interaction: {
                        intersect: false,
                        mode: "index",
                      },
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          backgroundColor: "rgba(0, 52, 101, 0.9)",
                          titleColor: "#ffffff",
                          bodyColor: "#ffffff",
                          borderColor: "#003465",
                          borderWidth: 1,
                          cornerRadius: 8,
                          displayColors: false,
                          callbacks: {
                            title: (context) => {
                              return activeTab === "Day"
                                ? `Time: ${context[0].label}`
                                : context[0].label;
                            },
                            label: (context) => {
                              return `Heart Rate: ${context.parsed.y} bpm`;
                            },
                          },
                        },
                      },
                      scales: {
                        x: {
                          grid: {
                            display: activeTab === "Day" ? true : false,
                            color: "rgba(0, 0, 0, 0.05)",
                            drawOnChartArea: true,
                            drawTicks: false,
                          },
                          ticks: {
                            color: "#666",
                            fontSize: 10,
                            maxRotation: 0,
                            ...(activeTab === "Day" && {
                              maxTicksLimit: 12,
                              callback: function (value, index, values) {
                                const label = this.getLabelForValue(value);
                                if (label.includes(":")) {
                                  const time = label.split(" ")[1] || label;
                                  return time.length > 5
                                    ? time.substring(0, 5)
                                    : time;
                                }
                                return label;
                              },
                            }),
                          },
                          border: {
                            display: false,
                          },
                        },
                        y: {
                          beginAtZero: false,
                          min:
                            activeTab === "Week" && HeartRateStatsData
                              ? Math.min(
                                  0,
                                  parseFloat(HeartRateStatsData.min) - 5
                                )
                              : chartData.data.length > 0
                              ? Math.min(...chartData.data) - 10
                              : 0,
                          max:
                            activeTab === "Week" && HeartRateStatsData
                              ? Math.max(
                                  ...chartData.data,
                                  parseFloat(HeartRateStatsData.max) + 5
                                )
                              : chartData.data.length > 0
                              ? Math.max(...chartData.data) + 10
                              : 100,
                          grid: {
                            color: "rgba(0, 0, 0, 0.08)",
                            drawTicks: false,
                          },
                          ticks: {
                            color: "#666",
                            fontSize: 10,
                            padding: 10,
                            callback: function (value) {
                              return Math.round(value) + " bpm";
                            },
                          },
                          border: {
                            display: false,
                          },
                        },
                      },
                    }}
                  />
                )}
              </div>
            </div>
            <div
              className="col-4 ps-2 border rounded-2"
              style={{ backgroundColor: "#F8FBFF" }}
            >
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
                    ? `${AverageData.stats.average} bpm`
                    : "-"}
                </span>
              </div>

              {/* Min/Max Rows - Only show in Week tab */}
              {activeTab === "Week" && HeartRateStatsData && (
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
                      {HeartRateStatsData.min} bpm
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
                      {HeartRateStatsData.max} bpm
                    </span>
                  </div>
                </>
              )}

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
                  chartData.tableData.map((item, index) => {
                    const handleRowClick = () => {
                      if (activeTab === "Year") {
                        // Navigate to month view
                        const monthIndex = index;
                        const newDate = new Date(
                          currentDate.getFullYear(),
                          monthIndex,
                          1
                        );
                        onDateChange(newDate);
                        handleTabChange("Month", newDate);
                      } else if (activeTab === "Month") {
                        // Navigate to day view - use row index to get correct date
                        const dayNumber = index + 1; // Day number based on row position
                        const newDate = new Date(
                          currentDate.getFullYear(),
                          currentDate.getMonth(),
                          dayNumber
                        );
                        onDateChange(newDate);
                        handleTabChange("Day", newDate);
                      }
                    };

                    return (
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
                          transition: "background-color 0.2s ease",
                        }}
                        onClick={handleRowClick}
                        onMouseEnter={(e) => {
                          if (activeTab === "Year" || activeTab === "Month") {
                            e.target.style.backgroundColor = "#F0F7FF";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (activeTab === "Year" || activeTab === "Month") {
                            e.target.style.backgroundColor = "white";
                          }
                        }}
                      >
                        <span style={{ color: "#003465" }}>{item.period}</span>
                        <span style={{ color: "#003465" }}>{item.value}</span>
                      </div>
                    );
                  })
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
                      301 - ((AverageData?.todayData?.value || 0) / 100) * 301
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
                    bpm
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mb-2">
              <p
                className={`mb-0 ${Loading ? "placeholder rounded-1" : ""}`}
                style={{ fontSize: "10px", color: "#666", fontWeight: "500" }}
              >
                Current resting heart rate
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
                    {AverageData?.todayData?.restingHeartRate || "0"} bpm
                  </div>
                  <div
                    style={{
                      fontSize: "9px",
                      color: "#666",
                      fontWeight: "500",
                    }}
                  >
                    Resting(HR)
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
                    {AverageData?.stats?.average || "-"} bpm
                  </div>
                  <div
                    style={{
                      fontSize: "9px",
                      color: "#666",
                      fontWeight: "500",
                    }}
                  >
                    Average
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

export default RestingHeartRateCard;
