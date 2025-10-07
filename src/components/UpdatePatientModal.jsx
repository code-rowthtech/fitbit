import React, { useState, useEffect, useCallback, useRef } from "react";
import { Modal, Form, Row, Col, Button } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import {
  resetUpdatePatient,
  updatePatient,
  getAllDoctors,
  getAllergies,
  getPatientById,
  getStates,
  getCities,
} from "../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { FaTimes } from "react-icons/fa";
import { MdDone } from "react-icons/md";
import { RiAddLine } from "react-icons/ri";
import Select from "react-select";
import AddAllergyModal from "./Allergy/AddAllergyModal";

// CSS for custom radio label styling
const customRadioStyle = `
.custom-radio-label .form-check-label {
    font-size: 12px !important;
    font-weight: 600 !important;
    color: #858B9A !important;
}
`;

const UpdatePatientModal = ({ show, onHide, patient, patientId }) => {
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(1);
  const [showAllergyModal, setShowAllergyModal] = useState(false);
  const id = patientId;
  const userInfo = JSON.parse(localStorage.getItem("user"));
  const UserRole = userInfo?.role;
  const UpdateResponse = useSelector(
    (state) => state?.updatePatient?.data?.status
  );
  const Loading = useSelector((state) => state?.updatePatient?.loading);
  const DoctorData = useSelector(
    (state) => state?.getAllDoctors?.data?.doctors
  );
  const AllergiesList = useSelector(
    (state) => state?.getAllergiesReducer?.data?.data
  );
  const PatientData = useSelector(
    (state) => state?.getPatientByIdReducer?.data?.data?.patient
  );

  console.log("PatientData in UpdatePatientModal:", PatientData);

  const StatesData = useSelector(
    (state) => state?.getStatesReducer?.data?.data
  );
  const CitiesData = useSelector(
    (state) => state?.getCitiesReducer?.data?.data
  );
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    trigger,
    watch,
    control,
  } = useForm({
    mode: "onChange",
  });
  const [selectedState, setSelectedState] = useState(null);
  const stateOptions =
    StatesData?.map((state) => ({
      value: state?.code,
      label: state?.name,
      data: state,
    })) || [];

  const cityOptions =
    CitiesData?.map((city) => ({
      value: city?._id,
      label: city?.name,
    })) || [];

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      fontSize: "12px",
      backgroundColor: "#F9FAFB",
      minHeight: "48px",
      border: "1px solid #ced4da",
      "&:hover": {
        border: "1px solid #ced4da",
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      fontSize: "12px",
      color: "#6c757d",
    }),
    singleValue: (provided) => ({
      ...provided,
      fontSize: "12px",
    }),
    option: (provided) => ({
      ...provided,
      fontSize: "12px",
    }),
  };

  const watchedDateOfBirth = watch("dateOfBirth");

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "";
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age.toString();
  };

  useEffect(() => {
    if (watchedDateOfBirth) {
      const age = calculateAge(watchedDateOfBirth);
      setValue("age", age);
    }
  }, [watchedDateOfBirth, setValue]);

  const steps = [
    {
      id: 1,
      title: "Patient Personal Information",
      completed: currentStep > 1,
    },
    { id: 2, title: "Contact Information", completed: currentStep > 2 },
    { id: 3, title: "Medical Information", completed: currentStep > 3 },
    {
      id: 4,
      title: "Administrative / System Information",
      completed: currentStep > 4,
    },
  ];

  useEffect(() => {
    if (id && show) {
      dispatch(getPatientById(id));
    }
  }, [id, show, dispatch]);

  useEffect(() => {
    if (show) {
      if (UserRole !== "doctor") {
        dispatch(getAllDoctors());
      }
      setCurrentStep(1);
    }
  }, [show]);

  useEffect(() => {
    dispatch(getAllergies());
    dispatch(getStates({ search: "", limit: 40 }));
  }, [dispatch]);

  useEffect(() => {
    if (
      PatientData &&
      show &&
      (DoctorData || UserRole === "doctor") &&
      StatesData
    ) {
      setValue("firstName", PatientData.firstName || "");
      setValue("lastName", PatientData.lastName || "");
      setValue("email", PatientData.email || "");
      setValue("gender", PatientData.gender || "");
      setValue("isActive", PatientData.isActive ? "true" : "false");
      const dobValue = PatientData.dateOfBirth
        ? new Date(PatientData.dateOfBirth).toISOString().split("T")[0]
        : "";
      setValue("dateOfBirth", dobValue);
      // Let the useEffect calculate age from dateOfBirth
      if (dobValue) {
        const calculatedAge = calculateAge(dobValue);
        setValue("age", calculatedAge);
      }
      setValue("maritalStatus", PatientData.maritalStatus || "");
      setValue("phoneNumber", PatientData.phoneNumber || "");
      setValue("street", PatientData.address?.street || "");

      // Load cities if state exists and not already loaded
      if (PatientData.address?.state && !citiesLoadedRef.current) {
        const stateCode = StatesData.find(
          (state) => state.name === PatientData.address.state.name
        )?.code;
        const patientState = stateOptions?.find(
          (stateData) => stateData?.value === stateCode
        );
        if (stateCode) {
          dispatch(
            getCities({
              stateCode: patientState,
              search: PatientData?.address?.city?.name,
            })
          );
          citiesLoadedRef.current = true;
        }
      }

      const stateValue = PatientData.address?.state?._id
        ? StatesData.find(
            (state) => state.name === PatientData.address.state.name
          )
        : null;
      if (stateValue) {
        setValue("state", {
          value: stateValue.code,
          label: stateValue.name,
          data: stateValue,
        });
      }
      setValue("pincode", PatientData.address?.zip || "");
      setValue("country", PatientData.address?.country || "");
      setValue("fullAddress", PatientData.fullAddress || "");
      setValue(
        "allergies",
        PatientData.allergies?.map((allergy) => ({
          value: allergy._id,
          label: allergy.name,
        })) || []
      );
      setValue("medicalConditions", PatientData.condition || "");
      setValue(
        "currentMedications",
        Array.isArray(PatientData.currentMedications) &&
          PatientData.currentMedications.length > 0
          ? PatientData.currentMedications[0].name
          : ""
      );
      setValue("medicalHistory", PatientData.medicalHistory?.name || "");
      setValue(
        "registrationDate",
        PatientData.registrationDate
          ? new Date(PatientData.registrationDate).toISOString().split("T")[0]
          : ""
      );
      setValue("PatientCategory", PatientData.PatientDataCategory || "");
      setValue("fitbitConsent", PatientData.fitbitConsent || "");
      setValue("notes", PatientData.notes || "");

      const doctorId =
        typeof PatientData.doctorId === "object"
          ? PatientData.doctorId._id
          : PatientData.doctorId;
      const doctorExists = DoctorData?.find((doc) => doc._id === doctorId);
      setValue("doctorId", doctorExists ? doctorId : "");
    }
  }, [PatientData, show, DoctorData, StatesData, setValue, dispatch, UserRole]);

  const citySetRef = useRef(false);
  const citiesLoadedRef = useRef(false);

  // Set city value after cities are loaded
  useEffect(() => {
    if (
      PatientData?.address?.city &&
      CitiesData?.length > 0 &&
      !citySetRef.current
    ) {
      const cityValue = CitiesData.find(
        (city) =>
          city._id === PatientData.address.city._id ||
          city.name === PatientData.address.city.name
      );
      if (cityValue) {
        setValue("city", { value: cityValue._id, label: cityValue.name });
        citySetRef.current = true;
      }
    }
  }, [CitiesData, PatientData, setValue]);

  // Reset refs when modal closes
  useEffect(() => {
    if (!show) {
      citySetRef.current = false;
      citiesLoadedRef.current = false;
    }
  }, [show]);

  useEffect(() => {
    if (UpdateResponse === 200) {
      reset();
      setCurrentStep(1);
      onHide();
      dispatch(resetUpdatePatient());
    }
  }, [UpdateResponse]);

  const handleNext = async () => {
    let fieldsToValidate = [];

    if (currentStep === 1) {
      fieldsToValidate = ["firstName", "lastName", "dateOfBirth", "gender"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["phoneNumber", "email"];
    } else if (currentStep === 4) {
      fieldsToValidate = ["doctorId"];
    }

    const isValid = await trigger(fieldsToValidate);

    if (isValid && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepId) => {
    setCurrentStep(stepId);
  };
  const onSubmit = (data) => {
    const patientData = {
      body: {
        email: data.email,
        role: "patient",
        isActive: data.isActive === "true",
        phoneNumber: data.phoneNumber || undefined,
        maritalStatus: data.maritalStatus || "prefer-not-to-say",
        dateOfBirth: data.dateOfBirth || undefined,
        age: data.age,
        ...(data.street ||
        data.city ||
        data.state ||
        data.country ||
        data.pincode
          ? {
              address: {
                street: data.street || "",
                city: data.city?.value || data.city || null,
                state: data?.state?.data?._id,
                country: "India",
                zip: data.pincode || "",
              },
            }
          : {}),
        fullAddress: data.fullAddress || "",
        allergies: Array.isArray(data.allergies)
          ? data.allergies.map((allergy) => allergy.value)
          : data.allergies
          ? [data.allergies]
          : [],
        currentMedications: Array.isArray(data.currentMedications)
          ? data.currentMedications
          : data.currentMedications
          ? [{ name: data.currentMedications }]
          : [],
        medicalHistory: data.medicalHistory
          ? { name: data.medicalHistory }
          : undefined,
        registrationDate: data.registrationDate || Date.now(),
        condition: data.medicalConditions || undefined,
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        gender: data.gender || "prefer-not-to-say",
        doctorId: data.doctorId || undefined,
        patientCategory: data.patientCategory || undefined,
        fitbitConsent: data.fitbitConsent || undefined,
        notes: data.notes || undefined,
      },
      patientId: id,
    };
    dispatch(updatePatient(patientData));
  };

  const handleClose = useCallback(() => {
    reset();
    setCurrentStep(1);
    onHide();
  }, [reset, onHide]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="p-4" style={{ minHeight: "400px" }}>
            <Row className="mt-5">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label
                    className="mb-1 fw-semibold opacity-75"
                    style={{ fontSize: "14px", color: "#16213DB2" }}
                  >
                    First Name <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    style={{ fontSize: "12px", backgroundColor: "#F9FAFB" }}
                    className="py-3"
                    type="text"
                    placeholder="Enter First Name"
                    autoComplete="off"
                    onKeyDown={(e) => {
                      if (e.target.value.length === 0 && e.key === " ") {
                        e.preventDefault();
                      }
                      const isEmoji =
                        /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(
                          e.key
                        );
                      if (
                        (!/^[a-zA-Z\s]$/.test(e.key) || isEmoji) &&
                        e.key.length === 1 &&
                        !["Backspace", "Delete", "Tab", "Enter"].includes(e.key)
                      ) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e) => {
                      const pastedText = e.clipboardData.getData("text");
                      const hasEmoji =
                        /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(
                          pastedText
                        );
                      if (!/^[A-Za-z\s]+$/.test(pastedText) || hasEmoji) {
                        e.preventDefault();
                      }
                    }}
                    {...register("firstName", {
                      required: "First name is required",
                      pattern: {
                        value: /^[A-Za-z]{3,}$/,
                        message:
                          "First name should contain at least 3 alphabets only",
                      },
                    })}
                  />
                  {errors.firstName && (
                    <span className="text-danger" style={{ fontSize: "10px" }}>
                      {errors.firstName.message}
                    </span>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label
                    className="mb-1 fw-semibold opacity-75"
                    style={{ fontSize: "14px", color: "#16213DB2" }}
                  >
                    Last Name <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    style={{ fontSize: "12px", backgroundColor: "#F9FAFB" }}
                    className="py-3"
                    type="text"
                    placeholder="Enter Last Name"
                    autoComplete="off"
                    onKeyDown={(e) => {
                      if (e.target.value.length === 0 && e.key === " ") {
                        e.preventDefault();
                      }
                      const isEmoji =
                        /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(
                          e.key
                        );
                      if (
                        (!/^[a-zA-Z\s]$/.test(e.key) || isEmoji) &&
                        e.key.length === 1 &&
                        !["Backspace", "Delete", "Tab", "Enter"].includes(e.key)
                      ) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e) => {
                      const pastedText = e.clipboardData.getData("text");
                      const hasEmoji =
                        /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(
                          pastedText
                        );
                      if (!/^[A-Za-z\s]+$/.test(pastedText) || hasEmoji) {
                        e.preventDefault();
                      }
                    }}
                    {...register("lastName", {
                      required: "Last name is required",
                      pattern: {
                        value: /^[A-Za-z]{3,}$/,
                        message:
                          "Last name should contain at least 3 alphabets only",
                      },
                    })}
                  />
                  {errors.lastName && (
                    <span className="text-danger" style={{ fontSize: "10px" }}>
                      {errors.lastName.message}
                    </span>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label
                    className="mb-1 fw-semibold opacity-75"
                    style={{ fontSize: "14px", color: "#16213DB2" }}
                  >
                    Date Of Birth (DOB) <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    style={{ fontSize: "12px", backgroundColor: "#F9FAFB" }}
                    className="py-3"
                    type="date"
                    max={new Date().toISOString().split("T")[0]}
                    autoComplete="off"
                    {...register("dateOfBirth", {
                      required: "Date of birth is required",
                      validate: (value) =>
                        new Date(value) <= new Date() ||
                        "Date of birth cannot be in the future",
                    })}
                  />
                  {errors.dateOfBirth && (
                    <span className="text-danger" style={{ fontSize: "10px" }}>
                      {errors.dateOfBirth.message}
                    </span>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label
                    className="mb-1 fw-semibold opacity-75"
                    style={{ fontSize: "14px", color: "#16213DB2" }}
                  >
                    Age
                  </Form.Label>
                  <Form.Control
                    style={{ fontSize: "12px", backgroundColor: "#F9FAFB" }}
                    className="py-3"
                    type="text"
                    // placeholder=""
                    autoComplete="off"
                    readOnly
                    {...register("age")}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label
                    className="mb-1 fw-semibold opacity-75"
                    style={{ fontSize: "14px", color: "#16213DB2" }}
                  >
                    Marital Status
                  </Form.Label>
                  <Form.Select
                    style={{ fontSize: "12px", backgroundColor: "#F9FAFB" }}
                    className="py-3"
                    {...register("maritalStatus")}
                  >
                    <option value="">Select</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                    <option value="separated">Separated</option>
                    <option value="civil partnership">Civil Partnership</option>
                    <option value="domestic partnership">
                      Domestic Partnership
                    </option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer Not to Say</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label
                    className="mb-1 fw-semibold opacity-75"
                    style={{ fontSize: "14px", color: "#16213DB2" }}
                  >
                    Gender <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="d-flex gap-4 mt-2">
                    <Form.Check
                      type="radio"
                      label="Male"
                      value="male"
                      className="custom-radio-label"
                      {...register("gender", {
                        required: "Gender is required",
                      })}
                    />
                    <Form.Check
                      type="radio"
                      label="Female"
                      value="female"
                      className="custom-radio-label"
                      {...register("gender", {
                        required: "Gender is required",
                      })}
                    />
                    <Form.Check
                      type="radio"
                      label="Other"
                      value="other"
                      className="custom-radio-label"
                      {...register("gender", {
                        required: "Gender is required",
                      })}
                    />
                  </div>
                  {errors.gender && (
                    <span className="text-danger" style={{ fontSize: "10px" }}>
                      {errors.gender.message}
                    </span>
                  )}
                </Form.Group>
              </Col>
            </Row>
          </div>
        );
      case 2:
        return (
          <div className="p-4" style={{ minHeight: "400px" }}>
            <Row className="mt-2">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label
                    className="mb-1 fw-semibold opacity-75"
                    style={{ fontSize: "14px", color: "#16213DB2" }}
                  >
                    Phone Number <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    style={{ fontSize: "12px", backgroundColor: "#F9FAFB" }}
                    className="py-3"
                    type="tel"
                    placeholder="Enter Phone Number"
                    autoComplete="off"
                    name="phoneNumber"
                    onKeyDown={(e) => {
                      if (e.target.value.length === 0 && e.key === " ") {
                        e.preventDefault();
                      }
                      const digitCount = e.target.value.replace(
                        /[^0-9]/g,
                        ""
                      ).length;
                      if (
                        !/^[0-9+\-()\s]$/.test(e.key) &&
                        e.key.length === 1 &&
                        !["Backspace", "Delete", "Tab", "Enter"].includes(e.key)
                      ) {
                        e.preventDefault();
                      }
                      if (/^[0-9]$/.test(e.key) && digitCount >= 15) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e) => {
                      const pastedText = e.clipboardData.getData("text");
                      if (!/^[0-9+\-()\s]+$/.test(pastedText)) {
                        e.preventDefault();
                      }
                    }}
                    {...register("phoneNumber", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[0-9+\-()\s]+$/,
                        message:
                          "Only numbers and phone symbols (+, -, (, )) are allowed",
                      },
                      validate: {
                        minDigits: (value) => {
                          const digitCount =
                            value?.replace(/[^0-9]/g, "").length || 0;
                          return (
                            digitCount === 0 ||
                            digitCount >= 5 ||
                            "Phone number must have at least 5 digits"
                          );
                        },
                        maxDigits: (value) => {
                          const digitCount =
                            value?.replace(/[^0-9]/g, "").length || 0;
                          return (
                            digitCount <= 15 ||
                            "Phone number cannot exceed 15 digits"
                          );
                        },
                      },
                    })}
                  />
                  {errors.phoneNumber && (
                    <span className="text-danger" style={{ fontSize: "10px" }}>
                      {errors.phoneNumber.message}
                    </span>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label
                    className="mb-1 fw-semibold opacity-75"
                    style={{ fontSize: "14px", color: "#16213DB2" }}
                  >
                    Email Address <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    style={{ fontSize: "12px", backgroundColor: "#F9FAFB" }}
                    className="py-3"
                    type="email"
                    placeholder="Enter Email Address"
                    autoComplete="off"
                    name="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Please enter a valid email address",
                      },
                    })}
                  />
                  {errors.email && (
                    <span className="text-danger" style={{ fontSize: "10px" }}>
                      {errors.email.message}
                    </span>
                  )}
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label
                    className="mb-1 fw-semibold opacity-75"
                    style={{ fontSize: "14px", color: "#16213DB2" }}
                  >
                    Street
                  </Form.Label>
                  <Form.Control
                    style={{ fontSize: "12px", backgroundColor: "#F9FAFB" }}
                    className="py-3"
                    type="text"
                    placeholder="Enter Street Area"
                    autoComplete="off"
                    name="street"
                    onKeyDown={(e) => {
                      if (e.target.value.length === 0 && e.key === " ") {
                        e.preventDefault();
                      }
                      const isEmoji =
                        /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(
                          e.key
                        );
                      if (
                        (!/^[a-zA-Z0-9\s,.-]$/.test(e.key) || isEmoji) &&
                        e.key.length === 1 &&
                        !["Backspace", "Delete", "Tab", "Enter"].includes(e.key)
                      ) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e) => {
                      const pastedText = e.clipboardData.getData("text");
                      const hasEmoji =
                        /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(
                          pastedText
                        );
                      if (!/^[A-Za-z0-9\s,.-]+$/.test(pastedText) || hasEmoji) {
                        e.preventDefault();
                      }
                    }}
                    {...register("street")}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label
                    className="mb-1 fw-semibold opacity-75"
                    style={{ fontSize: "14px", color: "#16213DB2" }}
                  >
                    State
                  </Form.Label>
                  <Controller
                    name="state"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={stateOptions}
                        placeholder="Select State"
                        styles={customSelectStyles}
                        onInputChange={(data) => {
                          dispatch(getStates({ search: data, limit: 50 }));
                        }}
                        onChange={(e) => {
                          field.onChange(e);
                          setSelectedState(e);
                          dispatch(getCities({ stateCode: e }));
                        }}
                        isClearable
                        isSearchable
                      />
                    )}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label
                    className="mb-1 fw-semibold opacity-75"
                    style={{ fontSize: "14px", color: "#16213DB2" }}
                  >
                    City
                  </Form.Label>
                  <Controller
                    name="city"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={cityOptions}
                        placeholder="Select City"
                        styles={customSelectStyles}
                        onInputChange={(data) => {
                          dispatch(
                            getCities({
                              search: data,
                              stateCode: selectedState,
                            })
                          );
                        }}
                        isClearable
                        isSearchable
                      />
                    )}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label
                    className="mb-1 fw-semibold opacity-75"
                    style={{ fontSize: "14px", color: "#16213DB2" }}
                  >
                    Pincode
                  </Form.Label>
                  <Form.Control
                    style={{ fontSize: "12px", backgroundColor: "#F9FAFB" }}
                    className="py-3"
                    type="text"
                    placeholder="Enter PINCODE"
                    autoComplete="off"
                    name="pincode"
                    onKeyDown={(e) => {
                      if (e.target.value.length === 0 && e.key === " ") {
                        e.preventDefault();
                      }
                      if (
                        !/^[0-9]$/.test(e.key) &&
                        ![
                          "Backspace",
                          "Delete",
                          "Tab",
                          "Enter",
                          "ArrowLeft",
                          "ArrowRight",
                        ].includes(e.key)
                      ) {
                        e.preventDefault();
                      }
                      if (/^[0-9]$/.test(e.key) && e.target.value.length >= 6) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e) => {
                      const pastedText = e.clipboardData.getData("text");
                      if (!/^[0-9]+$/.test(pastedText)) {
                        e.preventDefault();
                      }
                    }}
                    {...register("pincode", {
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "Pincode must contain only numbers",
                      },
                      maxLength: {
                        value: 6,
                        message: "Pincode cannot exceed 6 digits",
                      },
                    })}
                  />
                  {errors.pincode && (
                    <span className="text-danger" style={{ fontSize: "10px" }}>
                      {errors.pincode.message}
                    </span>
                  )}
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label
                    className="mb-1 fw-semibold opacity-75"
                    style={{ fontSize: "14px", color: "#16213DB2" }}
                  >
                    Full Address
                  </Form.Label>
                  <Form.Control
                    style={{ fontSize: "12px", backgroundColor: "#F9FAFB" }}
                    className="py-3"
                    as="textarea"
                    rows={1}
                    placeholder="Enter Full Address"
                    autoComplete="off"
                    name="fullAddress"
                    onKeyDown={(e) => {
                      if (e.target.value.length === 0 && e.key === " ") {
                        e.preventDefault();
                      }
                      const isEmoji =
                        /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(
                          e.key
                        );
                      if (
                        (!/^[a-zA-Z0-9\s,.-]$/.test(e.key) || isEmoji) &&
                        e.key.length === 1 &&
                        !["Backspace", "Delete", "Tab", "Enter"].includes(e.key)
                      ) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e) => {
                      const pastedText = e.clipboardData.getData("text");
                      const hasEmoji =
                        /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(
                          pastedText
                        );
                      if (!/^[A-Za-z0-9\s,.-]+$/.test(pastedText) || hasEmoji) {
                        e.preventDefault();
                      }
                    }}
                    {...register("fullAddress")}
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>
        );
      case 3:
        return (
          <div className="p-4" style={{ minHeight: "400px" }}>
            <Row className="mt-5">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label
                    className="mb-1 fw-semibold opacity-75"
                    style={{ fontSize: "14px", color: "#16213DB2" }}
                  >
                    Allergies
                    <span
                      className="ms-2"
                      style={{ cursor: "pointer" }}
                      onClick={() => setShowAllergyModal(true)}
                    >
                      <RiAddLine
                        title="Add Allergies"
                        className="text-danger border border-1 rounded-1"
                      />
                    </span>
                  </Form.Label>
                  <Controller
                    name="allergies"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={AllergiesList?.map((allergy) => ({
                          value: allergy._id,
                          label: allergy.name,
                        }))}
                        placeholder="Select Allergies"
                        styles={customSelectStyles}
                        isClearable
                        isSearchable
                        isMulti
                      />
                    )}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label
                    className="mb-1 fw-semibold opacity-75"
                    style={{ fontSize: "14px", color: "#16213DB2" }}
                  >
                    Existing Medical Conditions
                  </Form.Label>
                  <Form.Select
                    style={{ fontSize: "12px", backgroundColor: "#F9FAFB" }}
                    className="py-3"
                    {...register("medicalConditions")}
                  >
                    <option value="">Select One</option>
                    <option value="Critical">Critical</option>
                    <option value="Normal">Normal</option>\{" "}
                    <option value="Fair">Fair</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label
                    className="mb-1 fw-semibold opacity-75"
                    style={{ fontSize: "14px", color: "#16213DB2" }}
                  >
                    Current Medications
                  </Form.Label>
                  <Form.Select
                    style={{ fontSize: "12px", backgroundColor: "#F9FAFB" }}
                    className="py-3"
                    {...register("currentMedications")}
                  >
                    <option value="">Select One</option>
                    <option value="none">None</option>
                    <option value="prescription">
                      Prescription Medications
                    </option>
                    <option value="otc">Over-the-counter</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label
                    className="mb-1 fw-semibold opacity-75"
                    style={{ fontSize: "14px", color: "#16213DB2" }}
                  >
                    Medical History
                  </Form.Label>
                  <div className="d-flex gap-4 mt-2">
                    <Form.Check
                      type="radio"
                      label="Yes"
                      value="yes"
                      className="custom-radio-label"
                      {...register("medicalHistory")}
                    />
                    <Form.Check
                      type="radio"
                      label="No"
                      value="no"
                      className="custom-radio-label"
                      {...register("medicalHistory")}
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>
          </div>
        );
      case 4:
        return (
          <div className="p-4" style={{ minHeight: "400px" }}>
            <Row className="mt-5">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label
                    className="mb-1 fw-semibold opacity-75"
                    style={{ fontSize: "14px", color: "#16213DB2" }}
                  >
                    Registration Date
                  </Form.Label>
                  <Form.Control
                    style={{ fontSize: "12px", backgroundColor: "#F9FAFB" }}
                    className="py-3"
                    type="date"
                    autoComplete="off"
                    {...register("registrationDate")}
                  />
                </Form.Group>
              </Col>
              {UserRole === "doctor" ? (
                <></>
              ) : (
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label
                      className="mb-1 fw-semibold opacity-75"
                      style={{ fontSize: "14px", color: "#16213DB2" }}
                    >
                      Assigned to <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                      style={{ fontSize: "12px", backgroundColor: "#F9FAFB" }}
                      className="py-3"
                      {...register("doctorId", {
                        required: "Doctor assignment is required",
                      })}
                    >
                      <option value="">Select One</option>
                      {DoctorData?.map((doctor) => (
                        <option key={doctor._id} value={doctor._id}>
                          {doctor.firstName} {doctor.lastName}
                        </option>
                      ))}
                    </Form.Select>
                    {errors.doctorId && (
                      <span
                        className="text-danger"
                        style={{ fontSize: "10px" }}
                      >
                        {errors.doctorId.message}
                      </span>
                    )}
                  </Form.Group>
                </Col>
              )}

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label
                    className="mb-1 fw-semibold opacity-75"
                    style={{ fontSize: "14px", color: "#16213DB2" }}
                  >
                    Patient Category
                  </Form.Label>
                  <Form.Select
                    style={{ fontSize: "12px", backgroundColor: "#F9FAFB" }}
                    className="py-3"
                    {...register("patientCategory")}
                  >
                    <option value="">Select One</option>
                    <option value="regular">Regular</option>
                    <option value="premium">Premium</option>
                    <option value="vip">VIP</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label
                    className="mb-1 fw-semibold opacity-75"
                    style={{ fontSize: "14px", color: "#16213DB2" }}
                  >
                    Fitbit Consent
                  </Form.Label>
                  <div className="d-flex gap-4 mt-2">
                    <Form.Check
                      type="radio"
                      label="Yes"
                      value="yes"
                      className="custom-radio-label"
                      {...register("fitbitConsent")}
                    />
                    <Form.Check
                      type="radio"
                      label="No"
                      value="no"
                      className="custom-radio-label"
                      {...register("fitbitConsent")}
                    />
                  </div>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label
                    className="mb-1 fw-semibold opacity-75"
                    style={{ fontSize: "14px", color: "#16213DB2" }}
                  >
                    Notes
                  </Form.Label>
                  <Form.Control
                    style={{ fontSize: "12px", backgroundColor: "#F9FAFB" }}
                    className="py-3"
                    as="textarea"
                    rows={4}
                    placeholder="Write Note"
                    autoComplete="off"
                    onKeyDown={(e) => {
                      if (e.target.value.length === 0 && e.key === " ") {
                        e.preventDefault();
                      }
                      const isEmoji =
                        /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(
                          e.key
                        );
                      if (
                        (!/^[a-zA-Z0-9\s,.-]$/.test(e.key) || isEmoji) &&
                        e.key.length === 1 &&
                        !["Backspace", "Delete", "Tab", "Enter"].includes(e.key)
                      ) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e) => {
                      const pastedText = e.clipboardData.getData("text");
                      const hasEmoji =
                        /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(
                          pastedText
                        );
                      if (!/^[A-Za-z0-9\s,.-]+$/.test(pastedText) || hasEmoji) {
                        e.preventDefault();
                      }
                    }}
                    {...register("notes")}
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <style>{customRadioStyle}</style>
      <Modal
        show={show && !showAllergyModal}
        onHide={handleClose}
        size="xl"
        backdrop="static"
      >
        <Modal.Body className="p-3" style={{ borderRadius: "15px" }}>
          <div className="position-relative">
            <div
              onClick={handleClose}
              style={{
                position: "absolute",
                top: "13px",
                right: "13px",
                zIndex: 1001,
                cursor: "pointer",
                fontSize: "20px",
                color: "#333",
                padding: "5px",
              }}
            >
              <FaTimes />
            </div>
            <div
              className="d-flex"
              style={{
                height: "500px",
                borderRadius: "15px",
                overflow: "hidden",
              }}
            >
              {/* Sidebar */}
              <div
                style={{
                  width: "350px",
                  minWidth: "350px",
                  maxWidth: "350px",
                  backgroundColor: "#E0ECF8",
                  padding: "30px 20px",
                  borderRadius: "15px",
                  flexShrink: 0,
                }}
              >
                <h4
                  className="fw-bold mb-5 pb-1"
                  style={{ fontSize: "22px", color: "#121212" }}
                >
                  Update Patient
                </h4>
                {steps.map((step, index) => (
                  <div key={step.id} className="position-relative mb-5 pb-2">
                    <div
                      className="d-flex align-items-center"
                      onClick={() => handleStepClick(step.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <div
                        className={`rounded-circle d-flex align-items-center justify-content-center me-3 ${
                          step.completed || currentStep === step.id
                            ? "text-white"
                            : "bg-light text-muted"
                        }`}
                        style={{
                          width: "40px",
                          height: "40px",
                          fontSize: "16px",
                          fontWeight: "bold",
                          backgroundColor:
                            step.completed || currentStep === step.id
                              ? "#003465"
                              : "#f8f9fa",
                          border:
                            step.completed || currentStep === step.id
                              ? "none"
                              : "2px solid #dee2e6",
                        }}
                      >
                        {step.completed ? <MdDone /> : step.id}
                      </div>
                      <div>
                        <div
                          className="fw-semibold"
                          style={{
                            fontSize: "14px",
                            lineHeight: "1.2",
                            color: "#003465",
                          }}
                        >
                          {step.title}
                        </div>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        style={{
                          width: "2px",
                          height: "40px",
                          backgroundColor: "#dee2e6",
                          position: "absolute",
                          left: "19px",
                          top: "50px",
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Content */}
              <div
                className="flex-fill d-flex flex-column"
                style={{
                  borderTopRightRadius: "15px",
                  borderBottomRightRadius: "15px",
                  backgroundColor: "white",
                }}
              >
                <Form
                  key={currentStep}
                  onSubmit={handleSubmit(onSubmit)}
                  className="h-100 d-flex flex-column"
                  autoComplete="off"
                >
                  <div
                    className="flex-fill"
                    style={{ height: "480px", overflowY: "auto" }}
                  >
                    {renderStepContent()}
                  </div>

                  {/* Footer Buttons */}
                  <div
                    className="d-flex justify-content-end gap-3 p-4 py-1 bg-white"
                    style={{
                      minHeight: "55px",
                      borderBottomRightRadius: "15px",
                    }}
                  >
                    {currentStep > 1 && (
                      <Button
                        className="bg-secondary border-0"
                        onClick={handleBack}
                        disabled={Loading}
                        style={{
                          minWidth: "100px",
                          height: "46px",
                          fontWeight: "600",
                          textTransform: "uppercase",
                        }}
                      >
                        BACK
                      </Button>
                    )}
                    <Button
                      type="submit"
                      disabled={Loading}
                      style={{
                        minWidth: "100px",
                        height: "46px",
                        backgroundColor: "#28a745",
                        border: "none",
                        fontWeight: "600",
                        textTransform: "uppercase",
                      }}
                    >
                      SUBMIT
                    </Button>
                    {currentStep < 4 && (
                      <Button
                        onClick={handleNext}
                        disabled={Loading}
                        style={{
                          minWidth: "100px",
                          height: "46px",
                          backgroundColor: "#003465",
                          border: "none",
                          fontWeight: "600",
                          textTransform: "uppercase",
                        }}
                      >
                        NEXT
                      </Button>
                    )}
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <AddAllergyModal
        show={showAllergyModal}
        onHide={() => setShowAllergyModal(false)}
      />
    </>
  );
};

export default UpdatePatientModal;
