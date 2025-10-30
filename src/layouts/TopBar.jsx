import { Navbar, Nav, Image, Dropdown, Modal, Button } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getMenuItems } from '../components/Routes';
import { IoLogOutOutline, IoPersonOutline } from 'react-icons/io5';
import fitbit_logo from '../assets/images/fitbit logo 2.png'
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/auth/actions';
import { LuCirclePlus } from "react-icons/lu";
import { useEffect, useState } from 'react';
import { getAllPatients, getSingleDoctor } from '../redux/actions';
import CreatePatientModal from '../components/CreatePatientModal';
import UpdateDoctorModal from '../components/UpdateDoctorModal';

const TopBar = () => {
  const location = useLocation();
  const userInfo = JSON.parse(localStorage.getItem('user'));
  const UserName = userInfo?.username
  const UserRole = userInfo?.role
  const DoctorId = userInfo?.id
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const Store = useSelector((state) => state)
  const currentDoctor = Store?.getSingleDoctor?.data?.doctor;
  const UpdateResponse = useSelector(
    (state) => state?.updateDoctor?.data?.status
  );

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showUpdateDoctorModal, setShowUpdateDoctorModal] = useState(false)

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
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    dispatch(logoutUser());
    setShowLogoutModal(false);
  };

  const handleProfileClick = () => {
    dispatch(getSingleDoctor());
    setShowUpdateDoctorModal(true);
  };

  useEffect(() => {
    dispatch(getAllPatients())
    if (UserRole === "doctor") {
      dispatch(getSingleDoctor())
    }
  }, [dispatch, UserRole]);

  useEffect(() => {
    if (UpdateResponse === 200) {
      dispatch(getSingleDoctor());
    }
  }, [UpdateResponse, dispatch]);

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
              src={UserRole === "doctor" && currentDoctor?.profilePhoto ? currentDoctor.profilePhoto : "https://i.pravatar.cc/32"}
              alt="Profile"
              roundedCircle
              width={32}
              height={32}
              className="me-2"
            />
            <span className="me-2 fw-semibold text-secondary text-capitalize" style={{ fontSize: '14px' }}>
              {UserRole === "doctor" && currentDoctor ? `${currentDoctor.firstName} ${currentDoctor.lastName}` : UserName}
            </span>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {UserRole === "doctor" && (
              <Dropdown.Item className="d-flex align-items-center" onClick={handleProfileClick}>
                <IoPersonOutline className="me-2" />
                Profile
              </Dropdown.Item>
            )}
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
      <UpdateDoctorModal
        show={showUpdateDoctorModal}
        onHide={() => setShowUpdateDoctorModal(false)}
        doctor={currentDoctor}
      />

      <Modal
        show={showLogoutModal}
        onHide={() => setShowLogoutModal(false)}
      >
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fs-6 fw-bold">
            Logout Confirmation
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4" style={{ fontSize: '12px' }}>
          <div>
            Are you sure you want to logout?
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button
            variant="secondary"
            className="fw-bold"
            onClick={() => setShowLogoutModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            className="fw-bold"
            onClick={confirmLogout}
            style={{ backgroundColor: '#003465', borderColor: '#003465' }}
          >
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </Navbar>
  );
};

export default TopBar;