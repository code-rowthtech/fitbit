import React, { useState, useEffect, useRef } from "react";
import { Table, Pagination, Form, Modal, Button } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import { TbPencilMinus } from "react-icons/tb";
import { FiSearch, FiFilter, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import CreatePatientModal from "../../components/CreatePatientModal";
import UpdatePatientModal from "../../components/UpdatePatientModal";
import {
  getAllPatients,
  getAllDoctors,
  updatePatient,
} from "../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { useSidebar } from "../../contexts/SidebarContext";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { MdOutlineCalendarMonth } from "react-icons/md";

const Patients = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { hideSidebar, showSidebar } = useSidebar();
  const Store = useSelector((state) => state);
  const PatientCount = Store?.getAllPatients?.message;
  const PatientData = Store?.getAllPatients?.message?.patients;
  const DoctorData = Store?.getAllDoctors?.data?.doctors || [];
  const loading = Store?.getAllPatients?.loading || false;
  const CreateResponse = useSelector(
    (state) => state?.createPatientReducer?.data?.status
  );
  const UpdateResponse = useSelector(
    (state) => state?.updatePatient?.data?.status
  );
  const userInfo = JSON.parse(localStorage.getItem("user"));
  const UserRole = userInfo?.role;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [statusFilter, setStatusFilter] = useState("active");
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedPatientForToggle, setSelectedPatientForToggle] =
    useState(null);
  const datePickerRef = useRef(null);
  const statusFilterRef = useRef(null);

  useEffect(() => {
    hideSidebar();
    const params = { page: currentPage, limit: 20 };
    if (searchTerm) params.search = searchTerm;
    if (selectedDoctor?.value) params.doctorId = selectedDoctor.value;
    if (dateRange[0].startDate && dateRange[0].endDate) {
      params.startDateRange = dateRange[0].startDate
        .toISOString()
        .split("T")[0];
      params.endDateRange = dateRange[0].endDate.toISOString().split("T")[0];
    }
    if (statusFilter) params.isActive = statusFilter === "active";
    dispatch(getAllPatients(params));
    if (UserRole !== "doctor") {
      dispatch(getAllDoctors());
    }
  }, [currentPage, searchTerm, selectedDoctor, dateRange, statusFilter]);

  useEffect(() => {
    if (PatientCount) {
      setTotalPages(PatientCount.totalPages || 1);
    }
  }, [PatientCount]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target)
      ) {
        setShowDatePicker(false);
      }
      if (
        statusFilterRef.current &&
        !statusFilterRef.current.contains(event.target)
      ) {
        setShowStatusFilter(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCreatePatient = () => {
    setShowCreateModal(true);
  };

  useEffect(() => {
    if (CreateResponse === 201 || UpdateResponse === 200) {
      const params = { page: currentPage, limit: 20 };
      if (searchTerm) params.search = searchTerm;
      if (selectedDoctor?.value) params.doctorId = selectedDoctor.value;
      if (dateRange[0].startDate && dateRange[0].endDate) {
        params.startDateRange = dateRange[0].startDate
          .toISOString()
          .split("T")[0];
        params.endDateRange = dateRange[0].endDate.toISOString().split("T")[0];
      }
      if (statusFilter) params.isActive = statusFilter === "active";
      dispatch(getAllPatients(params));
    }
  }, [
    CreateResponse,
    UpdateResponse,
    currentPage,
    searchTerm,
    selectedDoctor,
    dateRange,
    statusFilter,
  ]);

  const handleViewPatient = (patient) => {
    showSidebar();
    navigate(`/patient-dashboard/${patient._id}`);
  };

  const handleUpdatePatient = (patient) => {
    setSelectedPatient(patient._id);
    setShowUpdateModal(true);
  };

  const handlePaginationChange = (page) => {
    setCurrentPage(page);
  };

  const getStatusBadge = (isActive) => {
    return isActive
      ? "badge badge-active"
      : "badge bg-secondary-subtle text-secondary";
  };

  const handleStatusToggle = (patient) => {
    setSelectedPatientForToggle(patient);
    setShowConfirmModal(true);
  };

  const confirmStatusToggle = () => {
    const updatedData = {
      patientId: selectedPatientForToggle._id,
      body: {
        isActive: !selectedPatientForToggle.isActive,
      },
    };
    dispatch(updatePatient(updatedData));
    setShowConfirmModal(false);
    setSelectedPatientForToggle(null);
  };

  return (
    <>
      <style>
        {`
                .patient-row:hover { background-color: #F9FAFB !important; }
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
      <div
        className="border-0"
        style={{ height: "100%", display: "flex", flexDirection: "column" }}
      >
        <div
          className="px-4 py-2"
          style={{ flex: 1, display: "flex", flexDirection: "column" }}
        >
          <div className="">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="d-flex gap-3 align-items-center">
                <h4
                  className="fw-bold mb-0"
                  style={{ color: "#003465", letterSpacing: "-0.5px" }}
                >
                  Patients
                </h4>
                <span
                  className="badge text-white rounded-2 px-2 py-1"
                  style={{
                    backgroundColor: "#003465",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  {PatientCount?.totalRecords || 0}
                </span>
              </div>
              <div className="d-flex gap-2">
                <div ref={statusFilterRef} style={{ position: "relative" }}>
                  <button
                    className="form-control border-0 bg-light text-start d-flex justify-content-between align-items-center"
                    style={{
                      fontSize: "12px",
                      height: "36px",
                      width: "120px",
                      color: "#003465",
                      backgroundColor: "#F0F3F7",
                    }}
                    onClick={() => setShowStatusFilter(!showStatusFilter)}
                  >
                    <span className="text-capitalize">{statusFilter}</span>
                    <FiFilter />
                  </button>
                  {showStatusFilter && (
                    <div
                      style={{
                        position: "absolute",
                        top: "40px",
                        zIndex: 1000,
                        backgroundColor: "white",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                        borderRadius: "6px",
                        minWidth: "120px",
                      }}
                    >
                      <div
                        className="px-3 py-2 text-start"
                        style={{
                          cursor: "pointer",
                          fontSize: "12px",
                          borderBottom: "1px solid #eee",
                        }}
                        onClick={() => {
                          setStatusFilter("active");
                          setShowStatusFilter(false);
                        }}
                      >
                        Active
                      </div>
                      <div
                        className="px-3 py-2 text-start"
                        style={{ cursor: "pointer", fontSize: "12px" }}
                        onClick={() => {
                          setStatusFilter("inactive");
                          setShowStatusFilter(false);
                        }}
                      >
                        Inactive
                      </div>
                    </div>
                  )}
                </div>
                <div ref={datePickerRef} style={{ position: "relative" }}>
                  <button
                    className="form-control border-0 bg-light text-start d-flex justify-content-between align-items-center"
                    style={{
                      fontSize: "12px",
                      height: "36px",
                      width: "247px",
                      color: "#003465",
                      backgroundColor: "#F0F3F7",
                    }}
                    onClick={() => setShowDatePicker(!showDatePicker)}
                  >
                    <span>
                      {dateRange[0].startDate && dateRange[0].endDate
                        ? `${dateRange[0].startDate.toLocaleDateString()} - ${dateRange[0].endDate.toLocaleDateString()}`
                        : "Select Date Range"}
                    </span>
                    <MdOutlineCalendarMonth />
                  </button>
                  {showDatePicker && (
                    <div
                      style={{
                        position: "absolute",
                        top: "40px",
                        zIndex: 1000,
                        backgroundColor: "white",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                      }}
                    >
                      <DateRangePicker
                        ranges={dateRange}
                        onChange={(ranges) => setDateRange([ranges.selection])}
                      />
                    </div>
                  )}
                </div>
                {UserRole === "doctor" ? (
                  <></>
                ) : (
                  <div>
                    <Form.Select
                      className="mb-0 border-0 bg-light"
                      style={{
                        fontSize: "12px",
                        height: "36px",
                        width: "247px",
                        color: "#003465",
                        backgroundColor: "#F0F3F7",
                      }}
                      value={selectedDoctor?.value || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSelectedDoctor(
                          value
                            ? {
                                value,
                                label:
                                  DoctorData.find((d) => d._id === value)
                                    ?.firstName +
                                  " " +
                                  DoctorData.find((d) => d._id === value)
                                    ?.lastName,
                              }
                            : null
                        );
                      }}
                    >
                      <option value="">Select Doctor</option>
                      {DoctorData?.map((doctor) => (
                        <option key={doctor._id} value={doctor._id}>
                          {doctor.firstName} {doctor.lastName}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                )}

                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      padding: "4px 32px 4px 8px",
                      fontSize: "12px",
                      height: "36px",
                      width: "247px",
                      backgroundColor: "#F6F9FF",
                    }}
                    className="form-control border-0"
                    placeholder="Search patients..."
                  />
                  {searchTerm && (
                    <FiX
                      style={{
                        position: "absolute",
                        right: "32px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#6c757d",
                        fontSize: "16px",
                        cursor: "pointer",
                      }}
                      onClick={() => setSearchTerm("")}
                    />
                  )}
                  <FiSearch
                    style={{
                      position: "absolute",
                      right: "8px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#6c757d",
                      fontSize: "18px",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              flex: 1,
              overflow: "auto",
              scrollbarWidth: "thin",
              scrollbarColor: "#c1dfe9ff #e6f2f9",
            }}
          >
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
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Table
                  className="mb-0 table-sm"
                  style={{ fontSize: "11px", overflow: "hidden" }}
                >
                  <thead
                    className="thead-custom"
                    style={{ position: "sticky", top: 0, zIndex: 10 }}
                  >
                    <tr>
                      <th
                        className="fw-bold py-2 text-center"
                        style={{
                          width: statusFilter === "inactive" ? "4%" : "5%",
                          fontSize: "16px",
                        }}
                      >
                        #
                      </th>
                      <th
                        className="fw-bold py-2 text-start ps-5"
                        style={{
                          width: statusFilter === "inactive" ? "18%" : "20%",
                          fontSize: "16px",
                        }}
                      >
                        Name
                      </th>
                      <th
                        className="fw-bold py-2 text-start"
                        style={{
                          width: statusFilter === "inactive" ? "22%" : "25%",
                          fontSize: "16px",
                        }}
                      >
                        Email
                      </th>
                      <th
                        className="fw-bold py-2 text-center"
                        style={{
                          width: statusFilter === "inactive" ? "10%" : "12%",
                          fontSize: "16px",
                        }}
                      >
                        Registered At
                      </th>
                      <th
                        className="fw-bold py-2 text-start"
                        style={{
                          width: statusFilter === "inactive" ? "16%" : "18%",
                          fontSize: "16px",
                        }}
                      >
                        Assigned to
                      </th>
                      <th
                        className="fw-bold py-2 text-center"
                        style={{
                          width: statusFilter === "inactive" ? "7%" : "8%",
                          fontSize: "16px",
                        }}
                      >
                        Gender
                      </th>
                      {statusFilter === "inactive" && (
                        <th
                          className="fw-bold py-2 text-center"
                          style={{ width: "10%", fontSize: "16px" }}
                        >
                          Inactive Date
                        </th>
                      )}
                      <th
                        className="fw-bold py-2 text-center"
                        style={{
                          width: statusFilter === "inactive" ? "6%" : "7%",
                          fontSize: "16px",
                        }}
                      >
                        Status
                      </th>
                      <th
                        className="fw-bold py-2 text-start pe-3"
                        style={{
                          width: statusFilter === "inactive" ? "7%" : "5%",
                          fontSize: "16px",
                        }}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                </Table>
                <div style={{ flex: 1, overflowY: "auto", maxHeight: "76vh" }}>
                  <Table className="mb-0 table-sm" style={{ fontSize: "11px" }}>
                    <tbody>
                      {PatientData?.map((patient, index) => (
                        <tr
                          key={patient._id}
                          className="align-middle patient-row"
                          style={{ cursor: "pointer" }}
                        >
                          <td
                            className="text-center fw-semibold"
                            style={{
                              fontSize: "14px",
                              width: statusFilter === "inactive" ? "4%" : "5%",
                            }}
                          >
                            {(currentPage - 1) * 20 + index + 1}
                          </td>
                          <td
                            className="text-start ps-3"
                            style={{
                              fontSize: "14px",
                              width:
                                statusFilter === "inactive" ? "18%" : "20%",
                            }}
                          >
                            <div className="d-flex align-items-center gap-2">
                              <div
                                className="bg-secondary rounded-circle d-flex align-items-center justify-content-center text-uppercase"
                                style={{
                                  width: "32px",
                                  height: "32px",
                                  fontSize: "14px",
                                  color: "white",
                                }}
                              >
                                {patient.firstName?.charAt(0)}
                                {patient.lastName?.charAt(0)}
                              </div>
                              <div>
                                <div
                                  className=" text-dark text-capitalize"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => handleViewPatient(patient)}
                                >
                                  {patient.firstName} {patient.lastName}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td
                            className="text-start"
                            style={{
                              fontSize: "14px",
                              width:
                                statusFilter === "inactive" ? "22%" : "25%",
                            }}
                          >
                            {patient.email}
                          </td>
                          <td
                            className="text-center"
                            style={{
                              fontSize: "14px",
                              width:
                                statusFilter === "inactive" ? "10%" : "12%",
                            }}
                          >
                            {patient.registrationDate
                              ? new Date(
                                  patient.registrationDate
                                ).toLocaleDateString()
                              : "-"}
                          </td>
                          <td
                            className="text-start"
                            style={{
                              fontSize: "14px",
                              width:
                                statusFilter === "inactive" ? "16%" : "18%",
                            }}
                          >
                            <div
                              className="text-dark text-capitalize"
                              style={{ fontSize: "14px" }}
                            >
                              {patient?.doctorId?.firstName &&
                              patient?.doctorId?.lastName
                                ? `${patient.doctorId.firstName} ${patient.doctorId.lastName}`
                                : "Unassigned"}
                            </div>
                          </td>
                          <td
                            className="text-center"
                            style={{
                              fontSize: "14px",
                              width: statusFilter === "inactive" ? "7%" : "8%",
                            }}
                          >
                            <span className="text-capitalize">
                              {patient.gender || "-"}
                            </span>
                          </td>
                          {statusFilter === "inactive" && (
                            <td
                              className="text-center"
                              style={{ fontSize: "14px", width: "10%" }}
                            >
                              {patient.inActiveTime
                                ? new Date(
                                    patient.inActiveTime
                                  ).toLocaleDateString("en-GB")
                                : "-"}
                            </td>
                          )}
                          <td
                            className="text-center"
                            style={{
                              width: statusFilter === "inactive" ? "6%" : "7%",
                            }}
                          >
                            <Form.Check
                              type="switch"
                              id={`status-switch-${patient._id}`}
                              checked={patient.isActive}
                              onChange={() => handleStatusToggle(patient)}
                              style={{ transform: "scale(1.2)" }}
                            />
                          </td>
                          <td
                            className="text-center pe-3"
                            style={{
                              width: statusFilter === "inactive" ? "7%" : "5%",
                            }}
                          >
                            <div className="d-flex justify-content-center gap-1">
                              <button
                                title="View"
                                className="btn d-flex align-items-center justify-content-center"
                                style={{
                                  padding: "2px 6px",
                                  fontSize: "10px",
                                  backgroundColor: "#C6E4FF",
                                  color: "#003465",
                                  height: "30px",
                                }}
                                onClick={() => handleViewPatient(patient)}
                              >
                                <FaEye size={12} />
                              </button>
                              <button
                                title="Update"
                                className="btn text-white d-flex align-items-center justify-content-center"
                                style={{
                                  padding: "4px 6px",
                                  fontSize: "10px",
                                  backgroundColor: "#5496D3",
                                  height: "30px",
                                }}
                                onClick={() => handleUpdatePatient(patient)}
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

          {PatientCount?.totalPages > 1 && (
            <div
              className="d-flex justify-content-between align-items-center mt-2 pt-3"
              style={{ borderTop: "1px solid #e9ecef" }}
            >
              <div
                style={{
                  fontSize: "14px",
                  color: "#003465",
                  fontWeight: "500",
                }}
              >
                Showing{" "}
                <span className="fw-bold">{(currentPage - 1) * 20 + 1}</span> -{" "}
                <span className="fw-bold">
                  {Math.min(currentPage * 20, PatientCount?.totalRecords || 0)}
                </span>{" "}
                of{" "}
                <span className="fw-bold">
                  {PatientCount?.totalRecords || 0}
                </span>{" "}
                patients
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
                {[...Array(PatientCount?.totalPages)].map((_, index) => {
                  const page = index + 1;
                  if (
                    page === currentPage ||
                    page === 1 ||
                    page === PatientCount?.totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <Pagination.Item
                        key={page}
                        active={page === currentPage}
                        onClick={() => handlePaginationChange(page)}
                      >
                        {page}
                      </Pagination.Item>
                    );
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return <Pagination.Ellipsis key={page} />;
                  }
                  return null;
                })}
                <Pagination.Next
                  onClick={() => handlePaginationChange(currentPage + 1)}
                  disabled={currentPage === PatientCount?.totalPages}
                />
                <Pagination.Last
                  onClick={() =>
                    handlePaginationChange(PatientCount?.totalPages)
                  }
                  disabled={currentPage === PatientCount?.totalPages}
                />
              </Pagination>
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
          patientId={selectedPatient}
        />

        <Modal
          show={showConfirmModal}
          onHide={() => setShowConfirmModal(false)}
        >
          <Modal.Header closeButton className="border-0">
            <Modal.Title className="fs-6 fw-bold">
              Status Confirmation
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center py-4" style={{ fontSize: "12px" }}>
            <div>
              Are you sure you want to{" "}
              {selectedPatientForToggle?.isActive ? "deactivate" : "activate"}{" "}
              <span className="fw-bold" style={{ color: "#003465" }}>
                {selectedPatientForToggle?.firstName}{" "}
                {selectedPatientForToggle?.lastName}
              </span>
              ?
            </div>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button
              variant="secondary"
              className="fw-bold"
              onClick={() => setShowConfirmModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="fw-bold"
              onClick={confirmStatusToggle}
              style={{ backgroundColor: "#003465", borderColor: "#003465" }}
            >
              {selectedPatientForToggle?.isActive ? "Deactivate" : "Activate"}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default Patients;
