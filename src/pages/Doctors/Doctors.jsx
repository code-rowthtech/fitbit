import React, { useState, useEffect } from 'react'
import { Table, Pagination, Form } from 'react-bootstrap'
import { TbPencilMinus } from "react-icons/tb";
import { FiSearch } from 'react-icons/fi'
import CreateDoctorModal from '../../components/CreateDoctorModal'
import UpdateDoctorModal from '../../components/UpdateDoctorModal'
import { getAllDoctors } from '../../redux/actions'
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

    useEffect(() => {
        const params = { page: currentPage, limit: 20 };
        if (searchTerm) params.search = searchTerm;
        dispatch(getAllDoctors(params))
    }, [currentPage, searchTerm]);

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
            dispatch(getAllDoctors(params))
        }
    }, [CreateResponse, UpdateResponse, currentPage, searchTerm]);

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
                        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Table className="mb-0 table-sm" style={{ fontSize: '11px', overflow: 'hidden' }}>
                                <thead className='thead-custom' style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                                    <tr>
                                        <th className='fw-bold py-2 text-center' style={{ width: '5%', fontSize: '16px' }}>#</th>
                                        <th className='fw-bold py-2 text-start ps-5' style={{ width: '30%', fontSize: '16px' }}>Name</th>
                                        <th className='fw-bold py-2 text-start' style={{ width: '35%', fontSize: '16px' }}>Email</th>
                                        <th className='fw-bold py-2 text-center' style={{ width: '10%', fontSize: '16px' }}>Gender</th>
                                        <th className='fw-bold py-2 text-center' style={{ width: '10%', fontSize: '16px' }}>Status</th>
                                        <th className='fw-bold py-2 text-center' style={{ width: '10%', fontSize: '16px' }}>Actions</th>
                                    </tr>
                                </thead>
                            </Table>
                            <div style={{ flex: 1, overflowY: 'auto', maxHeight: '76vh' }}>
                                <Table className="mb-0 table-sm" style={{ fontSize: '11px' }}>
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
                                                <td className="text-start" style={{ fontSize: '14px', width: '35%' }}>
                                                    {doctor.email}
                                                </td>
                                                <td className="text-center" style={{ fontSize: '14px', width: '10%' }}>
                                                    <span className="text-capitalize">{doctor.gender || "-"}</span>
                                                </td>
                                                <td className="text-center" style={{ width: '10%' }}>
                                                    <span className={`${getStatusBadge(doctor.isActive)} text-capitalize`}
                                                        style={{ padding: '6px', fontSize: '14px', width: '3.5vw', height:'30px' }}>
                                                        {doctor.isActive ? 'Active' : 'Inactive'}
                                                    </span>
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
            </div>
        </>
    )
}

export default Doctors