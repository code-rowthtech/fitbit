import React, { useState, useRef, useEffect } from 'react'
import Activity_Min from '../../../assets/images/PatientDashboard/Active Minutes.png'
import Steps_Icon from '../../../assets/images/PatientDashboard/Steps.png'
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

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const ActivityData = ({ isExpanded, onExpand }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [expandedCard, setExpandedCard] = useState(null)
    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ])
    const datePickerRef = useRef(null)

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
                                            onChange={(ranges) => setDateRange([ranges.selection])}
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
                                <div style={{ flex: 1, backgroundColor: 'white', border: '1px solid #e9ecef', borderRadius: '8px', minHeight: expandedCard === 'steps' ? '550px' : '245px', transition: 'min-height 0.3s ease' }}>
                                    <div className="d-flex align-items-center justify-content-between mb-0 p-2 border-1" style={{ backgroundColor: '#E0ECF8', borderTopLeftRadius: '7px', borderTopRightRadius: '7px' }}>
                                        <div>
                                            <img src={Steps_Icon} alt="Steps" className="mx-2" style={{ width: '19px', height: '19px' }} />
                                            <span style={{ fontSize: '12px', fontWeight: '600', color: '#003465' }}>Steps</span>
                                        </div>
                                        <div className='d-flex'>
                                            <IoCalendarClearOutline style={{ fontSize: '16px', color: '#003465', marginLeft: '8px' }} />
                                            <IoIosExpand
                                                style={{ fontSize: '16px', color: '#003465', marginLeft: '6px', cursor: 'pointer' }}
                                                onClick={() => handleCardExpand('steps')}
                                            />
                                        </div>
                                    </div>
                                    <div className='p-2 pt-0'>
                                        {expandedCard === 'steps' ? (
                                            <div className='row p-3'>
                                                <div className='col-8 pe-2'>
                                                    <div className='border rounded-2' style={{ padding: '10px', backgroundColor: '#F6FAFF', height: '500px' }}>
                                                       
                                                        <Bar
                                                            data={{
                                                                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                                                                datasets: [{
                                                                    data: [1000, 3000, 3000, 2000, 3000, 3000, 2000],
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
                                                            <p className='fw-bold mb-0' style={{ color: "#003465", fontSize: '14px' }}>Steps Summary</p>
                                                        </div>

                                                        <div className="d-flex justify-content-center mb-4">
                                                            <div className="position-relative" style={{ width: '180px', height: '180px' }}>
                                                                <svg width="180" height="180" className="position-absolute">
                                                                    <circle cx="90" cy="90" r="75" fill="none" stroke="#E0ECF8" strokeWidth="12" />
                                                                    <circle cx="90" cy="90" r="75" fill="none" stroke="#003465" strokeWidth="10" strokeDasharray="471" strokeDashoffset="141" strokeLinecap="round" transform="rotate(-90 90 90)" />
                                                                </svg>
                                                                <div className="position-absolute top-50 start-50 translate-middle text-center">
                                                                    <div className="fw-bold" style={{ fontSize: '24px', color: '#003465' }}>70%</div>
                                                                    <div style={{ fontSize: '14px', color: '#003465' }}>Goal</div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="text-center mb-4">
                                                            <p className="mb-0" style={{ fontSize: '13px', color: '#666' }}>3,000 steps away from hitting daily goal</p>
                                                        </div>

                                                        <div className="row mb-4">
                                                            <div className="col-6">
                                                                <div className="text-center p-2 rounded" style={{ backgroundColor: 'white' }}>
                                                                    <div className="fw-bold" style={{ fontSize: '18px', color: '#003465' }}>7,000</div>
                                                                    <div style={{ fontSize: '12px', color: '#666' }}>Today's Steps</div>
                                                                </div>
                                                            </div>
                                                            <div className="col-6">
                                                                <div className="text-center p-2 rounded" style={{ backgroundColor: 'white' }}>
                                                                    <div className="fw-bold" style={{ fontSize: '18px', color: '#003465' }}>10,000</div>
                                                                    <div style={{ fontSize: '12px', color: '#666' }}>Daily Goal</div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="mt-auto">
                                                            <div className="row">
                                                                <div className="col-12 mb-2">
                                                                    <div className="d-flex justify-content-between align-items-center p-2 rounded" style={{ backgroundColor: 'white', fontSize: '12px' }}>
                                                                        <span style={{ color: '#666' }}>Weekly Average</span>
                                                                        <span className="fw-bold" style={{ color: '#003465' }}>8,500</span>
                                                                    </div>
                                                                </div>
                                                                <div className="col-12">
                                                                    <div className="d-flex justify-content-between align-items-center p-2 rounded" style={{ backgroundColor: 'white', fontSize: '12px' }}>
                                                                        <span style={{ color: '#666' }}>Best Day</span>
                                                                        <span className="fw-bold" style={{ color: '#003465' }}>12,500</span>
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
                                                        <td className='p-1' style={{ fontWeight: '600', textAlign: 'right', borderLeft: '1px solid #E0E0E0', backgroundColor: '#F3F3F3', borderBottom: '1px solid #E0E0E0' }}>Avg- 2,714</td>
                                                    </tr>
                                                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                                                        const steps = { Monday: '3,000', Tuesday: '3,000', Wednesday: '3,000', Thursday: '2,000', Friday: '3,000', Saturday: '3,000', Sunday: '2,000' }[day];
                                                        return (
                                                            <tr key={day}>
                                                                <td className='p-1' style={{ color: '#121212', borderBottom: '1px solid #E0E0E0', backgroundColor: '#F9FAFB' }}>{day}</td>
                                                                <td className='p-1' style={{ textAlign: 'right', borderBottom: '1px solid #E0E0E0', borderLeft: '1px solid #E0E0E0', backgroundColor: '#F9FAFB' }}>{steps}</td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </Table>
                                        )}
                                    </div>
                                </div>
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
                                    <div className='p-2 pt-0'>
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
                                <div style={{ flex: 1, backgroundColor: 'white', border: '1px solid #e9ecef', borderRadius: '8px', minHeight: expandedCard === 'calories' ? '550px' : '245px', transition: 'min-height 0.3s ease' }}>
                                    <div className="d-flex align-items-center justify-content-between mb-0 p-2 border-1" style={{ backgroundColor: '#E0ECF8', borderTopLeftRadius: '7px', borderTopRightRadius: '7px' }}>
                                        <div>
                                            <img src={Calories_Icon} alt="Calories Burned" className="mx-2" style={{ width: '19px', height: '19px' }} />
                                            <span style={{ fontSize: '12px', fontWeight: '600', color: '#003465' }}>Calories Burned</span>
                                        </div>
                                        <div className='d-flex'>
                                            <IoCalendarClearOutline style={{ fontSize: '16px', color: '#003465', marginLeft: '8px' }} />
                                            <IoIosExpand
                                                style={{ fontSize: '16px', color: '#003465', marginLeft: '6px', cursor: 'pointer' }}
                                                onClick={() => handleCardExpand('calories')}
                                            />
                                        </div>
                                    </div>
                                    <div className='p-2 pt-0'>
                                        {expandedCard === 'calories' ? (
                                            <div className='row p-3'>
                                                <div className='col-8 pe-2'>
                                                    <div className='border rounded-2' style={{ padding: '10px', backgroundColor: '#F6FAFF', height: '500px' }}>
                                                        <Bar
                                                            data={{
                                                                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                                                                datasets: [{
                                                                    data: [2150, 1980, 2300, 1710, 2450, 2100, 1650],
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
                                                            <p className='fw-bold mb-0' style={{ color: "#003465", fontSize: '14px' }}>Calories Summary</p>
                                                        </div>
                                                        <div className="d-flex justify-content-center mb-4">
                                                            <div className="position-relative" style={{ width: '180px', height: '180px' }}>
                                                                <svg width="180" height="180" className="position-absolute">
                                                                    <circle cx="90" cy="90" r="75" fill="none" stroke="#E0ECF8" strokeWidth="12" />
                                                                    <circle cx="90" cy="90" r="75" fill="none" stroke="#003465" strokeWidth="10" strokeDasharray="471" strokeDashoffset="94" strokeLinecap="round" transform="rotate(-90 90 90)" />
                                                                </svg>
                                                                <div className="position-absolute top-50 start-50 translate-middle text-center">
                                                                    <div className="fw-bold" style={{ fontSize: '24px', color: '#003465' }}>80%</div>
                                                                    <div style={{ fontSize: '14px', color: '#003465' }}>Goal</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-center mb-4">
                                                            <p className="mb-0" style={{ fontSize: '13px', color: '#666' }}>350 calories away from hitting daily goal</p>
                                                        </div>
                                                        <div className="row mb-4">
                                                            <div className="col-6">
                                                                <div className="text-center p-2 rounded" style={{ backgroundColor: 'white' }}>
                                                                    <div className="fw-bold" style={{ fontSize: '18px', color: '#003465' }}>2,150</div>
                                                                    <div style={{ fontSize: '12px', color: '#666' }}>Today's Burn</div>
                                                                </div>
                                                            </div>
                                                            <div className="col-6">
                                                                <div className="text-center p-2 rounded" style={{ backgroundColor: 'white' }}>
                                                                    <div className="fw-bold" style={{ fontSize: '18px', color: '#003465' }}>2,500</div>
                                                                    <div style={{ fontSize: '12px', color: '#666' }}>Daily Goal</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="mt-auto">
                                                            <div className="row">
                                                                <div className="col-12 mb-2">
                                                                    <div className="d-flex justify-content-between align-items-center p-2 rounded" style={{ backgroundColor: 'white', fontSize: '12px' }}>
                                                                        <span style={{ color: '#666' }}>Weekly Average</span>
                                                                        <span className="fw-bold" style={{ color: '#003465' }}>2,063</span>
                                                                    </div>
                                                                </div>
                                                                <div className="col-12">
                                                                    <div className="d-flex justify-content-between align-items-center p-2 rounded" style={{ backgroundColor: 'white', fontSize: '12px' }}>
                                                                        <span style={{ color: '#666' }}>Best Day</span>
                                                                        <span className="fw-bold" style={{ color: '#003465' }}>2,450</span>
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
                                                        <td className='p-1' style={{ fontWeight: '600', textAlign: 'right', borderLeft: '1px solid #E0E0E0', backgroundColor: '#F3F3F3', borderBottom: '1px solid #E0E0E0' }}>Avg- 2,150</td>
                                                    </tr>
                                                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                                                        const calories = { Monday: '2,150', Tuesday: '1,980', Wednesday: '2,300', Thursday: '1,710', Friday: '2,450', Saturday: '2,100', Sunday: '1,650' }[day];
                                                        return (
                                                            <tr key={day}>
                                                                <td className='p-1' style={{ color: '#121212', borderBottom: '1px solid #E0E0E0', backgroundColor: '#F9FAFB' }}>{day}</td>
                                                                <td className='p-1' style={{ textAlign: 'right', borderBottom: '1px solid #E0E0E0', borderLeft: '1px solid #E0E0E0', backgroundColor: '#F9FAFB' }}>{calories}</td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </Table>
                                        )}
                                    </div>
                                </div>
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
                                    <div className='p-2 pt-0'>
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
                                <div style={{ flex: 1, backgroundColor: 'white', border: '1px solid #e9ecef', borderRadius: '8px', minHeight: expandedCard === 'distance' ? '550px' : '245px', transition: 'min-height 0.3s ease' }}>
                                    <div className="d-flex align-items-center justify-content-between mb-0 p-2 border-1" style={{ backgroundColor: '#E0ECF8', borderTopLeftRadius: '7px', borderTopRightRadius: '7px' }}>
                                        <div>
                                            <img src={Distance_Icon} alt="Distance" className="mx-2" style={{ width: '19px', height: '19px' }} />
                                            <span style={{ fontSize: '12px', fontWeight: '600', color: '#003465' }}>Distance</span>
                                        </div>
                                        <div className='d-flex'>
                                            <IoCalendarClearOutline style={{ fontSize: '16px', color: '#003465', marginLeft: '8px' }} />
                                            <IoIosExpand
                                                style={{ fontSize: '16px', color: '#003465', marginLeft: '6px', cursor: 'pointer' }}
                                                onClick={() => handleCardExpand('distance')}
                                            />
                                        </div>
                                    </div>
                                    <div className='p-2 pt-0'>
                                        {expandedCard === 'distance' ? (
                                            <div className='row p-3'>
                                                <div className='col-8 pe-2'>
                                                    <div className='border rounded-2' style={{ padding: '10px', backgroundColor: '#F6FAFF', height: '500px' }}>
                                                        <Bar
                                                            data={{
                                                                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                                                                datasets: [{
                                                                    data: [2.3, 2.1, 2.5, 1.8, 2.7, 2.2, 1.6],
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
                                                            <p className='fw-bold mb-0' style={{ color: "#003465", fontSize: '14px' }}>Distance Summary</p>
                                                        </div>
                                                        <div className="d-flex justify-content-center mb-4">
                                                            <div className="position-relative" style={{ width: '180px', height: '180px' }}>
                                                                <svg width="180" height="180" className="position-absolute">
                                                                    <circle cx="90" cy="90" r="75" fill="none" stroke="#E0ECF8" strokeWidth="12" />
                                                                    <circle cx="90" cy="90" r="75" fill="none" stroke="#003465" strokeWidth="10" strokeDasharray="471" strokeDashoffset="165" strokeLinecap="round" transform="rotate(-90 90 90)" />
                                                                </svg>
                                                                <div className="position-absolute top-50 start-50 translate-middle text-center">
                                                                    <div className="fw-bold" style={{ fontSize: '24px', color: '#003465' }}>65%</div>
                                                                    <div style={{ fontSize: '14px', color: '#003465' }}>Goal</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-center mb-4">
                                                            <p className="mb-0" style={{ fontSize: '13px', color: '#666' }}>1.2 km away from hitting daily goal</p>
                                                        </div>
                                                        <div className="row mb-4">
                                                            <div className="col-6">
                                                                <div className="text-center p-2 rounded" style={{ backgroundColor: 'white' }}>
                                                                    <div className="fw-bold" style={{ fontSize: '18px', color: '#003465' }}>2.3</div>
                                                                    <div style={{ fontSize: '12px', color: '#666' }}>Today's km</div>
                                                                </div>
                                                            </div>
                                                            <div className="col-6">
                                                                <div className="text-center p-2 rounded" style={{ backgroundColor: 'white' }}>
                                                                    <div className="fw-bold" style={{ fontSize: '18px', color: '#003465' }}>3.5</div>
                                                                    <div style={{ fontSize: '12px', color: '#666' }}>Daily Goal</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="mt-auto">
                                                            <div className="row">
                                                                <div className="col-12 mb-2">
                                                                    <div className="d-flex justify-content-between align-items-center p-2 rounded" style={{ backgroundColor: 'white', fontSize: '12px' }}>
                                                                        <span style={{ color: '#666' }}>Weekly Average</span>
                                                                        <span className="fw-bold" style={{ color: '#003465' }}>2.17 km</span>
                                                                    </div>
                                                                </div>
                                                                <div className="col-12">
                                                                    <div className="d-flex justify-content-between align-items-center p-2 rounded" style={{ backgroundColor: 'white', fontSize: '12px' }}>
                                                                        <span style={{ color: '#666' }}>Best Day</span>
                                                                        <span className="fw-bold" style={{ color: '#003465' }}>2.7 km</span>
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
                                                        <td className='p-1 text-warning' style={{ fontWeight: '600', textAlign: 'right', borderLeft: '1px solid #E0E0E0', backgroundColor: '#F3F3F3', borderBottom: '1px solid #E0E0E0' }}>Avg- 2.1 km</td>
                                                    </tr>
                                                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                                                        const distance = { Monday: '2.3', Tuesday: '2.1', Wednesday: '2.5', Thursday: '1.8', Friday: '2.7', Saturday: '2.2', Sunday: '1.6' }[day];
                                                        const distanceValue = parseFloat(distance);
                                                        const colorClass = distanceValue >= 2.5 ? 'text-success' : distanceValue >= 2.0 ? 'text-warning' : 'text-danger';
                                                        return (
                                                            <tr key={day}>
                                                                <td className='p-1' style={{ color: '#121212', borderBottom: '1px solid #E0E0E0', backgroundColor: '#F9FAFB' }}>{day}</td>
                                                                <td className={`p-1 ${colorClass}`} style={{ textAlign: 'right', borderBottom: '1px solid #E0E0E0', borderLeft: '1px solid #E0E0E0', backgroundColor: '#F9FAFB' }}>{distance}</td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </Table>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ActivityData