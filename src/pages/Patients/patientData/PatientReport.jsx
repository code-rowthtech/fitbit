import React, { useState } from 'react';
import { Table } from 'react-bootstrap';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { MdSimCardDownload } from "react-icons/md";
import moment from 'moment';
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

const PatientReport = ({ isExpanded, onExpand }) => {
  const [currentMonth, setCurrentMonth] = useState(moment());
  const daysInMonth = currentMonth.daysInMonth();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

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
              {/* Activity Data Section */}
              <tr>
                <td className="d-flex align-items-center metrics-cell"><img src={Steps_Icon} alt="Steps" className="metric-icon" />Steps</td>
                <td className="normal-range-cell">6k - 8k</td>
                {daysArray.map(day => <td key={day} className="text-center day-data-cell" style={{ color: day <= 20 ? (day % 3 === 0 ? '#28a745' : day % 2 === 0 ? '#ffc107' : '#dc3545') : '#000' }}>{day <= 20 ? `7,000` : '-'}</td>)}
              </tr>
              <tr>
                <td className="d-flex align-items-center metrics-cell"><img src={ActiveMinutes_Icon} alt="Active Mins" className="metric-icon" />Active Mins</td>
                <td className="normal-range-cell">150 - 300 Min (Moderate) OR 75 - 150 Min (Vigorous)</td>
                {daysArray.map(day => <td key={day} className="text-center day-data-cell" style={{ color: day <= 20 ? (day % 3 === 0 ? '#28a745' : day % 2 === 0 ? '#ffc107' : '#dc3545') : '#000' }}>{day <= 20 ? `${Math.floor(Math.random() * 60) + 30} mins` : '-'}</td>)}
              </tr>
              <tr>
                <td className="d-flex align-items-center metrics-cell"><img src={CaloriesBurned_Icon} alt="Calories Burned" className="metric-icon" />Calories Burned</td>
                <td className="normal-range-cell">1,800 - 2,400 Kcal (W) &gt; 2,200 - 3,000 Kcal (M)</td>
                {daysArray.map(day => <td key={day} className="text-center day-data-cell" style={{ color: day <= 20 ? '#28a745' : '#000' }}>{day <= 20 ? `2,150 kcal` : '-'}</td>)}
              </tr>
              <tr>
                <td className="d-flex align-items-center metrics-cell"><img src={Distance_Icon} alt="Distance" className="metric-icon" />Distance</td>
                <td className="normal-range-cell">7,000 - 10,000 Steps (~5 - 8 Km)</td>
                {daysArray.map(day => <td key={day} className="text-center day-data-cell" style={{ color: day <= 20 ? (day % 4 === 0 ? '#28a745' : day % 3 === 0 ? '#ffc107' : '#dc3545') : '#000' }}>{day <= 20 ? `${(Math.random() * 3 + 3).toFixed(1)} km` : '-'}</td>)}
              </tr>

              {/* Sleep Data Section */}
              <tr>
                <td className="d-flex align-items-center metrics-cell"><img src={SleepStages_Icon} alt="Sleep Stages" className="metric-icon" />Sleep Stages</td>
                <td className="normal-range-cell">L Sleep: 45 - 55%</td>
                {daysArray.map(day => <td key={day} className="text-center day-data-cell" style={{ color: day <= 20 ? (day % 3 === 0 ? '#28a745' : '#ffc107') : '#000' }}>{day <= 20 ? `7h 15m` : '-'}</td>)}
              </tr>
              <tr>
                <td className="d-flex align-items-center metrics-cell"><img src={Duration_Icon} alt="Duration" className="metric-icon" />Duration</td>
                <td className="normal-range-cell">7 - 9 Hours/Night</td>
                {daysArray.map(day => <td key={day} className="text-center day-data-cell" style={{ color: day <= 20 ? (day % 2 === 0 ? '#28a745' : '#ffc107') : '#000' }}>{day <= 20 ? `${Math.floor(Math.random() * 2) + 7}h ${Math.floor(Math.random() * 60)}m` : '-'}</td>)}
              </tr>
              <tr>
                <td className="d-flex align-items-center metrics-cell"><img src={Efficiency_Icon} alt="Efficiency" className="metric-icon" />Efficiency</td>
                <td className="normal-range-cell">≥85%</td>
                {daysArray.map(day => <td key={day} className="text-center day-data-cell" style={{ color: day <= 20 ? (day % 4 === 0 ? '#28a745' : day % 3 === 0 ? '#ffc107' : '#dc3545') : '#000' }}>{day <= 20 ? `${Math.floor(Math.random() * 20) + 80}%` : '-'}</td>)}
              </tr>
              <tr>
                <td className="d-flex align-items-center metrics-cell"><img src={Awakenings_Icon} alt="Awakenings" className="metric-icon" />Awakenings</td>
                <td className="normal-range-cell">0 - 2</td>
                {daysArray.map(day => <td key={day} className="text-center day-data-cell" style={{ color: day <= 20 ? (day % 5 === 0 ? '#28a745' : day % 2 === 0 ? '#ffc107' : '#dc3545') : '#000' }}>{day <= 20 ? `${Math.floor(Math.random() * 4)}` : '-'}</td>)}
              </tr>

              {/* Heart Rate Section */}
              <tr>
                <td className="d-flex align-items-center metrics-cell"><img src={HeartRate_Icon} alt="Resting Heart Rate" className="metric-icon" />Resting Heart Rate</td>
                <td className="normal-range-cell">60 - 100 Bpm</td>
                {daysArray.map(day => <td key={day} className="text-center day-data-cell" style={{ color: day <= 20 ? '#28a745' : '#000' }}>{day <= 20 ? `68 bpm` : '-'}</td>)}
              </tr>
              <tr>
                <td className="d-flex align-items-center metrics-cell"><img src={ContinuousHeartRate_Icon} alt="Continuous Heart Rate" className="metric-icon" />Continuous Heart Rate</td>
                <td className="normal-range-cell">60 - 100 Bpm</td>
                {daysArray.map(day => <td key={day} className="text-center day-data-cell" style={{ color: day <= 20 ? '#28a745' : '#000' }}>{day <= 20 ? `70 bpm` : '-'}</td>)}
              </tr>

              {/* Weight And Body Metrics Section */}
              <tr>
                <td className="d-flex align-items-center metrics-cell"><img src={Weight_Icon} alt="Weight" className="metric-icon" />Weight</td>
                <td className="normal-range-cell">L Sleep: 45 - 55%</td>
                {daysArray.map(day => <td key={day} className="text-center day-data-cell" style={{ color: day <= 20 ? (day % 4 === 0 ? '#28a745' : day % 2 === 0 ? '#ffc107' : '#dc3545') : '#000' }}>{day <= 20 ? `${(Math.random() * 20 + 60).toFixed(1)} kg` : '-'}</td>)}
              </tr>
              <tr>
                <td className="d-flex align-items-center metrics-cell"><img src={BMI_Icon} alt="BMI" className="metric-icon" />BMI</td>
                <td className="normal-range-cell">18.5 - 24.9</td>
                {daysArray.map(day => <td key={day} className="text-center day-data-cell" style={{ color: day <= 20 ? (day % 3 === 0 ? '#28a745' : day % 2 === 0 ? '#ffc107' : '#dc3545') : '#000' }}>{day <= 20 ? `${(Math.random() * 10 + 18).toFixed(1)}` : '-'}</td>)}
              </tr>
              <tr>
                <td className="d-flex align-items-center metrics-cell"><img src={BodyFat_Icon} alt="Body Fat Percentage" className="metric-icon" />Body Fat Percentage</td>
                <td className="normal-range-cell">10 - 20%</td>
                {daysArray.map(day => <td key={day} className="text-center day-data-cell" style={{ color: day <= 20 ? (day % 5 === 0 ? '#28a745' : day % 3 === 0 ? '#ffc107' : '#dc3545') : '#000' }}>{day <= 20 ? `${(Math.random() * 15 + 10).toFixed(1)}%` : '-'}</td>)}
              </tr>

              {/* Exercise Data Section */}
              <tr>
                <td className="d-flex align-items-center metrics-cell"><img src={ExerciseSessions_Icon} alt="Exercise Sessions" className="metric-icon" />Exercise Sessions</td>
                <td className="normal-range-cell">3 - 5 Sessions</td>
                {daysArray.map(day => <td key={day} className="text-center day-data-cell" style={{ color: day <= 20 ? (day % 4 === 0 ? '#28a745' : day % 2 === 0 ? '#ffc107' : '#dc3545') : '#000' }}>{day <= 20 ? `${Math.floor(Math.random() * 3) + 1}` : '-'}</td>)}
              </tr>
              <tr>
                <td className="d-flex align-items-center metrics-cell"><img src={GPSTracking_Icon} alt="GPS Tracking" className="metric-icon" />GPS Tracking</td>
                <td className="normal-range-cell">2 - 3 Cardio</td>
                {daysArray.map(day => <td key={day} className="text-center day-data-cell" style={{ color: day <= 20 ? (day % 3 === 0 ? '#28a745' : '#ffc107') : '#000' }}>{day <= 20 ? `${Math.floor(Math.random() * 2) + 1}` : '-'}</td>)}
              </tr>
              <tr>
                <td className="d-flex align-items-center metrics-cell"><img src={Elevation_Icon} alt="Elevation" className="metric-icon" />Elevation</td>
                <td className="normal-range-cell">No Fixed Average</td>
                {daysArray.map(day => <td key={day} className="text-center day-data-cell" style={{ color: day <= 20 ? (day % 5 === 0 ? '#28a745' : day % 2 === 0 ? '#ffc107' : '#dc3545') : '#000' }}>{day <= 20 ? `${Math.floor(Math.random() * 100)}m` : '-'}</td>)}
              </tr>

              {/* Nutrition Section */}
              <tr>
                <td className="d-flex align-items-center metrics-cell"><img src={CaloriesConsumed_Icon} alt="Calories Consumed" className="metric-icon" />Calories Consumed</td>
                <td className="normal-range-cell">1,800 - 2,200 Kcal</td>
                {daysArray.map(day => <td key={day} className="text-center day-data-cell" style={{ color: day <= 20 ? (day % 4 === 0 ? '#28a745' : day % 3 === 0 ? '#ffc107' : '#dc3545') : '#000' }}>{day <= 20 ? `${Math.floor(Math.random() * 400) + 1800} kcal` : '-'}</td>)}
              </tr>
              <tr>
                <td className="d-flex align-items-center metrics-cell"><img src={WaterIntake_Icon} alt="Water Intake" className="metric-icon" />Water Intake</td>
                <td className="normal-range-cell">2 - 3 Liters/Day</td>
                {daysArray.map(day => <td key={day} className="text-center day-data-cell" style={{ color: day <= 20 ? (day % 3 === 0 ? '#28a745' : day % 2 === 0 ? '#ffc107' : '#dc3545') : '#000' }}>{day <= 20 ? `${(Math.random() * 1 + 2).toFixed(1)}L` : '-'}</td>)}
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default PatientReport