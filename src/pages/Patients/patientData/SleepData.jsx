import React, { useState, useRef, useEffect } from 'react'
import SleepStages_Icon from '../../../assets/images/PatientDashboard/Sleep stages.png'
import Duration_Icon from '../../../assets/images/PatientDashboard/duration.png'
import Efficiency_Icon from '../../../assets/images/PatientDashboard/efficiency.png'
import Awakenings_Icon from '../../../assets/images/PatientDashboard/awakenings.png'
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

const SleepData = ({ isExpanded, onExpand }) => {
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
        <div className="accordion" id="sleepAccordion" style={{ backgroundColor: 'white', }}>
            <div className="accordion-item" style={{ border: 'none' }}>
                <h2 className="accordion-header">
                    <div className="py-2 d-flex align-items-center justify-content-between" style={{ backgroundColor: '#f8f9fa', padding: '16px 20px' }}>
                        <div className="d-flex align-items-center">
                            <span style={{ fontSize: '16px', fontWeight: '600', marginRight: '15px' }}>
                                Sleep Data
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
                            {isOpen ? <IoChevronUp className='fs-4'/> : <IoChevronDown className='fs-4' />}
                        </div>
                    </div>
                </h2>
                <div className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}>
                    <div className="accordion-body" style={{ backgroundColor: 'transparent', border: 'none', padding: '10px' }}>
                        <div className={expandedCard ? "d-flex flex-column gap-3" : "d-flex gap-3"}>
                            {/* Sleep Stages Card */}
                            {(!expandedCard || expandedCard === 'sleepStages') && (
                            <div style={{ flex: 1, backgroundColor: 'white', border: '1px solid #e9ecef', borderRadius: '8px', minHeight: expandedCard === 'sleepStages' ? '550px' : '245px', transition: 'min-height 0.3s ease' }}>
                                <div className="d-flex align-items-center justify-content-between mb-0 p-2 border-1" style={{ backgroundColor: '#E0ECF8', borderTopLeftRadius: '7px', borderTopRightRadius: '7px' }}>
                                    <div>
                                        <img src={SleepStages_Icon} alt="Sleep stages" className="mx-2" style={{ width: '19px', height: '19px' }} />
                                        <span style={{ fontSize: '12px', fontWeight: '600' }}>Sleep stages</span>
                                    </div>
                                    <div className='d-flex'>
                                        <IoCalendarClearOutline style={{ fontSize: '16px', color: '#003465', marginLeft: '8px' }} />
                                        <IoIosExpand 
                                            style={{ fontSize: '16px', color: '#003465', marginLeft: '6px', cursor: 'pointer' }} 
                                            onClick={() => handleCardExpand('sleepStages')}
                                        />
                                    </div>
                                </div>
                                <div className='p-2 pt-0'>
                                    {expandedCard === 'sleepStages' ? (
                                        <div className='row p-3'>
                                            <div className='col-8 pe-2'>
                                                <div className='border rounded-2' style={{ padding: '10px', backgroundColor: '#F6FAFF', height: '500px' }}>
                                                    <Bar
                                                        data={{
                                                            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                                                            datasets: [{
                                                                data: [4, 4, 3, 4, 4, 3, 4],
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
                                                        <p className='fw-bold mb-0' style={{ color: "#003465", fontSize: '14px' }}>Sleep Stages Summary</p>
                                                    </div>
                                                    <div className="d-flex justify-content-center mb-4">
                                                        <div className="position-relative" style={{ width: '180px', height: '180px' }}>
                                                            <svg width="180" height="180" className="position-absolute">
                                                                <circle cx="90" cy="90" r="75" fill="none" stroke="#E0ECF8" strokeWidth="12" />
                                                                <circle cx="90" cy="90" r="75" fill="none" stroke="#003465" strokeWidth="10" strokeDasharray="471" strokeDashoffset="118" strokeLinecap="round" transform="rotate(-90 90 90)" />
                                                            </svg>
                                                            <div className="position-absolute top-50 start-50 translate-middle text-center">
                                                                <div className="fw-bold" style={{ fontSize: '24px', color: '#003465' }}>75%</div>
                                                                <div style={{ fontSize: '14px', color: '#003465' }}>Quality</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-center mb-4">
                                                        <p className="mb-0" style={{ fontSize: '13px', color: '#666' }}>Good sleep stage distribution</p>
                                                    </div>
                                                    <div className="row mb-4">
                                                        <div className="col-6">
                                                            <div className="text-center p-2 rounded" style={{ backgroundColor: 'white' }}>
                                                                <div className="fw-bold" style={{ fontSize: '18px', color: '#003465' }}>4</div>
                                                                <div style={{ fontSize: '12px', color: '#666' }}>Today's Stages</div>
                                                            </div>
                                                        </div>
                                                        <div className="col-6">
                                                            <div className="text-center p-2 rounded" style={{ backgroundColor: 'white' }}>
                                                                <div className="fw-bold" style={{ fontSize: '18px', color: '#003465' }}>4</div>
                                                                <div style={{ fontSize: '12px', color: '#666' }}>Optimal</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-auto">
                                                        <div className="row">
                                                            <div className="col-12 mb-2">
                                                                <div className="d-flex justify-content-between align-items-center p-2 rounded" style={{ backgroundColor: 'white', fontSize: '12px' }}>
                                                                    <span style={{ color: '#666' }}>Weekly Average</span>
                                                                    <span className="fw-bold" style={{ color: '#003465' }}>3.7</span>
                                                                </div>
                                                            </div>
                                                            <div className="col-12">
                                                                <div className="d-flex justify-content-between align-items-center p-2 rounded" style={{ backgroundColor: 'white', fontSize: '12px' }}>
                                                                    <span style={{ color: '#666' }}>Best Days</span>
                                                                    <span className="fw-bold" style={{ color: '#003465' }}>5 days</span>
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
                                                    <td className='p-1' style={{ fontWeight: '600', textAlign: 'right', borderLeft: '1px solid #E0E0E0', backgroundColor: '#F3F3F3', borderBottom: '1px solid #E0E0E0' }}>Avg- 4 stages</td>
                                                </tr>
                                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                                                    const stages = { Monday: '4', Tuesday: '4', Wednesday: '3', Thursday: '4', Friday: '4', Saturday: '3', Sunday: '4' }[day];
                                                    return (
                                                        <tr key={day}>
                                                            <td className='p-1' style={{ color: '#121212', borderBottom: '1px solid #E0E0E0', backgroundColor: '#F9FAFB' }}>{day}</td>
                                                            <td className='p-1' style={{ textAlign: 'right', borderBottom: '1px solid #E0E0E0', borderLeft: '1px solid #E0E0E0', backgroundColor: '#F9FAFB' }}>{stages}</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </Table>
                                    )}
                                </div>
                            </div>
                            )}

                            {/* Duration Card */}
                            {(!expandedCard || expandedCard === 'duration') && (
                            <div style={{ flex: 1, backgroundColor: 'white', border: '1px solid #e9ecef', borderRadius: '8px', minHeight: expandedCard === 'duration' ? '550px' : '245px', transition: 'min-height 0.3s ease' }}>
                                <div className="d-flex align-items-center justify-content-between mb-0 p-2 border-1" style={{ backgroundColor: '#E0ECF8', borderTopLeftRadius: '7px', borderTopRightRadius: '7px' }}>
                                    <div>
                                        <img src={Duration_Icon} alt="duration" className="mx-2" style={{ width: '19px', height: '19px' }} />
                                        <span style={{ fontSize: '12px', fontWeight: '600' }}>Duration</span>
                                    </div>
                                    <div className='d-flex'>
                                        <IoCalendarClearOutline style={{ fontSize: '16px', color: '#003465', marginLeft: '8px' }} />
                                        <IoIosExpand 
                                            style={{ fontSize: '16px', color: '#003465', marginLeft: '6px', cursor: 'pointer' }} 
                                            onClick={() => handleCardExpand('duration')}
                                        />
                                    </div>
                                </div>
                                <div className='p-2 pt-0'>
                                    {expandedCard === 'duration' ? (
                                        <div className='row p-3'>
                                            <div className='col-8 pe-2'>
                                                <div className='border rounded-2' style={{ padding: '10px', backgroundColor: '#F6FAFF', height: '500px' }}>
                                                    <Bar
                                                        data={{
                                                            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                                                            datasets: [{
                                                                data: [8.25, 7.5, 7.75, 6.83, 8.0, 8.5, 7.42],
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
                                                        <p className='fw-bold mb-0' style={{ color: "#003465", fontSize: '14px' }}>Duration Summary</p>
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
                                                        <p className="mb-0" style={{ fontSize: '13px', color: '#666' }}>15 mins away from optimal sleep</p>
                                                    </div>
                                                    <div className="row mb-4">
                                                        <div className="col-6">
                                                            <div className="text-center p-2 rounded" style={{ backgroundColor: 'white' }}>
                                                                <div className="fw-bold" style={{ fontSize: '18px', color: '#003465' }}>7h 45m</div>
                                                                <div style={{ fontSize: '12px', color: '#666' }}>Last Night</div>
                                                            </div>
                                                        </div>
                                                        <div className="col-6">
                                                            <div className="text-center p-2 rounded" style={{ backgroundColor: 'white' }}>
                                                                <div className="fw-bold" style={{ fontSize: '18px', color: '#003465' }}>8h</div>
                                                                <div style={{ fontSize: '12px', color: '#666' }}>Target</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-auto">
                                                        <div className="row">
                                                            <div className="col-12 mb-2">
                                                                <div className="d-flex justify-content-between align-items-center p-2 rounded" style={{ backgroundColor: 'white', fontSize: '12px' }}>
                                                                    <span style={{ color: '#666' }}>Weekly Average</span>
                                                                    <span className="fw-bold" style={{ color: '#003465' }}>7h 46m</span>
                                                                </div>
                                                            </div>
                                                            <div className="col-12">
                                                                <div className="d-flex justify-content-between align-items-center p-2 rounded" style={{ backgroundColor: 'white', fontSize: '12px' }}>
                                                                    <span style={{ color: '#666' }}>Best Night</span>
                                                                    <span className="fw-bold" style={{ color: '#003465' }}>8h 30m</span>
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
                                                    <td className='p-1 text-success' style={{ fontWeight: '600', textAlign: 'right', borderLeft: '1px solid #E0E0E0', backgroundColor: '#F3F3F3', borderBottom: '1px solid #E0E0E0' }}>Avg- 7h 45m</td>
                                                </tr>
                                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                                                    const duration = { Monday: '8h 15m', Tuesday: '7h 30m', Wednesday: '7h 45m', Thursday: '6h 50m', Friday: '8h 00m', Saturday: '8h 30m', Sunday: '7h 25m' }[day];
                                                    const hours = parseFloat(duration.split('h')[0]);
                                                    const colorClass = hours >= 8 ? 'text-success' : hours >= 7 ? 'text-warning' : 'text-danger';
                                                    return (
                                                        <tr key={day}>
                                                            <td className='p-1' style={{ color: '#121212', borderBottom: '1px solid #E0E0E0', backgroundColor: '#F9FAFB' }}>{day}</td>
                                                            <td className={`p-1 ${colorClass}`} style={{ textAlign: 'right', borderBottom: '1px solid #E0E0E0', borderLeft: '1px solid #E0E0E0', backgroundColor: '#F9FAFB' }}>{duration}</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </Table>
                                    )}
                                </div>
                            </div>
                            )}

                            {/* Efficiency Card */}
                            {(!expandedCard || expandedCard === 'efficiency') && (
                            <div style={{ flex: 1, backgroundColor: 'white', border: '1px solid #e9ecef', borderRadius: '8px', minHeight: expandedCard === 'efficiency' ? '550px' : '245px', transition: 'min-height 0.3s ease' }}>
                                <div className="d-flex align-items-center justify-content-between mb-0 p-2 border-1" style={{ backgroundColor: '#E0ECF8', borderTopLeftRadius: '7px', borderTopRightRadius: '7px' }}>
                                    <div>
                                        <img src={Efficiency_Icon} alt="efficiency" className="mx-2" style={{ width: '19px', height: '19px' }} />
                                        <span style={{ fontSize: '12px', fontWeight: '600' }}>Efficiency</span>
                                    </div>
                                    <div className='d-flex'>
                                        <IoCalendarClearOutline style={{ fontSize: '16px', color: '#003465', marginLeft: '8px' }} />
                                        <IoIosExpand 
                                            style={{ fontSize: '16px', color: '#003465', marginLeft: '6px', cursor: 'pointer' }} 
                                            onClick={() => handleCardExpand('efficiency')}
                                        />
                                    </div>
                                </div>
                                <div className='p-2 pt-0'>
                                    {expandedCard === 'efficiency' ? (
                                        <div className='row p-3'>
                                            <div className='col-8 pe-2'>
                                                <div className='border rounded-2' style={{ padding: '10px', backgroundColor: '#F6FAFF', height: '500px' }}>
                                                    <Bar
                                                        data={{
                                                            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                                                            datasets: [{
                                                                data: [89, 85, 91, 82, 88, 90, 84],
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
                                                        <p className='fw-bold mb-0' style={{ color: "#003465", fontSize: '14px' }}>Efficiency Summary</p>
                                                    </div>
                                                    <div className="d-flex justify-content-center mb-4">
                                                        <div className="position-relative" style={{ width: '180px', height: '180px' }}>
                                                            <svg width="180" height="180" className="position-absolute">
                                                                <circle cx="90" cy="90" r="75" fill="none" stroke="#E0ECF8" strokeWidth="12" />
                                                                <circle cx="90" cy="90" r="75" fill="none" stroke="#003465" strokeWidth="10" strokeDasharray="471" strokeDashoffset="61" strokeLinecap="round" transform="rotate(-90 90 90)" />
                                                            </svg>
                                                            <div className="position-absolute top-50 start-50 translate-middle text-center">
                                                                <div className="fw-bold" style={{ fontSize: '24px', color: '#003465' }}>87%</div>
                                                                <div style={{ fontSize: '14px', color: '#003465' }}>Efficient</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-center mb-4">
                                                        <p className="mb-0" style={{ fontSize: '13px', color: '#666' }}>Good sleep efficiency this week</p>
                                                    </div>
                                                    <div className="row mb-4">
                                                        <div className="col-6">
                                                            <div className="text-center p-2 rounded" style={{ backgroundColor: 'white' }}>
                                                                <div className="fw-bold" style={{ fontSize: '18px', color: '#003465' }}>87%</div>
                                                                <div style={{ fontSize: '12px', color: '#666' }}>Last Night</div>
                                                            </div>
                                                        </div>
                                                        <div className="col-6">
                                                            <div className="text-center p-2 rounded" style={{ backgroundColor: 'white' }}>
                                                                <div className="fw-bold" style={{ fontSize: '18px', color: '#003465' }}>85%</div>
                                                                <div style={{ fontSize: '12px', color: '#666' }}>Target</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-auto">
                                                        <div className="row">
                                                            <div className="col-12 mb-2">
                                                                <div className="d-flex justify-content-between align-items-center p-2 rounded" style={{ backgroundColor: 'white', fontSize: '12px' }}>
                                                                    <span style={{ color: '#666' }}>Weekly Average</span>
                                                                    <span className="fw-bold" style={{ color: '#003465' }}>87%</span>
                                                                </div>
                                                            </div>
                                                            <div className="col-12">
                                                                <div className="d-flex justify-content-between align-items-center p-2 rounded" style={{ backgroundColor: 'white', fontSize: '12px' }}>
                                                                    <span style={{ color: '#666' }}>Best Night</span>
                                                                    <span className="fw-bold" style={{ color: '#003465' }}>91%</span>
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
                                                    <td className='p-1' style={{ fontWeight: '600', textAlign: 'right', borderLeft: '1px solid #E0E0E0', backgroundColor: '#F3F3F3', borderBottom: '1px solid #E0E0E0' }}>Avg- 87%</td>
                                                </tr>
                                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                                                    const efficiency = { Monday: '89%', Tuesday: '85%', Wednesday: '91%', Thursday: '82%', Friday: '88%', Saturday: '90%', Sunday: '84%' }[day];
                                                    const effValue = parseInt(efficiency);
                                                    const colorClass = effValue >= 90 ? 'text-success' : effValue >= 80 ? 'text-warning' : 'text-danger';
                                                    return (
                                                        <tr key={day}>
                                                            <td className='p-1' style={{ color: '#121212', borderBottom: '1px solid #E0E0E0', backgroundColor: '#F9FAFB' }}>{day}</td>
                                                            <td className={`p-1 ${colorClass}`} style={{ textAlign: 'right', borderBottom: '1px solid #E0E0E0', borderLeft: '1px solid #E0E0E0', backgroundColor: '#F9FAFB' }}>{efficiency}</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </Table>
                                    )}
                                </div>
                            </div>
                            )}

                            {/* Awakenings Card */}
                            {(!expandedCard || expandedCard === 'awakenings') && (
                            <div style={{ flex: 1, backgroundColor: 'white', border: '1px solid #e9ecef', borderRadius: '8px', minHeight: expandedCard === 'awakenings' ? '550px' : '245px', transition: 'min-height 0.3s ease' }}>
                                <div className="d-flex align-items-center justify-content-between mb-0 p-2 border-1" style={{ backgroundColor: '#E0ECF8', borderTopLeftRadius: '7px', borderTopRightRadius: '7px' }}>
                                    <div>
                                        <img src={Awakenings_Icon} alt="awakenings" className="mx-2" style={{ width: '19px', height: '19px' }} />
                                        <span style={{ fontSize: '12px', fontWeight: '600' }}>Awakenings</span>
                                    </div>
                                    <div className='d-flex'>
                                        <IoCalendarClearOutline style={{ fontSize: '16px', color: '#003465', marginLeft: '8px' }} />
                                        <IoIosExpand 
                                            style={{ fontSize: '16px', color: '#003465', marginLeft: '6px', cursor: 'pointer' }} 
                                            onClick={() => handleCardExpand('awakenings')}
                                        />
                                    </div>
                                </div>
                                <div className='p-2 pt-0'>
                                    {expandedCard === 'awakenings' ? (
                                        <div className='row p-3'>
                                            <div className='col-8 pe-2'>
                                                <div className='border rounded-2' style={{ padding: '10px', backgroundColor: '#F6FAFF', height: '500px' }}>
                                                    <Bar
                                                        data={{
                                                            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                                                            datasets: [{
                                                                data: [2, 3, 1, 4, 2, 2, 2],
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
                                                        <p className='fw-bold mb-0' style={{ color: "#003465", fontSize: '14px' }}>Awakenings Summary</p>
                                                    </div>
                                                    <div className="d-flex justify-content-center mb-4">
                                                        <div className="position-relative" style={{ width: '180px', height: '180px' }}>
                                                            <svg width="180" height="180" className="position-absolute">
                                                                <circle cx="90" cy="90" r="75" fill="none" stroke="#E0ECF8" strokeWidth="12" />
                                                                <circle cx="90" cy="90" r="75" fill="none" stroke="#003465" strokeWidth="10" strokeDasharray="471" strokeDashoffset="235" strokeLinecap="round" transform="rotate(-90 90 90)" />
                                                            </svg>
                                                            <div className="position-absolute top-50 start-50 translate-middle text-center">
                                                                <div className="fw-bold" style={{ fontSize: '24px', color: '#003465' }}>50%</div>
                                                                <div style={{ fontSize: '14px', color: '#003465' }}>Quality</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-center mb-4">
                                                        <p className="mb-0" style={{ fontSize: '13px', color: '#666' }}>Moderate sleep interruptions</p>
                                                    </div>
                                                    <div className="row mb-4">
                                                        <div className="col-6">
                                                            <div className="text-center p-2 rounded" style={{ backgroundColor: 'white' }}>
                                                                <div className="fw-bold" style={{ fontSize: '18px', color: '#003465' }}>2</div>
                                                                <div style={{ fontSize: '12px', color: '#666' }}>Last Night</div>
                                                            </div>
                                                        </div>
                                                        <div className="col-6">
                                                            <div className="text-center p-2 rounded" style={{ backgroundColor: 'white' }}>
                                                                <div className="fw-bold" style={{ fontSize: '18px', color: '#003465' }}>≤1</div>
                                                                <div style={{ fontSize: '12px', color: '#666' }}>Target</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-auto">
                                                        <div className="row">
                                                            <div className="col-12 mb-2">
                                                                <div className="d-flex justify-content-between align-items-center p-2 rounded" style={{ backgroundColor: 'white', fontSize: '12px' }}>
                                                                    <span style={{ color: '#666' }}>Weekly Average</span>
                                                                    <span className="fw-bold" style={{ color: '#003465' }}>2.3</span>
                                                                </div>
                                                            </div>
                                                            <div className="col-12">
                                                                <div className="d-flex justify-content-between align-items-center p-2 rounded" style={{ backgroundColor: 'white', fontSize: '12px' }}>
                                                                    <span style={{ color: '#666' }}>Best Night</span>
                                                                    <span className="fw-bold" style={{ color: '#003465' }}>1</span>
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
                                                    <td className='p-1 text-warning' style={{ fontWeight: '600', textAlign: 'right', borderLeft: '1px solid #E0E0E0', backgroundColor: '#F3F3F3', borderBottom: '1px solid #E0E0E0' }}>Avg- 2.3</td>
                                                </tr>
                                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                                                    const awakenings = { Monday: '2', Tuesday: '3', Wednesday: '1', Thursday: '4', Friday: '2', Saturday: '2', Sunday: '2' }[day];
                                                    const awakValue = parseInt(awakenings);
                                                    const colorClass = awakValue <= 1 ? 'text-success' : awakValue <= 3 ? 'text-warning' : 'text-danger';
                                                    return (
                                                        <tr key={day}>
                                                            <td className='p-1' style={{ color: '#121212', borderBottom: '1px solid #E0E0E0', backgroundColor: '#F9FAFB' }}>{day}</td>
                                                            <td className={`p-1 ${colorClass}`} style={{ textAlign: 'right', borderBottom: '1px solid #E0E0E0', borderLeft: '1px solid #E0E0E0', backgroundColor: '#F9FAFB' }}>{awakenings}</td>
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

export default SleepData