import React, { useState, useEffect, useRef } from 'react'
import { Table, Pagination, Form, Modal, Button, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { TbPencilMinus } from "react-icons/tb";
import { FiSearch, FiFilter } from 'react-icons/fi'
import CreateDoctorModal from '../../components/CreateDoctorModal'
import UpdateDoctorModal from '../../components/UpdateDoctorModal'
import { getAllDoctors, updateDoctor } from '../../redux/actions'
import { useDispatch, useSelector } from 'react-redux'

const Doctors = () => {
    const dispatch = useDispatch();
    const Store = useSelector((state) => state)
    const DoctorCount = Store?.getAllDoctors?.data;
    console.log(DoctorCount,'DoctorCount')
    const DoctorData = Store?.getAllDoctors?.data?.doctors
    const loading = Store?.getAllDoctors?.loading || false
    const CreateResponse = useSelector((state) => state?.createDoctorReducer?.data?.status);
    const UpdateResponse = useSelector((state) => state?.updateDoctor?.data?.status);
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showUpdateModal, setShowUpdateModal] = useState(false)
    const [selectedDoctor, setSelectedDoctor] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('active')
    const [showStatusFilter, setShowStatusFilter] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [selectedDoctorForToggle, setSelectedDoctorForToggle] = useState(null)
    const statusFilterRef = useRef(null)

    useEffect(() => {
        const params = { page: currentPage, limit: 20 };
        if (searchTerm) params.search = searchTerm;
        if (statusFilter) params.isActive = statusFilter === 'active';
        dispatch(getAllDoctors(params))
    }, [currentPage, searchTerm, statusFilter]);

    useEffect(() => {
        if (DoctorCount) {
            setTotalPages(DoctorCount.totalPages || 1)
        }
    }, [DoctorCount]);

    useEffect(() => {
        const handleCreateDoctorEvent = () => {
            setShowCreateModal(true);
        };
        
        window.addEventListener('createDoctor', handleCreateDoctorEvent);
        
        return () => {
            window.removeEventListener('createDoctor', handleCreateDoctorEvent);
        };
    }, []);

    const handleCreateDoctor = () => {
        setShowCreateModal(true)
    }

    useEffect(() => {
        if (CreateResponse === 201 || UpdateResponse === 200) {
            const params = { page: currentPage, limit: 20 };
            if (searchTerm) params.search = searchTerm;
            if (statusFilter) params.isActive = statusFilter === 'active';
            dispatch(getAllDoctors(params))
        }
    }, [CreateResponse, UpdateResponse, currentPage, searchTerm, statusFilter]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (statusFilterRef.current && !statusFilterRef.current.contains(event.target)) {
                setShowStatusFilter(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleUpdateDoctor = (doctor) => {
        setSelectedDoctor(doctor)
        setShowUpdateModal(true)
    }

    const handlePaginationChange = (page) => {
        setCurrentPage(page)
    }

    const getStatusBadge = (isActive) => {
        return isActive ? 'badge badge-active' : 'badge bg-secondary-subtle text-secondary'
    }

    const handleStatusToggle = (doctor) => {
        setSelectedDoctorForToggle(doctor)
        setShowConfirmModal(true)
    }

    const confirmStatusToggle = () => {
        const updatedData = {
            doctorId: selectedDoctorForToggle._id,
            body: {
                isActive: !selectedDoctorForToggle.isActive
            }
        }
        dispatch(updateDoctor(updatedData))
        setShowConfirmModal(false)
        setSelectedDoctorForToggle(null)
    }

    return (
        <>
            <style>
                {`
                .custom-pagination .page-link {
                    color: #003465;
                    border: 1px solid #e9ecef;
                    padding: 5px 10px;
                    margin: 0 3px;
                    border-radius: 6px;
                    font-weight: 500;
                    transition: all 0.2s ease;
                }
                .custom-pagination .page-link:hover {
                    background-color: #f8f9fa;
                    border-color: #003465;
                    color: #003465;
                }
                .custom-pagination .page-item.active .page-link {
                    background-color: #003465;
                    border-color: #003465;
                    color: white;
                }
                .custom-pagination .page-item.disabled .page-link {
                    color: #6c757d;
                    background-color: #fff;
                    border-color: #dee2e6;
                }
                .form-check-input:checked {
                    background-color: #003465;
                    border-color: #003465;
                }
                .form-check-input:focus {
                    border-color: #003465;
                    box-shadow: 0 0 0 0.25rem rgba(0, 52, 101, 0.25);
                }
                `}
            </style>
            <div className='border-0' style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className='px-4 py-2' style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div className="">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className='d-flex gap-3 align-items-center'>
                            <h4 className='fw-bold mb-0' style={{ color:'#003465', letterSpacing: '-0.5px' }}>Doctors</h4>
                            <span className='badge text-white rounded-2 px-2 py-1' style={{backgroundColor:'#003465', fontSize:'14px', fontWeight: '600'}}>{DoctorCount?.totalDoctors || 0}</span>
                        </div>
                        <div className='d-flex gap-2'>
                            <div ref={statusFilterRef} style={{ position: 'relative' }}>
                                <button
                                    className="form-control border-0 bg-light text-start d-flex justify-content-between align-items-center"
                                    style={{ fontSize: '12px', height: '36px', width: '120px', color: '#003465', backgroundColor: '#F0F3F7' }}
                                    onClick={() => setShowStatusFilter(!showStatusFilter)}
                                >
                                    <span className="text-capitalize">{statusFilter}</span>
                                    <FiFilter />
                                </button>
                                {showStatusFilter && (
                                    <div style={{ position: 'absolute', top: '40px', zIndex: 1000, backgroundColor: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', borderRadius: '6px', minWidth: '120px' }}>
                                        <div 
                                            className="px-3 py-2 text-start" 
                                            style={{ cursor: 'pointer', fontSize: '12px', borderBottom: '1px solid #eee' }}
                                            onClick={() => { setStatusFilter('active'); setShowStatusFilter(false); }}
                                        >
                                            Active
                                        </div>
                                        <div 
                                            className="px-3 py-2 text-start" 
                                            style={{ cursor: 'pointer', fontSize: '12px' }}
                                            onClick={() => { setStatusFilter('inactive'); setShowStatusFilter(false); }}
                                        >
                                            Inactive
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ padding: '4px 32px 4px 8px', fontSize: '12px', height: '36px', width: '247px', backgroundColor:'#F6F9FF' }}
                                    className='form-control border-0'
                                    placeholder="Search doctors..."
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
                    ) : !DoctorData || DoctorData.length === 0 ? (
                        <div className="d-flex justify-content-center align-items-center h-100">
                            <h5 className="text-muted">No Doctors Found</h5>
                        </div>
                    ) : (
                        <div style={{ height: '100%', overflowY: 'auto', maxHeight: '76vh' }}>
                            <Table className="mb-0 table-sm" style={{ fontSize: '11px' }}>
                                <thead className='thead-custom' style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                                    <tr>
                                        <th className='fw-bold py-2 text-center' style={{ width: '5%', fontSize: '16px' }}>#</th>
                                        <th className='fw-bold py-2 text-start ps-5' style={{ width: '30%', fontSize: '16px' }}>Name</th>
                                        <th className='fw-bold py-2 text-start' style={{ width: '25%', fontSize: '16px' }}>Email</th>
                                        <th className='fw-bold py-2 text-start' style={{ width: '20%', fontSize: '16px' }}>Specialization</th>
                                        <th className='fw-bold py-2 text-center' style={{ width: '10%', fontSize: '16px' }}>Gender</th>
                                        <th className='fw-bold py-2 text-center' style={{ width: '10%', fontSize: '16px' }}>Status</th>
                                        <th className='fw-bold py-2 text-center' style={{ width: '10%', fontSize: '16px' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {DoctorData?.map((doctor, index) => (
                                        <tr key={doctor._id} className="align-middle" style={{ cursor: 'pointer' }}>
                                            <td className="text-center fw-semibold" style={{ fontSize: '14px', width: '5%' }}>
                                                {((currentPage - 1) * 20) + index + 1}
                                            </td>
                                            <td className="text-start ps-3" style={{ fontSize: '14px', width: '30%' }}>
                                                <div className="d-flex align-items-center gap-2">
                                                    {doctor.profilePhoto ? (
                                                        <img 
                                                            src={doctor.profilePhoto} 
                                                            alt="Profile" 
                                                            className="rounded-circle"
                                                            style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                                                        />
                                                    ) : (
                                                        <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center text-uppercase"
                                                            style={{ width: '32px', height: '32px', fontSize: '14px', color: 'white' }}>
                                                            {doctor.firstName?.charAt(0)}{doctor.lastName?.charAt(0)}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="fw-semibold text-dark text-capitalize" style={{ cursor: 'pointer' }}>
                                                            {doctor.firstName} {doctor.lastName}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-start" style={{ fontSize: '14px', width: '25%' }}>
                                                {doctor.email}
                                            </td>
                                            <td className="text-start" style={{ fontSize: '14px', width: '20%' }}>
                                                {(() => {
                                                    const fullText = doctor?.specializations?.length > 0 ? doctor.specializations.map(spec => spec.name || spec).join(', ') : "-";
                                                    const truncatedText = fullText.length > 30 ? fullText.substring(0, 30) + '...' : fullText;
                                                    
                                                    return fullText.length > 30 ? (
                                                        <OverlayTrigger
                                                            placement="top"
                                                            overlay={<Tooltip>{fullText}</Tooltip>}
                                                        >
                                                            <span style={{ cursor: 'help' }}>{truncatedText}</span>
                                                        </OverlayTrigger>
                                                    ) : fullText;
                                                })()}
                                            </td>
                                            <td className="text-center" style={{ fontSize: '14px', width: '10%' }}>
                                                <span className="text-capitalize">{doctor.gender || "-"}</span>
                                            </td>
                                            <td className="text-center" style={{ width: '10%' }}>
                                                <Form.Check 
                                                    type="switch"
                                                    id={`status-switch-${doctor._id}`}
                                                    checked={doctor.isActive}
                                                    onChange={() => handleStatusToggle(doctor)}
                                                    style={{ transform: 'scale(1.2)' }}
                                                />
                                            </td>
                                            <td className="text-center" style={{ width: '10%' }}>
                                                <div className="d-flex justify-content-center gap-1">
                                                    <button
                                                        title='Update'
                                                        className="btn text-white d-flex align-items-center justify-content-center"
                                                        style={{ padding: '4px 6px', fontSize: '10px', backgroundColor: '#5496D3', height: '30px' }}
                                                        onClick={() => handleUpdateDoctor(doctor)}
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
                    )}
                </div>

                {DoctorCount?.totalPages > 1 && (
                    <div className="d-flex justify-content-between align-items-center mt-2 pt-3" style={{ borderTop: '1px solid #e9ecef' }}>
                        <div style={{ fontSize: '14px', color: '#003465', fontWeight: '500' }}>
                            Showing <span className="fw-bold">{((currentPage - 1) * 20) + 1}</span> - <span className="fw-bold">{Math.min(currentPage * 20, DoctorCount?.totalRecords || 0)}</span> of <span className="fw-bold">{DoctorCount?.totalRecords || 0}</span> doctors
                        </div>
                        <Pagination className="custom-pagination mb-0">
                            <Pagination.First 
                                onClick={() => handlePaginationChange(1)}
                                disabled={currentPage === 1}
                            />
                            <Pagination.Prev 
                                onClick={() => handlePaginationChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            />
                            {[...Array(DoctorCount?.totalPages)].map((_, index) => {
                                const page = index + 1;
                                if (page === currentPage || 
                                    page === 1 || 
                                    page === DoctorCount?.totalPages ||
                                    (page >= currentPage - 1 && page <= currentPage + 1)) {
                                    return (
                                        <Pagination.Item
                                            key={page}
                                            active={page === currentPage}
                                            onClick={() => handlePaginationChange(page)}
                                        >
                                            {page}
                                        </Pagination.Item>
                                    );
                                } else if (page === currentPage - 2 || page === currentPage + 2) {
                                    return <Pagination.Ellipsis key={page} />;
                                }
                                return null;
                            })}
                            <Pagination.Next 
                                onClick={() => handlePaginationChange(currentPage + 1)}
                                disabled={currentPage === DoctorCount?.totalPages}
                            />
                            <Pagination.Last 
                                onClick={() => handlePaginationChange(DoctorCount?.totalPages)}
                                disabled={currentPage === DoctorCount?.totalPages}
                            />
                        </Pagination>
                    </div>
                )}
            </div>

            <CreateDoctorModal
                show={showCreateModal}
                onHide={() => setShowCreateModal(false)}
            />

            <UpdateDoctorModal
                show={showUpdateModal}
                onHide={() => setShowUpdateModal(false)}
                doctor={selectedDoctor}
            />

            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
                <Modal.Header closeButton className='border-0'>
                    <Modal.Title className='fs-6 fw-bold'>Status Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body className='text-center py-4' style={{ fontSize: '12px' }}>
                    <div>Are you sure you want to {selectedDoctorForToggle?.isActive ? 'deactivate' : 'activate'} <span className='fw-bold' style={{ color: '#003465' }}>{selectedDoctorForToggle?.firstName} {selectedDoctorForToggle?.lastName}</span>?</div>
                </Modal.Body>
                <Modal.Footer className='border-0'>
                    <Button variant="secondary" className='fw-bold' onClick={() => setShowConfirmModal(false)}>
                        Cancel
                    </Button>
                    <Button 
                        variant="primary" 
                        className='fw-bold' 
                        onClick={confirmStatusToggle}
                        style={{ backgroundColor: '#003465', borderColor: '#003465' }}
                    >
                        {selectedDoctorForToggle?.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                </Modal.Footer>
            </Modal>
            </div>
        </>
    )
}

export default Doctors