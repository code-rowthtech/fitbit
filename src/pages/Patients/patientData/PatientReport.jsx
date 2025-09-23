import React, { useState, useEffect, use } from 'react';
import { Table, Form } from 'react-bootstrap';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { MdSimCardDownload } from "react-icons/md";
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { getAllReports, createReport } from '../../../redux/reports/action';
import '../PatientDashboard.css';
import { IoCalendarClearOutline } from "react-icons/io5";

// Import icons
import Steps_Icon from '../../../assets/images/PatientDashboard/Steps.png';
import ActiveMinutes_Icon from '../../../assets/images/PatientDashboard/Active Minutes.png';
import CaloriesBurned_Icon from '../../../assets/images/PatientDashboard/Calories Burned.png';
import Distance_Icon from '../../../assets/images/PatientDashboard/distance.png';
import SleepStages_Icon from '../../../assets/images/PatientDashboard/Sleep stages.png';
import Duration_Icon from '../../../assets/images/PatientDashboard/duration.png';
import Efficiency_Icon from '../../../assets/images/PatientDashboard/efficiency.png';
import Awakenings_Icon from '../../../assets/images/PatientDashboard/awakenings.png';
import HeartRate_Icon from '../../../assets/images/PatientDashboard/heart rate.png';
import ContinuousHeartRate_Icon from '../../../assets/images/PatientDashboard/continuous heart rate.png';
import Weight_Icon from '../../../assets/images/PatientDashboard/Weight.png';
import BMI_Icon from '../../../assets/images/PatientDashboard/BMI.png';
import BodyFat_Icon from '../../../assets/images/PatientDashboard/body fat percentage.png';
import ExerciseSessions_Icon from '../../../assets/images/PatientDashboard/Exercise sessions.png';
import GPSTracking_Icon from '../../../assets/images/PatientDashboard/GPS tracking.png';
import Elevation_Icon from '../../../assets/images/PatientDashboard/elevation.png';
import CaloriesConsumed_Icon from '../../../assets/images/PatientDashboard/Calories Burned.png';
import WaterIntake_Icon from '../../../assets/images/PatientDashboard/water intake.png';
import { IoIosExpand } from 'react-icons/io';
import { useParams, useSearchParams } from 'react-router-dom';

const PatientReport = ({ isExpanded, onExpand }) => {
  const { id: pathId } = useParams();
  const [searchParams] = useSearchParams();
  const id = pathId || searchParams.get('id') || searchParams.get('patientId');
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [normalRanges, setNormalRanges] = useState({});
  const [editingRange, setEditingRange] = useState(null);
  const [tempRange, setTempRange] = useState({ min: '', max: '' });
  const daysInMonth = currentMonth.daysInMonth();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const dispatch = useDispatch();

  const CreateResponse = useSelector(state => state?.createReportReducer?.data?.status)
  const DailyData = useSelector(state => state?.getAllReports?.data?.data?.mappedData)
  const loading = useSelector(state => state?.getAllReports?.loading)
  console.log(CreateResponse, 'CreateResponse')
  const metricsEnum = [
    'steps', 'Continuous Heart Rate', 'BMI', 'sleep', 'calories burned', 'distance',
    'activeMinutes', 'Sleep Stages', 'Awakenings', 'Weight', 'Calories Consumed',
    'Water Intake', 'Resting Heart Rate', 'Exercise Sessions', 'GPS Tracking',
    'Elevation', 'Body Fat Percentage'
  ];

  const metricsConfig = [
    { label: 'steps', icon: Steps_Icon, displayName: 'Steps' },
    { label: 'activeMinutes', icon: ActiveMinutes_Icon, displayName: 'Active Mins' },
    { label: 'calories burned', icon: CaloriesBurned_Icon, displayName: 'Calories Burned' },
    { label: 'distance', icon: Distance_Icon, displayName: 'Distance' },
    { label: 'Sleep Stages', icon: SleepStages_Icon, displayName: 'Sleep Stages' },
    { label: 'sleep', icon: Duration_Icon, displayName: 'Duration' },
    { label: 'sleep', icon: Efficiency_Icon, displayName: 'Efficiency' },
    { label: 'Awakenings', icon: Awakenings_Icon, displayName: 'Awakenings' },
    { label: 'Resting Heart Rate', icon: HeartRate_Icon, displayName: 'Resting Heart Rate' },
    { label: 'Continuous Heart Rate', icon: ContinuousHeartRate_Icon, displayName: 'Continuous Heart Rate' },
    { label: 'Weight', icon: Weight_Icon, displayName: 'Weight' },
    { label: 'BMI', icon: BMI_Icon, displayName: 'BMI' },
    { label: 'Body Fat Percentage', icon: BodyFat_Icon, displayName: 'Body Fat Percentage' },
    { label: 'Exercise Sessions', icon: ExerciseSessions_Icon, displayName: 'Exercise Sessions' },
    { label: 'GPS Tracking', icon: GPSTracking_Icon, displayName: 'GPS Tracking' },
    { label: 'Elevation', icon: Elevation_Icon, displayName: 'Elevation' },
    { label: 'Calories Consumed', icon: CaloriesConsumed_Icon, displayName: 'Calories Consumed' },
    { label: 'Water Intake', icon: WaterIntake_Icon, displayName: 'Water Intake' }
  ];

  useEffect(() => {
    if (id) {
      dispatch(getAllReports({ id, month: currentMonth.format('YYYY-MM') }));
    }
  }, [dispatch, id, currentMonth]);

  useEffect(() => {
    if (DailyData) {
      const rangesMap = {};
      DailyData.forEach(report => {
        rangesMap[report.label] = { min: report.min, max: report.max };
      });
      setNormalRanges(rangesMap);
    }
  }, [DailyData]);

  useEffect(() => {
    if (CreateResponse === 201 && id) {
      dispatch(getAllReports({ id, month: currentMonth.format('YYYY-MM') }));
      // Reset the create response to allow future triggers
      // dispatch({ type: 'RESET_CREATE_RESPONSE' });
    }
  }, [CreateResponse, dispatch, id, currentMonth]);


  const handleCreateReport = (label, min, max) => {
    const reportData = {
      patientId: id,
      data: [{
        label,
        min,
        max
      }]
    };
    dispatch(createReport(reportData));
  };

  const handleRangeClick = (label) => {
    const existing = normalRanges[label];
    setEditingRange(label);
    setTempRange(existing || { min: '', max: '' });
  };

  const handleRangeSave = () => {
    if (tempRange.min && tempRange.max) {
      handleCreateReport(editingRange, tempRange.min, tempRange.max);
    }
    setEditingRange(null);
    setTempRange({ min: '', max: '' });
  };

  const handleRangeCancel = () => {
    setEditingRange(null);
    setTempRange({ min: '', max: '' });
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(prev => prev.clone().subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => prev.clone().add(1, 'month'));
  };

  const getDataForDay = (label, day) => {
    const reportData = DailyData?.find(report => report.label === label);
    if (!reportData?.dailyData) return '-';

    const dayData = reportData.dailyData.find(data => {
      const dataDay = new Date(data.date).getDate();
      return dataDay === day;
    });

    if (!dayData) return '-';

    // Format value based on label
    switch (label) {
      case 'steps': return dayData.value.toLocaleString();
      case 'Water Intake': return `${dayData.value}ml`;
      case 'distance': return `${dayData.value}km`;
      default: return dayData.value;
    }
  };

  const getCellColor = (label, day) => {
    const reportData = DailyData?.find(report => report.label === label);
    if (!reportData?.dailyData) return '#000';

    const dayData = reportData.dailyData.find(data => {
      const dataDay = new Date(data.date).getDate();
      return dataDay === day;
    });

    return dayData?.color || '#000';
  };

  const renderNormalRangeCell = (label) => {
    const range = normalRanges[label];
    const isEditing = editingRange === label;

    if (isEditing) {
      return (
        <td className="normal-range-cell p-0">
          <div className="d-flex align-items-center justify-content-center gap-1" style={{ paddingBottom: '1px', paddingTop: '1px' }}>
            <Form.Control
              size="sm"
              placeholder="Min"
              value={tempRange.min}
              onChange={(e) => setTempRange(prev => ({ ...prev, min: e.target.value }))}
              className="range-input"
              style={{ width: '100px', fontSize: '10px' }}
            />
            <span className="text-muted" style={{ fontSize: '10px' }}>-</span>
            <Form.Control
              size="sm"
              placeholder="Max"
              value={tempRange.max}
              onChange={(e) => setTempRange(prev => ({ ...prev, max: e.target.value }))}
              className="range-input"
              style={{ width: '100px', fontSize: '10px' }}
            />
            <button
              className="btn btn-sm text-white p-0"
              style={{ width: '20px', height: '20px', fontSize: '10px', backgroundColor:'#003465' }}
              onClick={handleRangeSave}
              title="Save"
            >
              ✓
            </button>
            <button
              className="btn btn-secondary btn-sm p-0"
              style={{ width: '20px', height: '20px', fontSize: '10px' }}
              onClick={handleRangeCancel}
              title="Cancel"
            >
              ✕
            </button>
          </div>
        </td>
      );
    }

    return (
      <td
        className="normal-range-cell text-center"
        style={{ cursor: 'pointer' }}
        onClick={() => handleRangeClick(label)}
        title="Click to edit range"
      >
        {range ? `${range.min} - ${range.max}` : 'No fixed range'}
      </td>
    );
  };

  return (
    <div className='bg-white py-2 px-2'>
      {/* Month Navigation */}
      <div className="d-flex justify-content-between align-items-center px-4 py-2  month-navigation">
        <span onClick={() => setCurrentMonth(currentMonth.clone().subtract(1, 'month'))} className="month-navigation span">
          <FaAngleLeft style={{ color: '#003465' }} />
        </span>
        <h6 className="mb-0 fw-bold text-center month-navigation" style={{ fontSize: '14px', color: '#003465' }}>
          {currentMonth.format('MMMM YYYY')}
          <span>
            <IoCalendarClearOutline className='mb-1' style={{ fontSize: '18px', marginLeft: '8px', color: '#003465' }} />
          </span>
        </h6>
        <div>
          <IoIosExpand title='Expand Report' className='me-3 p-0 fs-4' style={{ color: '#003465', cursor: 'pointer' }} onClick={onExpand} />
          <MdSimCardDownload title='Export Report' className='me-3 p-0 fs-4' style={{ color: '#003465', cursor: 'pointer' }} />
          <FaAngleRight style={{ color: '#003465', cursor: 'pointer' }} onClick={() => setCurrentMonth(currentMonth.clone().add(1, 'month'))} />
        </div>
      </div>



      <div className="monthly-table-container">
        {/* Unified Scrollable Content */}
        <div className="table-scroll-container">
          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
              <div className="spinner-border" role="status" style={{ color: '#003465' }}>
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <Table className="mb-0 table-hover table-sm patient-report-table" style={{ width: `${450 + daysInMonth * 60}px` }}>
              <thead className="table table-header">
                <tr>
                  <th className='fw-bold text-center sticky-metrics'>Metrics</th>
                  <th className='fw-bold text-center sticky-normal-range'>Normal Range</th>
                  {daysArray.map(day => (
                    <th className='fw-bold day-header' key={day}>{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody className='fw-semibold'>
                {metricsConfig.map((metric, index) => (
                  <tr key={`${metric.label}-${index}`}>
                    <td className="d-flex align-items-center metrics-cell" style={{ padding: '6px 8px' }}>
                      <img src={metric.icon} alt={metric.displayName} className="metric-icon" />
                      {metric.displayName}
                    </td>
                    {renderNormalRangeCell(metric.label)}
                    {daysArray.map(day => (
                      <td key={day} className="text-center day-data-cell"
                        style={{ color: getCellColor(metric.label, day) }}>
                        {getDataForDay(metric.label, day)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </div>


    </div>
  );
};

export default PatientReport