import React, { useState, useEffect } from "react";
import RestingHeartRate_Icon from "../../../../assets/images/PatientDashboard/heart rate.png";
import { IoIosExpand } from "react-icons/io";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { Bar } from "react-chartjs-2";
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
  // console.log(AverageData,'AverageDataAverageData')
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

    // Handle Day view with intraday data
    if (activeTab === "Day" && apiData[0]?.intradayData) {
      const intradayData = apiData[0].intradayData;
      const labels = intradayData.map((item) => item.timeRange);
      const data = intradayData.map((item) => item.restingHeartRate);
      const tableData = intradayData.map((item) => ({
        period: item.timeRange,
        value: item.restingHeartRate ? `${item.restingHeartRate} bpm` : "0 bpm",
      }));
      return { labels, data, tableData };
    }

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

  const handleTabChange = (tab) => {
    onTabChange(tab);
    // Fetch data for new tab
    setTimeout(() => {
      if (patientId) {
        const date = new Date(currentDate);
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
            Resting Heart Rate
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
                  padding: "10px",
                  backgroundColor: "#F6FAFF",
                  height: "500px",
                }}
              >
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
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            return `${context.parsed.y} bpm`;
                          },
                        },
                      },
                    },
                    scales: {
                      x: {
                        grid: { display: false },
                        ticks: { color: "#666", fontSize: 10 },
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
                            ? Math.min(...chartData.data) - 5
                            : 0,
                        max:
                          activeTab === "Week" && HeartRateStatsData
                            ? Math.max(
                                ...chartData.data,
                                parseFloat(HeartRateStatsData.max) + 5
                              )
                            : chartData.data.length > 0
                            ? Math.max(...chartData.data) + 5
                            : 100,
                        grid: { color: "#f0f0f0" },
                        ticks: { color: "#666", fontSize: 10 },
                      },
                    },
                    categoryPercentage: 0.6,
                  }}
                />
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
