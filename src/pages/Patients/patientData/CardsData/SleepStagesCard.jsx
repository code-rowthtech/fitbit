import React from 'react'
import { IoIosExpand } from "react-icons/io"
import { IoChevronBack, IoChevronForward } from "react-icons/io5"
import { Bar } from 'react-chartjs-2'


const SleepStagesCard = ({ 
    patientId, 
    expandedCard, 
    onCardExpand, 
    activeTab, 
    onTabChange, 
    currentDate, 
    onDateChange,
    formatDate 
}) => {
    // Mock data for sleep stages
    const mockData = {
        Day: { labels: ['Today'], data: [4], tableData: [{ period: 'Today', value: '4 stages' }] },
        Week: { 
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], 
            data: [4, 4, 3, 4, 4, 3, 4],
            tableData: [
                { period: 'Monday', value: '4 stages' },
                { period: 'Tuesday', value: '4 stages' },
                { period: 'Wednesday', value: '3 stages' },
                { period: 'Thursday', value: '4 stages' },
                { period: 'Friday', value: '4 stages' },
                { period: 'Saturday', value: '3 stages' },
                { period: 'Sunday', value: '4 stages' }
            ]
        },
        Month: { labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], data: [3.8, 4, 3.5, 3.9], tableData: [
            { period: 'Week 1', value: '3.8 avg' },
            { period: 'Week 2', value: '4.0 avg' },
            { period: 'Week 3', value: '3.5 avg' },
            { period: 'Week 4', value: '3.9 avg' }
        ]},
        Year: { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], data: [3.7, 3.9, 4.1, 3.8, 4.0, 3.6], tableData: [
            { period: 'January', value: '3.7 avg' },
            { period: 'February', value: '3.9 avg' },
            { period: 'March', value: '4.1 avg' },
            { period: 'April', value: '3.8 avg' },
            { period: 'May', value: '4.0 avg' },
            { period: 'June', value: '3.6 avg' }
        ]}
    }

    const chartData = mockData[activeTab] || mockData.Week

    // Get navigation label based on active tab
    const getNavigationLabel = () => {
        const date = new Date(currentDate)

        switch (activeTab) {
            case 'Day':
                return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
            case 'Week':
                const startOfWeek = new Date(date)
                startOfWeek.setDate(date.getDate() - date.getDay())
                const endOfWeek = new Date(startOfWeek)
                endOfWeek.setDate(startOfWeek.getDate() + 6)
                return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
            case 'Month':
                return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
            case 'Year':
                return date.getFullYear().toString()
            default:
                return 'Current Period'
        }
    }

    // Check if next navigation would go to future
    const isNextDisabled = () => {
        const today = new Date()
        const testDate = new Date(currentDate)

        switch (activeTab) {
            case 'Day':
                testDate.setDate(testDate.getDate() + 1)
                return testDate > today
            case 'Week':
                testDate.setDate(testDate.getDate() + 7)
                return testDate > today
            case 'Month':
                testDate.setMonth(testDate.getMonth() + 1)
                return testDate > today
            case 'Year':
                testDate.setFullYear(testDate.getFullYear() + 1)
                return testDate > today
            default:
                return false
        }
    }

    // Handle navigation
    const handleNavigation = (direction) => {
        if (direction === 'next' && isNextDisabled()) return

        const newDate = new Date(currentDate)

        switch (activeTab) {
            case 'Day':
                newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1))
                break
            case 'Week':
                newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7))
                break
            case 'Month':
                newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1))
                break
            case 'Year':
                newDate.setFullYear(newDate.getFullYear() + (direction === 'next' ? 1 : -1))
                break
        }

        onDateChange(newDate)
    }

    // Handle tab change
    const handleTabChange = (tab) => {
        onTabChange(tab)
    }

    return (
        <div style={{ flex: 1, backgroundColor: 'white', border: '1px solid #e9ecef', borderRadius: '8px', minHeight: expandedCard === 'sleepStages' ? '550px' : '245px', transition: 'min-height 0.3s ease' }}>
            <div className="d-flex align-items-center justify-content-between mb-0 p-2 border-1" style={{ backgroundColor: '#E0ECF8', borderTopLeftRadius: '7px', borderTopRightRadius: '7px' }}>
                <div>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#003465', marginLeft: '8px' }}>Sleep Stages</span>
                </div>
                <div className='d-flex'>
                    <IoIosExpand
                        style={{ fontSize: '16px', color: '#003465', marginLeft: '6px', cursor: 'pointer' }}
                        onClick={() => onCardExpand('sleepStages')}
                    />
                </div>
            </div>
            <div className='p-1 pt-0'>
                {expandedCard === 'sleepStages' ? (
                    <div className='row p-3'>
                        <div className='col-8 pe-2'>
                            <div className='border rounded-2' style={{ padding: '10px', backgroundColor: '#F6FAFF', height: '500px' }}>
                                <Bar
                                    data={{
                                        labels: chartData.labels,
                                        datasets: [{
                                            data: chartData.data,
                                            backgroundColor: '#003465',
                                            borderRadius: 3,
                                            barThickness: 15
                                        }]
                                    }}
                                    options={{
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: { display: false }
                                        },
                                        scales: {
                                            x: {
                                                grid: { display: false },
                                                ticks: { color: '#666', fontSize: 10 }
                                            },
                                            y: {
                                                beginAtZero: true,
                                                max: 5,
                                                grid: { color: '#f0f0f0' },
                                                ticks: { color: '#666', fontSize: 10 }
                                            }
                                        },
                                        categoryPercentage: 0.6
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
                                                e.target.style.backgroundColor = '#E8F2FF'
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (tab !== activeTab) {
                                                e.target.style.backgroundColor = 'transparent'
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
                                <span style={{ color: '#003465' }}>4 stages</span>
                            </div>

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
                    <div className='rounded-3 px-2 mt-1 d-flex flex-column' style={{ backgroundColor: '#F8FBFF', height: '200px' }}>
                        <div className="d-flex justify-content-center mb-2">
                            <div className="position-relative" style={{ width: '120px', height: '120px' }}>
                                <svg width="120" height="120" className="position-absolute">
                                    <circle cx="60" cy="60" r="48" fill="none" stroke="#E8F2FF" strokeWidth="6" />
                                    <circle cx="60" cy="60" r="48" fill="none" stroke="#003465" strokeWidth="4" strokeDasharray="301" strokeDashoffset={301 - (4/4 * 301)} strokeLinecap="round" transform="rotate(-90 60 60)" />
                                </svg>
                                <div className="position-absolute top-50 start-50 translate-middle text-center">
                                    <div className="fw-bold" style={{ fontSize: '16px', color: '#003465' }}>100%</div>
                                    <div style={{ fontSize: '9px', color: '#666', fontWeight: '500' }}>Complete</div>
                                </div>
                            </div>
                        </div>

                        <div className="text-center mb-2">
                            <p className="mb-0" style={{ fontSize: '10px', color: '#666', fontWeight: '500' }}>Optimal sleep stages achieved</p>
                        </div>

                        <div className="row g-1">
                            <div className="col-6">
                                <div className="text-center py-1 px-2 rounded-2" style={{ backgroundColor: 'white', border: '1px solid #E8F2FF' }}>
                                    <div className="fw-bold" style={{ fontSize: '14px', color: '#003465' }}>4</div>
                                    <div style={{ fontSize: '9px', color: '#666', fontWeight: '500' }}>Today</div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="text-center py-1 px-2 rounded-2" style={{ backgroundColor: 'white', border: '1px solid #E8F2FF' }}>
                                    <div className="fw-bold" style={{ fontSize: '14px', color: '#003465' }}>4</div>
                                    <div style={{ fontSize: '9px', color: '#666', fontWeight: '500' }}>Goal</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SleepStagesCard