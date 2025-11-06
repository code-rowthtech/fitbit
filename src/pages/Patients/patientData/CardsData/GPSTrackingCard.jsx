import React, { useState, useEffect } from "react";
import GPSTracking_Icon from "../../../../assets/images/PatientDashboard/GPS tracking.png";
import { IoIosExpand } from "react-icons/io";
import { TbNotes } from "react-icons/tb";
import {
  IoChevronBack,
  IoChevronForward,
  IoChevronDown,
  IoChevronUp,
} from "react-icons/io5";
import { TbMapUp } from "react-icons/tb";
import { Bar } from "react-chartjs-2";
import GPSMapView from "../../../../components/GPSMapView";
import { useDispatch, useSelector } from "react-redux";
import { getNotes } from "../../../../redux/notes/action";
import { getPatientGpsTracking, getExerciseSessions } from "../../../../redux/patientsDashboard/action";
import NotesModal from "../../../../components/NotesModal";

const GPSTrackingCard = ({
  patientId,
  masterDataId,
  expandedCard,
  onCardExpand,
  activeTab,
  onTabChange,
  currentDate,
  onDateChange,
}) => {
  const dispatch = useDispatch();
  const [expandedItems, setExpandedItems] = useState({});
  const [expandedActivityDetails, setExpandedActivityDetails] = useState({});
  const [showMapView, setShowMapView] = useState(false);
  const [selectedBikeActivity, setSelectedBikeActivity] = useState(null);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedLogId, setSelectedLogId] = useState(null);

  const gpsTrackingData = useSelector(
    (state) => state?.getPatientGpsTracking?.data
  );
  const Loading = useSelector((state) => state?.getPatientGpsTracking?.loading);

  const ExerciseData = useSelector(
    (state) => state?.getExerciseSessions?.data?.response?.data
  );
  const TodayExerciseData = useSelector(
    (state) => state?.getExerciseSessions?.data?.response?.currentWeekData

  );
  console.log(TodayExerciseData, 'TodayExerciseData')
  const ExerciseLoading = useSelector((state) => state?.getExerciseSessions?.loading);

  const fieldKey = "ExerciseData_Gps-Tracking";
  const notesData = useSelector((state) => state?.getNotesReducer?.data?.[fieldKey]?.notes || []);
  const notesLoading = useSelector((state) => state?.getNotesReducer?.loading?.[fieldKey] || false);
  const addNotesResponse = useSelector((state) => state?.addNotesReducer?.data?.status);
  const updateNotesResponse = useSelector((state) => state?.updateNotesReducer?.data?.status);
  const deleteNotesResponse = useSelector((state) => state?.deleteNotesReducer?.data?.status);
  useEffect(() => {
    if (patientId) {
      const params = { patientId, page: 1, limit: 4, type: "ExerciseData", value: "Gps-Tracking" };
      dispatch(getNotes(params, fieldKey));
    }
  }, [dispatch, patientId, fieldKey, addNotesResponse, updateNotesResponse, deleteNotesResponse]);

  // Fetch exercise sessions data to get logId
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

      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      const payload = {
        patientId: patientId,
        start: formatDate(start),
        end: formatDate(end),
        field: "exerciseSessions",
      };
      if (activeTab === "Year") payload.period = "year";
      dispatch(getExerciseSessions(payload));
    }
  }, [patientId, currentDate, activeTab, dispatch]);

  // Fetch GPS tracking data when logId is selected
  useEffect(() => {
    if (patientId && selectedLogId) {
      const payload = {
        userId: patientId,
        logId: selectedLogId,
      };
      dispatch(getPatientGpsTracking(payload));
    }
  }, [patientId, selectedLogId, dispatch]);

  // Update map view when GPS tracking data changes
  useEffect(() => {
    if (gpsTrackingData && !Loading) {
      if (gpsTrackingData?.data?.trackPoints?.length > 0) {
        setSelectedBikeActivity({
          trackPoints: gpsTrackingData.data.trackPoints,
          sport: gpsTrackingData.data.sport,
          startTime: gpsTrackingData.data.startTime,
        });
      } else {
        setSelectedBikeActivity({ noData: true });
      }
    }
  }, [gpsTrackingData, Loading]);

  // Handle activity click to fetch GPS tracking
  const handleActivityClick = (logId, activityName) => {
    setSelectedLogId(logId);
  };

  const getChartData = () => {
    if (!ExerciseData || ExerciseData.length === 0) {
      return { labels: [], data: [], tableData: [] };
    }

    const apiData = ExerciseData;

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
        value: item.value || 0,
        exerciseSessions: item.exerciseSessions || [],
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
    const current = new Date(currentDate);

    switch (activeTab) {
      case "Week":
        const nextWeekStart = new Date(current);
        nextWeekStart.setDate(current.getDate() - current.getDay() + 7);
        return nextWeekStart > today;
      case "Month":
        return current.getMonth() === today.getMonth() && current.getFullYear() === today.getFullYear();
      case "Year":
        return current.getFullYear() === today.getFullYear();
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
    setSelectedLogId(null);
    setSelectedBikeActivity(null);
    setExpandedItems({});
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
          <TbNotes
            title="Notes"
            style={{
              fontSize: "16px",
              color: "#003465",
              marginLeft: "6px",
              cursor: "pointer",
            }}
            onClick={() => setShowNotesModal(true)}
          />
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
                {Loading && selectedLogId ? (
                  <div className="h-100 d-flex justify-content-center align-items-center">
                    <div style={{ textAlign: "center", color: "#666" }}>
                      <div className="spinner-border text-primary mb-2" role="status" style={{ width: "30px", height: "30px" }}>
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <div style={{ fontSize: "12px" }}>Loading GPS data...</div>
                    </div>
                  </div>
                ) : selectedBikeActivity?.noData ? (
                  <div className="h-100 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 style={{ fontSize: "12px", color: "#003465", margin: 0 }}>
                        GPS Tracking
                      </h6>
                      <button
                        className="btn btn-sm"
                        style={{
                          backgroundColor: "#003465",
                          color: "white",
                          fontSize: "10px",
                          padding: "4px 8px",
                        }}
                        onClick={() => {
                          setSelectedLogId(null);
                          setSelectedBikeActivity(null);
                        }}
                      >
                        Back to Chart
                      </button>
                    </div>
                    <div className="h-100 d-flex justify-content-center align-items-center">
                      <div style={{ textAlign: "center", color: "#666" }}>
                        <div style={{ fontSize: "40px", marginBottom: "12px" }}>📍</div>
                        <div style={{ fontSize: "14px", fontWeight: "500", marginBottom: "4px" }}>No GPS Data Available</div>
                        <div style={{ fontSize: "11px", color: "#999" }}>This activity doesn't have GPS tracking data</div>
                      </div>
                    </div>
                  </div>
                ) : selectedBikeActivity?.trackPoints?.length > 0 ? (
                  <div className="h-100 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <h6
                          style={{
                            fontSize: "12px",
                            color: "#003465",
                            margin: 0,
                          }}
                        >
                          Route Navigation - {selectedBikeActivity?.sport}
                        </h6>
                        <small style={{ fontSize: "10px", color: "#666" }}>
                          {selectedBikeActivity?.startTime && new Date(selectedBikeActivity.startTime).toLocaleString()}
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
                        onClick={() => {
                          setShowMapView(false);
                          setSelectedLogId(null);
                          setSelectedBikeActivity(null);
                        }}
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
                      <GPSMapView gpsData={selectedBikeActivity} />
                    </div>
                  </div>
                ) : ExerciseLoading ? (
                  <div className="h-100 d-flex justify-content-center align-items-center">
                    <div style={{ textAlign: "center", color: "#666" }}>
                      <div className="spinner-border text-primary mb-2" role="status" style={{ width: "30px", height: "30px" }}>
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <div style={{ fontSize: "12px" }}>Loading chart data...</div>
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
                    border: `1px solid ${isNextDisabled() ? "#ccc" : "#003465"
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
                <span style={{ color: "#003465" }}>8.3 km</span>
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
                    const hasData = item.exerciseSessions && item.exerciseSessions.length > 0;

                    return (
                      <div key={itemKey}>
                        <div
                          className="d-flex justify-content-between align-items-center p-2 mb-1"
                          style={{
                            backgroundColor: isExpanded ? "#F0F7FF" : "white",
                            fontSize: "10px",
                            borderRadius: "4px",
                            border: isExpanded
                              ? "1px solid #003465"
                              : "1px solid #E8F2FF",
                            cursor: hasData ? "pointer" : "default",
                            opacity: hasData ? 1 : 0.7,
                            transition: "all 0.2s ease",
                            boxShadow: isExpanded
                              ? "0 2px 4px rgba(0,52,101,0.1)"
                              : "none",
                          }}
                          onClick={() => {
                            if (hasData) {
                              setExpandedItems((prev) => {
                                const isCurrentlyExpanded = prev[itemKey];
                                return isCurrentlyExpanded
                                  ? {}
                                  : { [itemKey]: true };
                              });
                            }
                          }}
                        >
                          <div
                            className="d-flex align-items-center"
                            style={{ gap: "6px" }}
                          >
                            <span
                              style={{ color: "#003465", fontWeight: "500" }}
                            >
                              {item.period}
                            </span>
                            {hasData && (
                              <div style={{ fontSize: "8px", color: "#666" }}>
                                {isExpanded ? (
                                  <IoChevronUp />
                                ) : (
                                  <IoChevronDown />
                                )}
                              </div>
                            )}
                          </div>
                          <span style={{ color: "#003465", fontWeight: "600" }}>
                            {item.value}
                          </span>
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
                            <div
                              style={{
                                fontSize: "9px",
                                color: "#666",
                                marginBottom: "8px",
                                fontWeight: "500",
                              }}
                            >
                              Activity Details:
                            </div>
                            {item.exerciseSessions.map((session, detailIndex) => {
                              const activityKey = `${itemKey}-${detailIndex}`;
                              const isActivityExpanded =
                                expandedActivityDetails[activityKey];

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
                                      handleActivityClick(session.logId, session.activityName);
                                    }}
                                  >
                                    <div className="d-flex align-items-center" style={{ gap: "4px" }}>
                                      <span style={{ color: "#003465", fontWeight: "600" }}>
                                        {new Date(session.startTime).toLocaleTimeString("en-US", {
                                          hour: "numeric",
                                          minute: "2-digit",
                                          hour12: true,
                                        })}
                                      </span>
                                      <span style={{ color: "#666" }}>•</span>
                                      <span style={{ color: "#666", textTransform: "capitalize" }}>
                                        {session.activityName}
                                      </span>
                                    </div>
                                    <div className="d-flex align-items-center" style={{ gap: "8px" }}>
                                      <span style={{ color: "#003465" }}>
                                        {session.distance ? `${session.distance.toFixed(2)} ${session.distanceUnit?.toLowerCase() || "mi"}` : "0 mi"}
                                      </span>
                                      <span style={{ color: "#666" }}>•</span>
                                      <span style={{ color: "#666" }}>
                                        {session.duration}
                                      </span>
                                      <span style={{ color: "#666" }}>•</span>
                                      <span style={{ color: "#666" }}>
                                        {session.calories} cal
                                      </span>
                                      {session.steps && (
                                        <>
                                          <span style={{ color: "#666" }}>•</span>
                                          <span style={{ color: "#666" }}>
                                            {session.steps} steps
                                          </span>
                                        </>
                                      )}
                                    </div>
                                  </div>
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
                    className="d-flex justify-content-center align-items-center"
                    style={{ padding: "20px", color: "#666", fontSize: "10px" }}
                  >
                    No data available
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="row g-2 mt-0">
            <div className="col-8 mt-1">
              <div
                className="rounded-3 px-2 d-flex flex-column"
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
                        strokeDashoffset={301 - ((() => {
                          const today = TodayExerciseData?.find(d => new Date(d.date).toDateString() === new Date().toDateString());
                          const todayActivities = today?.exerciseSessions?.length || 0;
                          return todayActivities / 10;
                        })()) * 301}
                        strokeLinecap="round"
                        transform="rotate(-90 60 60)"
                      />
                    </svg>
                    <div className="position-absolute top-50 start-50 translate-middle text-center">
                      <div
                        className="fw-bold"
                        style={{ fontSize: "16px", color: "#003465" }}
                      >
                        {(() => {
                          const today = TodayExerciseData?.find(d => new Date(d.date).toDateString() === new Date().toDateString());
                          return today?.exerciseSessions?.length || 0;
                        })()}
                      </div>
                      <div
                        style={{
                          fontSize: "9px",
                          color: "#666",
                          fontWeight: "500",
                        }}
                      >
                        activities
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center mb-2">
                  <p
                    className="mb-0"
                    style={{ fontSize: "10px", color: "#666", fontWeight: "500" }}
                  >
                    Today's activities
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
                        {(() => {
                          const today = TodayExerciseData?.find(d => new Date(d.date).toDateString() === new Date().toDateString());
                          return today?.exerciseSessions?.length || 0;
                        })()}
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
                        {(() => {
                          const daysWithData = TodayExerciseData?.filter(d => d.hasData) || [];
                          const totalActivities = daysWithData.reduce((sum, d) => sum + (d.exerciseSessions?.length || 0), 0);
                          const avgActivities = daysWithData.length > 0 ? (totalActivities / daysWithData.length).toFixed(1) : 0;
                          return avgActivities;
                        })()}
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
            </div>
            
            <div className="col-4 ps-0 mt-1">
              <div
                className="rounded-3 px-1 py-2"
                style={{ backgroundColor: "#F8FBFF", height: "200px" }}
              >
                <div
                  className="mb-2 d-flex justify-content-between align-items-center position-relative"
                  style={{ fontSize: "12px", color: "#003465", fontWeight: "600" }}
                >
                  <span>Notes</span>
                </div>
                <div className="d-flex flex-column gap-1" style={{ maxHeight: "140px", overflowY: "auto" }}>
                  {notesLoading ? (
                    [...Array(3)].map((_, index) => (
                      <div
                        key={`skeleton-${index}`}
                        className="px-1 py-0 placeholder-glow"
                        style={{
                          borderBottom: "1px solid #E8F2FF",
                          fontSize: "9px",
                        }}
                      >
                        <span className="placeholder rounded-1" style={{ width: "80%", height: "8px" }}></span>
                      </div>
                    ))
                  ) : notesData.length > 0 ? (
                    notesData.slice(0, 4).map((note, index) => (
                      <div
                        key={note._id || index}
                        className="px-1 py-0"
                        style={{
                          borderBottom: "1px solid #E8F2FF",
                          fontSize: "9px",
                          color: "#666",
                        }}
                        title={note.title}
                      >
                        • {note.title.length > 30 ? `${note.title.substring(0, 30)}...` : note.title}
                      </div>
                    ))
                  ) : (
                    <div
                      className="px-1 py-2 text-center"
                      style={{
                        fontSize: "9px",
                        color: "#999",
                      }}
                    >
                      No notes available
                    </div>
                  )}
                </div>
                {notesData.length > 0 && (
                  <div className="text-end px-1 mt-1">
                    <span
                      style={{
                        fontSize: "9px",
                        color: "#003465",
                        cursor: "pointer",
                        textDecoration: "underline"
                      }}
                      onClick={() => setShowNotesModal(true)}
                    >
                      View All  
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <NotesModal
        show={showNotesModal}
        onHide={() => setShowNotesModal(false)}
        patientId={patientId}
        masterDataId={masterDataId}
        title="GPS Tracking Notes"
        type="ExerciseData"
        value="Gps-Tracking"
      />
    </div>
  );
};

export default GPSTrackingCard;
