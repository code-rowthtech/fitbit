import React, { useState, useRef, useEffect } from 'react'
import Activity_Min from '../../../assets/images/PatientDashboard/Active Minutes.png'
import Calories_Icon from '../../../assets/images/PatientDashboard/Calories Burned.png'
import HeartRate_Icon from '../../../assets/images/PatientDashboard/heart rate.png'
import Distance_Icon from '../../../assets/images/PatientDashboard/distance.png'
import { IoCalendarClearOutline } from "react-icons/io5";
import { Table } from 'react-bootstrap'
import { DateRangePicker } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import { IoIosExpand } from "react-icons/io";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { getFilterData } from '../../../redux/patientsDashboard/action'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useSearchParams } from 'react-router-dom'
import StepsCard from './CardsData/StepsCard'
import CaloriesCard from './CardsData/CaloriesCard'
import DistanceCard from './CardsData/DistanceCard'
import './ActivityData.css'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const ActivityData = ({ isExpanded, onExpand }) => {
    const dispatch = useDispatch();
    const { id: pathId } = useParams();
    const [searchParams] = useSearchParams();
    const patientId = pathId || searchParams.get('id') || searchParams.get('patientId');
    const [isOpen, setIsOpen] = useState(true);
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [expandedCard, setExpandedCard] = useState(null)
    const [activeTab, setActiveTab] = useState('Week')
    const [currentDate, setCurrentDate] = useState(new Date())

    // Initialize dateRange based on current week
    const initializeWeekRange = () => {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return {
            startDate: startOfWeek,
            endDate: endOfWeek,
            key: 'selection'
        };
    };

    const [dateRange, setDateRange] = useState([initializeWeekRange()])
    const datePickerRef = useRef(null)

    // Get date range based on active tab and current date
    const getDateRange = () => {
        const date = new Date(currentDate);

        switch (activeTab) {
            case 'Day':
                return {
                    start: new Date(date),
                    end: new Date(date)
                };
            case 'Week':
                const startOfWeek = new Date(date);
                startOfWeek.setDate(date.getDate() - date.getDay());
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6);
                return {
                    start: startOfWeek,
                    end: endOfWeek
                };
            case 'Month':
                const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
                const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                return {
                    start: startOfMonth,
                    end: endOfMonth
                };
            case 'Year':
                const startOfYear = new Date(date.getFullYear(), 0, 1);
                const endOfYear = new Date(date.getFullYear(), 11, 31);
                return {
                    start: startOfYear,
                    end: endOfYear
                };
            default:
                return { start: new Date(), end: new Date() };
        }
    };

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        if (patientId) {
            const { start, end } = getDateRange();
            const payload = {
                patientId: patientId,
                start: formatDate(start),
                end: formatDate(end),
                field: "steps"
            };
            if (activeTab === 'Month') payload.period = 'month';
            if (activeTab === 'Year') payload.period = 'year';
            dispatch(getFilterData(payload));
        }
    }, [patientId, currentDate, activeTab]);

    const handleCardExpand = (cardType) => {
        if (expandedCard === cardType) {
            setExpandedCard(null)
            onExpand()
        } else {
            setExpandedCard(cardType)
            onExpand()
        }
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
                setShowDatePicker(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])



    return (
        <div className="accordion" id="activityAccordion" style={{ backgroundColor: 'white', }}>
            <div className="accordion-item" style={{ border: 'none' }}>
                <h2 className="accordion-header">
                    <div className="py-2 d-flex align-items-center justify-content-between" style={{ backgroundColor: '#f8f9fa', padding: '16px 20px' }}>
                        <div className="d-flex align-items-center">
                            <span style={{ fontSize: '16px', fontWeight: '600', marginRight: '15px' }}>
                                Activity Data
                            </span>
                            <div ref={datePickerRef} style={{ position: 'relative' }}>
                                <button
                                    className="form-control rounded-3 border-0 text-start d-flex justify-content-between align-items-center"
                                    style={{ fontSize: '10px', height: '26px', width: '170px', color: '#003465', backgroundColor: 'transparent' }}
                                    onClick={() => setShowDatePicker(!showDatePicker)}
                                >
                                    <span>{dateRange[0].startDate.toLocaleDateString()} - {dateRange[0].endDate.toLocaleDateString()}</span>
                                    <IoCalendarClearOutline style={{ fontSize: '15px', color: '#003465', marginLeft: '10px' }} />
                                </button>
                                {showDatePicker && (
                                    <div style={{ position: 'absolute', top: '40px', zIndex: 1000, backgroundColor: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                                        <DateRangePicker
                                            ranges={dateRange}
                                            onChange={(ranges) => {
                                                const { startDate, endDate } = ranges.selection;
                                                const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

                                                if (daysDiff <= 7) {
                                                    setDateRange([ranges.selection]);
                                                    if (patientId) {
                                                        const payload = {
                                                            patientId: patientId,
                                                            start: formatDate(startDate),
                                                            end: formatDate(endDate),
                                                            field: "steps"
                                                        };
                                                        if (activeTab === 'Month') payload.period = 'month';
                                                        if (activeTab === 'Year') payload.period = 'year';
                                                        dispatch(getFilterData(payload));
                                                    }
                                                }
                                            }}
                                            maxDate={new Date()}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div
                            onClick={() => setIsOpen(!isOpen)}
                            style={{ cursor: 'pointer', fontSize: '18px', color: '#121212' }}
                        >
                            {isOpen ? <IoChevronUp className='fs-4' /> : <IoChevronDown className='fs-4' />}
                        </div>
                    </div>
                </h2>
                <div className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}>
                    <div className="accordion-body" style={{ backgroundColor: 'transparent', border: 'none', padding: '10px' }}>
                        <div className={expandedCard ? "d-flex flex-column gap-3" : "d-flex gap-3"}>
                            {/* Steps Card */}
                            {(!expandedCard || expandedCard === 'steps') && (
                                <StepsCard 
                                    patientId={patientId}
                                    expandedCard={expandedCard}
                                    onCardExpand={handleCardExpand}
                                    activeTab={activeTab}
                                    onTabChange={setActiveTab}
                                    currentDate={currentDate}
                                    onDateChange={setCurrentDate}
                                    formatDate={formatDate}
                                />
                            )}

                            {/* Active Mins Card */}
                            {(!expandedCard || expandedCard === 'activeMins') && (
                                <div style={{ flex: 1, backgroundColor: 'white', border: '1px solid #e9ecef', borderRadius: '8px', minHeight: expandedCard === 'activeMins' ? '550px' : '245px', transition: 'min-height 0.3s ease' }}>
                                    <div className="d-flex align-items-center justify-content-between mb-0 p-2 border-1" style={{ backgroundColor: '#E0ECF8', borderTopLeftRadius: '7px', borderTopRightRadius: '7px' }}>
                                        <div>
                                            <img src={Activity_Min} alt="Active Minutes" className="mx-2" style={{ width: '19px', height: '19px' }} />
                                            <span style={{ fontSize: '12px', fontWeight: '600', color: '#003465' }}>Active Mins</span>
                                        </div>
                                        <div className='d-flex'>
                                            <IoCalendarClearOutline style={{ fontSize: '16px', color: '#003465', marginLeft: '8px' }} />
                                            <IoIosExpand
                                                style={{ fontSize: '16px', color: '#003465', marginLeft: '6px', cursor: 'pointer' }}
                                                onClick={() => handleCardExpand('activeMins')}
                                            />
                                        </div>
                                    </div>
                                    <div className='p-1 pt-0'>
                                        {expandedCard === 'activeMins' ? (
                                            <div className='row p-3'>
                                                <div className='col-8 pe-2'>
                                                    <div className='border rounded-2' style={{ padding: '10px', backgroundColor: '#F6FAFF', height: '500px' }}>
                                                        <Bar
                                                            data={{
                                                                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                                                                datasets: [{
                                                                    data: [45, 45, 45, 45, 75, 45, 25],
                                                                    backgroundColor: '#003465',
                                                                    borderRadius: 3,
                                                                    barThickness: 35
                                                                }]
                                                            }}
                                                            options={{
                                                                maintainAspectRatio: false,
                                                                plugins: { legend: { display: false } },
                                                                scales: {
                                                                    x: {
                                                                        grid: { display: false },
                                                                        ticks: { color: '#666', fontSize: 10 }
                                                                    },
                                                                    y: {
                                                                        beginAtZero: true,
                                                                        grid: { color: '#f0f0f0' },
                                                                        ticks: { color: '#666', fontSize: 10 }
                                                                    }
                                                                },
                                                                categoryPercentage: 0.6
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='col-4 ps-2'>
                                                    <div className='border rounded-2 p-3 d-flex flex-column' style={{ backgroundColor: '#F6FAFF', height: '500px' }}>
                                                        <div className="mb-3">
                                                            <p className='fw-bold mb-0' style={{ color: "#003465", fontSize: '14px' }}>Active Minutes Summary</p>
                                                        </div>
                                                        <div className="d-flex justify-content-center mb-4">
                                                            <div className="position-relative" style={{ width: '180px', height: '180px' }}>
                                                                <svg width="180" height="180" className="position-absolute">
                                                                    <circle cx="90" cy="90" r="75" fill="none" stroke="#E0ECF8" strokeWidth="12" />
                                                                    <circle cx="90" cy="90" r="75" fill="none" stroke="#003465" strokeWidth="10" strokeDasharray="471" strokeDashoffset="188" strokeLinecap="round" transform="rotate(-90 90 90)" />
                                                                </svg>
                                                                <div className="position-absolute top-50 start-50 translate-middle text-center">
                                                                    <div className="fw-bold" style={{ fontSize: '24px', color: '#003465' }}>60%</div>
                                                                    <div style={{ fontSize: '14px', color: '#003465' }}>Goal</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-center mb-4">
                                                            <p className="mb-0" style={{ fontSize: '13px', color: '#666' }}>30 mins away from hitting daily goal</p>
                                                        </div>
                                                        <div className="row mb-4">
                                                            <div className="col-6">
                                                                <div className="text-center p-2 rounded" style={{ backgroundColor: 'white' }}>
                                                                    <div className="fw-bold" style={{ fontSize: '18px', color: '#003465' }}>45</div>
                                                                    <div style={{ fontSize: '12px', color: '#666' }}>Today's Mins</div>
                                                                </div>
                                                            </div>
                                                            <div className="col-6">
                                                                <div className="text-center p-2 rounded" style={{ backgroundColor: 'white' }}>
                                                                    <div className="fw-bold" style={{ fontSize: '18px', color: '#003465' }}>75</div>
                                                                    <div style={{ fontSize: '12px', color: '#666' }}>Daily Goal</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="mt-auto">
                                                            <div className="row">
                                                                <div className="col-12 mb-2">
                                                                    <div className="d-flex justify-content-between align-items-center p-2 rounded" style={{ backgroundColor: 'white', fontSize: '12px' }}>
                                                                        <span style={{ color: '#666' }}>Weekly Average</span>
                                                                        <span className="fw-bold" style={{ color: '#003465' }}>47</span>
                                                                    </div>
                                                                </div>
                                                                <div className="col-12">
                                                                    <div className="d-flex justify-content-between align-items-center p-2 rounded" style={{ backgroundColor: 'white', fontSize: '12px' }}>
                                                                        <span style={{ color: '#666' }}>Best Day</span>
                                                                        <span className="fw-bold" style={{ color: '#003465' }}>75</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <Table className=' fw-bold mb-0 mt-1' style={{ width: '100%', fontSize: '10px', borderCollapse: 'collapse', border: '1px solid #E0E0E0', borderBottom: 'transparent' }}>
                                                <tbody>
                                                    <tr>
                                                        <td className='p-1' style={{ color: '#121212', backgroundColor: '#F3F3F3', borderBottom: '1px solid #E0E0E0' }}>Current Week</td>
                                                        <td className='p-1 text-warning' style={{ fontWeight: '600', textAlign: 'right', borderLeft: '1px solid #E0E0E0', backgroundColor: '#F3F3F3', borderBottom: '1px solid #E0E0E0' }}>Avg- 45 mins</td>
                                                    </tr>
                                                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                                                        const mins = { Monday: '45 mins', Tuesday: '45 mins', Wednesday: '45 mins', Thursday: '45 mins', Friday: '75 mins', Saturday: '45 mins', Sunday: '25 mins' }[day];
                                                        const minsValue = parseInt(mins);
                                                        const colorClass = minsValue >= 60 ? 'text-success' : minsValue >= 30 ? 'text-warning' : 'text-danger';
                                                        return (
                                                            <tr key={day}>
                                                                <td className='p-1' style={{ color: '#121212', borderBottom: '1px solid #E0E0E0', backgroundColor: '#F9FAFB' }}>{day}</td>
                                                                <td className={`p-1 ${colorClass}`} style={{ textAlign: 'right', borderBottom: '1px solid #E0E0E0', borderLeft: '1px solid #E0E0E0', backgroundColor: '#F9FAFB' }}>{mins}</td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </Table>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Calories Card */}
                            {(!expandedCard || expandedCard === 'calories') && (
                                <CaloriesCard 
                                    patientId={patientId}
                                    expandedCard={expandedCard}
                                    onCardExpand={handleCardExpand}
                                    activeTab={activeTab}
                                    onTabChange={setActiveTab}
                                    currentDate={currentDate}
                                    onDateChange={setCurrentDate}
                                    formatDate={formatDate}
                                />
                            )}

                            {/* Heart Rate Card */}
                            {(!expandedCard || expandedCard === 'heartRate') && (
                                <div style={{ flex: 1, backgroundColor: 'white', border: '1px solid #e9ecef', borderRadius: '8px', minHeight: expandedCard === 'heartRate' ? '550px' : '245px', transition: 'min-height 0.3s ease' }}>
                                    <div className="d-flex align-items-center justify-content-between mb-0 p-2 border-1" style={{ backgroundColor: '#E0ECF8', borderTopLeftRadius: '7px', borderTopRightRadius: '7px' }}>
                                        <div>
                                            <img src={HeartRate_Icon} alt="Heart Rate" className="mx-2" style={{ width: '19px', height: '19px' }} />
                                            <span style={{ fontSize: '12px', fontWeight: '600', color: '#003465' }}>Heart Rate</span>
                                        </div>
                                        <div className='d-flex'>
                                            <IoCalendarClearOutline style={{ fontSize: '16px', color: '#003465', marginLeft: '8px' }} />
                                            <IoIosExpand
                                                style={{ fontSize: '16px', color: '#003465', marginLeft: '6px', cursor: 'pointer' }}
                                                onClick={() => handleCardExpand('heartRate')}
                                            />
                                        </div>
                                    </div>
                                    <div className='p-1 pt-0'>
                                        {expandedCard === 'heartRate' ? (
                                            <div className='row p-3'>
                                                <div className='col-8 pe-2'>
                                                    <div className='border rounded-2' style={{ padding: '10px', backgroundColor: '#F6FAFF', height: '500px' }}>
                                                        <Bar
                                                            data={{
                                                                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                                                                datasets: [{
                                                                    data: [68, 70, 67, 72, 69, 68, 71],
                                                                    backgroundColor: '#003465',
                                                                    borderRadius: 3,
                                                                    barThickness: 35
                                                                }]
                                                            }}
                                                            options={{
                                                                maintainAspectRatio: false,
                                                                plugins: { legend: { display: false } },
                                                                scales: {
                                                                    x: {
                                                                        grid: { display: false },
                                                                        ticks: { color: '#666', fontSize: 10 }
                                                                    },
                                                                    y: {
                                                                        beginAtZero: true,
                                                                        grid: { color: '#f0f0f0' },
                                                                        ticks: { color: '#666', fontSize: 10 }
                                                                    }
                                                                },
                                                                categoryPercentage: 0.6
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='col-4 ps-2'>
                                                    <div className='border rounded-2 p-3 d-flex flex-column' style={{ backgroundColor: '#F6FAFF', height: '500px' }}>
                                                        <div className="mb-3">
                                                            <p className='fw-bold mb-0' style={{ color: "#003465", fontSize: '14px' }}>Heart Rate Summary</p>
                                                        </div>
                                                        <div className="d-flex justify-content-center mb-4">
                                                            <div className="position-relative" style={{ width: '180px', height: '180px' }}>
                                                                <svg width="180" height="180" className="position-absolute">
                                                                    <circle cx="90" cy="90" r="75" fill="none" stroke="#E0ECF8" strokeWidth="12" />
                                                                    <circle cx="90" cy="90" r="75" fill="none" stroke="#003465" strokeWidth="10" strokeDasharray="471" strokeDashoffset="47" strokeLinecap="round" transform="rotate(-90 90 90)" />
                                                                </svg>
                                                                <div className="position-absolute top-50 start-50 translate-middle text-center">
                                                                    <div className="fw-bold" style={{ fontSize: '24px', color: '#003465' }}>90%</div>
                                                                    <div style={{ fontSize: '14px', color: '#003465' }}>Healthy</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-center mb-4">
                                                            <p className="mb-0" style={{ fontSize: '13px', color: '#666' }}>Heart rate is in healthy range</p>
                                                        </div>
                                                        <div className="row mb-4">
                                                            <div className="col-6">
                                                                <div className="text-center p-2 rounded" style={{ backgroundColor: 'white' }}>
                                                                    <div className="fw-bold" style={{ fontSize: '18px', color: '#003465' }}>69</div>
                                                                    <div style={{ fontSize: '12px', color: '#666' }}>Avg BPM</div>
                                                                </div>
                                                            </div>
                                                            <div className="col-6">
                                                                <div className="text-center p-2 rounded" style={{ backgroundColor: 'white' }}>
                                                                    <div className="fw-bold" style={{ fontSize: '18px', color: '#003465' }}>72</div>
                                                                    <div style={{ fontSize: '12px', color: '#666' }}>Max BPM</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="mt-auto">
                                                            <div className="row">
                                                                <div className="col-12 mb-2">
                                                                    <div className="d-flex justify-content-between align-items-center p-2 rounded" style={{ backgroundColor: 'white', fontSize: '12px' }}>
                                                                        <span style={{ color: '#666' }}>Resting HR</span>
                                                                        <span className="fw-bold" style={{ color: '#003465' }}>65 bpm</span>
                                                                    </div>
                                                                </div>
                                                                <div className="col-12">
                                                                    <div className="d-flex justify-content-between align-items-center p-2 rounded" style={{ backgroundColor: 'white', fontSize: '12px' }}>
                                                                        <span style={{ color: '#666' }}>Zone</span>
                                                                        <span className="fw-bold text-success" style={{ color: '#003465' }}>Normal</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <Table className=' fw-bold mb-0 mt-1' style={{ width: '100%', fontSize: '10px', borderCollapse: 'collapse', border: '1px solid #E0E0E0', borderBottom: 'transparent' }}>
                                                <tbody>
                                                    <tr>
                                                        <td className='p-1' style={{ color: '#121212', backgroundColor: '#F3F3F3', borderBottom: '1px solid #E0E0E0' }}>Current Week</td>
                                                        <td className='p-1 text-success' style={{ fontWeight: '600', textAlign: 'right', borderLeft: '1px solid #E0E0E0', backgroundColor: '#F3F3F3', borderBottom: '1px solid #E0E0E0' }}>Avg- 69 bpm</td>
                                                    </tr>
                                                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                                                        const heart = { Monday: '68', Tuesday: '70', Wednesday: '67', Thursday: '72', Friday: '69', Saturday: '68', Sunday: '71' }[day];
                                                        const heartValue = parseInt(heart);
                                                        const colorClass = heartValue >= 60 && heartValue <= 70 ? 'text-success' : heartValue <= 75 ? 'text-warning' : 'text-danger';
                                                        return (
                                                            <tr key={day}>
                                                                <td className='p-1' style={{ color: '#121212', borderBottom: '1px solid #E0E0E0', backgroundColor: '#F9FAFB' }}>{day}</td>
                                                                <td className={`p-1 ${colorClass}`} style={{ textAlign: 'right', borderBottom: '1px solid #E0E0E0', borderLeft: '1px solid #E0E0E0', backgroundColor: '#F9FAFB' }}>{heart}</td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </Table>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Distance Card */}
                            {(!expandedCard || expandedCard === 'distance') && (
                                <DistanceCard 
                                    patientId={patientId}
                                    expandedCard={expandedCard}
                                    onCardExpand={handleCardExpand}
                                    activeTab={activeTab}
                                    onTabChange={setActiveTab}
                                    currentDate={currentDate}
                                    onDateChange={setCurrentDate}
                                    formatDate={formatDate}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ActivityData