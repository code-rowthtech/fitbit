import React, { useState, useEffect } from "react";
import Elevation_Icon from "../../../../assets/images/PatientDashboard/elevation.png";
import { IoIosExpand } from "react-icons/io";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { TbNotes } from "react-icons/tb";
import { Bar } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { getNotes } from "../../../../redux/notes/action";
import NotesModal from "../../../../components/NotesModal";

const ElevationCard = ({
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
  const [showNotesModal, setShowNotesModal] = useState(false);
  
  const fieldKey = "ExerciseData_Elavation";
  const notesData = useSelector((state) => state?.getNotesReducer?.data?.[fieldKey]?.notes || []);
  const notesLoading = useSelector((state) => state?.getNotesReducer?.loading?.[fieldKey] || false);
  const addNotesResponse = useSelector((state) => state?.addNotesReducer?.data?.status);
  const updateNotesResponse = useSelector((state) => state?.updateNotesReducer?.data?.status);
  const deleteNotesResponse = useSelector((state) => state?.deleteNotesReducer?.data?.status);

  useEffect(() => {
    if (patientId) {
      const params = { patientId, page: 1, limit: 4, type: "ExerciseData", value: "Elavation" };
      dispatch(getNotes(params, fieldKey));
    }
  }, [dispatch, patientId, fieldKey, addNotesResponse, updateNotesResponse, deleteNotesResponse]);

  // Static data for demonstration
  const staticData = {
    Day: {
      intradayData: [
        { timeRange: "6:00-9:00", elevation: 15 },
        { timeRange: "9:00-12:00", elevation: 45 },
        { timeRange: "12:00-15:00", elevation: 23 },
        { timeRange: "15:00-18:00", elevation: 67 },
        { timeRange: "18:00-21:00", elevation: 34 },
        { timeRange: "21:00-24:00", elevation: 8 }
      ]
    },
    Week: [
      { date: "2024-01-01", value: 192 },
      { date: "2024-01-02", value: 156 },
      { date: "2024-01-03", value: 234 },
      { date: "2024-01-04", value: 178 },
      { date: "2024-01-05", value: 201 },
      { date: "2024-01-06", value: 267 },
      { date: "2024-01-07", value: 143 }
    ],
    Month: [
      { date: "Week 1", value: 1371 },
      { date: "Week 2", value: 1245 },
      { date: "Week 3", value: 1456 },
      { date: "Week 4", value: 1123 }
    ],
    Year: [
      { date: "2024-01-01", value: 5195 },
      { date: "2024-02-01", value: 5678 },
      { date: "2024-03-01", value: 4987 },
      { date: "2024-04-01", value: 6234 },
      { date: "2024-05-01", value: 5456 },
      { date: "2024-06-01", value: 6789 }
    ]
  };



  const getChartData = () => {
    if (activeTab === "Day") {
      const intradayData = staticData.Day.intradayData;
      const labels = intradayData.map((item) => item.timeRange);
      const data = intradayData.map((item) => item.elevation);
      const tableData = intradayData.map((item) => ({
        period: item.timeRange,
        value: item.elevation ? `${item.elevation} m` : "0 m",
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
        value: item.value ? `${item.value} m` : "0 m",
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
        minHeight: expandedCard === "elevation" ? "550px" : "245px",
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
            src={Elevation_Icon}
            alt="Elevation"
            className="mx-2"
            style={{ width: "19px", height: "19px" }}
          />
          <span style={{ fontSize: "12px", fontWeight: "600" }}>
            Elevation
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
            onClick={() => onCardExpand("elevation")}
          />
        </div>
      </div>
      <div className="p-1 pt-0">
        {expandedCard === "elevation" ? (
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
                  192 m
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
                    strokeDashoffset={
                      301 - (192 / 300) * 301
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
                    192
                  </div>
                  <div
                    style={{
                      fontSize: "9px",
                      color: "#666",
                      fontWeight: "500",
                    }}
                  >
                    m
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mb-2">
              <p
                className="mb-0"
                style={{ fontSize: "10px", color: "#666", fontWeight: "500" }}
              >
                Today's elevation gain
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
                    192
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
                    192
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
        title="Elevation Notes"
        type="ExerciseData"
        value="Elavation"
      />
    </div>
  );
};

export default ElevationCard;