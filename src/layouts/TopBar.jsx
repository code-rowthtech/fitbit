import { Navbar, Nav, Image, Dropdown } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getMenuItems } from '../components/Routes';
import { IoLogOutOutline } from 'react-icons/io5';
import fitbit_logo from '../assets/images/fitbit logo 2.png'
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/auth/actions';
import { LuCirclePlus } from "react-icons/lu";
import { useEffect, useState } from 'react';
import { getAllPatients } from '../redux/actions';
import CreatePatientModal from '../components/CreatePatientModal';

const TopBar = () => {
  const location = useLocation();
  const userInfo = JSON.parse(localStorage.getItem('user'));
  const UserName = userInfo?.username
  const UserRole = userInfo?.role
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const Store = useSelector((state) => state)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const handleCreatePatient = () => {
    // This will be handled by the parent component or context
    // const event = new CustomEvent('createPatient');
    // window.dispatchEvent(event);
    setShowCreateModal(true)
  };

  const handleCreateDoctor = () => {
    const event = new CustomEvent('createDoctor');
    window.dispatchEvent(event);
  };

  const handleLogout = () => {
    dispatch(logoutUser());

  };

  useEffect(() => {
    dispatch(getAllPatients())
  }, [dispatch]);

  return (
    <Navbar className="topbar ps-5 pe-3 py-1 d-flex justify-content-between align-items-center position-relative">
      <Image src={fitbit_logo} alt="Fitbit Logo" height={45} />

      {UserRole !== "doctor" && (
        <Nav className="d-flex align-items-center position-absolute" style={{ left: '50%', transform: 'translateX(-50%)' }}>
          {getMenuItems().map((item, index) => {
            const isActive = location.pathname === item.path ||
              (item.label === 'Patients' && (location.pathname === '/patients' || location.pathname.startsWith('/patient-dashboard/')));
            return (
              <Nav.Link
                key={index}
                as={Link}
                to={item.path}
                className="px-4 py-2 text-decoration-none"
                style={{
                  color: isActive ? '#000' : '#6c757d',
                  borderBottom: '2px solid transparent',
                  borderBottomColor: isActive ? '#000' : 'transparent',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                {item.label}
              </Nav.Link>
            );
          })}
        </Nav>
      )}

      <Nav className="d-flex align-items-center py-2 gap-2">
        {(location.pathname === '/patients' || location.pathname.startsWith('/patient-dashboard/')) && (
          <button
            className="button-primary"
            onClick={handleCreatePatient}
          >
            <LuCirclePlus className='fs-6 me-2' />
            Add Patient
          </button>
        )}
        {location.pathname === '/doctors' && (
          <button
            className="button-primary"
            onClick={handleCreateDoctor}
          >
            <LuCirclePlus className='fs-6 me-2' />
            Add Doctor
          </button>
        )}
        <Dropdown>
          <Dropdown.Toggle variant="link" className="d-flex align-items-center p-0 border-0 text-decoration-none">
            <Image
              src="https://i.pravatar.cc/32"
              alt="Profile"
              roundedCircle
              width={32}
              height={32}
              className="me-2"
            />
            <span className="me-2 fw-semibold text-secondary text-capitalize" style={{ fontSize: '14px' }}>{UserName}</span>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item className="d-flex align-items-center" onClick={handleLogout}>
              <IoLogOutOutline className="me-2" />
              Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Nav>
      <CreatePatientModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
      />
    </Navbar>
  );
};

export default TopBar;