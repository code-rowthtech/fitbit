import React, { useState, useEffect } from "react";
import ExerciseSessions_Icon from "../../../../assets/images/PatientDashboard/Exercise sessions.png";
import { IoIosExpand } from "react-icons/io";
import { IoChevronBack, IoChevronForward, IoCheckmark } from "react-icons/io5";
import { Bar } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { getExerciseSessions } from "../../../../redux/patientsDashboard/action";
import { useParams, useSearchParams } from "react-router-dom";

const ExerciseSessionsCard = ({
  expandedCard,
  onCardExpand,
  activeTab,
  onTabChange,
  currentDate,
  onDateChange,
  formatDate,
}) => {
  const dispatch = useDispatch();
  const ExerciseData = useSelector(
    (state) => state?.getExerciseSessions?.data?.response?.data
  );
  const AverageData = useSelector(
    (state) => state?.getExerciseSessions?.data?.response
  );
  const Loading = useSelector((state) => state?.getExerciseSessions?.loading);
  const [expandedSession, setExpandedSession] = useState(null);
  const [selectedSessionIndex, setSelectedSessionIndex] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isTabSwitching, setIsTabSwitching] = useState(false);

  // Reset loading states when data loading completes
  useEffect(() => {
    if (!Loading) {
      setIsNavigating(false);
      setIsTabSwitching(false);
    }
  }, [Loading]);

  const { id: pathId } = useParams();
  const [searchParams] = useSearchParams();
  const patientId =
    pathId || searchParams.get("id") || searchParams.get("patientId");

  const formatDuration = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 60000);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours > 0 ? `${hours}h ${remainingMinutes}m` : `${minutes}m`;
  };

  const handleSessionClick = (item, index) => {
    if (item.value > 0) {
      if (activeTab === "Week") {
        // Switch to Day tab and set date to the clicked day
        const originalItem = ExerciseData[index];
        if (originalItem?.date) {
          const clickedDate = new Date(originalItem.date);
          onDateChange(clickedDate);
          onTabChange("Day");
          setSelectedSessionIndex(0); // Reset to first session
        }
      } else {
        setExpandedSession(expandedSession === index ? null : index);
      }
    }
  };

  const getChartData = () => {
    if (!ExerciseData || ExerciseData.length === 0) {
      return { labels: [], data: [], tableData: [] };
    }

    const apiData = ExerciseData;

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
        value: item.value || 0,
      };
    });

    return { labels, data, tableData };
  };

  const chartData = getChartData();

  // Fetch data on component mount and when dependencies change
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
        field: "exerciseSessions",
      };
      if (activeTab === "Year") payload.period = "year";
      dispatch(getExerciseSessions(payload));
    }
  }, [patientId, currentDate, activeTab, dispatch, formatDate]);

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
          field: "exerciseSessions",
        };
        if (activeTab === "Year") payload.period = "year";
        dispatch(getExerciseSessions(payload));
      }
    }, 0);
  };

  const handleTabChange = (tab) => {
    if (isTabSwitching || tab === activeTab) return;

    setIsTabSwitching(true);
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
          field: "exerciseSessions",
        };
        // if (tab === "Month") payload.period = "month";
        if (tab === "Year") payload.period = "year";
        dispatch(getExerciseSessions(payload));
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
        minHeight: expandedCard === "sessions" ? "550px" : "245px",
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
            src={ExerciseSessions_Icon}
            alt="Exercise Sessions"
            className="mx-2"
            style={{ width: "19px", height: "19px" }}
          />
          <span style={{ fontSize: "12px", fontWeight: "600" }}>
            Exercise Sessions
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
            onClick={() => onCardExpand("sessions")}
          />
        </div>
      </div>
      <div className="p-1 pt-0">
        {expandedCard === "sessions" ? (
          <div className="row p-3">
            <div className="col-8 pe-2">
              <div
                className="border rounded-2"
                style={{
                  padding: "20px",
                  backgroundColor: "#F6FAFF",
                  height: "500px",
                }}
              >
                {activeTab === "Day" ? (
                  <div className="h-100">
                    {ExerciseData &&
                    ExerciseData.length > 0 &&
                    ExerciseData[0]?.exerciseSessions?.length > 0 ? (
                      <>
                        <div
                          className="mb-3"
                          style={{
                            background: "white",
                            borderRadius: "8px",
                            padding: "8px",
                            boxShadow: "0 2px 4px rgba(0,52,101,0.08)",
                          }}
                        >
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
                                style={{
                                  fontSize: "12px",
                                  fontWeight: "700",
                                  color: "#003465",
                                }}
                              >
                                {ExerciseData?.[0]?.exerciseSessions?.[
                                  selectedSessionIndex
                                ]
                                  ? new Date(
                                      ExerciseData[0].exerciseSessions[
                                        selectedSessionIndex
                                      ].startTime
                                    ).toLocaleTimeString("en-US", {
                                      hour: "numeric",
                                      minute: "2-digit",
                                      hour12: true,
                                    })
                                  : "9:26 am"}
                              </div>
                              <div
                                style={{
                                  fontSize: "9px",
                                  color: "#666",
                                  fontWeight: "500",
                                }}
                              >
                                Start Time
                              </div>
                            </div>
                            <div className="text-center">
                              <div
                                style={{
                                  fontSize: "11px",
                                  fontWeight: "600",
                                  color: "#666",
                                }}
                              >
                                {ExerciseData?.[0]?.exerciseSessions?.[
                                  selectedSessionIndex
                                ]?.activityName || "Exercise"}
                              </div>
                              <div style={{ fontSize: "8px", color: "#999" }}>
                                {ExerciseData?.[0]?.exerciseSessions?.[
                                  selectedSessionIndex
                                ]?.source?.name || "Device"}
                              </div>
                            </div>
                            <div className="text-center">
                              <div
                                style={{
                                  fontSize: "12px",
                                  fontWeight: "700",
                                  color: "#003465",
                                }}
                              >
                                Today
                              </div>
                              <div
                                style={{
                                  fontSize: "9px",
                                  color: "#666",
                                  fontWeight: "500",
                                }}
                              >
                                {ExerciseData?.[0]?.exerciseSessions?.[
                                  selectedSessionIndex
                                ]
                                  ? new Date(
                                      ExerciseData[0].exerciseSessions[
                                        selectedSessionIndex
                                      ].startTime
                                    ).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })
                                  : "Oct 25, 2024"}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="row g-2">
                          <div className="col-4">
                            <div
                              className="p-2 rounded d-flex flex-column justify-content-center"
                              style={{
                                backgroundColor: "white",
                                border: "1px solid #E8F2FF",
                                height: "60px",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "10px",
                                  color: "#666",
                                  marginBottom: "2px",
                                }}
                              >
                                Duration
                              </div>
                              <div
                                style={{
                                  fontSize: "12px",
                                  fontWeight: "600",
                                  color: "#003465",
                                }}
                              >
                                {ExerciseData?.[0]?.exerciseSessions?.[
                                  selectedSessionIndex
                                ]?.duration || "0m"}
                              </div>
                            </div>
                          </div>
                          <div className="col-4">
                            <div
                              className="p-2 rounded d-flex flex-column justify-content-center"
                              style={{
                                backgroundColor: "white",
                                border: "1px solid #E8F2FF",
                                height: "60px",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "10px",
                                  color: "#666",
                                  marginBottom: "2px",
                                }}
                              >
                                Distance
                              </div>
                              <div
                                style={{
                                  fontSize: "12px",
                                  fontWeight: "600",
                                  color: "#003465",
                                }}
                              >
                                {ExerciseData?.[0]?.exerciseSessions?.[
                                  selectedSessionIndex
                                ]
                                  ? `${
                                      ExerciseData[0].exerciseSessions[
                                        selectedSessionIndex
                                      ].distance?.toFixed(2) || 0
                                    } ${
                                      ExerciseData[0].exerciseSessions[
                                        selectedSessionIndex
                                      ].distanceUnit?.toLowerCase() || "mi"
                                    }`
                                  : "0 mi"}
                              </div>
                            </div>
                          </div>
                          <div className="col-4">
                            <div
                              className="p-2 rounded d-flex flex-column justify-content-center"
                              style={{
                                backgroundColor: "white",
                                border: "1px solid #E8F2FF",
                                height: "60px",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "10px",
                                  color: "#666",
                                  marginBottom: "2px",
                                }}
                              >
                                Avg Speed
                              </div>
                              <div
                                style={{
                                  fontSize: "12px",
                                  fontWeight: "600",
                                  color: "#003465",
                                }}
                              >
                                {ExerciseData?.[0]?.exerciseSessions?.[
                                  selectedSessionIndex
                                ]
                                  ? `${(
                                      ExerciseData[0].exerciseSessions[
                                        selectedSessionIndex
                                      ].speed * 2.237
                                    ).toFixed(1)} mph`
                                  : "0 mph"}
                              </div>
                            </div>
                          </div>
                          <div className="col-4">
                            <div
                              className="p-2 rounded d-flex flex-column justify-content-center"
                              style={{
                                backgroundColor: "white",
                                border: "1px solid #E8F2FF",
                                height: "60px",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "10px",
                                  color: "#666",
                                  marginBottom: "2px",
                                }}
                              >
                                Avg Heart Rate
                              </div>
                              <div
                                style={{
                                  fontSize: "12px",
                                  fontWeight: "600",
                                  color: "#003465",
                                }}
                              >
                                {ExerciseData?.[0]?.exerciseSessions?.[
                                  selectedSessionIndex
                                ]?.averageHeartRate || 0}{" "}
                                bpm
                              </div>
                            </div>
                          </div>
                          <div className="col-4">
                            <div
                              className="p-2 rounded d-flex flex-column justify-content-center"
                              style={{
                                backgroundColor: "white",
                                border: "1px solid #E8F2FF",
                                height: "60px",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "10px",
                                  color: "#666",
                                  marginBottom: "2px",
                                }}
                              >
                                Energy burned
                              </div>
                              <div
                                style={{
                                  fontSize: "12px",
                                  fontWeight: "600",
                                  color: "#003465",
                                }}
                              >
                                {ExerciseData?.[0]?.exerciseSessions?.[
                                  selectedSessionIndex
                                ]?.calories || 0}{" "}
                                cal
                              </div>
                            </div>
                          </div>
                          <div className="col-4">
                            <div
                              className="p-2 rounded d-flex flex-column justify-content-center"
                              style={{
                                backgroundColor: "white",
                                border: "1px solid #E8F2FF",
                                height: "60px",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "10px",
                                  color: "#666",
                                  marginBottom: "2px",
                                }}
                              >
                                Elevation Gain
                              </div>
                              <div
                                style={{
                                  fontSize: "12px",
                                  fontWeight: "600",
                                  color: "#003465",
                                }}
                              >
                                {ExerciseData?.[0]?.exerciseSessions?.[
                                  selectedSessionIndex
                                ]?.elevationGain || 0}{" "}
                                ft
                              </div>
                            </div>
                          </div>
                          <div className="col-4">
                            <div
                              className="p-2 rounded d-flex flex-column justify-content-center"
                              style={{
                                backgroundColor: "white",
                                border: "1px solid #E8F2FF",
                                height: "60px",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "10px",
                                  color: "#666",
                                  marginBottom: "2px",
                                }}
                              >
                                Cardio Load
                              </div>
                              <div
                                style={{
                                  fontSize: "12px",
                                  fontWeight: "600",
                                  color: "#003465",
                                }}
                              >
                                {ExerciseData?.[0]?.exerciseSessions?.[
                                  selectedSessionIndex
                                ]
                                  ? Math.round(
                                      ExerciseData[0].exerciseSessions[
                                        selectedSessionIndex
                                      ].cl || 0
                                    )
                                  : 0}
                              </div>
                            </div>
                          </div>
                          <div className="col-4">
                            <div
                              className="p-2 rounded d-flex flex-column justify-content-center"
                              style={{
                                backgroundColor: "white",
                                border: "1px solid #E8F2FF",
                                height: "60px",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "10px",
                                  color: "#666",
                                  marginBottom: "2px",
                                }}
                              >
                                Zone Min
                              </div>
                              <div
                                style={{
                                  fontSize: "12px",
                                  fontWeight: "600",
                                  color: "#003465",
                                }}
                              >
                                {ExerciseData?.[0]?.exerciseSessions?.[
                                  selectedSessionIndex
                                ]?.activeZoneMinutes?.totalMinutes || 0}
                              </div>
                            </div>
                          </div>
                          <div className="col-4">
                            <div
                              className="p-2 rounded d-flex flex-column justify-content-center"
                              style={{
                                backgroundColor: "white",
                                border: "1px solid #E8F2FF",
                                height: "60px",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "10px",
                                  color: "#666",
                                  marginBottom: "2px",
                                }}
                              >
                                Swim Lengths
                              </div>
                              <div
                                style={{
                                  fontSize: "12px",
                                  fontWeight: "600",
                                  color: "#003465",
                                }}
                              >
                                {ExerciseData?.[0]?.exerciseSessions?.[
                                  selectedSessionIndex
                                ]?.swimLengths || 0}
                              </div>
                            </div>
                          </div>
                          {(ExerciseData?.[0]?.exerciseSessions?.[
                            selectedSessionIndex
                          ]?.steps || 0) > 0 && (
                            <div className="col-4">
                              <div
                                className="p-2 rounded d-flex flex-column justify-content-center"
                                style={{
                                  backgroundColor: "white",
                                  border: "1px solid #E8F2FF",
                                  height: "60px",
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: "10px",
                                    color: "#666",
                                    marginBottom: "2px",
                                  }}
                                >
                                  Steps
                                </div>
                                <div
                                  style={{
                                    fontSize: "12px",
                                    fontWeight: "600",
                                    color: "#003465",
                                  }}
                                >
                                  {ExerciseData?.[0]?.exerciseSessions?.[
                                    selectedSessionIndex
                                  ]?.steps || 0}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="d-flex justify-content-center align-items-center h-100">
                        <div
                          style={{
                            color: "#666",
                            fontSize: "16px",
                            textAlign: "center",
                          }}
                        >
                          <div
                            style={{ marginBottom: "8px", fontSize: "18px" }}
                          >
                            📊
                          </div>
                          <div>No data present for this day</div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : Loading || isNavigating || isTabSwitching ? (
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
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className="placeholder rounded-1 mb-4"
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
                          {[...Array(4)].map((_, i) => (
                            <line
                              key={`grid-${i}`}
                              x1="0"
                              y1={`${(i + 1) * 25}%`}
                              x2="100%"
                              y2={`${(i + 1) * 25}%`}
                              stroke="#E8F2FF"
                              strokeWidth="1"
                            />
                          ))}

                          {/* Skeleton bars */}
                          {[...Array(7)].map((_, i) => (
                            <rect
                              key={`bar-${i}`}
                              x={`${i * 14 + 2}%`}
                              y={`${60 + Math.sin(i) * 20}%`}
                              width="10%"
                              height={`${20 + Math.cos(i) * 15}%`}
                              fill="#E8F2FF"
                              rx="3"
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
                        {[...Array(7)].map((_, i) => (
                          <div
                            key={i}
                            className="placeholder rounded-1"
                            style={{ height: "8px", width: "15px" }}
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
                          max: 2,
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
                <span style={{ color: "#003465" }}>Total</span>
                <span style={{ color: "#003465" }}>
                  {AverageData?.stats?.total || 0} sessions
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
                {Loading || isNavigating || isTabSwitching ? (
                  // Table skeleton
                  [...Array(6)].map((_, index) => (
                    <div key={`skeleton-${index}`} className="mb-1">
                      <div
                        className="d-flex justify-content-between align-items-center p-2 placeholder-glow"
                        style={{
                          backgroundColor: "white",
                          fontSize: "10px",
                          borderRadius: "4px",
                          border: "1px solid #E8F2FF",
                        }}
                      >
                        <span
                          className="placeholder rounded-1"
                          style={{ width: "60px", height: "10px" }}
                        ></span>
                        <span
                          className="placeholder rounded-1"
                          style={{ width: "50px", height: "10px" }}
                        ></span>
                      </div>
                    </div>
                  ))
                ) : chartData.tableData.length > 0 ? (
                  chartData.tableData.map((item, index) => {
                    const sessionCount = parseInt(item.value) || 0;
                    const originalItem = ExerciseData[index];
                    return (
                      <div
                        key={`${activeTab}-${item.period}-${index}`}
                        className="mb-1"
                      >
                        <div
                          className="d-flex justify-content-between align-items-center p-2"
                          style={{
                            backgroundColor:
                              sessionCount === 0 ? "#ffebee" : "white",
                            fontSize: "10px",
                            borderRadius: "4px",
                            border: "1px solid #E8F2FF",
                            cursor: sessionCount > 0 ? "pointer" : "default",
                          }}
                          onClick={() => handleSessionClick(item, index)}
                        >
                          <span style={{ color: "#003465", fontWeight: "500" }}>
                            {item.period}
                          </span>
                          <div className="d-flex align-items-center">
                            <span
                              style={{ color: "#003465", fontWeight: "500" }}
                            >
                              {sessionCount}{" "}
                              {sessionCount === 1 ? "session" : "sessions"}
                            </span>
                            {sessionCount > 0 && (
                              <span
                                style={{
                                  color: "#003465",
                                  marginLeft: "4px",
                                  fontSize: "8px",
                                }}
                              >
                                {expandedSession === index ? "▼" : "▶"}
                              </span>
                            )}
                          </div>
                        </div>
                        {expandedSession === index &&
                          sessionCount > 0 &&
                          originalItem?.exerciseSessions && (
                            <div
                              className="mt-1 p-2"
                              style={{
                                backgroundColor: "#f8fbff",
                                borderRadius: "4px",
                                border: "1px solid #e3f2fd",
                              }}
                            >
                              {originalItem.exerciseSessions.map(
                                (session, sessionIndex) => (
                                  <div
                                    key={sessionIndex}
                                    className="d-flex justify-content-between align-items-center py-1 px-2"
                                    style={{
                                      fontSize: "10px",
                                      borderBottom:
                                        sessionIndex <
                                        originalItem.exerciseSessions.length - 1
                                          ? "1px solid #e3f2fd"
                                          : "none",
                                      cursor:
                                        activeTab === "Day"
                                          ? "pointer"
                                          : "default",
                                      backgroundColor:
                                        activeTab === "Day" &&
                                        selectedSessionIndex === sessionIndex
                                          ? "#E8F2FF"
                                          : "transparent",
                                    }}
                                    onClick={() => {
                                      if (activeTab === "Day") {
                                        setSelectedSessionIndex(sessionIndex);
                                      } else if (activeTab === "Week") {
                                        // Switch to Day tab and set date to this day
                                        const originalItem =
                                          ExerciseData[index];
                                        if (originalItem?.date) {
                                          const clickedDate = new Date(
                                            originalItem.date
                                          );
                                          onDateChange(clickedDate);
                                          onTabChange("Day");
                                          setSelectedSessionIndex(sessionIndex);
                                        }
                                      }
                                    }}
                                  >
                                    <span
                                      style={{
                                        color: "#003465",
                                        fontWeight: "500",
                                      }}
                                    >
                                      {session.activityName}
                                    </span>
                                    <span style={{ color: "#003465" }}>
                                      {session.duration || "-"}
                                    </span>
                                  </div>
                                )
                              )}
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
            className={`rounded-3 px-3 py-3 mt-1 ${
              Loading ? "placeholder-glow" : ""
            }`}
            style={{ backgroundColor: "#F8FBFF" }}
          >
            <div className="d-flex justify-content-between align-items-end py-4">
              <div>
                <div className="d-flex align-items-baseline mt-3 mb-3">
                  <span
                    className={`${Loading ? "placeholder rounded-1" : ""}`}
                    style={{
                      fontSize: "48px",
                      fontWeight: "400",
                      color: "#003465",
                    }}
                  >
                    {AverageData?.currentWeekData?.filter((day) => day.hasData)
                      .length || 0}
                  </span>
                  <span
                    style={{
                      fontSize: "24px",
                      fontWeight: "400",
                      color: "#666",
                      marginLeft: "8px",
                    }}
                  >
                    of 5
                  </span>
                </div>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  Days of this week
                </div>
              </div>

              <div className="d-flex flex-column align-items-end">
                <div className="d-flex gap-1 mb-2">
                  {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => {
                    const dayData = AverageData?.currentWeekData?.[index];
                    return (
                      <div
                        key={index}
                        className={`rounded-pill d-flex align-items-center justify-content-center ${
                          Loading ? "placeholder" : ""
                        }`}
                        style={{
                          width: "24px",
                          height: "68px",
                          backgroundColor: dayData?.hasData
                            ? "#003465"
                            : "#B8D4E3",
                        }}
                      >
                        {dayData?.hasData && (
                          <IoCheckmark
                            style={{
                              color: "white",
                              fontSize: "16px",
                              strokeWidth: "40",
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="d-flex gap-1">
                  {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => {
                    const dayData = AverageData?.currentWeekData?.[index];
                    return (
                      <div
                        key={index}
                        className="text-center"
                        style={{
                          width: "24px",
                          fontSize: "14px",
                          color: dayData?.hasData ? "#000" : "#666",
                          fontWeight: dayData?.hasData ? "600" : "400",
                        }}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseSessionsCard;
