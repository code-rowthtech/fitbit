import React, { useState, useEffect } from "react";
import Weight_Icon from "../../../../assets/images/PatientDashboard/Weight.png";
import { IoIosExpand } from "react-icons/io";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { Line } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { getPatientWeight } from "../../../../redux/patientsDashboard/action";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const WeightCard = ({
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
  const [chartType, setChartType] = useState("weight");
  const FilterData = useSelector(
    (state) => state?.getPatientWeight?.data?.response?.data
  );
  console.log(FilterData, "FilterData");
  const WeightStatsData = useSelector(
    (state) => state?.getPatientWeight?.data?.response?.targetRange
  );
  const AverageData = useSelector(
    (state) => state?.getPatientWeight?.data?.response
  );
  const Loading = useSelector((state) => state?.getPatientWeight?.loading);
  // Get date range based on active tab and current date
  const getDateRange = () => {
    const date = new Date(currentDate);

    switch (activeTab) {
      case "Week":
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return {
          start: startOfWeek,
          end: endOfWeek,
        };
      case "Month":
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        return {
          start: startOfMonth,
          end: endOfMonth,
        };
      case "Year":
        const startOfYear = new Date(date.getFullYear(), 0, 1);
        const endOfYear = new Date(date.getFullYear(), 11, 31);
        return {
          start: startOfYear,
          end: endOfYear,
        };
      default:
        return { start: new Date(), end: new Date() };
    }
  };

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
      let currentValue;
      switch (chartType) {
        case "bmi":
          currentValue = item.weightData?.bmi;
          break;
        case "bodyFat":
          currentValue = item.weightData?.bodyFat;
          break;
        default:
          currentValue = item.value;
      }

      // If current value is null, 0, or undefined, find the last valid value
      if (
        (currentValue === null ||
          currentValue === 0 ||
          currentValue === undefined) &&
        index > 0
      ) {
        // Look backwards to find the last non-null, non-zero value
        for (let i = index - 1; i >= 0; i--) {
          let prevValue;
          switch (chartType) {
            case "bmi":
              prevValue = apiData[i].weightData?.bmi;
              break;
            case "bodyFat":
              prevValue = apiData[i].weightData?.bodyFat;
              break;
            default:
              prevValue = apiData[i].value;
          }
          if (
            prevValue !== null &&
            prevValue !== 0 &&
            prevValue !== undefined
          ) {
            return prevValue;
          }
        }
        // If no valid previous value found, return null to hide point
        return null;
      }
      return currentValue;
    });

    // Create point styles array to hide markers for null/0 values
    const pointBackgroundColors = apiData.map((item) => {
      let currentValue;
      switch (chartType) {
        case "bmi":
          currentValue = item.weightData?.bmi;
          break;
        case "bodyFat":
          currentValue = item.weightData?.bodyFat;
          break;
        default:
          currentValue = item.value;
      }
      return currentValue === null ||
        currentValue === 0 ||
        currentValue === undefined
        ? "transparent"
        : "#003465";
    });
    const pointBorderColors = apiData.map((item) => {
      let currentValue;
      switch (chartType) {
        case "bmi":
          currentValue = item.weightData?.bmi;
          break;
        case "bodyFat":
          currentValue = item.weightData?.bodyFat;
          break;
        default:
          currentValue = item.value;
      }
      return currentValue === null ||
        currentValue === 0 ||
        currentValue === undefined
        ? "transparent"
        : "#003465";
    });
    const pointRadii = apiData.map((item) => {
      let currentValue;
      switch (chartType) {
        case "bmi":
          currentValue = item.weightData?.bmi;
          break;
        case "bodyFat":
          currentValue = item.weightData?.bodyFat;
          break;
        default:
          currentValue = item.value;
      }
      return currentValue === null ||
        currentValue === 0 ||
        currentValue === undefined
        ? 0
        : 4;
    });

    const tableData = apiData.map((item, index) => {
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

      // Use the same logic as chart data for consistency
      let displayValue;
      switch (chartType) {
        case "bmi":
          displayValue = item.weightData?.bmi;
          break;
        case "bodyFat":
          displayValue = item.weightData?.bodyFat;
          break;
        default:
          displayValue = item.value;
      }

      if (
        (displayValue === null ||
          displayValue === 0 ||
          displayValue === undefined) &&
        index > 0
      ) {
        for (let i = index - 1; i >= 0; i--) {
          let prevValue;
          switch (chartType) {
            case "bmi":
              prevValue = apiData[i].weightData?.bmi;
              break;
            case "bodyFat":
              prevValue = apiData[i].weightData?.bodyFat;
              break;
            default:
              prevValue = apiData[i].value;
          }
          if (
            prevValue !== null &&
            prevValue !== 0 &&
            prevValue !== undefined
          ) {
            displayValue = prevValue;
            break;
          }
        }
      }

      const unit =
        chartType === "weight" ? "kg" : chartType === "bodyFat" ? "%" : "";
      return {
        period,
        value: displayValue ? `${displayValue} ${unit}` : `0 ${unit}`,
      };
    });

    return {
      labels,
      data,
      tableData,
      pointBackgroundColors,
      pointBorderColors,
      pointRadii,
    };
  };

  const chartData = getChartData();

  // Get navigation label based on active tab
  const getNavigationLabel = () => {
    const date = new Date(currentDate);

    switch (activeTab) {
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

    const newDate = new Date(currentDate);

    switch (activeTab) {
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
          field: "weight",
        };
        if (activeTab === "Year") payload.period = "year";
        dispatch(getPatientWeight(payload));
      }
    }, 0);
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    onTabChange(tab);
    // Fetch data for new tab
    setTimeout(() => {
      if (patientId) {
        const date = new Date(currentDate);
        let start, end;

        switch (tab) {
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
          field: "weight",
        };
        if (tab === "Year") payload.period = "year";
        dispatch(getPatientWeight(payload));
      }
    }, 0);
  };

  // Fetch data on component mount and when dependencies change
  useEffect(() => {
    if (patientId) {
      const date = new Date(currentDate);
      let start, end;

      switch (activeTab) {
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
        field: "weight",
      };
      if (activeTab === "Year") payload.period = "year";
      dispatch(getPatientWeight(payload));
    }
  }, [patientId, currentDate, activeTab, dispatch, formatDate]);

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: "white",
        border: "1px solid #e9ecef",
        borderRadius: "8px",
        minHeight: expandedCard === "weight" ? "550px" : "245px",
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
            src={Weight_Icon}
            alt="Weight"
            className="mx-2"
            style={{ width: "19px", height: "19px" }}
          />
          <span
            style={{ fontSize: "12px", fontWeight: "600", color: "#003465" }}
          >
            Weight
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
            onClick={() => onCardExpand("weight")}
          />
        </div>
      </div>
      <div className="p-1 pt-0">
        {expandedCard === "weight" ? (
          <div className="row p-3">
            <div className="col-8 pe-2">
              <div
                className="border rounded-2 position-relative"
                style={{
                  padding: "10px",
                  backgroundColor: "#F6FAFF",
                  height: "500px",
                }}
              >
                <div
                  className="position-absolute"
                  style={{ top: "10px", right: "10px", zIndex: 10 }}
                >
                  <div className="d-flex gap-1">
                    <button
                      className="btn btn-sm"
                      style={{
                        backgroundColor:
                          chartType === "weight" ? "#003465" : "white",
                        color: chartType === "weight" ? "white" : "#003465",
                        border: "1px solid #003465",
                        fontSize: "10px",
                        padding: "4px 8px",
                      }}
                      onClick={() => setChartType("weight")}
                    >
                      Weight
                    </button>
                    <button
                      className="btn btn-sm"
                      style={{
                        backgroundColor:
                          chartType === "bmi" ? "#003465" : "white",
                        color: chartType === "bmi" ? "white" : "#003465",
                        border: "1px solid #003465",
                        fontSize: "10px",
                        padding: "4px 8px",
                      }}
                      onClick={() => setChartType("bmi")}
                    >
                      BMI
                    </button>
                    <button
                      className="btn btn-sm"
                      style={{
                        backgroundColor:
                          chartType === "bodyFat" ? "#003465" : "white",
                        color: chartType === "bodyFat" ? "white" : "#003465",
                        border: "1px solid #003465",
                        fontSize: "10px",
                        padding: "4px 8px",
                      }}
                      onClick={() => setChartType("bodyFat")}
                    >
                      Body Fat
                    </button>
                  </div>
                </div>
                <Line
                  key={`chart-${activeTab}-${chartType}-${chartData.data.length}`}
                  data={{
                    labels: chartData.labels,
                    datasets: [
                      {
                        label:
                          chartType === "weight"
                            ? "Weight"
                            : chartType === "bmi"
                            ? "BMI"
                            : "Body Fat",
                        data: chartData.data,
                        borderColor: "#003465",
                        backgroundColor: "rgba(0, 52, 101, 0.1)",
                        borderWidth: 2,
                        pointBackgroundColor: chartData.pointBackgroundColors,
                        pointBorderColor: chartData.pointBorderColors,
                        pointRadius: chartData.pointRadii,
                        fill: true,
                        spanGaps: true,
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
                            const unit =
                              chartType === "weight"
                                ? "kg"
                                : chartType === "bodyFat"
                                ? "%"
                                : "";
                            return `${context.parsed.y} ${unit}`;
                          },
                          afterBody:
                            activeTab === "Week" && WeightStatsData
                              ? () => [
                                  `Min: ${parseFloat(
                                    WeightStatsData.min
                                  ).toFixed(1)} kg`,
                                  `Max: ${parseFloat(
                                    WeightStatsData.max
                                  ).toFixed(1)} kg`,
                                ]
                              : activeTab === "Month" && FilterData
                              ? (context) => {
                                  const dataIndex = context[0]?.dataIndex;
                                  return dataIndex !== undefined &&
                                    FilterData[dataIndex]
                                    ? [`Date: ${FilterData[dataIndex].date}`]
                                    : [];
                                }
                              : undefined,
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
                          activeTab === "Week" && WeightStatsData
                            ? Math.min(0, parseFloat(WeightStatsData.min) - 1)
                            : chartData.data.length > 0
                            ? Math.min(...chartData.data) - 1
                            : 0,
                        max:
                          activeTab === "Week" && WeightStatsData
                            ? Math.max(
                                ...chartData.data,
                                parseFloat(WeightStatsData.max) + 1
                              )
                            : chartData.data.length > 0
                            ? Math.max(...chartData.data) + 1
                            : 100,
                        grid: { color: "#f0f0f0" },
                        ticks: { color: "#666", fontSize: 10 },
                      },
                    },
                  }}
                />
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
                {["Week", "Month", "Year"].map((tab, index) => (
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
                  {AverageData?.stats?.average
                    ? `${AverageData.stats.average} kg`
                    : "-"}
                </span>
              </div>

              {/* Min/Max Rows - Only show in Week tab */}
              {activeTab === "Week" && WeightStatsData && (
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
                      {WeightStatsData.min} kg
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
                      {WeightStatsData.max} kg
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
            className={`rounded-3 px-2 mt-1 pb-2 ${
              Loading ? "placeholder-glow" : ""
            }`}
            style={{ backgroundColor: "#F8FBFF" }}
          >
            <div className="row">
              <div className="col-8">
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
                          ((AverageData?.todayData?.value || 0) / 100) * 301
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
                        KG
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center mb-2">
                  <p
                    className={`mb-0 ${Loading ? "placeholder rounded-1" : ""}`}
                    style={{
                      fontSize: "10px",
                      color: "#666",
                      fontWeight: "500",
                    }}
                  >
                    Weight is in healthy range
                  </p>
                </div>

                <div className="row g-1">
                  <div className="col-3">
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
                        {AverageData?.todayData?.value || "-"}kg
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
                  <div className="col-3">
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
                        {AverageData?.goals?.weightGoal?.weight || "-"}kg
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
                  <div className="col-3">
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
                        {AverageData?.todayData?.weightData?.bmi || "-"}
                      </div>
                      <div
                        style={{
                          fontSize: "9px",
                          color: "#666",
                          fontWeight: "500",
                        }}
                      >
                        BMI
                      </div>
                    </div>
                  </div>
                  <div className="col-3">
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
                        {AverageData?.todayData?.weightData?.bodyFat || "-"}%
                      </div>
                      <div
                        style={{
                          fontSize: "9px",
                          color: "#666",
                          fontWeight: "500",
                        }}
                      >
                        Body Fat
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="col-4 px-1 pt-1"
                style={{ borderLeft: "1px solid #ddd" }}
              >
                <div
                  className="mb-2 text-start"
                  style={{
                    fontSize: "12px",
                    fontWeight: "700",
                    color: "#003465",
                    letterSpacing: "0.5px",
                  }}
                >
                  Goal Progress:
                </div>

                <div
                  className="p-3 mb-2 rounded-3 shadow-sm position-relative"
                  style={{
                    backgroundColor: "white",
                    border: "2px solid #E8F2FF",
                  }}
                >
                  <div
                    className="position-absolute top-0 start-0 w-100 h-1 rounded-top"
                    style={{ backgroundColor: "#003465" }}
                  ></div>
                  <div className="d-flex align-items-center mb-1">
                    <div
                      className="rounded-circle me-2"
                      style={{
                        width: "8px",
                        height: "8px",
                        backgroundColor: "#003465",
                      }}
                    ></div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#003465",
                        fontWeight: "600",
                      }}
                    >
                      Progress Update
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#003465",
                      fontWeight: "500",
                      lineHeight: "1.3",
                    }}
                  >
                    {" "}
                    <span className="fw-bold">
                      {AverageData?.todayData?.value &&
                      AverageData?.goals?.weightGoal?.startWeight
                        ? Math.abs(
                            AverageData.todayData.value -
                              AverageData.goals.weightGoal.startWeight
                          ).toFixed(1)
                        : 0}
                      kg
                    </span>{" "}
                    gained since{" "}
                    <span>
                      {AverageData?.goals?.weightGoal?.startDate
                        ? new Date(
                            AverageData.goals.weightGoal.startDate
                          ).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                          })
                        : "-"}
                    </span>
                  </div>
                </div>

                <div
                  className="p-3 rounded-3 shadow-sm position-relative"
                  style={{
                    backgroundColor: "white",
                    border: "2px solid #E8F2FF",
                  }}
                >
                  <div
                    className="position-absolute top-0 start-0 w-100 h-1 rounded-top"
                    style={{ backgroundColor: "#003465" }}
                  ></div>
                  <div className="d-flex align-items-center mb-1">
                    <div
                      className="rounded-circle me-2"
                      style={{
                        width: "8px",
                        height: "8px",
                        backgroundColor: "#003465",
                      }}
                    ></div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#003465",
                        fontWeight: "600",
                      }}
                    >
                      Goal Status
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#003465",
                      fontWeight: "500",
                      lineHeight: "1.3",
                    }}
                  >
                    <span className="fw-bold">
                      {AverageData?.todayData?.value &&
                      AverageData?.goals?.weightGoal?.weight
                        ? Math.abs(
                            AverageData.goals.weightGoal.weight -
                              AverageData.todayData.value
                          ).toFixed(1)
                        : 0}
                      kg
                    </span>{" "}
                    to go - this goal is in the bag!
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

export default WeightCard;
