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
import { IoChevronDown, IoChevronUp, IoChevronBack, IoChevronForward } from "react-icons/io5";
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
import { getFilterData, getPatientActivity } from '../../../redux/patientsDashboard/action'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useSearchParams } from 'react-router-dom'
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
    // const ActivityData = useSelector((state) => state?.getPatientActivity?.data?.data?.activity);
    const FilterData = useSelector((state) => state?.getFilterData?.data?.response?.data);
    const StepsStatsData = useSelector((state) => state?.getFilterData?.data?.response?.targetRange);
    const AverageData = useSelector((state) => state?.getFilterData?.data?.response);

    console.log(AverageData, 'AverageData')
    console.log(StepsStatsData, 'StepsStatsData')

    // Process FilterData for steps
    const getStepsData = () => {
        if (!FilterData) return { labels: [], values: [], tableData: [] };

        const data = FilterData.slice(0, 7); // Limit to 7 days
        const labels = data.map(item => {
            const date = new Date(item.date);
            return date.toLocaleDateString('en-US', { weekday: 'short' });
        });
        const values = data.map(item => item.value);
        const tableData = data.map(item => ({
            day: new Date(item.date).toLocaleDateString('en-US', { weekday: 'long' }),
            value: item.value ? item.value.toLocaleString() : '0'
        }));

        return { labels, values, tableData };
    };

    const stepsData = getStepsData();

    // Get chart data based on active tab and API response
    const getChartData = () => {
        if (!FilterData || FilterData.length === 0) {
            return { labels: [], data: [], tableData: [] };
        }

        const apiData = FilterData;

        const labels = apiData.map(item => {
            // Handle special format for Month tab (e.g., "2025-08 Week 34")
            if (activeTab === 'Month' && item.date.includes('Week')) {
                const weekMatch = item.date.match(/Week (\d+)/);
                return weekMatch ? `Week ${weekMatch[1]}` : item.date;
            }

            const date = new Date(item.date);
            switch (activeTab) {
                case 'Day':
                    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                case 'Week':
                    return date.toLocaleDateString('en-US', { weekday: 'short' });
                case 'Month':
                    return date.toLocaleDateString('en-US', { day: 'numeric' });
                case 'Year':
                    return date.toLocaleDateString('en-US', { month: 'short' });
                default:
                    return date.toLocaleDateString();
            }
        });

        const data = apiData.map(item => item.value);

        const tableData = apiData.map(item => {
            let period;

            // Handle special format for Month tab (e.g., "2025-08 Week 34")
            if (activeTab === 'Month' && item.date.includes('Week')) {
                const weekMatch = item.date.match(/Week (\d+)/);
                period = weekMatch ? `Week ${weekMatch[1]}` : item.date;
            } else {
                const date = new Date(item.date);
                switch (activeTab) {
                    case 'Day':
                        period = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
                        break;
                    case 'Week':
                        period = date.toLocaleDateString('en-US', { weekday: 'long' });
                        break;
                    case 'Month':
                        period = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                        break;
                    case 'Year':
                        period = date.toLocaleDateString('en-US', { month: 'long' });
                        break;
                    default:
                        period = date.toLocaleDateString();
                }
            }

            return {
                period,
                value: item.value ? item.value.toLocaleString() : '0'
            };
        });

        return { labels, data, tableData };
    };

    const chartData = getChartData();
    console.log(chartData, 'chartData');

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

    // Fetch data based on current tab and date
    const fetchTabData = () => {
        if (patientId) {
            const { start, end } = getDateRange();
            dispatch(getFilterData({
                patientId: patientId,
                start: formatDate(start),
                end: formatDate(end),
                field: "steps"
            }));
        }
    };

    // Get navigation label based on active tab
    const getNavigationLabel = () => {
        const date = new Date(currentDate);

        switch (activeTab) {
            case 'Day':
                return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
            case 'Week':
                const startOfWeek = new Date(date);
                startOfWeek.setDate(date.getDate() - date.getDay());
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6);
                return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
            case 'Month':
                return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            case 'Year':
                return date.getFullYear().toString();
            default:
                return 'Current Period';
        }
    };

    // Check if next navigation would go to future
    const isNextDisabled = () => {
        const today = new Date();
        const testDate = new Date(currentDate);

        switch (activeTab) {
            case 'Day':
                testDate.setDate(testDate.getDate() + 1);
                return testDate > today;
            case 'Week':
                testDate.setDate(testDate.getDate() + 7);
                return testDate > today;
            case 'Month':
                testDate.setMonth(testDate.getMonth() + 1);
                return testDate > today;
            case 'Year':
                testDate.setFullYear(testDate.getFullYear() + 1);
                return testDate > today;
            default:
                return false;
        }
    };

    // Handle navigation
    const handleNavigation = (direction) => {
        if (direction === 'next' && isNextDisabled()) return;

        const newDate = new Date(currentDate);

        switch (activeTab) {
            case 'Day':
                newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
                break;
            case 'Week':
                newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
                break;
            case 'Month':
                newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
                break;
            case 'Year':
                newDate.setFullYear(newDate.getFullYear() + (direction === 'next' ? 1 : -1));
                break;
        }

        setCurrentDate(newDate);

        // Calculate new date range based on the new current date
        let start, end;
        switch (activeTab) {
            case 'Day':
                start = end = new Date(newDate);
                break;
            case 'Week':
                start = new Date(newDate);
                start.setDate(newDate.getDate() - newDate.getDay());
                end = new Date(start);
                end.setDate(start.getDate() + 6);
                break;
            case 'Month':
                start = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
                end = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0);
                break;
            case 'Year':
                start = new Date(newDate.getFullYear(), 0, 1);
                end = new Date(newDate.getFullYear(), 11, 31);
                break;
        }

        // Update dateRange to match navigation
        setDateRange([{
            startDate: start,
            endDate: end,
            key: 'selection'
        }]);


        // Fetch new data after navigation
        setTimeout(() => {
            if (patientId) {
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
        }, 0);
    };

    // Handle tab change
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        // Fetch data for new tab
        setTimeout(() => {
            if (patientId) {
                const date = new Date(currentDate);
                let start, end;

                switch (tab) {
                    case 'Day':
                        start = end = new Date(date);
                        break;
                    case 'Week':
                        start = new Date(date);
                        start.setDate(date.getDate() - date.getDay());
                        end = new Date(start);
                        end.setDate(start.getDate() + 6);
                        break;
                    case 'Month':
                        start = new Date(date.getFullYear(), date.getMonth(), 1);
                        end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                        break;
                    case 'Year':
                        start = new Date(date.getFullYear(), 0, 1);
                        end = new Date(date.getFullYear(), 11, 31);
                        break;
                }

                // Update dateRange to match tab change
                setDateRange([{
                    startDate: start,
                    endDate: end,
                    key: 'selection'
                }]);

                const payload = {
                    patientId: patientId,
                    start: formatDate(start),
                    end: formatDate(end),
                    field: "steps"
                };
                if (tab === 'Month') payload.period = 'month';
                if (tab === 'Year') payload.period = 'year';
                dispatch(getFilterData(payload));
            }
        }, 0);
    };

    // useEffect(() => {
    //     if (patientId) {
    //         dispatch(getPatientActivity({ id: patientId }))
    //     }
    // }, [patientId]);

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
                                <div style={{ flex: 1, backgroundColor: 'white', border: '1px solid #e9ecef', borderRadius: '8px', minHeight: expandedCard === 'steps' ? '550px' : '245px', transition: 'min-height 0.3s ease' }}>
                                    <div className="d-flex align-items-center justify-content-between mb-0 p-2 border-1" style={{ backgroundColor: '#E0ECF8', borderTopLeftRadius: '7px', borderTopRightRadius: '7px' }}>
                                        <div>
                                            <img src={Steps_Icon} alt="Steps" className="mx-2" style={{ width: '19px', height: '19px' }} />
                                            <span style={{ fontSize: '12px', fontWeight: '600', color: '#003465' }}>Steps</span>
                                        </div>
                                        <div className='d-flex'>
                                            {/* <IoCalendarClearOutline style={{ fontSize: '16px', color: '#003465', marginLeft: '8px' }} /> */}
                                            <IoIosExpand
                                                style={{ fontSize: '16px', color: '#003465', marginLeft: '6px', cursor: 'pointer' }}
                                                onClick={() => handleCardExpand('steps')}
                                            />
                                        </div>
                                    </div>
                                    <div className='p-1 pt-0'>
                                        {expandedCard === 'steps' ? (
                                            <div className='row p-3'>
                                                <div className='col-8 pe-2'>
                                                    <div className='border rounded-2' style={{ padding: '10px', backgroundColor: '#F6FAFF', height: '500px' }}>

                                                        <Bar
                                                            key={`chart-${activeTab}-${chartData.data.length}`}
                                                            data={{
                                                                labels: chartData.labels,
                                                                datasets: [{
                                                                    data: chartData.data,
                                                                    backgroundColor: '#003465',
                                                                    borderRadius: 3,
                                                                    barThickness: 35
                                                                }]
                                                            }}
                                                            options={{
                                                                maintainAspectRatio: false,
                                                                plugins: {
                                                                    legend: { display: false },
                                                                    tooltip: {
                                                                        callbacks: {
                                                                            afterBody: activeTab === 'Week' && StepsStatsData ? () => [
                                                                                `Min: ${parseInt(StepsStatsData.min)}`,
                                                                                `Max: ${parseInt(StepsStatsData.max)}`
                                                                            ] : undefined
                                                                        }
                                                                    }
                                                                },
                                                                scales: {
                                                                    x: {
                                                                        grid: { display: false },
                                                                        ticks: { color: '#666', fontSize: 10 }
                                                                    },
                                                                    y: {
                                                                        beginAtZero: true,
                                                                        min: activeTab === 'Week' && StepsStatsData ? Math.min(0, parseInt(StepsStatsData.min) - 500) : 0,
                                                                        max: activeTab === 'Week' && StepsStatsData ? Math.max(...chartData.data, parseInt(StepsStatsData.max) + 500) : undefined,
                                                                        grid: { color: '#f0f0f0' },
                                                                        ticks: { color: '#666', fontSize: 10 }
                                                                    }
                                                                },
                                                                categoryPercentage: 0.6,
                                                                onHover: activeTab === 'Week' && StepsStatsData ? (event, elements, chart) => {
                                                                    const ctx = chart.ctx;
                                                                    const chartArea = chart.chartArea;
                                                                    
                                                                    if (chartArea) {
                                                                        const yScale = chart.scales.y;
                                                                        const minY = yScale.getPixelForValue(parseInt(StepsStatsData.min));
                                                                        const maxY = yScale.getPixelForValue(parseInt(StepsStatsData.max));
                                                                        
                                                                        // Draw min line
                                                                        ctx.save();
                                                                        ctx.strokeStyle = '#ff6b6b';
                                                                        ctx.lineWidth = 1;
                                                                        ctx.setLineDash([5, 5]);
                                                                        ctx.beginPath();
                                                                        ctx.moveTo(chartArea.left, minY);
                                                                        ctx.lineTo(chartArea.right, minY);
                                                                        ctx.stroke();
                                                                        
                                                                        // Draw max line
                                                                        ctx.strokeStyle = '#51cf66';
                                                                        ctx.beginPath();
                                                                        ctx.moveTo(chartArea.left, maxY);
                                                                        ctx.lineTo(chartArea.right, maxY);
                                                                        ctx.stroke();
                                                                        ctx.restore();
                                                                    }
                                                                } : undefined
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='col-4 ps-2 border rounded-2' style={{ backgroundColor: '#F8FBFF' }}>
                                                    {/* Tabs Row */}
                                                    <div className='d-flex justify-content-center my-3 p-0 rounded-pill' style={{ backgroundColor: '#F0F7FF', gap: '4px' }}>
                                                        {['Day', 'Week', 'Month', 'Year'].map((tab, index) => (
                                                            <div
                                                                key={index}
                                                                className='px-3 py-2 rounded-pill text-center flex-fill'
                                                                style={{
                                                                    backgroundColor: tab === activeTab ? '#003465' : 'transparent',
                                                                    color: tab === activeTab ? 'white' : '#003465',
                                                                    cursor: 'pointer',
                                                                    fontSize: '11px',
                                                                    fontWeight: '500',
                                                                    transition: 'all 0.2s ease',
                                                                    border: 'none',
                                                                    minWidth: '45px'
                                                                }}
                                                                onClick={() => handleTabChange(tab)}
                                                                onMouseEnter={(e) => {
                                                                    if (tab !== activeTab) {
                                                                        e.target.style.backgroundColor = '#E8F2FF';
                                                                    }
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    if (tab !== activeTab) {
                                                                        e.target.style.backgroundColor = 'transparent';
                                                                    }
                                                                }}
                                                            >
                                                                {tab}
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Date Navigation Row */}
                                                    <div className='d-flex align-items-center justify-content-between mb-2 p-2' style={{ backgroundColor: '#E8F2FF', borderRadius: '4px' }}>
                                                        <button
                                                            className='btn p-1 d-flex align-items-center justify-content-center'
                                                            style={{
                                                                width: '24px',
                                                                height: '24px',
                                                                backgroundColor: 'white',
                                                                border: '1px solid #003465',
                                                                borderRadius: '4px',
                                                                color: '#003465'
                                                            }}
                                                            onClick={() => handleNavigation('prev')}
                                                        >
                                                            <IoChevronBack style={{ fontSize: '12px' }} />
                                                        </button>
                                                        <span style={{ fontSize: '11px', fontWeight: '600', color: '#003465' }}>
                                                            {getNavigationLabel()}
                                                        </span>
                                                        <button
                                                            className='btn p-1 d-flex align-items-center justify-content-center'
                                                            style={{
                                                                width: '24px',
                                                                height: '24px',
                                                                backgroundColor: isNextDisabled() ? '#f5f5f5' : 'white',
                                                                border: `1px solid ${isNextDisabled() ? '#ccc' : '#003465'}`,
                                                                borderRadius: '4px',
                                                                color: isNextDisabled() ? '#ccc' : '#003465',
                                                                cursor: isNextDisabled() ? 'not-allowed' : 'pointer'
                                                            }}
                                                            onClick={() => handleNavigation('next')}
                                                            disabled={isNextDisabled()}
                                                        >
                                                            <IoChevronForward style={{ fontSize: '12px' }} />
                                                        </button>
                                                    </div>

                                                    {/* Average Row */}
                                                    <div className='d-flex justify-content-between p-2 mb-1' style={{ backgroundColor: '#E8F2FF', fontSize: '10px', fontWeight: '600' }}>
                                                        <span style={{ color: '#003465' }}>Average</span>
                                                        <span style={{ color: '#003465' }}>{AverageData?.stats?.average}</span>
                                                    </div>

                                                    {/* Min/Max Rows - Only show in Week tab */}
                                                    {activeTab === 'Week' && StepsStatsData && (
                                                        <>
                                                            <div className='d-flex justify-content-between p-2 mb-1' style={{ backgroundColor: '#FFE8E8', fontSize: '10px', fontWeight: '600' }}>
                                                                <span style={{ color: '#ff6b6b' }}>Min</span>
                                                                <span style={{ color: '#ff6b6b' }}>{StepsStatsData.min}</span>
                                                            </div>
                                                            <div className='d-flex justify-content-between p-2 mb-1' style={{ backgroundColor: '#E8F8E8', fontSize: '10px', fontWeight: '600' }}>
                                                                <span style={{ color: '#51cf66' }}>Max</span>
                                                                <span style={{ color: '#51cf66' }}>{StepsStatsData.max}</span>
                                                            </div>
                                                        </>
                                                    )}

                                                    {/* Data Rows */}
                                                    <div style={{
                                                        maxHeight: '340px',
                                                        overflowY: 'auto',
                                                        paddingRight: '4px',
                                                        scrollbarWidth: 'thin',
                                                        scrollbarColor: '#003465 #E8F2FF'
                                                    }} className='custom-scroll'>
                                                        {chartData.tableData.length > 0 ? (
                                                            chartData.tableData.map((item, index) => (
                                                                <div key={`${activeTab}-${item.period}-${index}`} className='d-flex justify-content-between p-2 mb-1' style={{ backgroundColor: 'white', fontSize: '10px', borderRadius: '2px', border: '1px solid #E8F2FF' }}>
                                                                    <span style={{ color: '#003465' }}>{item.period}</span>
                                                                    <span style={{ color: '#003465' }}>{item.value}</span>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className='d-flex justify-content-center align-items-center p-4' style={{ color: '#666', fontSize: '12px' }}>
                                                                Data not found
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (

                                            <div className=' rounded-3 px-2 mt-1 d-flex flex-column' style={{ backgroundColor: '#F8FBFF', height: '200px' }}>
                                                <div className="d-flex justify-content-center mb-2">
                                                    <div className="position-relative" style={{ width: '120px', height: '120px' }}>
                                                        <svg width="120" height="120" className="position-absolute">
                                                            <circle cx="60" cy="60" r="48" fill="none" stroke="#E8F2FF" strokeWidth="6" />
                                                            <circle cx="60" cy="60" r="48" fill="none" stroke="#003465" strokeWidth="4" strokeDasharray="301" strokeDashoffset={301 - (((AverageData?.todayData?.value || 0) / (AverageData?.goals?.steps || 1)) * 301)} strokeLinecap="round" transform="rotate(-90 60 60)" />
                                                        </svg>
                                                        <div className="position-absolute top-50 start-50 translate-middle text-center">
                                                            <div className="fw-bold" style={{ fontSize: '16px', color: '#003465' }}>{Math.round(((AverageData?.todayData?.value || 0) / (AverageData?.goals?.steps || 1)) * 100)}%</div>
                                                            <div style={{ fontSize: '9px', color: '#666', fontWeight: '500' }}>Complete</div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="text-center mb-2">
                                                    <p className="mb-0" style={{ fontSize: '10px', color: '#666', fontWeight: '500' }}>{Math.max(0, (AverageData?.goals?.steps || 0) - (AverageData?.todayData?.value || 0))} steps to reach daily goal</p>
                                                </div>

                                                <div className="row g-1 ">
                                                    <div className="col-6">
                                                        <div className="text-center py-1 px-2 rounded-2" style={{ backgroundColor: 'white', border: '1px solid #E8F2FF' }}>
                                                            <div className="fw-bold" style={{ fontSize: '14px', color: '#003465' }}>{AverageData?.todayData?.value || '-'}</div>
                                                            <div style={{ fontSize: '9px', color: '#666', fontWeight: '500' }}>Today</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-6">
                                                        <div className="text-center py-1 px-2 rounded-2" style={{ backgroundColor: 'white', border: '1px solid #E8F2FF' }}>
                                                            <div className="fw-bold" style={{ fontSize: '14px', color: '#003465' }}>{AverageData?.goals?.steps}</div>
                                                            <div style={{ fontSize: '9px', color: '#666', fontWeight: '500' }}>Goal</div>
                                                        </div>
                                                    </div>
                                                </div>


                                            </div>
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
                                    <div className='p-1 pt-0'>
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
                                    <div className='p-1 pt-0'>
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