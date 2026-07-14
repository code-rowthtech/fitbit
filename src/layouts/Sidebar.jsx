import React, { useState, useEffect } from "react";
import { Form, OverlayTrigger, Tooltip, Button } from "react-bootstrap";
import { FiSearch } from "react-icons/fi";
import { LuLayoutList } from "react-icons/lu";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { FaCheckCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getAllPatients, getAllDoctors } from "../redux/actions";
import { useNavigate, useLocation } from "react-router-dom";
import Select from "react-select";
import moment from "moment";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const Store = useSelector((state) => state);
  const PatientData = Store?.getAllPatients?.message?.patients || [];
  const DoctorData = Store?.getAllDoctors?.data?.doctors || [];
  const loading = Store?.getAllPatients?.loading || false;
  const [activePatient, setActivePatient] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("new");
  const location = useLocation();
  const userInfo = JSON.parse(localStorage.getItem("user"));
  const UserRole = userInfo?.role;
  const CreateResponse = useSelector(
    (state) => state?.createPatientReducer?.data?.status
  );
  const CreateDoctorResponse = useSelector(
    (state) => state?.createDoctorReducer?.data?.status
  );
  const UpdateResponse = useSelector(
    (state) => state?.updatePatient?.data?.status
  );
  useEffect(() => {
    const payload =
      selectedDoctor?.value && selectedDoctor.value !== "all"
        ? { doctorId: selectedDoctor.value, patientType: activeTab, paginate: false }
        : { patientType: activeTab, paginate: false };
    dispatch(getAllPatients(payload));
    if (UserRole !== "doctor") {
      dispatch(getAllDoctors({ paginate: false }));
    }
  }, [dispatch, selectedDoctor, activeTab]);

  useEffect(() => {
    const pathMatch = location.pathname.match(/\/patient-dashboard\/(.+)/);
    const extractedId = pathMatch ? pathMatch[1] : null;

    if (extractedId && extractedId !== "undefined") {
      setActivePatient(extractedId);
    } else if (
      PatientData?.length > 0 &&
      (!activePatient || activePatient === "undefined" || extractedId === "undefined")
    ) {
      const firstPatient = PatientData[0];
      setActivePatient(firstPatient._id);
      navigate(`/patient-dashboard/${firstPatient._id}`, { replace: true });
    }
  }, [location.pathname, PatientData, activePatient, navigate]);

  useEffect(() => {
    if (CreateResponse === 201) {
      const payload =
        selectedDoctor?.value && selectedDoctor.value !== "all"
          ? { doctorId: selectedDoctor.value, patientType: activeTab, paginate: false }
          : { patientType: activeTab, paginate: false };
      dispatch(getAllPatients(payload));
    }
  }, [CreateResponse, selectedDoctor, activeTab]);

  useEffect(() => {
    if (CreateDoctorResponse === 201) {
      dispatch(getAllDoctors({ paginate: false }));
    }
  }, [CreateDoctorResponse]);

  useEffect(() => {
    if (UpdateResponse === 200) {
      const payload =
        selectedDoctor?.value && selectedDoctor.value !== "all"
          ? { doctorId: selectedDoctor.value, patientType: activeTab, paginate: false }
          : { patientType: activeTab, paginate: false };
      dispatch(getAllPatients(payload));
    }
  }, [UpdateResponse, selectedDoctor, activeTab]);

  const styles = `
    .patient-item:hover {
      background-color: #003465 !important;
    }
    .patient-item.active {
      background-color: #003465 !important;
    }
    .patient-list {
      overflow-y: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
    .patient-list::-webkit-scrollbar {
      display: none;
    }
  `;
  const handleViewPatient = (patient) => {
    navigate(`/patient-dashboard/${patient._id}`);
  };

  const handleSetActive = (patientId) => {
    setActivePatient(patientId);
  };

  return (
    <>
      <style>{styles}</style>
      <div
        className="sidebar d-flex flex-column"
        style={{
          height: "100%",
          width: "253px",
          borderRight: "1px solid #e9ecef",
        }}
      >
        <div
          className="p-2 d-flex align-items-center gap-1"
          style={{ borderBottom: "0.5px solid rgba(233, 236, 239, 0.2)" }}
        >
          <div style={{ position: "relative", flex: 1 }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: "4px 30px 4px 8px",
                fontSize: "12px",
                height: "36px",
              }}
              className="form-control"
              placeholder="Search patients..."
            />
            <FiSearch
              style={{
                position: "absolute",
                right: "8px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#6c757d",
                fontSize: "20px",
              }}
            />
          </div>
          <LuLayoutList
            onClick={() => navigate("/patients")}
            title="List View"
            className="text-white"
            style={{
              // color: '#6c757d',
              fontSize: "25px",
              cursor: "pointer",
            }}
          />
        </div>

        <div className="d-flex flex-column flex-grow-1 overflow-hidden">
          <div className="d-flex px-2 pt-2 pb-1">
            <Button
              className="w-50 text-center"
              style={{
                fontSize: '12px',
                borderRadius: '4px 0 0 4px',
                backgroundColor: activeTab === 'new' ? '#003465' : '#f8f9fa',
                color: activeTab === 'new' ? '#fff' : '#000',
                border: '1px solid #ced4da'
              }}
              onClick={() => {
                setActiveTab('new');
                navigate('/patient-dashboard/undefined', { replace: true });
              }}
            >
              New
            </Button>
            <Button
              className="w-50 text-center"
              style={{
                fontSize: '12px',
                borderRadius: '0 4px 4px 0',
                backgroundColor: activeTab === 'old' ? '#003465' : '#f8f9fa',
                color: activeTab === 'old' ? '#fff' : '#000',
                border: '1px solid #ced4da',
                borderLeft: 'none'
              }}
              onClick={() => {
                setActiveTab('old');
                navigate('/patient-dashboard/undefined', { replace: true });
              }}
            >
              Old
            </Button>
          </div>
          {UserRole !== "doctor" && (
            <div className="p-2 pb-2">
              <Select
                value={selectedDoctor}
                onChange={(option) => {
                  setSelectedDoctor(option);
                  navigate('/patient-dashboard/undefined', { replace: true });
                }}
                placeholder="Search Doctor"
                options={[
                  // { value: '', label: 'Search Doctor' },
                  // { value: 'all', label: 'All' },
                  ...(DoctorData?.map((doctor) => ({
                    value: doctor._id,
                    label: `${doctor.firstName} ${doctor.lastName}`,
                  })) || []),
                ]}
                isClearable
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: "36px",
                    fontSize: "12px",
                    border: "none",
                    backgroundColor: "#f8f9fa",
                  }),
                  option: (base) => ({
                    ...base,
                    fontSize: "12px",
                    textTransform: "capitalize",
                  }),
                }}
              />
            </div>
          )}
          <div
            className="patient-list pb-4 flex-grow-1"
          >
            {loading ? (
              <div className="d-flex justify-content-center align-items-center p-3">
                <div
                  className="spinner-border spinner-border-sm text-white"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (() => {
                const filteredPatients = PatientData?.filter((patient) => {
                  const fullName =
                    `${patient.firstName} ${patient.lastName}`.toLowerCase();
                  return (
                    fullName.includes(searchTerm.toLowerCase()) ||
                    patient.email
                      ?.toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  );
                });

                if (PatientData?.length === 0) {
                  return (
                    <div className="text-center p-3">
                      <span className="text-white" style={{ fontSize: "12px" }}>
                        No patients found
                      </span>
                    </div>
                  );
                }

                if (searchTerm && filteredPatients?.length === 0) {
                  return (
                    <div className="text-center p-3">
                      <span className="text-white" style={{ fontSize: "12px" }}>
                        No patient found for "{searchTerm}"
                      </span>
                    </div>
                  );
                }

                return filteredPatients?.map((patient) => (
                <div
                  key={patient._id}
                  className={`d-flex align-items-center p-2 patient-item ${
                    activePatient === patient._id ? "active" : ""
                  }`}
                  style={{
                    cursor: "pointer",
                    borderBottom: "0.5px solid rgba(233, 236, 239, 0.2)",
                  }}
                  onClick={() => {
                    handleSetActive(patient._id);
                    handleViewPatient(patient);
                  }}
                >
                  <div className="position-relative">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center text-uppercase me-2"
                      style={{
                        width: "36px",
                        height: "36px",
                        fontSize: "12px",
                        color: "#16213D",
                        backgroundColor: "#E0ECF8",
                      }}
                    >
                      {patient.firstName?.charAt(0)}
                      {patient.lastName?.charAt(0)}
                    </div>
                   
                  </div>
                  <div className="flex-grow-1 d-flex flex-column justify-content-center px-2" style={{ minWidth: 0 }}>
                    <div className="d-flex align-items-center w-100">
                      <div
                        className="fw-semibold text-white text-capitalize text-truncate"
                        style={{ fontSize: "12px", marginRight: "4px" }}
                        title={`${patient.firstName} ${patient.lastName}`}
                      >
                        {patient.firstName} {patient.lastName}
                      </div>
                      <div className="d-flex align-items-center flex-shrink-0">
                        {patient.fitbitUserId && (
                          <FaCheckCircle
                            style={{ fontSize: "12px", color: "#28a745" }}
                            title="Connected"
                          />
                        )}
                        {patient.noDataAlert && (
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>{patient.noDataMessage}</Tooltip>}
                          >
                            <AiOutlineInfoCircle
                              className="ms-1"
                              style={{ fontSize: "12px", color: "#dc3545" }}
                            />
                          </OverlayTrigger>
                        )}
                      </div>
                    </div>
                    
                    <div
                      className="text-white mt-1 text-truncate"
                      style={{ fontSize: "8px" }}
                    >
                      {(typeof patient?.address?.city === "string"
                        ? patient?.address?.city
                        : patient?.address?.city?.name) ||
                        (typeof patient?.address?.country === "string"
                          ? patient?.address?.country
                          : patient?.address?.country?.name) ||
                        "N/A"}
                    </div>
                  </div>
                  <div className="text-end flex-shrink-0 d-flex flex-column justify-content-center ms-1">
                    <span
                      className="text-white mb-1"
                      style={{ fontSize: "8px" }}
                    >
                      {patient?.createdAt
                        ? moment(patient.createdAt).format("DD/MM/YYYY")
                        : "N/A"}
                    </span>
                    <p
                      className="m-0 text-white text-capitalize fw-semibold"
                      style={{ fontSize: "10px" }}
                    >
                      {patient.isActive ? "active" : "inactive"}
                    </p>
                  </div>
                </div>
                ))
              })()}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
