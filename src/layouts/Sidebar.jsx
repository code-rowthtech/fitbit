import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { FiSearch } from "react-icons/fi";
import { LuLayoutList } from "react-icons/lu";
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
        ? { doctorId: selectedDoctor.value, paginate: false }
        : { paginate: false };
    dispatch(getAllPatients(payload));
    if (UserRole !== "doctor") {
      dispatch(getAllDoctors());
    }
  }, [dispatch, selectedDoctor]);

  useEffect(() => {
    const pathMatch = location.pathname.match(/\/patient-dashboard\/(.+)/);
    if (pathMatch) {
      setActivePatient(pathMatch[1]);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (CreateResponse === 201) {
      const payload =
        selectedDoctor?.value && selectedDoctor.value !== "all"
          ? { doctorId: selectedDoctor.value, paginate: false }
          : { paginate: false };
      dispatch(getAllPatients(payload));
    }
  }, [CreateResponse, selectedDoctor]);

  useEffect(() => {
    if (CreateDoctorResponse === 201) {
      dispatch(getAllDoctors());
    }
  }, [CreateDoctorResponse]);

  useEffect(() => {
    if (UpdateResponse === 200) {
      const payload =
        selectedDoctor?.value && selectedDoctor.value !== "all"
          ? { doctorId: selectedDoctor.value, paginate: false }
          : { paginate: false };
      dispatch(getAllPatients(payload));
    }
  }, [UpdateResponse, selectedDoctor]);

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
        className="sidebar"
        style={{
          height: "100vh",
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

        <div>
          {UserRole !== "doctor" && (
            <div className="p-2 pb-2">
              <Select
                value={selectedDoctor}
                onChange={setSelectedDoctor}
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
            className="patient-list pb-4"
            style={{ maxHeight: "calc(100vh - 140px)" }}
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
            ) : PatientData?.length === 0 ? (
              <div className="text-center p-3">
                <span className="text-white" style={{ fontSize: "12px" }}>
                  No patients found
                </span>
              </div>
            ) : (
              PatientData?.filter((patient) => {
                const fullName =
                  `${patient.firstName} ${patient.lastName}`.toLowerCase();
                return (
                  fullName.includes(searchTerm.toLowerCase()) ||
                  patient.email
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase())
                );
              }).map((patient) => (
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
                  <div className="flex-grow-1">
                    <div
                      className="fw-semibold text-white text-capitalize"
                      style={{ fontSize: "12px" }}
                    >
                      {patient.firstName} {patient.lastName}
                    </div>
                    <div
                      className="text-white mt-1"
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
                  <div className="">
                    <span
                      className="text-white me-2 mb-0"
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
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
