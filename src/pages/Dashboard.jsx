import React from 'react';
import { Card, Row, Col, Table } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import ActiveUsers from '../assets/images/Active Users.png'
import NewSignUps from '../assets/images/New Sign-ups.png'
import AvgDailySteps from '../assets/images/Avg Daily Steps.png'
import AvgRestingHR from '../assets/images/Avg Resting HR.png'
import SleepDuration from '../assets/images/Sleep Duration.png'
import SyncSuccessRate from '../assets/images/Sync Success Rate.png'
import dashboard_bg from '../assets/images/dashboard_bg.png';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Dashboard = () => {
  const stats = [
    { icon: <img src={ActiveUsers} alt="Active Users" style={{ width: '24px', height: '24px' }} />, value: '10k', label: 'Active Users' },
    { icon: <img src={NewSignUps} alt="New Sign-ups" style={{ width: '24px', height: '24px' }} />, value: '200', label: 'New Sign-ups' },
    { icon: <img src={AvgDailySteps} alt="Avg Daily Steps" style={{ width: '24px', height: '24px' }} />, value: '800k', label: 'Avg Daily Steps' },
    { icon: <img src={AvgRestingHR} alt="Avg Resting HR" style={{ width: '24px', height: '24px' }} />, value: '1500k', label: 'Avg Resting HR' },
    { icon: <img src={SleepDuration} alt="Sleep Duration" style={{ width: '24px', height: '24px' }} />, value: '80%', label: 'Sleep Duration' },
    { icon: <img src={SyncSuccessRate} alt="Sync Success Rate" style={{ width: '24px', height: '24px' }} />, value: '98%', label: 'Sync Success Rate' }
  ];

  const recentPatients = [
    { name: 'Darrell Steward', email: 'michelle.rivera@example.com', gender: 'Male', age: 30 },
    { name: 'Albert Flores', email: 'felicia.reid@example.com', gender: 'Female', age: 50 },
    { name: 'Annette Black', email: 'debra.holt@example.com', gender: 'Female', age: 30 },
    { name: 'Esther Howard', email: 'michael.mitc@example.com', gender: 'Male', age: 40 },
    { name: 'Guy Hawkins', email: 'kenzi.lawson@example.com', gender: 'Male', age: 60 },
    { name: 'Savannah Nguyen', email: 'willie.jennings@example.com', gender: 'Male', age: 70 },
    { name: 'Jerome Bell', email: 'dolores.chambers@example.com', gender: 'Male', age: 34 },
    { name: 'Marvin McKinney', email: 'nevaeh.simmons@example.com', gender: 'Male', age: 45 }
  ];

  const recentDoctors = [
    { name: 'Darrell Steward', email: 'michelle.rivera@example.com', gender: 'Male', patients: 30 },
    { name: 'Albert Flores', email: 'felicia.reid@example.com', gender: 'Female', patients: 50 },
    { name: 'Annette Black', email: 'debra.holt@example.com', gender: 'Female', patients: 30 },
    { name: 'Esther Howard', email: 'michael.mitc@example.com', gender: 'Male', patients: 40 },
    { name: 'Guy Hawkins', email: 'kenzi.lawson@example.com', gender: 'Male', patients: 60 },
    { name: 'Savannah Nguyen', email: 'willie.jennings@example.com', gender: 'Male', patients: 70 },
    { name: 'Jerome Bell', email: 'dolores.chambers@example.com', gender: 'Male', patients: 34 },
    { name: 'Marvin McKinney', email: 'nevaeh.simmons@example.com', gender: 'Male', patients: 45 }
  ];

  const chartData = {
    labels: [],
    datasets: [{
      data: [30, 25, 20, 15, 10],
      backgroundColor: ['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'],
      borderWidth: 0
    }]
  };

  const barData = {
    labels: ['', '', '', '', '', '', '', '', '', ''],
    datasets: [{
      data: [80, 65, 75, 40, 70, 85, 90, 55, 75, 80],
      backgroundColor: '#003465',
      borderRadius: 4,
      barThickness: 15
    }]
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: `url(${dashboard_bg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      padding: '15px'
    }}>
      {/* Stats Cards */}
      <Row className="mb-3">
        {stats.map((stat, index) => (
          <Col xl={2} lg={4} md={6} sm={6} key={index} className="mb-2">
            <Card className="border-0 shadow-sm bg-white" style={{ height: '114px' }}>
              <Card.Body className="text-center p-2 ps-3 d-flex justify-content-start align-items-center">
                <div className='d-flex gap-2'>
                  <div className='border border-light p-3 rounded-circle' style={{ background: '#f6faff', width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className='fs-4'>
                      {stat.icon}
                    </span>
                  </div>
                  <div className='text-start mt-2'>
                    <h5 className="mb-0 fw-bold text-secondary" style={{ fontSize: '26px' }}>{stat.value}</h5>
                    <small className="text-secondary fw-medium" style={{ fontSize: '14px' }}>{stat.label}</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Activity Trends */}
      <Row className="mb-3">
        <Col lg={6} className="mb-3">
          <Card className="border-0 shadow-sm bg-white" style={{ height: '388px' }}>
            <Card.Body>
              <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center mb-3">
                <h6 className="mb-2 mb-lg-0 fw-bold" style={{ fontSize: '24px' }}>Activity Trend</h6>
                <div className="d-flex align-items-center gap-1">
                  <div className="d-flex align-items-center gap-2">
                    <span className="text-muted" style={{ fontSize: '14px' }}>From</span>
                    <div className="position-relative">
                      <input
                        type="date"
                        className="form-control"
                        placeholder="Select date"
                        style={{
                          width: '140px',
                          // paddingRight: '35px',
                          // border: '2px solid #007bff',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                      />
                      <i className="fas fa-calendar-alt position-absolute" style={{
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#007bff',
                        pointerEvents: 'none'
                      }}></i>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="text-muted" style={{ fontSize: '14px' }}>To</span>
                    <div className="position-relative">
                      <input
                        type="date"
                        className="form-control"
                        placeholder="Select date"
                        style={{
                          width: '140px',
                          // paddingRight: '35px',
                          border: '1px solid #dee2e6',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                      />
                      <i className="fas fa-calendar-alt position-absolute" style={{
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#6c757d',
                        pointerEvents: 'none'
                      }}></i>
                    </div>
                  </div>
                </div>
              </div>
              <Row className="align-items-center" style={{ height: '280px' }}>
                <Col xs={6} className="d-flex justify-content-center">
                  <div className="position-relative" style={{ width: '250px', height: '250px' }}>
                    {/* Outer ring */}
                    <svg width="250" height="250" className="position-absolute">
                      <circle cx="125" cy="125" r="105" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                      <circle cx="125" cy="125" r="105" fill="none" stroke="#003465" strokeWidth="8" strokeDasharray="659" strokeDashoffset="198" strokeLinecap="round" transform="rotate(-90 125 125)" />
                    </svg>
                    {/* Middle ring */}
                    <svg width="250" height="250" className="position-absolute">
                      <circle cx="125" cy="125" r="87" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                      <circle cx="125" cy="125" r="87" fill="none" stroke="#5882C1" strokeWidth="8" strokeDasharray="546" strokeDashoffset="273" strokeLinecap="round" transform="rotate(-90 125 125)" />
                    </svg>
                    {/* Inner ring */}
                    <svg width="250" height="250" className="position-absolute">
                      <circle cx="125" cy="125" r="69" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                      <circle cx="125" cy="125" r="69" fill="none" stroke="#003465" strokeWidth="8" strokeDasharray="433" strokeDashoffset="130" strokeLinecap="round" transform="rotate(-90 125 125)" />
                    </svg>
                  </div>
                </Col>
                <Col xs={6} className="d-flex justify-content-center align-items-center">
                  <div className="d-flex align-items-center">
                    <div style={{ width: '12px', height: '12px', backgroundColor: '#1e40af', marginRight: '8px', borderRadius: '50%' }}></div>
                    <span style={{ fontSize: '14px' }}>30k Steps</span>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6} className="mb-3">
          <Card className="border-0 shadow-sm bg-white" style={{ height: "388px" }}>
            <Card.Body>
              <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center mb-3">
                <h6 className="mb-2 mb-lg-0 fw-bold" style={{ fontSize: '24px' }}>Activity Trend</h6>
                <div className="d-flex align-items-center gap-1">
                  <div className="d-flex align-items-center gap-2">
                    <span className="text-muted" style={{ fontSize: '14px' }}>From</span>
                    <div className="position-relative">
                      <input
                        type="date"
                        className="form-control"
                        placeholder="Select date"
                        style={{
                          width: '140px',
                          // paddingRight: '35px',
                          // border: '2px solid #007bff',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                      />
                      <i className="fas fa-calendar-alt position-absolute" style={{
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#007bff',
                        pointerEvents: 'none'
                      }}></i>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="text-muted" style={{ fontSize: '14px' }}>To</span>
                    <div className="position-relative">
                      <input
                        type="date"
                        className="form-control"
                        placeholder="Select date"
                        style={{
                          width: '140px',
                          // paddingRight: '35px',
                          border: '1px solid #dee2e6',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                      />
                      <i className="fas fa-calendar-alt position-absolute" style={{
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#6c757d',
                        pointerEvents: 'none'
                      }}></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className='mt-3 px-2' style={{ height: '300px' }}>
                <Bar
                  data={barData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      x: { display: false },
                      y: { display: false }
                    },
                    categoryPercentage: 0.5
                  }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tables */}
      <Row>
        <Col lg={6} className="mb-3">
          <Card className="border-0 shadow-sm" style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0 fw-bold">Recent Patients</h6>
                <a href="#" className="text-primary text-decoration-none">View all →</a>
              </div>
              <Table responsive className="mb-0">
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th className="border-0 py-2">Full Name</th>
                    <th className="border-0 py-2">Email Id</th>
                    <th className="border-0 py-2">Gender</th>
                    <th className="border-0 py-2">Age</th>
                    <th className="border-0 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPatients.map((patient, index) => (
                    <tr key={index}>
                      <td className="border-0 py-2">{patient.name}</td>
                      <td className="border-0 py-2">{patient.email}</td>
                      <td className="border-0 py-2">{patient.gender}</td>
                      <td className="border-0 py-2">{patient.age}</td>
                      <td className="border-0 py-2">⋮</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6} className="mb-3">
          <Card className="border-0 shadow-sm" style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0 fw-bold">Recent Doctor</h6>
                <a href="#" className="text-primary text-decoration-none">View all →</a>
              </div>
              <Table responsive className="mb-0">
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th className="border-0 py-2">Full Name</th>
                    <th className="border-0 py-2">Email Id</th>
                    <th className="border-0 py-2">Gender</th>
                    <th className="border-0 py-2">Total Patients</th>
                    <th className="border-0 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentDoctors.map((doctor, index) => (
                    <tr key={index}>
                      <td className="border-0 py-2">{doctor.name}</td>
                      <td className="border-0 py-2">{doctor.email}</td>
                      <td className="border-0 py-2">{doctor.gender}</td>
                      <td className="border-0 py-2">{doctor.patients}</td>
                      <td className="border-0 py-2">⋮</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;