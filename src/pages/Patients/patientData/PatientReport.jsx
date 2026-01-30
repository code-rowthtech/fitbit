import React, { useState, useEffect, use } from 'react';
import { Table, Form, Modal, Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { MdSimCardDownload } from "react-icons/md";
import { FcDownload } from "react-icons/fc";
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { getAllReports, createReport, resetCreateReport, downloadReport, resetDownloadReport, getYearlyReports, downloadYearlyReport, resetDownloadYearlyReport, createNoDataReason, getNoDataReason, updateNoDataReason } from '../../../redux/reports/action';
import '../PatientDashboard.css';
import { IoCalendarClearOutline } from "react-icons/io5";

// Import icons
import Steps_Icon from '../../../assets/images/PatientDashboard/Steps.png';
import ActiveMinutes_Icon from '../../../assets/images/PatientDashboard/Active Minutes.png';
import CaloriesBurned_Icon from '../../../assets/images/PatientDashboard/Calories Burned.png';
import Distance_Icon from '../../../assets/images/PatientDashboard/distance.png';

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
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showYearlyDownloadModal, setShowYearlyDownloadModal] = useState(false);
  const [viewType, setViewType] = useState('Monthly');
  const [currentYear, setCurrentYear] = useState(moment());
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [reason, setReason] = useState('');
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [existingReasonData, setExistingReasonData] = useState(null);
  const daysInMonth = currentMonth.daysInMonth();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const monthsArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const dispatch = useDispatch();

  const CreateResponse = useSelector(state => state?.createReportReducer?.data?.status)
  const DailyData = useSelector(state => state?.getAllReports?.data?.data?.mappedData)
  const YearlyData = useSelector(state => state?.getYearlyReports?.data?.data?.mappedData)
  const loading = useSelector(state => state?.getAllReports?.loading)
  const yearlyLoading = useSelector(state => state?.getYearlyReports?.loading)
  const downloadLoading = useSelector(state => state?.downloadReportReducer?.loading)
  const downloadResponse = useSelector(state => state?.downloadReportReducer?.data)
  const downloadError = useSelector(state => state?.downloadReportReducer?.message)
  const yearlyDownloadLoading = useSelector(state => state?.downloadYearlyReportReducer?.loading)
  const yearlyDownloadResponse = useSelector(state => state?.downloadYearlyReportReducer?.data)
  const getNoDataReasonResponse = useSelector(state => state?.getNoDataReasonReducer?.message?.data)
  const getNoDataReasonLoading = useSelector(state => state?.getNoDataReasonReducer?.loading)
  const updateNoDataReasonResponse = useSelector(state => state?.updateNoDataReasonReducer?.data?.status)
  const metricsEnum = [
    'steps', 'Continuous Heart Rate', 'BMI', 'sleep', 'calories burned', 'distance',
    'activeMinutes', 'Awakenings', 'Weight', 'Calories Consumed',
    'Water Intake', 'Resting Heart Rate', 'Exercise Sessions', 'GPS Tracking',
    'Elevation', 'Body Fat Percentage'
  ];

  const metricsConfig = [
    { label: 'steps', icon: Steps_Icon, displayName: 'Steps' },
    { label: 'activeMinutes', icon: ActiveMinutes_Icon, displayName: 'Active Mins' },
    { label: 'calories burned', icon: CaloriesBurned_Icon, displayName: 'Calories Burned' },
    { label: 'distance', icon: Distance_Icon, displayName: 'Distance' },

    { label: 'Sleep Duration', icon: Duration_Icon, displayName: 'Sleep Duration' },
    { label: 'Sleep Efficiency', icon: Efficiency_Icon, displayName: 'Sleep Efficiency' },
    { label: 'Sleep Awakenings', icon: Awakenings_Icon, displayName: 'Sleep Awakenings' },
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
      if (viewType === 'Monthly') {
        dispatch(getAllReports({ id, month: currentMonth.format('YYYY-MM') }));
      } else {
        dispatch(getYearlyReports({ id, year: currentYear.format('YYYY') }));
      }
    }
  }, [dispatch, id, currentMonth, currentYear, viewType]);

  useEffect(() => {
    const data = viewType === 'Monthly' ? DailyData : YearlyData;
    if (data) {
      const rangesMap = {};
      data.forEach(report => {
        rangesMap[report.label] = { min: report.min, max: report.max };
      });
      setNormalRanges(rangesMap);
    }
  }, [DailyData, YearlyData, viewType]);

  useEffect(() => {
    if (CreateResponse === 201 && id) {
      dispatch(getAllReports({ id, month: currentMonth.format('YYYY-MM') }));
      // Reset the create response to allow future triggers
      dispatch(resetCreateReport());
    }
  }, [CreateResponse, dispatch, id, currentMonth]);

  useEffect(() => {
    if (downloadResponse?.success) {
      dispatch(resetDownloadReport());
    }
  }, [downloadResponse, dispatch]);

  useEffect(() => {
    if (yearlyDownloadResponse?.success) {
      dispatch(resetDownloadYearlyReport());
    }
  }, [yearlyDownloadResponse, dispatch]);

  useEffect(() => {
    if (getNoDataReasonResponse?.length > 0) {
      const reasonData = getNoDataReasonResponse[0];
      setExistingReasonData(reasonData);
      setReason(reasonData.reason || '');
    }
  }, [getNoDataReasonResponse]);

  useEffect(() => {
    if (updateNoDataReasonResponse === 200 && id) {
      dispatch(getAllReports({ id, month: currentMonth.format('YYYY-MM') }));
    }
  }, [updateNoDataReasonResponse, dispatch, id, currentMonth]);


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

  const handleDownloadReport = () => {
    if (viewType === 'Monthly') {
      setShowDownloadModal(true);
    } else {
      setShowYearlyDownloadModal(true);
    }
  };

  const confirmDownload = () => {
    if (!id) return;
    dispatch(downloadReport({ id, month: currentMonth.format('YYYY-MM') }));
    setShowDownloadModal(false);
  };

  const confirmYearlyDownload = () => {
    if (!id) return;
    dispatch(downloadYearlyReport({ id, year: currentYear.format('YYYY') }));
    setShowYearlyDownloadModal(false);
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(prev => prev.clone().subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => prev.clone().add(1, 'month'));
  };

  const handlePreviousYear = () => {
    setCurrentYear(prev => prev.clone().subtract(1, 'year'));
  };

  const handleNextYear = () => {
    setCurrentYear(prev => prev.clone().add(1, 'year'));
  };

  const getDataForMonth = (label, monthIndex) => {
    const reportData = YearlyData?.find(report => report.label === label);
    if (!reportData?.monthlyData) return '-';

    // Find the month data that matches the current year and month index
    const targetMonth = `${currentYear.format('YYYY')}-${String(monthIndex + 1).padStart(2, '0')}`;
    const monthData = reportData.monthlyData.find(data => data.month === targetMonth);

    if (!monthData) return '-';

    return monthData.value || '-';
  };

  const getMonthCellColor = (label, monthIndex) => {
    const reportData = YearlyData?.find(report => report.label === label);
    if (!reportData?.monthlyData) return '#000';

    // Find the month data that matches the current year and month index
    const targetMonth = `${currentYear.format('YYYY')}-${String(monthIndex + 1).padStart(2, '0')}`;
    const monthData = reportData.monthlyData.find(data => data.month === targetMonth);

    return monthData?.color || '#000';
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
      case 'Water Intake': return `${dayData.value}`;
      case 'distance': return `${dayData.value}`;
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

  const hasReasonForDay = (day) => {
    const stepsData = DailyData?.find(report => report.label === 'steps');
    if (!stepsData?.dailyData) return false;
    
    const dayData = stepsData.dailyData.find(data => {
      const dataDay = new Date(data.date).getDate();
      return dataDay === day;
    });
    
    return dayData?.reason === true;
  };

  const getCellBackgroundColor = (day) => {
    // Check if steps are 0 or - for this day to highlight entire column
    const stepsValue = getDataForDay('steps', day);
    if (stepsValue === '-' || stepsValue === '0steps' || stepsValue === 0 || stepsValue === '' || !stepsValue) {
      return '#ffebee';
    }
    return 'transparent';
  };

  const handleDayClick = (day) => {
    const stepsValue = getDataForDay('steps', day);
    if (stepsValue === '-' || stepsValue === '0steps' || stepsValue === 0 || stepsValue === '' || !stepsValue) {
      setSelectedDay(day);
      if (hasReasonForDay(day)) {
        const selectedDate = `${currentMonth.format('YYYY-MM')}-${String(day).padStart(2, '0')}`;
        dispatch(getNoDataReason({ userId: id, date: selectedDate }));
        setIsUpdateMode(true);
      } else {
        setIsUpdateMode(false);
        setReason('');
      }
      setShowReasonModal(true);
    }
  };

  const handleReasonSubmit = () => {
    const selectedDate = `${currentMonth.format('YYYY-MM')}-${String(selectedDay).padStart(2, '0')}`;
    
    if (isUpdateMode && existingReasonData) {
      const payload = {
        id: existingReasonData._id,
        body: { reason: reason.trim() }
      };
      console.log('Update payload:', payload);
      dispatch(updateNoDataReason(payload));
    } else {
      const payload = {
        date: selectedDate,
        userId: id,
        reason: reason.trim()
      };
      console.log('Create payload:', payload);
      dispatch(createNoDataReason(payload));
    }
    
    setShowReasonModal(false);
    setSelectedDay(null);
    setReason('');
    setIsUpdateMode(false);
    setExistingReasonData(null);
  };

  const getMonthCellBackgroundColor = (monthIndex) => {
    // Check if steps are 0 or - for this month to highlight entire column
    const stepsValue = getDataForMonth('steps', monthIndex);
    if (stepsValue === '-' || stepsValue === '0steps' || stepsValue === 0 || stepsValue === '' || !stepsValue) {
      return '#ffebee';
    }
    return 'transparent';
  };

  const renderNormalRangeCell = (label) => {
    const range = normalRanges[label];
    const isEditing = editingRange === label;

    if (isEditing) {
      return (
        <td className="normal-range-cell p-0" style={{ width: viewType === 'Yearly' ? '200px' : 'auto' }}>
          <div className="d-flex align-items-center justify-content-center gap-1" style={{ paddingBottom: '1px', paddingTop: '1px' }}>
            <Form.Control
              size="sm"
              placeholder="Min"
              value={tempRange.min}
              onChange={(e) => setTempRange(prev => ({ ...prev, min: e.target.value }))}
              className="range-input"
              style={{ width: '65px', fontSize: '10px' }}
            />
            <span className="text-muted" style={{ fontSize: '10px' }}>-</span>
            <Form.Control
              size="sm"
              placeholder="Max"
              value={tempRange.max}
              onChange={(e) => setTempRange(prev => ({ ...prev, max: e.target.value }))}
              className="range-input"
              style={{ width: '65px', fontSize: '10px' }}
            />
            <button
              className="btn btn-sm text-white p-0"
              style={{ width: '20px', height: '20px', fontSize: '10px', backgroundColor: '#003465' }}
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
        style={{ cursor: 'pointer', width: viewType === 'Yearly' ? '200px' : 'auto' }}
        onClick={() => handleRangeClick(label)}
        title="Click to edit range"
      >
        {range ? `${range.min} - ${range.max}` : 'No fixed range'}
      </td>
    );
  };

  return (
    <div className='bg-white py-2 px-2'>
      {/* Navigation */}
      <div className="d-flex justify-content-between align-items-center px-4 py-2  month-navigation">
        <div></div>
        <div className="d-flex align-items-center gap-3">
          <button
            onClick={viewType === 'Monthly' ? handlePreviousMonth : handlePreviousYear}
            className="btn btn-sm d-flex align-items-center justify-content-center"
            style={{ width: '24px', height: '24px', backgroundColor: '#003465', color: 'white', border: 'none' }}
          >
            <FaAngleLeft />
          </button>
          <h6 className="mb-0 fw-bold text-center month-navigation" style={{ fontSize: '14px', color: '#003465' }}>
            {viewType === 'Monthly' ? currentMonth.format('MMMM YYYY') : currentYear.format('YYYY')}
            <span>
              <IoCalendarClearOutline className='mb-1' style={{ fontSize: '18px', marginLeft: '8px', color: '#003465' }} />
            </span>
          </h6>
          <button
            onClick={viewType === 'Monthly' ? handleNextMonth : handleNextYear}
            className="btn btn-sm d-flex align-items-center justify-content-center"
            style={{ width: '24px', height: '24px', backgroundColor: '#003465', color: 'white', border: 'none' }}
          >
            <FaAngleRight />
          </button>
        </div>
        <div className="d-flex align-items-center">
          <div className="d-flex align-items-center gap-2 me-3">
            <div className="d-flex align-items-center gap-1" style={{ fontSize: '12.4px', color: viewType === 'Monthly' ? '#003465' : '#6c757d' }}>
              <span className="fw-bold">Monthly</span>
            </div>
            <div
              className="position-relative d-flex align-items-center justify-content-center"
              style={{
                width: '40px',
                height: '18px',
                backgroundColor: viewType === 'Yearly' ? '#003465' : '#003465',
                borderRadius: '9px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={() => {
                const newViewType = viewType === 'Monthly' ? 'Yearly' : 'Monthly';
                setViewType(newViewType);
                if (id) {
                  if (newViewType === 'Yearly') {
                    dispatch(getYearlyReports({ id, year: currentYear.format('YYYY') }));
                  } else {
                    dispatch(getAllReports({ id, month: currentMonth.format('YYYY-MM') }));
                  }
                }
              }}
            >
              <div
                className="position-absolute bg-white rounded-circle"
                style={{
                  width: '14px',
                  height: '14px',
                  left: viewType === 'Yearly' ? '24px' : '2px',
                  transition: 'all 0.3s ease'
                }}
              />
            </div>
            <div className="d-flex align-items-center gap-1" style={{ fontSize: '12.4px', color: viewType === 'Yearly' ? '#003465' : '#6c757d' }}>
              <span className="fw-bold">Yearly</span>
            </div>
          </div>
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>Expand Report</Tooltip>}
          >
            <IoIosExpand className='me-3 p-0 fs-4' style={{ color: '#003465', cursor: 'pointer' }} onClick={onExpand} />
          </OverlayTrigger>
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>{viewType === 'Monthly' ? 'Export Monthly Report' : 'Export Yearly Report'}</Tooltip>}
          >
            <MdSimCardDownload
              className='me-3 p-0 fs-4'
              style={{ color: '#003465', cursor: 'pointer' }}
              onClick={handleDownloadReport}
            />
          </OverlayTrigger>

        </div>
      </div>



      <div className="monthly-table-container">
        {/* Unified Scrollable Content */}
        <div className="table-scroll-container">
          {(loading || yearlyLoading) ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
              <div className="spinner-border" role="status" style={{ color: '#003465' }}>
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <Table className="mb-0 table-hover table-sm patient-report-table" style={{ width: viewType === 'Monthly' ? `${450 + daysInMonth * 60}px` : '100%' }}>
              <thead className="table table-header">
                <tr>
                  <th className='fw-bold text-center sticky-metrics' style={{ width: viewType === 'Yearly' ? '150px' : 'auto' }}>Metrics</th>
                  <th className='fw-bold text-center sticky-normal-range' style={{ width: viewType === 'Yearly' ? '200px' : 'auto' }}>Normal Range</th>
                  {viewType === 'Monthly' ? (
                    daysArray.map(day => {
                      const bgColor = getCellBackgroundColor(day);
                      const isClickable = bgColor === '#ffebee';
                      return (
                        <th className='fw-bold day-header position-relative' key={day}
                          style={{ cursor: isClickable ? 'pointer' : 'default' }}
                          onClick={() => isClickable && handleDayClick(day)}>
                          {day}
                          {isClickable && hasReasonForDay(day) && (
                            <div style={{
                              position: 'absolute',
                              top: '-10px',
                              right: '-8px',
                              width: '6px',
                              height: '6px',
                              backgroundColor: '#003465',
                              transform: 'rotate(45deg)',
                            }}></div>
                          )}
                        </th>
                      );
                    })
                  ) : (
                    monthsArray.map((month, index) => (
                      <th className='fw-bold day-header' key={index} style={{ width: 'auto' }}>{month}</th>
                    ))
                  )}
                </tr>
              </thead>
              <tbody className='fw-semibold'>
                {metricsConfig.map((metric, index) => (
                  <tr key={`${metric.label}-${index}`}>
                    <td className="d-flex align-items-center metrics-cell" style={{ padding: '6px 8px', width: viewType === 'Yearly' ? '150px' : 'auto' }}>
                      <img src={metric.icon} alt={metric.displayName} className="metric-icon" />
                      {metric.displayName}
                    </td>
                    {renderNormalRangeCell(metric.label)}
                    {viewType === 'Monthly' ? (
                      daysArray.map(day => (
                        <td key={day} className="text-center day-data-cell"
                          style={{
                            color: getCellColor(metric.label, day),
                            backgroundColor: getCellBackgroundColor(day)
                          }}>
                          {getDataForDay(metric.label, day)}
                        </td>
                      ))
                    ) : (
                      monthsArray.map((month, monthIndex) => (
                        <td key={monthIndex} className="text-center day-data-cell"
                          style={{
                            color: getMonthCellColor(metric.label, monthIndex),
                            width: 'auto',
                            backgroundColor: getMonthCellBackgroundColor(monthIndex)
                          }}>
                          {getDataForMonth(metric.label, monthIndex)}
                        </td>
                      ))
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </div>

      {/* Monthly Download Confirmation Modal */}
      <Modal show={showDownloadModal} onHide={() => setShowDownloadModal(false)} >
        <Modal.Header closeButton className='border-0'>
          <Modal.Title className='fs-6 fw-bold'>Download Monthly Report</Modal.Title>
        </Modal.Header>
        <Modal.Body className='text-center py-4' style={{ fontSize: '12px' }}>
          <FcDownload size={40} className='mb-3' />
          <div>Are you sure you want to download report of <span className='fw-bold' style={{ color: '#003465' }}>{currentMonth.format('MMMM YYYY')}</span> month?</div>
        </Modal.Body>
        <Modal.Footer className='border-0'>
          <Button variant="secondary" className='fw-bold' onClick={() => setShowDownloadModal(false)} disabled={downloadLoading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            className='fw-bold'
            onClick={confirmDownload}
            disabled={downloadLoading}
            style={{ backgroundColor: '#003465', borderColor: '#003465' }}
          >
            {downloadLoading ? 'Downloading...' : 'Download'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Yearly Download Confirmation Modal */}
      <Modal show={showYearlyDownloadModal} onHide={() => setShowYearlyDownloadModal(false)} >
        <Modal.Header closeButton className='border-0'>
          <Modal.Title className='fs-6 fw-bold'>Download Yearly Report</Modal.Title>
        </Modal.Header>
        <Modal.Body className='text-center py-4' style={{ fontSize: '12px' }}>
          <FcDownload size={40} className='mb-3' />
          <div>Are you sure you want to download report of <span className='fw-bold' style={{ color: '#003465' }}>{currentYear.format('YYYY')}</span> year?</div>
        </Modal.Body>
        <Modal.Footer className='border-0'>
          <Button variant="secondary" className='fw-bold' onClick={() => setShowYearlyDownloadModal(false)} disabled={yearlyDownloadLoading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            className='fw-bold'
            onClick={confirmYearlyDownload}
            disabled={yearlyDownloadLoading}
            style={{ backgroundColor: '#003465', borderColor: '#003465' }}
          >
            {yearlyDownloadLoading ? 'Downloading...' : 'Download'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Reason Modal */}
      <Modal show={showReasonModal} onHide={() => setShowReasonModal(false)}>
        <Modal.Header closeButton className='border-0'>
          <Modal.Title className='fs-6 fw-bold'>
            {isUpdateMode ? `Update Reason for Day ${selectedDay}` : `Add Reason for Day ${selectedDay}`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className='py-3'>
          {isUpdateMode && existingReasonData && (
            <div className='mb-3 p-2' style={{ backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
              <small className='text-muted'>Created: {new Date(existingReasonData.createdAt).toLocaleDateString()}</small>
            </div>
          )}
          <Form.Group>
            <Form.Label className='fw-bold mb-2'>Reason:</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for this day..."
              disabled={getNoDataReasonLoading}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className='border-0'>
          <Button variant="secondary" className='fw-bold' onClick={() => setShowReasonModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            className='fw-bold'
            onClick={handleReasonSubmit}
            disabled={!reason.trim() || getNoDataReasonLoading}
            style={{ backgroundColor: '#003465', borderColor: '#003465' }}
          >
            {isUpdateMode ? 'Update' : 'Save'}
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default PatientReport