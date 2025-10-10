import React, { useState } from "react";
import GPSTracking_Icon from "../../../../assets/images/PatientDashboard/GPS tracking.png";
import { IoIosExpand } from "react-icons/io";
import { IoChevronBack, IoChevronForward, IoChevronDown, IoChevronUp } from "react-icons/io5";
import { TbMapUp } from "react-icons/tb";
import { Bar } from "react-chartjs-2";

const GPSTrackingCard = ({
  expandedCard,
  onCardExpand,
  activeTab,
  onTabChange,
  currentDate,
  onDateChange,
}) => {
  const [expandedItems, setExpandedItems] = useState({});
  const [expandedActivityDetails, setExpandedActivityDetails] = useState({});
  const [showMapView, setShowMapView] = useState(false);
  const [selectedBikeActivity, setSelectedBikeActivity] = useState(null);

  // Static data for demonstration
  const staticData = {
    Day: {
      intradayData: [
        { timeRange: "6:00-9:00", distance: 0.5 },
        { timeRange: "9:00-12:00", distance: 2.1 },
        { timeRange: "12:00-15:00", distance: 0.8 },
        { timeRange: "15:00-18:00", distance: 3.2 },
        { timeRange: "18:00-21:00", distance: 1.5 },
        { timeRange: "21:00-24:00", distance: 0.2 }
      ]
    },
    Week: [
      { date: "2024-01-01", value: 8.3 },
      { date: "2024-01-02", value: 5.7 },
      { date: "2024-01-03", value: 9.1 },
      { date: "2024-01-04", value: 7.4 },
      { date: "2024-01-05", value: 6.8 },
      { date: "2024-01-06", value: 10.2 },
      { date: "2024-01-07", value: 4.9 }
    ],
    Month: [
      { date: "Week 1", value: 52.4 },
      { date: "Week 2", value: 48.7 },
      { date: "Week 3", value: 55.3 },
      { date: "Week 4", value: 41.2 }
    ],
    Year: [
      { date: "2024-01-01", value: 197.6 },
      { date: "2024-02-01", value: 215.3 },
      { date: "2024-03-01", value: 189.7 },
      { date: "2024-04-01", value: 234.8 },
      { date: "2024-05-01", value: 201.4 },
      { date: "2024-06-01", value: 267.9 }
    ]
  };



  const getChartData = () => {
    if (activeTab === "Day") {
      const intradayData = staticData.Day.intradayData;
      const labels = intradayData.map((item) => item.timeRange);
      const data = intradayData.map((item) => item.distance);
      const tableData = intradayData.map((item) => ({
        period: item.timeRange,
        value: item.distance ? `${item.distance} km` : "0 km",
        details: item.distance > 0 ? [
          { 
            time: "6:59", 
            category: "bike", 
            distance: "1.2 km",
            duration: "15 min",
            avgSpeed: "4.8 km/h",
            energyBurned: "45 cal"
          },
          { 
            time: "7:15", 
            category: "walk", 
            distance: "0.8 km",
            duration: "12 min",
            avgSpeed: "4.0 km/h",
            energyBurned: "32 cal",
            steps: "1,250"
          }
        ] : null
      }));
      return { labels, data, tableData };
    }

    const apiData = staticData[activeTab] || [];
    
    if (apiData.length === 0) {
      return { labels: [], data: [], tableData: [] };
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
        value: item.value ? `${item.value} km` : "0 km",
        details: item.value > 0 ? [
          { 
            time: "6:59", 
            category: "bike", 
            distance: "2.1 km",
            duration: "25 min",
            avgSpeed: "5.0 km/h",
            energyBurned: "78 cal"
          },
          { 
            time: "14:30", 
            category: "walk", 
            distance: "1.5 km",
            duration: "18 min",
            avgSpeed: "5.0 km/h",
            energyBurned: "65 cal",
            steps: "2,100"
          }
        ] : null
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
  };

  const handleTabChange = (tab) => {
    onTabChange(tab);
  };

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: "white",
        border: "1px solid #e9ecef",
        borderRadius: "8px",
        minHeight: expandedCard === "gpsTracking" ? "550px" : "245px",
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
            src={GPSTracking_Icon}
            alt="GPS Tracking"
            className="mx-2"
            style={{ width: "19px", height: "19px" }}
          />
          <span style={{ fontSize: "12px", fontWeight: "600" }}>
            GPS Tracking
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
            onClick={() => onCardExpand("gpsTracking")}
          />
        </div>
      </div>
      <div className="p-1 pt-0">
        {expandedCard === "gpsTracking" ? (
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
                {showMapView ? (
                  <div className="h-100 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <h6 style={{ fontSize: "12px", color: "#003465", margin: 0 }}>Route Navigation</h6>
                        <small style={{ fontSize: "10px", color: "#666" }}>
                          {selectedBikeActivity?.time} - {selectedBikeActivity?.category} ({selectedBikeActivity?.distance})
                        </small>
                      </div>
                      <button
                        className="btn btn-sm"
                        style={{
                          backgroundColor: "#003465",
                          color: "white",
                          fontSize: "10px",
                          padding: "4px 8px",
                        }}
                        onClick={() => setShowMapView(false)}
                      >
                        Back to Chart
                      </button>
                    </div>
                    <div
                      className="flex-grow-1"
                      style={{
                        borderRadius: "8px",
                        overflow: "hidden",
                      }}
                    >
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d24176.251535935987!2d-74.0060!3d40.7128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e1!4m5!1s0x89c25a316e15a0ad%3A0x82b4725c4f81a0ad!2sNew%20York%2C%20NY%2C%20USA!3m2!1d40.7127753!2d-74.0059728!4m5!1s0x89c2588f046ee661%3A0xa0b3281fcecc08c!2sManhattan%2C%20New%20York%2C%20NY%2C%20USA!3m2!1d40.7831!2d-73.9712!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="GPS Route Map"
                      ></iframe>
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
                          grid: { color: "#f0f0f0" },
                          ticks: { color: "#666", fontSize: 10 },
                        },
                      },
                      categoryPercentage: 0.6,
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
                  8.3 km
                </span>
              </div>

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
                  chartData.tableData.map((item, index) => {
                    const itemKey = `${activeTab}-${item.period}-${index}`;
                    const isExpanded = expandedItems[itemKey];
                    const hasData = item.details && item.details.length > 0;
                    
                    return (
                      <div key={itemKey}>
                        <div
                          className="d-flex justify-content-between align-items-center p-2 mb-1"
                          style={{
                            backgroundColor: isExpanded ? "#F0F7FF" : "white",
                            fontSize: "10px",
                            borderRadius: "4px",
                            border: isExpanded ? "1px solid #003465" : "1px solid #E8F2FF",
                            cursor: hasData ? "pointer" : "default",
                            opacity: hasData ? 1 : 0.7,
                            transition: "all 0.2s ease",
                            boxShadow: isExpanded ? "0 2px 4px rgba(0,52,101,0.1)" : "none",
                          }}
                          onClick={() => {
                            if (hasData) {
                              setExpandedItems(prev => {
                                const isCurrentlyExpanded = prev[itemKey];
                                return isCurrentlyExpanded ? {} : { [itemKey]: true };
                              });
                            }
                          }}
                        >
                          <div className="d-flex align-items-center" style={{ gap: "6px" }}>
                            <span style={{ color: "#003465", fontWeight: "500" }}>{item.period}</span>
                            {hasData && (
                              <div style={{ fontSize: "8px", color: "#666" }}>
                                {isExpanded ? <IoChevronUp /> : <IoChevronDown />}
                              </div>
                            )}
                          </div>
                          <span style={{ color: "#003465", fontWeight: "600" }}>{item.value}</span>
                        </div>
                        
                        {isExpanded && hasData && (
                          <div
                            className="mb-2 p-3"
                            style={{
                              backgroundColor: "#FAFCFF",
                              borderRadius: "6px",
                              border: "1px solid #D6E8FF",
                              marginLeft: "4px",
                              marginRight: "4px",
                              marginTop: "6px",
                              boxShadow: "inset 0 1px 3px rgba(0,52,101,0.05)",
                            }}
                          >
                            <div style={{ fontSize: "9px", color: "#666", marginBottom: "8px", fontWeight: "500" }}>
                              Activity Details:
                            </div>
                            {item.details.map((detail, detailIndex) => {
                              const activityKey = `${itemKey}-${detailIndex}`;
                              const isActivityExpanded = expandedActivityDetails[activityKey];
                              
                              return (
                                <div key={detailIndex}>
                                  <div
                                    className="d-flex justify-content-between align-items-center py-2 px-2"
                                    style={{
                                      fontSize: "9px",
                                      backgroundColor: "white",
                                      borderRadius: "4px",
                                      border: "1px solid #E8F2FF",
                                      marginBottom: "6px",
                                      transition: "all 0.1s ease",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => {
                                      if (detail.category === "bike") {
                                        setSelectedBikeActivity(detail);
                                        setShowMapView(true);
                                      } else {
                                        setExpandedActivityDetails(prev => ({
                                          ...prev,
                                          [activityKey]: !prev[activityKey]
                                        }));
                                      }
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.backgroundColor = "#F8FBFF";
                                      e.currentTarget.style.borderColor = "#B8D4FF";
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.backgroundColor = "white";
                                      e.currentTarget.style.borderColor = "#E8F2FF";
                                    }}
                                  >
                                    <div className="d-flex align-items-center" style={{ gap: "6px" }}>
                                      <div
                                        style={{
                                          width: "6px",
                                          height: "6px",
                                          borderRadius: "50%",
                                          backgroundColor: detail.category === "bike" ? "#28a745" : "#007bff",
                                        }}
                                      ></div>
                                      <span style={{ color: "#003465", fontWeight: "600" }}>{detail.time}</span>
                                      <span style={{ color: "#666", fontSize: "8px" }}>•</span>
                                      <span style={{ color: "#003465", textTransform: "capitalize" }}>{detail.category}</span>
                                      {detail.category === "bike" && (
                                        <TbMapUp style={{ color: "#28a745", fontSize: "10px" }} />
                                      )}
                                    </div>
                                    <span style={{ color: "#003465", fontWeight: "600" }}>{detail.distance}</span>
                                  </div>
                                  
                                  {isActivityExpanded && (
                                    <div
                                      className="mt-2 p-2"
                                      style={{
                                        backgroundColor: "#F0F7FF",
                                        borderRadius: "4px",
                                        border: "1px solid #D6E8FF",
                                        marginBottom: "6px",
                                      }}
                                    >
                                      <div className="row g-1">
                                        <div className="col-6">
                                          <div style={{ fontSize: "8px", color: "#666" }}>Duration</div>
                                          <div style={{ fontSize: "9px", color: "#003465", fontWeight: "600" }}>{detail.duration}</div>
                                        </div>
                                        <div className="col-6">
                                          <div style={{ fontSize: "8px", color: "#666" }}>Distance</div>
                                          <div style={{ fontSize: "9px", color: "#003465", fontWeight: "600" }}>{detail.distance}</div>
                                        </div>
                                        <div className="col-6">
                                          <div style={{ fontSize: "8px", color: "#666" }}>Avg Speed</div>
                                          <div style={{ fontSize: "9px", color: "#003465", fontWeight: "600" }}>{detail.avgSpeed}</div>
                                        </div>
                                        <div className="col-6">
                                          <div style={{ fontSize: "8px", color: "#666" }}>Energy Burned</div>
                                          <div style={{ fontSize: "9px", color: "#003465", fontWeight: "600" }}>{detail.energyBurned}</div>
                                        </div>
                                        {detail.category === "walk" && detail.steps && (
                                          <div className="col-6">
                                            <div style={{ fontSize: "8px", color: "#666" }}>Steps</div>
                                            <div style={{ fontSize: "9px", color: "#003465", fontWeight: "600" }}>{detail.steps}</div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
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
                      301 - (8.3 / 10) * 301
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
                    8.3
                  </div>
                  <div
                    style={{
                      fontSize: "9px",
                      color: "#666",
                      fontWeight: "500",
                    }}
                  >
                    km
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mb-2">
              <p
                className="mb-0"
                style={{ fontSize: "10px", color: "#666", fontWeight: "500" }}
              >
                Today's distance tracked
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
                    8.3
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
                    8.3
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

export default GPSTrackingCard;