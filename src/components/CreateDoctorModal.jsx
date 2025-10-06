import React, { useState, useEffect, useCallback } from "react";
import { Modal, Form, Row, Col, Button, InputGroup } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  createDoctor,
  resetCreateDoctor,
  getStates,
  getCities,
  getSkills,
  getSpecializations,
  getQualification,
} from "../redux/actions";
import { FaTimes, FaEye, FaEyeSlash } from "react-icons/fa";
import { RiAddLine } from "react-icons/ri";
import Select from "react-select";
import { MdDone } from "react-icons/md";
import AddSpecialSkillModal from "./SpecialSkill/AddSpecialSkillModal";
import AddSpecializationModal from "./Specialization/AddSpecializationModal";
import AddDegreeModal from "./CreateDegree/AddDegreeModal";
import { toast } from "react-toastify";

// CSS for custom radio label styling
const customRadioStyle = `
.custom-radio-label .form-check-label {
    font-size: 12px !important;
    font-weight: 600 !important;
    color: #858B9A !important;
}
`;

const CreateDoctorModal = ({ show, onHide }) => {
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showSpecialSkillModal, setShowSpecialSkillModal] = useState(false);
  const [showSpecializationModal, setShowSpecializationModal] = useState(false);
  const [showDegreeModal, setShowDegreeModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const CreateResponse = useSelector(
    (state) => state?.createDoctorReducer?.data?.status
  );

  const Loading = useSelector((state) => state?.createDoctorReducer?.loading);
  const StatesData = useSelector(
    (state) => state?.getStatesReducer?.data?.data
  );
  const CitiesData = useSelector(
    (state) => state?.getCitiesReducer?.data?.data
  );
  const SkillsData = useSelector(
    (state) => state?.getSkillsReducer?.data?.data
  );
  const SpecializationsData = useSelector(
    (state) => state?.getSpecializationsReducer?.data?.data
  );
  const qualificationsData = useSelector(
    (state) => state?.getQualificationReducer?.data?.data
  );

  const userInfo = JSON.parse(localStorage.getItem("user"));
  const UserRole = userInfo?.role;
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

  const groupedSkillOptions =
    SkillsData?.map((categoryData) => ({
      label: categoryData?.category,
      options:
        categoryData?.skills?.map((skill) => ({
          value: skill?._id,
          label: skill?.name,
        })) || [],
    })) || [];

  const groupedSpecializationOptions =
    SpecializationsData?.reduce((acc, item) => {
      const existingCategory = acc.find(
        (group) => group.label === item.category
      );
      if (existingCategory) {
        existingCategory.options.push({
          value: item._id,
          label: item.name,
        });
      } else {
        acc.push({
          label: item.category,
          options: [
            {
              value: item._id,
              label: item.name,
            },
          ],
        });
      }
      return acc;
    }, []) || [];

  const groupedQualificationsDataOptions =
    qualificationsData?.reduce((acc, item) => {
      const existingCategory = acc.find(
        (group) => group.label === item.category
      );
      if (existingCategory) {
        existingCategory.options.push({
          value: item._id, // Send _id
          label: item.degree, // Show degree
        });
      } else {
        acc.push({
          label: item.category,
          options: [
            {
              value: item._id, // Send _id
              label: item.degree, // Show degree
            },
          ],
        });
      }
      return acc;
    }, []) || [];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

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
      fontSize: "11px",
      padding: "8px 12px",
    }),
    groupHeading: (provided) => ({
      ...provided,
      fontSize: "11px",
      fontWeight: "600",
      padding: "6px 12px",
      backgroundColor: "#f8f9fa",
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: "200px",
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
    { id: 1, title: "Basic Information", completed: currentStep > 1 },
    { id: 2, title: "Professional Details", completed: currentStep > 2 },
    { id: 3, title: "Practice Information", completed: currentStep > 3 },
    { id: 4, title: "Additional Info", completed: currentStep > 4 },
  ];

  useEffect(() => {
    if (show && !isModalOpen) {
      setIsModalOpen(true);
      setCurrentStep(1);
      reset();
      setSelectedImage(null);
      dispatch(resetCreateDoctor());
    } else if (!show && isModalOpen) {
      setIsModalOpen(false);
    }
  }, [show, isModalOpen, reset, dispatch]);

  useEffect(() => {
    if (show && isModalOpen) {
      dispatch(getStates({ search: "" }));
      dispatch(getSkills());
      dispatch(getSpecializations());
      dispatch(getQualification());
    }
  }, [show, isModalOpen, dispatch]);

  useEffect(() => {
    if (CreateResponse === 201 && isModalOpen) {
      reset();
      setCurrentStep(1);
      setSelectedImage(null);
      setShowSpecialSkillModal(false);
      setShowSpecializationModal(false);
      setShowDegreeModal(false);
      setIsModalOpen(false);
      onHide();
      dispatch(resetCreateDoctor());
    } else if (CreateResponse && CreateResponse !== 201) {
      dispatch(resetCreateDoctor());
    }
  }, [CreateResponse, isModalOpen, reset, onHide, dispatch]);

  const handleNext = async () => {
    let fieldsToValidate = [];

    if (currentStep === 1) {
      fieldsToValidate = ["firstName", "lastName", "email", "password"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["specialization", "qualification"];
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

  const onSubmit = (data) => {
    const selectedState = stateOptions?.find(
      (state) => state?.value === data?.state?.value
    );

    // Create initial payload
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      phoneNumber: data.phone,
      role: "admin",
      gender: data.gender,
      age: data.age,
      dateOfBirth: data.dateOfBirth,
      fullAddress: data.fullAddress,
      specializations: data.specialization
        ? [data.specialization.value]
        : undefined,
      skills:
        data.specialSkill && data.specialSkill.length > 0
          ? Array.isArray(data.specialSkill)
            ? data.specialSkill.map((skill) => skill.value)
            : [data.specialSkill.value]
          : undefined,
      yearOfExperience: data.experience,
      consultationType: data.consultationType,
      patients: [],
      timings: data.timings,
      languageKnown: data.languages ? [data.languages] : undefined,
      medicalLicenseNumber: data.licenseNumber,
      qualifications: data.qualification
        ? [data.qualification.value]
        : undefined,
      hospitalName: data.hospitalName,
      clinicName: data.clinicName,
      clinicAddress: {
        street: data.street,
        city: data.city?.value || data.city,
        state: selectedState?.data?._id,
        country: "India",
        zip: data.pincode,
      },
      registrationDate:
        data.registrationDate || new Date().toISOString().split("T")[0],
      about: data.aboutDoctor,
      isActive: true,
      isDeleted: false,
      lastLogin: null,
    };

    // 🧹 Remove empty, null, undefined, or blank-string fields from payload
    const cleanPayload = (obj) => {
      if (Array.isArray(obj)) {
        return obj
          .map((item) => cleanPayload(item))
          .filter((item) => item !== undefined && item !== null && item !== "");
      } else if (typeof obj === "object" && obj !== null) {
        const newObj = {};
        Object.keys(obj).forEach((key) => {
          const value = cleanPayload(obj[key]);
          if (
            value !== undefined &&
            value !== null &&
            value !== "" &&
            !(Array.isArray(value) && value.length === 0)
          ) {
            newObj[key] = value;
          }
        });
        return Object.keys(newObj).length > 0 ? newObj : undefined;
      }
      return obj;
    };

    const filteredPayload = cleanPayload(payload);

    // ✅ If image selected, send as FormData
    if (selectedImage) {
      const formData = new FormData();
      Object.keys(filteredPayload).forEach((key) => {
        if (
          typeof filteredPayload[key] === "object" &&
          !(filteredPayload[key] instanceof File)
        ) {
          formData.append(key, JSON.stringify(filteredPayload[key]));
        } else {
          formData.append(key, filteredPayload[key]);
        }
      });
      formData.append("image", selectedImage);
      dispatch(createDoctor(formData));
    } else {
      dispatch(createDoctor(filteredPayload));
    }
  };

  const handleClose = useCallback(() => {
    if (isModalOpen) {
      reset();
      setCurrentStep(1);
      setSelectedImage(null);
      setShowSpecialSkillModal(false);
      setShowSpecializationModal(false);
      setShowDegreeModal(false);
      dispatch(resetCreateDoctor());
      setIsModalOpen(false);
      onHide();
    }
  }, [isModalOpen, reset, onHide, dispatch]);

  const preventFirstSpace = (e) => {
    if (e.target.value.length === 0 && e.key === " ") {
      e.preventDefault();
    }
  };

  const handleInputChange = (e, onChange) => {
    let { value } = e.target;

    // Do not allow space as first character
    if (value.length === 1 && value[0] === " ") {
      return;
    }

    onChange(e);
  };

  // Prevent rendering if modal should not be open
  if (!show) {
    return null;
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="p-4" style={{ minHeight: "400px" }}>
            <Row className="mt-2">
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
                      preventFirstSpace(e);
                      // Block emojis, numbers, and special characters
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
                      minLength: {
                        value: 2,
                        message: "Name is too short",
                      },
                      pattern: {
                        value: /^[A-Za-z]+(?:\s[A-Za-z]+)*$/,
                        message:
                          "Only alphabets are allowed (no emojis, numbers, or special characters)",
                      },
                      validate: {
                        noLeadingSpace: (value) =>
                          value?.trim() === value ||
                          "Name cannot start or end with spaces",
                        noMultipleSpaces: (value) =>
                          !/\s{2,}/.test(value) ||
                          "Multiple consecutive spaces are not allowed",
                        noEmojis: (value) =>
                          !/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(
                            value
                          ) || "Emojis are not allowed",
                      },
                      onChange: (e) =>
                        handleInputChange(e, (e) =>
                          setValue("firstName", e.target.value)
                        ),
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
                      preventFirstSpace(e);
                      // Block emojis, numbers, and special characters
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
                      minLength: {
                        value: 2,
                        message: "Name is too short",
                      },
                      pattern: {
                        value: /^[A-Za-z]+(?:\s[A-Za-z]+)*$/,
                        message:
                          "Only alphabets are allowed (no emojis, numbers, or special characters)",
                      },
                      validate: {
                        noLeadingSpace: (value) =>
                          value?.trim() === value ||
                          "Name cannot start or end with spaces",
                        noMultipleSpaces: (value) =>
                          !/\s{2,}/.test(value) ||
                          "Multiple consecutive spaces are not allowed",
                        noEmojis: (value) =>
                          !/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(
                            value
                          ) || "Emojis are not allowed",
                      },
                      onChange: (e) =>
                        handleInputChange(e, (e) =>
                          setValue("lastName", e.target.value)
                        ),
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
                    Date Of Birth (DOB)
                  </Form.Label>
                  <Form.Control
                    style={{ fontSize: "12px", backgroundColor: "#F9FAFB" }}
                    className="py-3"
                    type="date"
                    max={
                      new Date(
                        new Date().setFullYear(new Date().getFullYear() - 18)
                      )
                        .toISOString()
                        .split("T")[0]
                    }
                    autoComplete="off"
                    {...register("dateOfBirth", {
                      validate: (value) =>
                        !value ||
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
                    Phone Number
                  </Form.Label>
                  <Form.Control
                    style={{ fontSize: "12px", backgroundColor: "#F9FAFB" }}
                    className="py-3"
                    type="tel"
                    placeholder="Enter Phone Number"
                    autoComplete="off"
                    onKeyDown={(e) => {
                      preventFirstSpace(e);
                      const digitCount = e.target.value.replace(
                        /[^0-9]/g,
                        ""
                      ).length;
                      // Only allow numbers, +, -, (, ), and space
                      if (
                        !/^[0-9+\-()\s]$/.test(e.key) &&
                        e.key.length === 1 &&
                        !["Backspace", "Delete", "Tab", "Enter"].includes(e.key)
                      ) {
                        e.preventDefault();
                      }
                      // Prevent more than 15 digits
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
                    {...register("phone", {
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
                      onChange: (e) =>
                        handleInputChange(e, (e) =>
                          setValue("phone", e.target.value)
                        ),
                    })}
                  />
                  {errors.phone && (
                    <span className="text-danger" style={{ fontSize: "10px" }}>
                      {errors.phone.message}
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
                    Email ID <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    style={{ fontSize: "12px", backgroundColor: "#F9FAFB" }}
                    className="py-3"
                    type="email"
                    placeholder="Enter Email ID"
                    autoComplete="off"
                    onKeyDown={(e) => {
                      preventFirstSpace(e);
                      const isEmoji =
                        /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(
                          e.key
                        );
                      if (isEmoji && e.key.length === 1) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e) => {
                      const pastedText = e.clipboardData.getData("text");
                      const hasEmoji =
                        /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(
                          pastedText
                        );
                      if (hasEmoji) {
                        e.preventDefault();
                      }
                    }}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Please enter a valid email address",
                      },
                      validate: {
                        noEmojis: (value) =>
                          !/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(
                            value
                          ) || "Emojis are not allowed in email",
                      },
                      onChange: (e) =>
                        handleInputChange(e, (e) =>
                          setValue("email", e.target.value)
                        ),
                    })}
                  />
                  {errors.email && (
                    <span className="text-danger" style={{ fontSize: "10px" }}>
                      {errors.email.message}
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
                    Password <span className="text-danger">*</span>
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      style={{
                        fontSize: "12px",
                        backgroundColor: "#F9FAFB",
                        borderRight: "0px",
                      }}
                      className="py-3"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter Password"
                      autoComplete="off"
                      onKeyDown={(e) => {
                        preventFirstSpace(e);
                        const isEmoji =
                          /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(
                            e.key
                          );
                        if (isEmoji && e.key.length === 1) {
                          e.preventDefault();
                        }
                      }}
                      onPaste={(e) => {
                        const pastedText = e.clipboardData.getData("text");
                        const hasEmoji =
                          /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(
                            pastedText
                          );
                        if (hasEmoji) {
                          e.preventDefault();
                        }
                      }}
                      {...register("password", {
                        required: "Password is required",
                        validate: {
                          noEmojis: (value) =>
                            !/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(
                              value
                            ) || "Emojis are not allowed in password",
                          minLength: (value) =>
                            value?.length >= 8 ||
                            "Password must be at least 8 characters",
                          hasUppercaseAndNumber: (value) => {
                            const hasUppercase = /[A-Z]/.test(value);
                            const hasNumberOrSpecial =
                              /[0-9!@#$%^&*(),.?":{}|<>]/.test(value);
                            return (
                              (hasUppercase && hasNumberOrSpecial) ||
                              "Password must include a number or special character"
                            );
                          },
                        },
                        onChange: (e) =>
                          handleInputChange(e, (e) =>
                            setValue("password", e.target.value)
                          ),
                      })}
                    />
                    <InputGroup.Text
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ cursor: "pointer", backgroundColor: "#F9FAFB" }}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </InputGroup.Text>
                  </InputGroup>
                  {errors.password && (
                    <span className="text-danger" style={{ fontSize: "10px" }}>
                      {errors.password.message}
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
                    Profile Photo
                  </Form.Label>
                  <Form.Control
                    style={{ fontSize: "12px", backgroundColor: "#F9FAFB" }}
                    className="py-3"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    {...register("profilePhoto", {
                      validate: {
                        fileType: (files) => {
                          if (!files || files.length === 0) return true;
                          const file = files[0];
                          const allowedTypes = [
                            "image/jpeg",
                            "image/jpg",
                            "image/png",
                            "image/gif",
                            "image/webp",
                          ];
                          return (
                            allowedTypes.includes(file.type) ||
                            "Only image files (.png, .jpg, .jpeg, .gif, .webp) are allowed"
                          );
                        },
                      },
                    })}
                  />
                  {errors.profilePhoto && (
                    <span className="text-danger" style={{ fontSize: "10px" }}>
                      {errors.profilePhoto.message}
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
                    Gender
                  </Form.Label>
                  <div className="d-flex gap-4 mt-2">
                    <Form.Check
                      type="radio"
                      label="Male"
                      value="male"
                      className="custom-radio-label"
                      {...register("gender")}
                    />
                    <Form.Check
                      type="radio"
                      label="Female"
                      value="female"
                      className="custom-radio-label"
                      {...register("gender")}
                    />
                    <Form.Check
                      type="radio"
                      label="Other"
                      value="other"
                      className="custom-radio-label"
                      {...register("gender")}
                    />
                  </div>
                  {/* {errors.gender && <span className="text-danger" style={{ fontSize: '10px' }}>{errors.gender.message}</span>} */}
                </Form.Group>
              </Col>
            </Row>
          </div>
        );
      case 2:
        return (
          <div className="p-4" style={{ minHeight: "400px" }}>
            <Row className="mt-5">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label
                    className="mb-1 fw-semibold opacity-75"
                    style={{ fontSize: "14px", color: "#16213DB2" }}
                  >
                    Specialization <span className="text-danger">*</span>
                    <span
                      className="ms-2"
                      style={{ cursor: "pointer" }}
                      onClick={() => setShowSpecializationModal(true)}
                    >
                      <RiAddLine
                        title="Add Specialization"
                        className="text-danger border border-1 rounded-1"
                      />
                    </span>
                  </Form.Label>
                  <Controller
                    name="specialization"
                    control={control}
                    rules={{ required: "Specialization is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={groupedSpecializationOptions}
                        placeholder="Select Specialization"
                        styles={customSelectStyles}
                        isClearable
                        isSearchable
                        maxMenuHeight={200}
                      />
                    )}
                  />
                  {errors.specialization && (
                    <span className="text-danger" style={{ fontSize: "10px" }}>
                      {errors.specialization.message}
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
                    Qualification <span className="text-danger">*</span>
                    <span
                      className="ms-2"
                      style={{ cursor: "pointer" }}
                      onClick={() => setShowDegreeModal(true)}
                    >
                      <RiAddLine
                        title="Add Degree"
                        className="text-danger border border-1 rounded-1"
                      />
                    </span>
                  </Form.Label>

                  <Controller
                    name="qualification"
                    control={control}
                    rules={{ required: "Qualification is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={groupedQualificationsDataOptions}
                        placeholder="Select Qualification"
                        styles={customSelectStyles}
                        isClearable
                        isSearchable
                        maxMenuHeight={200}
                      />
                    )}
                  />
                  {errors.qualification && (
                    <span className="text-danger" style={{ fontSize: "10px" }}>
                      {errors.qualification.message}
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
                    Years Of Experience
                  </Form.Label>
                  <Form.Select
                    style={{ fontSize: "12px", backgroundColor: "#F9FAFB" }}
                    className="py-3"
                    {...register("experience")}
                  >
                    <option value="">Enter Your Work Experience</option>
                    <option value="0-2 years">0-2 years</option>
                    <option value="2-4 years">2-4 years</option>
                    <option value="4-6 years">4-6 years</option>
                    <option value="6-8 years">6-8 years</option>
                    <option value="8-10 years">8-10 years</option>
                    <option value="10+ years">10+ years</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label
                    className="mb-1 fw-semibold opacity-75"
                    style={{ fontSize: "14px", color: "#16213DB2" }}
                  >
                    Medical License Number
                  </Form.Label>
                  <Form.Control
                    style={{ fontSize: "12px", backgroundColor: "#F9FAFB" }}
                    className="py-3"
                    type="text"
                    placeholder="Enter Medical License Number"
                    onKeyDown={preventFirstSpace}
                    {...register("licenseNumber", {
                      onChange: (e) =>
                        handleInputChange(e, (e) =>
                          setValue("licenseNumber", e.target.value)
                        ),
                    })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label
                    className="mb-1 fw-semibold opacity-75"
                    style={{ fontSize: "14px", color: "#16213DB2" }}
                  >
                    Consultation Type
                  </Form.Label>
                  <Form.Select
                    style={{ fontSize: "12px", backgroundColor: "#F9FAFB" }}
                    className="py-3"
                    {...register("consultationType")}
                  >
                    <option value="">Select One</option>
                    <option value="Online">Online</option>
                    <option value="Home Visit">Home Visit</option>
                    <option value="Both">Both</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label
                    className="mb-1 fw-semibold opacity-75"
                    style={{ fontSize: "14px", color: "#16213DB2" }}
                  >
                    Languages Known
                  </Form.Label>
                  <Form.Select
                    style={{ fontSize: "12px", backgroundColor: "#F9FAFB" }}
                    className="py-3"
                    {...register("languages")}
                  >
                    <option value="">Select One</option>
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </div>
        );
      case 3:
        return (
          <div className="p-4" style={{ minHeight: "400px" }}>
            <Row className="mt-5">
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label
                    className="mb-1 fw-semibold opacity-75"
                    style={{ fontSize: "14px", color: "#16213DB2" }}
                  >
                    Clinic Name
                  </Form.Label>
                  <Form.Control
                    style={{ fontSize: "12px", backgroundColor: "#F9FAFB" }}
                    className="py-3"
                    type="text"
                    placeholder="Enter Clinic Name"
                    autoComplete="off"
                    onKeyDown={preventFirstSpace}
                    {...register("clinicName", {
                      onChange: (e) =>
                        handleInputChange(e, (e) =>
                          setValue("clinicName", e.target.value)
                        ),
                    })}
                  />
                </Form.Group>
              </Col>
              {/* <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className='mb-1 fw-semibold opacity-75' style={{ fontSize: '14px', color: '#16213DB2' }}>Fees</Form.Label>
                                    <Form.Control
                                        style={{ fontSize: '12px', backgroundColor: '#F9FAFB' }}
                                        className='py-3'
                                        type="text"
                                        placeholder="Enter Consultation Fees"
                                        autoComplete="off"
                                        {...register('fees')}
                                    />
                                </Form.Group>
                            </Col> */}
              <Col md={12}>
                <h4
                  className="fw-bold mb-3 mt-2"
                  style={{ fontSize: "16px", color: "#16213D" }}
                >
                  Clinic Address
                </h4>
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
                    onKeyDown={preventFirstSpace}
                    {...register("street", {
                      onChange: (e) =>
                        handleInputChange(e, (e) =>
                          setValue("street", e.target.value)
                        ),
                    })}
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
                          dispatch(getStates({ search: data }));
                        }}
                        onChange={(e) => {
                          field.onChange(e);
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
                    onKeyDown={preventFirstSpace}
                    {...register("pincode", {
                      onChange: (e) =>
                        handleInputChange(e, (e) =>
                          setValue("pincode", e.target.value)
                        ),
                    })}
                  />
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
                    onKeyDown={preventFirstSpace}
                    {...register("fullAddress", {
                      onChange: (e) =>
                        handleInputChange(e, (e) =>
                          setValue("fullAddress", e.target.value)
                        ),
                    })}
                  />
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
                    defaultValue={new Date().toISOString().split("T")[0]}
                    {...register("registrationDate")}
                  />
                </Form.Group>
              </Col>
              {/* <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className='mb-1 fw-semibold opacity-75' style={{ fontSize: '14px', color: '#16213DB2' }}>Fitbit ID</Form.Label>
                                    <Form.Control
                                        style={{ fontSize: '12px', backgroundColor: '#F9FAFB' }}
                                        className='py-3'
                                        type="text"
                                        placeholder="Enter ID"
                                        autoComplete="off"
                                        {...register('fitbitId')}
                                    />
                                </Form.Group>
                            </Col> */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label
                    className="mb-1 fw-semibold opacity-75"
                    style={{ fontSize: "14px", color: "#16213DB2" }}
                  >
                    Special Skills
                    <span
                      className="ms-2"
                      style={{ cursor: "pointer" }}
                      onClick={() => setShowSpecialSkillModal(true)}
                    >
                      <RiAddLine
                        title="Add Special Skill"
                        className="text-danger border border-1 rounded-1"
                      />
                    </span>
                  </Form.Label>
                  <Controller
                    name="specialSkill"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={groupedSkillOptions}
                        placeholder="Select Skills"
                        styles={customSelectStyles}
                        isClearable
                        isSearchable
                        isMulti
                        maxMenuHeight={200}
                      />
                    )}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label
                    className="mb-1 fw-semibold opacity-75"
                    style={{ fontSize: "14px", color: "#16213DB2" }}
                  >
                    About Doctor
                  </Form.Label>
                  <Form.Control
                    style={{ fontSize: "12px", backgroundColor: "#F9FAFB" }}
                    className="py-3"
                    as="textarea"
                    rows={4}
                    placeholder="Write Here"
                    autoComplete="off"
                    onKeyDown={preventFirstSpace}
                    {...register("aboutDoctor", {
                      onChange: (e) =>
                        handleInputChange(e, (e) =>
                          setValue("aboutDoctor", e.target.value)
                        ),
                    })}
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
        show={show}
        onHide={handleClose}
        size="xl"
        backdrop="static"
        keyboard={false}
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
                  Add Doctor
                </h4>
                {steps.map((step, index) => (
                  <div key={step.id} className="position-relative mb-5 pb-2">
                    <div className="d-flex align-items-center">
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
                    {currentStep < 4 ? (
                      <Button
                        onClick={handleNext}
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
                    ) : (
                      <Button
                        type="submit"
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
                        {Loading ? "SUBMITTING..." : "SUBMIT"}
                      </Button>
                    )}
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <AddSpecialSkillModal
        show={showSpecialSkillModal}
        onHide={() => setShowSpecialSkillModal(false)}
      />
      <AddSpecializationModal
        show={showSpecializationModal}
        onHide={() => setShowSpecializationModal(false)}
      />
      <AddDegreeModal
        show={showDegreeModal}
        onHide={() => setShowDegreeModal(false)}
      />
    </>
  );
};

export default CreateDoctorModal;
