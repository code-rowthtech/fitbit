import React, { useState, useEffect, useRef } from 'react'
import { Table, Pagination, Form } from 'react-bootstrap'
import { FaEye } from 'react-icons/fa'
import { TbPencilMinus } from "react-icons/tb";
import { FiSearch } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import CreatePatientModal from '../../components/CreatePatientModal'
import UpdatePatientModal from '../../components/UpdatePatientModal'
import { getAllPatients } from '../../redux/actions'
import { useDispatch, useSelector } from 'react-redux'
import { useSidebar } from '../../contexts/SidebarContext'
import { DateRangePicker } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import { MdOutlineCalendarMonth } from "react-icons/md";

const Patients = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { hideSidebar, showSidebar } = useSidebar();
    const Store = useSelector((state) => state)
    const PatientData = Store?.getAllPatients?.message?.patients
    const loading = Store?.getAllPatients?.loading || false
    const CreateResponse = useSelector((state) => state?.createPatientReducer?.data?.status);
    const UpdateResponse = useSelector((state) => state?.updatePatient?.data?.status);
    const userInfo = JSON.parse(localStorage.getItem('user'));
    const UserRole = userInfo?.role;
    console.log(PatientData, 'PatientDataPatientData')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showUpdateModal, setShowUpdateModal] = useState(false)
    const [selectedPatient, setSelectedPatient] = useState(null)
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ])
    const datePickerRef = useRef(null)

    useEffect(() => {
        hideSidebar();
        dispatch(getAllPatients())
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
                setShowDatePicker(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleCreatePatient = () => {
        setShowCreateModal(true)
    }

    useEffect(() => {
        if (CreateResponse === 201 || UpdateResponse === 200) {
            dispatch(getAllPatients())
        }
    }, [CreateResponse, UpdateResponse]);


    const handleViewPatient = (patient) => {
        showSidebar();
        navigate(`/patient-dashboard/${patient._id}`)
    }

    const handleUpdatePatient = (patient) => {
        setSelectedPatient(patient)
        setShowUpdateModal(true)
    }

    const handlePaginationChange = (event, page) => {
        setCurrentPage(page)
    }

    const getStatusBadge = (isActive) => {
        return isActive ? 'badge badge-active' : 'badge bg-secondary-subtle text-secondary'
    }

    return (
        <>
            <style>
                {`.patient-row:hover { background-color: #F9FAFB !important; }`}
            </style>
            <div className='border-0' style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div className='px-4 py-2' style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div className="">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <div>
                                <h4 className='fw-semibold mt-1' style={{ fontSize: '24px' }}>Patients</h4>
                            </div>
                            <div className='d-flex gap-2'>
                                <div ref={datePickerRef} style={{ position: 'relative' }}>
                                    <button
                                        className="form-control border-0 bg-light text-start d-flex justify-content-between align-items-center"
                                        style={{ fontSize: '12px', height: '36px', width: '247px', color: '#003465', backgroundColor: '#F0F3F7' }}
                                        onClick={() => setShowDatePicker(!showDatePicker)}
                                    >
                                        <span>{dateRange[0].startDate.toLocaleDateString()} - {dateRange[0].endDate.toLocaleDateString()}</span>
                                        <MdOutlineCalendarMonth />
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
                                {UserRole === "doctor" ?
                                    <></>
                                    :
                                    <div>
                                        <Form.Select className="mb-0 border-0 bg-light" style={{ fontSize: '12px', height: '36px', width: '247px', color: '#003465', backgroundColor: '#F0F3F7' }}>
                                            <option>Select Doctor</option>
                                        </Form.Select>
                                    </div>
                                }

                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        style={{ padding: '4px 32px 4px 8px', fontSize: '12px', height: '36px', width: '247px', backgroundColor: '#F6F9FF' }}
                                        className='form-control border-0'
                                        placeholder="Search patients..."
                                    />
                                    <FiSearch
                                        style={{
                                            position: 'absolute',
                                            right: '8px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            color: '#6c757d',
                                            fontSize: '18px'
                                        }}
                                    />
                                </div>


                            </div>
                        </div>
                    </div>

                    <div style={{ flex: 1, overflow: 'auto', scrollbarWidth: 'thin', scrollbarColor: '#c1dfe9ff #e6f2f9' }}>
                        {loading ? (
                            <div className="d-flex justify-content-center align-items-center h-100">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : !PatientData || PatientData.length === 0 ? (
                            <div className="d-flex justify-content-center align-items-center h-100">
                                <h5 className="text-muted">No Patients Found</h5>
                            </div>
                        ) : (
                            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <Table className="mb-0 table-sm" style={{ fontSize: '11px', overflow: 'hidden' }}>
                                    <thead className='thead-custom' style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                                        <tr>
                                            <th className='fw-bold py-2 text-start ps-5' style={{ width: '25%', fontSize: '16px' }}>Name</th>
                                            <th className='fw-bold py-2 text-start' style={{ width: '25%', fontSize: '16px' }}>Email</th>
                                            <th className='fw-bold py-2 text-start' style={{ width: '20%', fontSize: '16px' }}>Assigned to</th>
                                            <th className='fw-bold py-2 text-center' style={{ width: '10%', fontSize: '16px' }}>Gender</th>
                                            <th className='fw-bold py-2 text-center' style={{ width: '10%', fontSize: '16px' }}>Status</th>
                                            <th className='fw-bold py-2 text-center' style={{ width: '10%', fontSize: '16px' }}>Actions</th>
                                        </tr>
                                    </thead>
                                </Table>
                                <div style={{ flex: 1, overflowY: 'auto', maxHeight: '80vh' }}>
                                    <Table className="mb-0 table-sm" style={{ fontSize: '11px' }}>
                                        <tbody>
                                            {PatientData?.map((patient) => (
                                                <tr key={patient._id} className="align-middle patient-row" style={{ cursor: 'pointer' }}>
                                                    <td className="text-start ps-3" style={{ fontSize: '14px', width: '25%' }}>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center text-uppercase"
                                                                style={{ width: '32px', height: '32px', fontSize: '14px', color: 'white' }}>
                                                                {patient.firstName?.charAt(0)}{patient.lastName?.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <div className="fw-semibold text-dark text-capitalize" style={{ cursor: 'pointer' }} onClick={() => handleViewPatient(patient)}>
                                                                    {patient.firstName} {patient.lastName}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="text-start" style={{ fontSize: '14px', width: '25%' }}>
                                                        {patient.email}
                                                    </td>
                                                    <td className="text-start" style={{ fontSize: '14px', width: '20%' }}>
                                                        <div className="text-dark text-capitalize" style={{ fontSize: '14px' }}>
                                                            {patient?.doctorId?.firstName && patient?.doctorId?.lastName
                                                                ? `${patient.doctorId.firstName} ${patient.doctorId.lastName}`
                                                                : 'Unassigned'}
                                                        </div>
                                                    </td>
                                                    <td className="text-center" style={{ fontSize: '14px', width: '10%' }}>
                                                        <span className="text-capitalize">{patient.gender || "-"}</span>
                                                    </td>
                                                    <td className="text-center" style={{ width: '10%' }}>
                                                        <span className={`${getStatusBadge(patient.isActive)} text-capitalize`}
                                                            style={{ padding: '6px', fontSize: '14px', width: '3.5vw', height: '30px' }}>
                                                            {patient.isActive ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </td>
                                                    <td className="text-center" style={{ width: '10%' }}>
                                                        <div className="d-flex justify-content-center gap-1">
                                                            <button
                                                                title='View'
                                                                className="btn d-flex align-items-center justify-content-center"
                                                                style={{ padding: '2px 6px', fontSize: '10px', backgroundColor: '#C6E4FF', color: '#003465', height: '30px' }}
                                                                onClick={() => handleViewPatient(patient)}
                                                            >
                                                                <FaEye size={12} />
                                                            </button>
                                                            <button
                                                                title='Update'
                                                                className="btn text-white d-flex align-items-center justify-content-center"
                                                                style={{ padding: '4px 6px', fontSize: '10px', backgroundColor: '#5496D3', height: '30px' }}
                                                                onClick={() => handleUpdatePatient(patient?._id)}
                                                            >
                                                                <TbPencilMinus size={12} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        )}
                    </div>

                    {totalPages > 1 && (
                        <div className="d-flex justify-content-end mt-3 pt-2 border-top">
                            <Pagination
                                page={currentPage}
                                count={totalPages}
                                color="primary"
                                variant="outlined"
                                onChange={handlePaginationChange}
                            />
                        </div>
                    )}
                </div>

                <CreatePatientModal
                    show={showCreateModal}
                    onHide={() => setShowCreateModal(false)}
                />

                <UpdatePatientModal
                    show={showUpdateModal}
                    onHide={() => setShowUpdateModal(false)}
                    patient={selectedPatient}
                />
            </div>
        </>
    )
}

export default Patients