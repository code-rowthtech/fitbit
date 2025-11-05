import React, { useState, useEffect } from "react";
import CaloriesConsumed_Icon from "../../../../assets/images/PatientDashboard/Calories Burned.png";
import { IoIosExpand } from "react-icons/io";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { Bar } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { getPatientCaloriesConsumed } from "../../../../redux/patientsDashboard/action";
import { getNotes } from "../../../../redux/notes/action";
import { TbNotes } from "react-icons/tb";
import NotesModal from "../../../../components/NotesModal";

const CaloriesConsumedCard = ({
  patientId,
  masterDataId,
  expandedCard,
  onCardExpand,
  activeTab,
  onTabChange,
  currentDate,
  onDateChange,
  formatDate,
}) => {
  const dispatch = useDispatch();
  const [showNutritionPreview, setShowNutritionPreview] = useState(false);
  const [selectedDayData, setSelectedDayData] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isTabSwitching, setIsTabSwitching] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const CaloriesData = useSelector(
    (state) => state?.getPatientCaloriesConsumed?.data?.response?.data
  );
  const CaloriesStatsData = useSelector(
    (state) => state?.getPatientCaloriesConsumed?.data?.response?.targetRange
  );
  const AverageData = useSelector(
    (state) => state?.getPatientCaloriesConsumed?.data?.response
  );

  const Loading = useSelector(
    (state) => state?.getPatientCaloriesConsumed?.loading
  );

  const fieldKey = "NutritionData_CaloriesConsumed";
  const notesData = useSelector((state) => state?.getNotesReducer?.data?.[fieldKey]?.notes || []);
  const notesLoading = useSelector((state) => state?.getNotesReducer?.loading?.[fieldKey] || false);
  const addNotesResponse = useSelector((state) => state?.addNotesReducer?.data?.status);
  const updateNotesResponse = useSelector((state) => state?.updateNotesReducer?.data?.status);
  const deleteNotesResponse = useSelector((state) => state?.deleteNotesReducer?.data?.status);

  // Reset loading states when data loading completes
  useEffect(() => {
    if (!Loading) {
      setIsNavigating(false);
      setIsTabSwitching(false);
    }
  }, [Loading]);

  // Fetch notes data
  useEffect(() => {
    if (patientId) {
      const params = { patientId, page: 1, limit: 4, type: "NutritionData", value: "CaloriesConsumed" };
      dispatch(getNotes(params, fieldKey));
    }
  }, [dispatch, patientId, fieldKey, addNotesResponse, updateNotesResponse, deleteNotesResponse]);

  // console.log(Loading, "Loading CaloriesConsumedCard");

  // Fetch calories data on component mount and when dependencies change
  useEffect(() => {
    if (patientId && currentDate && formatDate) {
      const date = new Date(currentDate);
      if (isNaN(date.getTime())) return;

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

      if (start && end && !isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const payload = {
          patientId: patientId,
          start: formatDate(start),
          end: formatDate(end),
          field: "caloriesIn",
        };
        //   if (activeTab === "Month")  // payload.period = "month";
        if (activeTab === "Year") payload.period = "year";
        dispatch(getPatientCaloriesConsumed(payload));
      }
    }
  }, [patientId, dispatch, activeTab, currentDate, formatDate, expandedCard]);

  // Convert calories string to number
  const convertCalories = (value) => {
    if (!value || value === null) return 0;
    if (typeof value === "string") {
      return parseFloat(value.replace(" cal", ""));
    }
    return value;
  };

  // Get daily goal
  const getDailyGoal = () => {
    return 2200; // Use 2200 cal as default goal
  };

  // Get chart data based on API response
  const getChartData = () => {
    if (!CaloriesData || CaloriesData.length === 0) {
      return { labels: [], data: [], tableData: [] };
    }

    const apiData = CaloriesData;

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

    const data = apiData.map((item) => convertCalories(item.value));

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

      const caloriesValue = convertCalories(item.value);
      return {
        period,
        value: caloriesValue > 0 ? `${caloriesValue.toFixed(0)} cal` : "0 cal",
      };
    });

    return { labels, data, tableData };
  };

  const chartData = getChartData();

  // Get nutrition chart data for Week tab
  const getNutritionChartData = () => {
    if (!CaloriesData || CaloriesData.length === 0 || activeTab !== "Week") {
      return { labels: [], datasets: [] };
    }

    const labels = CaloriesData.map((item) => {
      const date = new Date(item.date);
      return date.toLocaleDateString("en-US", { weekday: "short" });
    });

    const proteinData = CaloriesData.map(
      (item) => item.calories?.nutrients?.protein || 0
    );
    const fatData = CaloriesData.map(
      (item) => item.calories?.nutrients?.fat || 0
    );
    const carbsData = CaloriesData.map(
      (item) => item.calories?.nutrients?.carbs || 0
    );

    return {
      labels,
      datasets: [
        {
          label: "Protein",
          data: proteinData,
          backgroundColor: "#8CC8FF",
          borderRadius: 3,
          barThickness: 12,
        },
        {
          label: "Fat",
          data: fatData,
          backgroundColor: "#FFD280",
          borderRadius: 3,
          barThickness: 12,
        },
        {
          label: "Carbs",
          data: carbsData,
          backgroundColor: "#B8E6C1",
          borderRadius: 3,
          barThickness: 12,
        },
      ],
    };
  };

  const nutritionChartData = getNutritionChartData();

  // Handle day selection
  const handleDaySelect = (dayIndex) => {
    if (CaloriesData && CaloriesData[dayIndex]) {
      setSelectedDayData(CaloriesData[dayIndex]);
    }
  };

  // Get selected day nutrition data for circular progress
  const getSelectedDayNutrition = () => {
    if (!selectedDayData || !selectedDayData.calories?.nutrients) {
      return { protein: 0, fat: 0, carbs: 0, total: 0 };
    }

    const nutrients = selectedDayData.calories.nutrients;
    const protein = nutrients.protein || 0;
    const fat = nutrients.fat || 0;
    const carbs = nutrients.carbs || 0;
    const total = protein + fat + carbs;

    return { protein, fat, carbs, total };
  };

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
    if (isNavigating) return;

    setIsNavigating(true);
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
    if (
      formatDate &&
      start &&
      end &&
      !isNaN(start.getTime()) &&
      !isNaN(end.getTime())
    ) {
      setTimeout(() => {
        if (patientId) {
          const payload = {
            patientId: patientId,
            start: formatDate(start),
            end: formatDate(end),
            field: "caloriesIn",
          };
          // if (activeTab === "Month")  // payload.period = "month";
          if (activeTab === "Year") payload.period = "year";
          dispatch(getPatientCaloriesConsumed(payload));
        }
      }, 0);
    }
  };

  // Handle tab change
  const handleTabChange = (tab, specificDate = null) => {
    if (isTabSwitching || tab === activeTab) return;

    setIsTabSwitching(true);
    onTabChange(tab);
    // Fetch data for new tab
    const dateToUse = specificDate || currentDate;
    if (dateToUse && formatDate) {
      setTimeout(() => {
        if (patientId) {
          const date = new Date(dateToUse);
          if (isNaN(date.getTime())) return;

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

          if (
            start &&
            end &&
            !isNaN(start.getTime()) &&
            !isNaN(end.getTime())
          ) {
            const payload = {
              patientId: patientId,
              start: formatDate(start),
              end: formatDate(end),
              field: "caloriesIn",
            };
            // if (tab === "Month")  // payload.period = "month";
            if (tab === "Year") payload.period = "year";
            dispatch(getPatientCaloriesConsumed(payload));
          }
        }
      }, 0);
    }
  };

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: "white",
        border: "1px solid #e9ecef",
        borderRadius: "8px",
        minHeight: expandedCard === "calories" ? "550px" : "245px",
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
            src={CaloriesConsumed_Icon}
            alt="Calories Consumed"
            className="mx-2"
            style={{ width: "19px", height: "19px" }}
          />
          <span
            style={{ fontSize: "12px", fontWeight: "600", color: "#003465" }}
          >
            Calories Consumed
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
            onClick={() => onCardExpand("calories")}
          />
        </div>
      </div>
      <div className="p-1 pt-0">
        {expandedCard === "calories" ? (
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
                {/* Nutrition Preview Button - Only show in Week tab and when no day is selected */}
                {activeTab === "Week" && !selectedDayData && (
                  <button
                    className="btn position-absolute"
                    style={{
                      top: "10px",
                      right: "10px",
                      backgroundColor: showNutritionPreview
                        ? "#003465"
                        : "white",
                      color: showNutritionPreview ? "white" : "#003465",
                      border: "1px solid #003465",
                      borderRadius: "12px",
                      fontSize: "10px",
                      fontWeight: "500",
                      padding: "4px 12px",
                      zIndex: 10,
                    }}
                    onClick={() =>
                      setShowNutritionPreview(!showNutritionPreview)
                    }
                  >
                    {showNutritionPreview
                      ? "Calories Preview"
                      : "Nutrition Preview"}
                  </button>
                )}
                {selectedDayData && activeTab === "Week" ? (
                  /* Detailed Day View */
                  <div
                    className="p-3 pt-1"
                    style={{ height: "480px", overflowY: "auto" }}
                  >
                    <div className="d-flex justify-content-between mb-3">
                      {/* Date Header */}
                      <h6
                        style={{
                          color: "#003465",
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      >
                        {new Date(selectedDayData.date).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </h6>
                      {/* Back Button */}
                      <button
                        className="btn"
                        style={{
                          backgroundColor: "#003465",
                          color: "white",
                          fontSize: "10px",
                          padding: "4px 12px",
                          borderRadius: "12px",
                        }}
                        onClick={() => setSelectedDayData(null)}
                      >
                        Back to Chart
                      </button>
                    </div>

                    <div className="row">
                      {/* Nutrition Section */}
                      <div
                        className="col-6 pe-3"
                        style={{ borderRight: "2px solid #E8F2FF" }}
                      >
                        <div
                          className="p-3 rounded-3"
                          style={{
                            backgroundColor: "white",
                            border: "1px solid #E8F2FF",
                            height: "415px",
                          }}
                        >
                          <h6
                            style={{
                              fontSize: "14px",
                              fontWeight: "700",
                              color: "#003465",
                              marginBottom: "30px",
                              borderBottom: "2px solid #E8F2FF",
                              paddingBottom: "8px",
                            }}
                          >
                            Micronutrients
                          </h6>
                          {/* Concentric Circular Progress Bars */}
                          <div className="d-flex justify-content-center mb-4">
                            <div
                              className="position-relative"
                              style={{ width: "200px", height: "200px" }}
                            >
                              <svg
                                width="200"
                                height="200"
                                className="position-absolute"
                              >
                                {(() => {
                                  const nutrition = getSelectedDayNutrition();
                                  const proteinGoal = 150;
                                  const fatGoal = 65;
                                  const carbsGoal = 250;

                                  return [
                                    // Outer circle - Carbs (largest)
                                    <circle
                                      key="carbs-bg"
                                      cx="100"
                                      cy="100"
                                      r="85"
                                      fill="none"
                                      stroke="#E8F2FF"
                                      strokeWidth="10"
                                    />,
                                    <circle
                                      key="carbs"
                                      cx="100"
                                      cy="100"
                                      r="85"
                                      fill="none"
                                      stroke="#B8E6C1"
                                      strokeWidth="10"
                                      strokeDasharray={2 * Math.PI * 85}
                                      strokeDashoffset={
                                        2 * Math.PI * 85 -
                                        (nutrition.carbs / carbsGoal) *
                                        2 *
                                        Math.PI *
                                        85
                                      }
                                      strokeLinecap="round"
                                      transform="rotate(-90 100 100)"
                                    />,

                                    // Middle circle - Fat
                                    <circle
                                      key="fat-bg"
                                      cx="100"
                                      cy="100"
                                      r="65"
                                      fill="none"
                                      stroke="#E8F2FF"
                                      strokeWidth="10"
                                    />,
                                    <circle
                                      key="fat"
                                      cx="100"
                                      cy="100"
                                      r="65"
                                      fill="none"
                                      stroke="#FFD280"
                                      strokeWidth="10"
                                      strokeDasharray={2 * Math.PI * 65}
                                      strokeDashoffset={
                                        2 * Math.PI * 65 -
                                        (nutrition.fat / fatGoal) *
                                        2 *
                                        Math.PI *
                                        65
                                      }
                                      strokeLinecap="round"
                                      transform="rotate(-90 100 100)"
                                    />,

                                    // Inner circle - Protein (smallest)
                                    <circle
                                      key="protein-bg"
                                      cx="100"
                                      cy="100"
                                      r="45"
                                      fill="none"
                                      stroke="#E8F2FF"
                                      strokeWidth="10"
                                    />,
                                    <circle
                                      key="protein"
                                      cx="100"
                                      cy="100"
                                      r="45"
                                      fill="none"
                                      stroke="#8CC8FF"
                                      strokeWidth="10"
                                      strokeDasharray={2 * Math.PI * 45}
                                      strokeDashoffset={
                                        2 * Math.PI * 45 -
                                        (nutrition.protein / proteinGoal) *
                                        2 *
                                        Math.PI *
                                        45
                                      }
                                      strokeLinecap="round"
                                      transform="rotate(-90 100 100)"
                                    />,
                                  ];
                                })()}
                              </svg>
                              <div className="position-absolute top-50 start-50 translate-middle text-center">
                                <div
                                  className="fw-bold"
                                  style={{ fontSize: "24px", color: "#003465" }}
                                >
                                  {selectedDayData.value || 0}
                                </div>
                                <div
                                  style={{
                                    fontSize: "12px",
                                    color: "#666",
                                    fontWeight: "500",
                                  }}
                                >
                                  KCAL
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Nutrition Legend */}
                          <div className="row g-2">
                            <div className="col-4">
                              <div
                                className="text-center p-2 rounded-2"
                                style={{
                                  backgroundColor: "#F0F9FF",
                                  border: "1px solid #8CC8FF",
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: "12px",
                                    color: "#8CC8FF",
                                    fontWeight: "700",
                                  }}
                                >
                                  ●
                                </div>
                                <div
                                  style={{
                                    fontSize: "10px",
                                    color: "#003465",
                                    fontWeight: "600",
                                  }}
                                >
                                  Protein
                                </div>
                                <div
                                  style={{
                                    fontSize: "11px",
                                    color: "#003465",
                                    fontWeight: "700",
                                  }}
                                >
                                  {getSelectedDayNutrition().protein}g
                                </div>
                              </div>
                            </div>
                            <div className="col-4">
                              <div
                                className="text-center p-2 rounded-2"
                                style={{
                                  backgroundColor: "#FFFBF0",
                                  border: "1px solid #FFD280",
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: "12px",
                                    color: "#FFD280",
                                    fontWeight: "700",
                                  }}
                                >
                                  ●
                                </div>
                                <div
                                  style={{
                                    fontSize: "10px",
                                    color: "#003465",
                                    fontWeight: "600",
                                  }}
                                >
                                  Fat
                                </div>
                                <div
                                  style={{
                                    fontSize: "11px",
                                    color: "#003465",
                                    fontWeight: "700",
                                  }}
                                >
                                  {getSelectedDayNutrition().fat}g
                                </div>
                              </div>
                            </div>
                            <div className="col-4">
                              <div
                                className="text-center p-2 rounded-2"
                                style={{
                                  backgroundColor: "#F0FFF4",
                                  border: "1px solid #B8E6C1",
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: "12px",
                                    color: "#B8E6C1",
                                    fontWeight: "700",
                                  }}
                                >
                                  ●
                                </div>
                                <div
                                  style={{
                                    fontSize: "10px",
                                    color: "#003465",
                                    fontWeight: "600",
                                  }}
                                >
                                  Carbs
                                </div>
                                <div
                                  style={{
                                    fontSize: "11px",
                                    color: "#003465",
                                    fontWeight: "700",
                                  }}
                                >
                                  {getSelectedDayNutrition().carbs}g
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Food Logs Section */}
                      <div className="col-6 ps-3">
                        <div
                          className="p-3 rounded-3"
                          style={{
                            backgroundColor: "white",
                            border: "1px solid #E8F2FF",
                            height: "415px",
                            overflowY: "auto",
                          }}
                        >
                          <h6
                            style={{
                              fontSize: "14px",
                              fontWeight: "700",
                              color: "#003465",
                              marginBottom: "15px",
                              borderBottom: "2px solid #E8F2FF",
                              paddingBottom: "8px",
                            }}
                          >
                            Food Logs
                          </h6>
                          {selectedDayData.foodLogs &&
                            Object.keys(selectedDayData.foodLogs).length > 0 ? (
                            Object.entries(selectedDayData.foodLogs).map(
                              ([mealType, foods]) => (
                                <div key={mealType} className="mb-3">
                                  <h6
                                    style={{
                                      fontSize: "12px",
                                      fontWeight: "600",
                                      color: "#003465",
                                      marginBottom: "8px",
                                    }}
                                  >
                                    {mealType}
                                  </h6>
                                  {foods.map((food, index) => (
                                    <div
                                      key={index}
                                      className="d-flex justify-content-between p-2 mb-1"
                                      style={{
                                        backgroundColor: "#F8FBFF",
                                        border: "1px solid #E8F2FF",
                                        borderRadius: "6px",
                                        fontSize: "10px",
                                      }}
                                    >
                                      <span
                                        style={{ color: "#003465", flex: 1 }}
                                      >
                                        {food.name}
                                      </span>
                                      <span
                                        style={{
                                          color: "#003465",
                                          fontWeight: "600",
                                        }}
                                      >
                                        {food.calories} cal
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )
                            )
                          ) : (
                            <div
                              className="text-center"
                              style={{ color: "#666", fontSize: "11px" }}
                            >
                              No food logs available
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : showNutritionPreview && activeTab === "Week" ? (
                  <Bar
                    key={`nutrition-chart-${nutritionChartData.datasets.length}`}
                    data={nutritionChartData}
                    options={{
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: true,
                          position: "top",
                          labels: {
                            fontSize: 10,
                            color: "#666",
                            usePointStyle: true,
                            padding: 15,
                          },
                        },
                        tooltip: {
                          callbacks: {
                            label: (context) => {
                              return `${context.dataset.label}: ${context.parsed.y}g`;
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
                          beginAtZero: true,
                          grid: { color: "#f0f0f0" },
                          ticks: { color: "#666", fontSize: 10 },
                        },
                      },
                      categoryPercentage: 0.8,
                      barPercentage: 0.9,
                    }}
                  />
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
                        {[...Array(5)].map((_, i) => (
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
                              y={`${50 + Math.sin(i) * 25}%`}
                              width="10%"
                              height={`${30 + Math.cos(i) * 20}%`}
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
                      onClick:
                        activeTab === "Year"
                          ? (event, elements) => {
                            if (elements.length > 0) {
                              const dataIndex = elements[0].index;
                              if (CaloriesData && CaloriesData[dataIndex]) {
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
                          }
                          : undefined,
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          callbacks: {
                            afterBody:
                              activeTab === "Week" && CaloriesStatsData
                                ? () => [
                                  `Min: ${parseFloat(
                                    CaloriesStatsData.min
                                  ).toFixed(0)} cal`,
                                  `Max: ${parseFloat(
                                    CaloriesStatsData.max
                                  ).toFixed(0)} cal`,
                                ]
                                : activeTab === "Month" && CaloriesData
                                  ? (context) => {
                                    const dataIndex = context[0]?.dataIndex;
                                    return dataIndex !== undefined &&
                                      CaloriesData[dataIndex]
                                      ? [
                                        // `Days: ${CaloriesData[dataIndex].dayRange}`,
                                      ]
                                      : [];
                                  }
                                  : activeTab === "Year"
                                    ? () => ["Click to view month details"]
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
                          beginAtZero: true,
                          min:
                            activeTab === "Week" && CaloriesStatsData
                              ? Math.min(
                                0,
                                parseFloat(CaloriesStatsData.min) - 100
                              )
                              : 0,
                          max:
                            activeTab === "Week" && CaloriesStatsData
                              ? Math.max(
                                ...chartData.data,
                                parseFloat(CaloriesStatsData.max) + 100
                              )
                              : undefined,
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
              {/* Tabs Row */}
              <div
                className="d-flex justify-content-center my-3 p-0 rounded-pill"
                style={{ backgroundColor: "#F0F7FF", gap: "4px" }}
              >
                {["Week", "Month", "Year"].map((tab, index) => (
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
                    border: `1px solid ${isNextDisabled() || isNavigating ? "#ccc" : "#003465"
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
                    ? `${AverageData.stats.average.toFixed(0)} cal`
                    : "-"}
                </span>
              </div>

              {/* Min/Max Rows - Only show in Week tab */}
              {activeTab === "Week" && CaloriesStatsData && (
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
                      {parseFloat(CaloriesStatsData.min).toFixed(0)} cal
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
                      {parseFloat(CaloriesStatsData.max).toFixed(0)} cal
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
                  [...Array(7)].map((_, index) => (
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
                        backgroundColor:
                          selectedDayData &&
                            CaloriesData[index]?.date === selectedDayData.date
                            ? "#E8F2FF"
                            : "white",
                        fontSize: "10px",
                        borderRadius: "2px",
                        border: "1px solid #E8F2FF",
                        cursor:
                          activeTab === "Week" || activeTab === "Year"
                            ? "pointer"
                            : "default",
                      }}
                      onClick={() => {
                        if (activeTab === "Week") {
                          handleDaySelect(index);
                        } else if (
                          activeTab === "Year" &&
                          CaloriesData &&
                          CaloriesData[index]
                        ) {
                          const monthIndex = index;
                          const newDate = new Date(
                            currentDate.getFullYear(),
                            monthIndex,
                            1
                          );
                          onDateChange(newDate);
                          handleTabChange("Month", newDate);
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
            </div>
          </div>
        ) : (
          <div className="row g-2 mt-0">
            {/* Current Section - col-6 */}
            <div className="col-6 mt-1">
              <div
                className="rounded-3 px-2 pb-2"
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
                        strokeDashoffset={Math.max(
                          0,
                          301 -
                            ((AverageData?.todayData?.value || 0) /
                              (AverageData?.goals?.caloriesInGoals || 1)) *
                              301
                        )}
                        strokeLinecap="round"
                        transform="rotate(-90 60 60)"
                      />
                    </svg>
                    <div className="position-absolute top-50 start-50 translate-middle text-center">
                      <div
                        className="fw-bold"
                        style={{ fontSize: "16px", color: "#003465" }}
                      >
                        {AverageData?.todayData?.value}
                      </div>
                      <div
                        style={{
                          fontSize: "9px",
                          color: "#666",
                          fontWeight: "500",
                        }}
                      >
                        KCAL
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center mb-2">
                  <p
                    className="mb-0"
                    style={{
                      fontSize: "10px",
                      color: "#666",
                      fontWeight: "500",
                    }}
                  >
                    Daily nutrition intake
                  </p>
                </div>

                <div className="row g-1">
                  <div className="col-4">
                    <div
                      className="text-center py-1 px-1 rounded-2"
                      style={{
                        backgroundColor: "white",
                        border: "1px solid #E8F2FF",
                      }}
                    >
                      <div
                        className="fw-bold"
                        style={{ fontSize: "12px", color: "#003465" }}
                      >
                        {AverageData?.todayData?.calories?.nutrients?.fat}g
                      </div>
                      <div
                        style={{
                          fontSize: "8px",
                          color: "#666",
                          fontWeight: "500",
                        }}
                      >
                        Fat
                      </div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div
                      className="text-center py-1 px-1 rounded-2"
                      style={{
                        backgroundColor: "white",
                        border: "1px solid #E8F2FF",
                      }}
                    >
                      <div
                        className="fw-bold"
                        style={{ fontSize: "12px", color: "#003465" }}
                      >
                        {AverageData?.todayData?.calories?.nutrients?.carbs}g
                      </div>
                      <div
                        style={{
                          fontSize: "8px",
                          color: "#666",
                          fontWeight: "500",
                        }}
                      >
                        Carbs
                      </div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div
                      className="text-center py-1 px-1 rounded-2"
                      style={{
                        backgroundColor: "white",
                        border: "1px solid #E8F2FF",
                      }}
                    >
                      <div
                        className="fw-bold"
                        style={{ fontSize: "12px", color: "#003465" }}
                      >
                        {AverageData?.todayData?.calories?.nutrients?.protein}g
                      </div>
                      <div
                        style={{
                          fontSize: "8px",
                          color: "#666",
                          fontWeight: "500",
                        }}
                      >
                        Protein
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes Section - col-3 */}
            <div className="col-3 ps-0 mt-1">
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

            {/* Nutrition Goals Section - col-3 */}
            <div className="col-3 ps-0 mt-1">
              <div
                className="rounded-3 px-1 py-2"
                style={{ backgroundColor: "#F8FBFF", height: "200px" }}
              >
                <div
                  className="mb-2 text-start"
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    color: "#003465",
                  }}
                >
                  Nutrition Goals:
                </div>

                <div
                  className="p-2 mb-2 rounded-3 shadow-sm position-relative"
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
                        width: "6px",
                        height: "6px",
                        backgroundColor: "#003465",
                      }}
                    ></div>
                    <div
                      style={{
                        fontSize: "10px",
                        color: "#003465",
                        fontWeight: "600",
                      }}
                    >
                      Daily Target
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "9px",
                      color: "#003465",
                      fontWeight: "500",
                      lineHeight: "1.3",
                    }}
                  >
                    Goal:{" "}
                    <span className="fw-bold">
                      {AverageData?.goals?.caloriesInGoals} kcal
                    </span>{" "}
                    per day
                  </div>
                </div>

                <div
                  className="p-2 rounded-3 shadow-sm position-relative"
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
                        width: "6px",
                        height: "6px",
                        backgroundColor: "#003465",
                      }}
                    ></div>
                    <div
                      style={{
                        fontSize: "10px",
                        color: "#003465",
                        fontWeight: "600",
                      }}
                    >
                      Progress
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "9px",
                      color: "#003465",
                      fontWeight: "500",
                      lineHeight: "1.3",
                    }}
                  >
                    <span className="fw-bold">
                      {Math.max(
                        0,
                        (AverageData?.goals?.caloriesInGoals || 0) -
                        (AverageData?.todayData?.value || 0)
                      )}{" "}
                      kcal
                    </span>{" "}
                    remaining for today
                  </div>
                </div>
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
        title="Calories Consumed Notes"
        type="NutritionData"
        value="CaloriesConsumed"
      />
    </div>
  );
};

export default CaloriesConsumedCard;

