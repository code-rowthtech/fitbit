import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Modal, Form, Row, Col, Button, InputGroup } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { resetUpdateDoctor, updateDoctor, getStates, getCities, getSkills, getSpecializations } from '../redux/actions';
import { FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa';
import { MdDone } from "react-icons/md";
import { RiAddLine } from "react-icons/ri";
import Select from 'react-select';
import AddSpecialSkillModal from './SpecialSkill/AddSpecialSkillModal';
import AddSpecializationModal from './Specialization/AddSpecializationModal';


// CSS for custom radio label styling
const customRadioStyle = `
.custom-radio-label .form-check-label {
    font-size: 12px !important;
    font-weight: 600 !important;
    color: #858B9A !important;
}
`;

const UpdateDoctorModal = ({ show, onHide, doctor }) => {
    const dispatch = useDispatch();
    const [currentStep, setCurrentStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showSpecialSkillModal, setShowSpecialSkillModal] = useState(false);
    const [showSpecializationModal, setShowSpecializationModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const doctorId = doctor?._id
    const UpdateResponse = useSelector((state) => state?.updateDoctor?.data?.status);
    const Loading = useSelector((state) => state?.updateDoctor?.loading);
    const StatesData = useSelector((state) => state?.getStatesReducer?.data?.data);
    const CitiesData = useSelector((state) => state?.getCitiesReducer?.data?.data);
    const SkillsData = useSelector((state) => state?.getSkillsReducer?.data?.data);
    const SpecializationsData = useSelector((state) => state?.getSpecializationsReducer?.data?.data);

    const { register, handleSubmit, reset, setValue, formState: { errors }, trigger, watch, control } = useForm({
        mode: 'onChange'
    });

    const stateOptions = StatesData?.map(state => ({
        value: state?.code,
        label: state?.name,
        data: state
    })) || [];

    const cityOptions = CitiesData?.map(city => ({
        value: city?._id,
        label: city?.name
    })) || [];

    const groupedSkillOptions = SkillsData?.map(categoryData => ({
        label: categoryData?.category,
        options: categoryData?.skills?.map(skill => ({
            value: skill?._id,
            label: skill?.name
        })) || []
    })) || [];

    const groupedSpecializationOptions = SpecializationsData?.reduce((acc, item) => {
        const existingCategory = acc.find(group => group.label === item.category);
        if (existingCategory) {
            existingCategory.options.push({
                value: item._id,
                label: item.name
            });
        } else {
            acc.push({
                label: item.category,
                options: [{
                    value: item._id,
                    label: item.name
                }]
            });
        }
        return acc;
    }, []) || [];

    const customSelectStyles = {
        control: (provided) => ({
            ...provided,
            fontSize: '12px',
            backgroundColor: '#F9FAFB',
            minHeight: '48px',
            border: '1px solid #ced4da',
            '&:hover': {
                border: '1px solid #ced4da'
            }
        }),
        placeholder: (provided) => ({
            ...provided,
            fontSize: '12px',
            color: '#6c757d'
        }),
        singleValue: (provided) => ({
            ...provided,
            fontSize: '12px'
        }),
        option: (provided) => ({
            ...provided,
            fontSize: '11px',
            padding: '8px 12px'
        }),
        groupHeading: (provided) => ({
            ...provided,
            fontSize: '11px',
            fontWeight: '600',
            padding: '6px 12px',
            backgroundColor: '#f8f9fa'
        }),
        menuList: (provided) => ({
            ...provided,
            maxHeight: '200px'
        })
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
        }
    };

    const citySetRef = useRef(false);
    const citiesLoadedRef = useRef(false);

    const watchedDateOfBirth = watch('dateOfBirth');

    const calculateAge = (dateOfBirth) => {
        if (!dateOfBirth) return '';
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age.toString();
    };

    useEffect(() => {
        if (watchedDateOfBirth) {
            const age = calculateAge(watchedDateOfBirth);
            setValue('age', age);
        }
    }, [watchedDateOfBirth, setValue]);



    const steps = [
        { id: 1, title: 'Basic Information', completed: currentStep > 1 },
        { id: 2, title: 'Professional Details', completed: currentStep > 2 },
        { id: 3, title: 'Practice Information', completed: currentStep > 3 },
        { id: 4, title: 'Additional Info', completed: currentStep > 4 }
    ];

    useEffect(() => {
        if (show) {
            setCurrentStep(1);
            reset();
        }
    }, [show, reset]);

    useEffect(() => {
        dispatch(getStates({ search: '' }))
        dispatch(getSkills())
        dispatch(getSpecializations())
    }, [dispatch]);

    useEffect(() => {
        if (doctor && show && StatesData) {
            setValue('firstName', doctor.firstName || '');
            setValue('lastName', doctor.lastName || '');
            setValue('email', doctor.email || '');
            setValue('phone', doctor.phoneNumber || '');
            setValue('dateOfBirth', doctor.dateOfBirth ? new Date(doctor.dateOfBirth).toISOString().split('T')[0] : '');
            setValue('age', doctor.age || '');
            setValue('gender', doctor.gender || '');
            setValue('profilePhoto', doctor.profilePhoto || '');
            setValue('specialization', doctor.specializations?.[0] || '');
            setValue('qualification', doctor.qualifications?.[0] || '');
            setValue('experience', doctor.yearOfExperience || '');
            setValue('licenseNumber', doctor.medicalLicenseNumber || '');
            setValue('consultationType', doctor.consultationType || '');
            setValue('languages', doctor.languageKnown?.[0] || '');
            setValue('clinicName', doctor.clinicName || '');
            // setValue('fees', doctor.feePerConsultation || '');
            setValue('street', doctor.clinicAddress?.street || '');

            // Load cities if state exists and not already loaded
            if (doctor.clinicAddress?.state && !citiesLoadedRef.current) {
                const stateCode = StatesData.find(state =>
                    state.name === doctor.clinicAddress.state.name
                )?.code;
                const doctorState = stateOptions?.find((stateData) => stateData?.value === stateCode);
                if (stateCode) {
                    dispatch(getCities({ stateCode: doctorState, search: doctor?.clinicAddress?.city?.name }));
                    citiesLoadedRef.current = true;
                }
            }

            const stateValue = doctor.clinicAddress?.state?._id ? StatesData.find(state =>
                state.name === doctor.clinicAddress.state.name
            ) : null;
            if (stateValue) {
                setValue('state', { value: stateValue.code, label: stateValue.name, data: stateValue });
            }

            setValue('pincode', doctor.clinicAddress?.zip || '');
            setValue('fullAddress', doctor.fullAddress || '');
            setValue('registrationDate', doctor.registrationDate ? new Date(doctor.registrationDate).toISOString().split('T')[0] : '');
            setValue('specialSkill', doctor.skills?.map(skill => ({ value: skill._id, label: skill.name })) || []);
            setValue('aboutDoctor', doctor.about || '');
            setValue('isActive', doctor.isActive ? 'true' : 'false');
        }
    }, [doctor, show, StatesData, setValue, dispatch]);

    // Set city value after cities are loaded
    useEffect(() => {
        if (doctor?.clinicAddress?.city && CitiesData?.length > 0 && !citySetRef.current) {
            const cityValue = CitiesData.find(city =>
                city._id === doctor.clinicAddress.city._id ||
                city.name === doctor.clinicAddress.city.name
            );
            if (cityValue) {
                setValue('city', { value: cityValue._id, label: cityValue.name });
                citySetRef.current = true;
            }
        }
    }, [CitiesData, doctor, setValue]);

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
            dispatch(resetUpdateDoctor());
        }
    }, [UpdateResponse]);

    const handleNext = async () => {
        let fieldsToValidate = [];

        if (currentStep === 1) {
            fieldsToValidate = ['firstName', 'lastName', 'email'];
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
        const selectedState = stateOptions?.find((state) => state?.value === data?.state?.value);
        const formData = new FormData();
        
        formData.append('firstName', data.firstName || "");
        formData.append('lastName', data.lastName || "");
        formData.append('email', data.email);
        if (data.password) formData.append('password', data.password);
        if (data.phone) formData.append('phoneNumber', data.phone);
        if (data.gender) formData.append('gender', data.gender);
        if (data.age) formData.append('age', data.age);
        if (data.dateOfBirth) formData.append('dateOfBirth', data.dateOfBirth);
        formData.append('fullAddress', data.fullAddress || "");
        if (data.specialization) formData.append('specializations', JSON.stringify([data.specialization]));
        if (data.specialSkill && data.specialSkill.length > 0) {
            const skills = Array.isArray(data.specialSkill) ? data.specialSkill.map(skill => skill.value) : [data.specialSkill.value];
            skills.forEach(skillId => formData.append('skills[]', skillId));
        }
        if (data.experience) formData.append('yearOfExperience', data.experience);
        // if (data.fees) formData.append('feePerConsultation', data.fees);
        if (data.consultationType) formData.append('consultationType', data.consultationType);
        if (data.languages) formData.append('languageKnown', JSON.stringify([data.languages]));
        if (data.licenseNumber) formData.append('medicalLicenseNumber', data.licenseNumber);
        if (data.qualification) formData.append('qualifications', JSON.stringify([data.qualification]));
        if (data.clinicName) formData.append('clinicName', data.clinicName);
        if (data.street || data.city || data.state || data.pincode) {
            const clinicAddress = {
                street: data.street || "",
                city: data.city?.value || data.city || null,
                state: selectedState?.data?._id,
                country: "India",
                zip: data.pincode || "",
            };
            formData.append('clinicAddress', JSON.stringify(clinicAddress));
        }
        if (data.registrationDate) formData.append('registrationDate', data.registrationDate);
        formData.append('about', data.aboutDoctor || "");
        formData.append('isActive', data.isActive === 'true');
        if (selectedImage) formData.append('image', selectedImage);
        
        const doctorData = {
            body: formData,
            doctorId: doctorId,
        }
        dispatch(updateDoctor(doctorData));
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
                    <div className="p-4" style={{ minHeight: '400px' }}>
                        <Row className='mt-2'>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className='mb-1 fw-semibold opacity-75' style={{ fontSize: '14px', color: '#16213DB2' }}>First Name <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        style={{ fontSize: '12px', backgroundColor: '#F9FAFB' }}
                                        className='py-3'
                                        type="text"
                                        placeholder="Enter First Name"
                                        {...register('firstName', { required: 'First name is required' })}
                                    />
                                    {errors.firstName && <span className="text-danger" style={{ fontSize: '10px' }}>{errors.firstName.message}</span>}
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className='mb-1 fw-semibold opacity-75' style={{ fontSize: '14px', color: '#16213DB2' }}>Last Name <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        style={{ fontSize: '12px', backgroundColor: '#F9FAFB' }}
                                        className='py-3'
                                        type="text"
                                        placeholder="Enter Last Name"
                                        {...register('lastName', { required: 'Last name is required' })}
                                    />
                                    {errors.lastName && <span className="text-danger" style={{ fontSize: '10px' }}>{errors.lastName.message}</span>}
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className='mb-1 fw-semibold opacity-75' style={{ fontSize: '14px', color: '#16213DB2' }}>Date Of Birth (DOB)</Form.Label>
                                    <Form.Control
                                        style={{ fontSize: '12px', backgroundColor: '#F9FAFB' }}
                                        className='py-3'
                                        type="date"
                                        max={
                                            new Date(
                                                new Date().setFullYear(
                                                    new Date().getFullYear() - 18
                                                )
                                            )
                                                .toISOString()
                                                .split('T')[0]
                                        }
                                        autoComplete="off"
                                        {...register('dateOfBirth', {
                                            validate: value => !value || new Date(value) <= new Date() || 'Date of birth cannot be in the future'
                                        })}
                                    />
                                    {errors.dateOfBirth && <span className="text-danger" style={{ fontSize: '10px' }}>{errors.dateOfBirth.message}</span>}
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className='mb-1 fw-semibold opacity-75' style={{ fontSize: '14px', color: '#16213DB2' }}>Phone Number</Form.Label>
                                    <Form.Control
                                        style={{ fontSize: '12px', backgroundColor: '#F9FAFB' }}
                                        className='py-3'
                                        type="tel"
                                        placeholder="Enter Phone Number"
                                        autoComplete="off"
                                        {...register('phone')}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className='mb-1 fw-semibold opacity-75' style={{ fontSize: '14px', color: '#16213DB2' }}>Email ID <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        style={{ fontSize: '12px', backgroundColor: '#F9FAFB' }}
                                        className='py-3'
                                        type="email"
                                        placeholder="Enter Email ID"
                                        autoComplete="off"
                                        {...register('email', { required: 'Email is required' })}
                                    />
                                    {errors.email && <span className="text-danger" style={{ fontSize: '10px' }}>{errors.email.message}</span>}
                                </Form.Group>
                            </Col>
                            {/* <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className='mb-1 fw-semibold opacity-75' style={{ fontSize: '14px', color: '#16213DB2' }}>Password</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            style={{ fontSize: '12px', backgroundColor: '#F9FAFB', borderRight: '0px' }}
                                            className='py-3'
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter New Password (optional)"
                                            autoComplete="off"
                                            {...register('password')}
                                        />
                                        <InputGroup.Text
                                            onClick={() => setShowPassword(!showPassword)}
                                            style={{ cursor: 'pointer', backgroundColor: '#F9FAFB' }}
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </InputGroup.Text>
                                    </InputGroup>
                                </Form.Group>
                            </Col> */}
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className='mb-1 fw-semibold opacity-75' style={{ fontSize: '14px', color: '#16213DB2' }}>Profile Photo</Form.Label>
                                    <Form.Control
                                        style={{ fontSize: '12px', backgroundColor: '#F9FAFB' }}
                                        className='py-3'
                                        type="file"
                                        onChange={handleFileChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className='mb-1 fw-semibold opacity-75' style={{ fontSize: '14px', color: '#16213DB2' }}>Gender</Form.Label>
                                    <div className="d-flex gap-4 mt-2">
                                        <Form.Check
                                            type="radio"
                                            label="Male"
                                            value="male"
                                            className="custom-radio-label"
                                            {...register('gender')}
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="Female"
                                            value="female"
                                            className="custom-radio-label"
                                            {...register('gender')}
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="Other"
                                            value="other"
                                            className="custom-radio-label"
                                            {...register('gender')}
                                        />
                                    </div>
                                </Form.Group>
                            </Col>
                        </Row>
                    </div>
                );
            case 2:
                return (
                    <div className="p-4" style={{ minHeight: '400px' }}>
                        <Row className='mt-5'>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className='mb-1 fw-semibold opacity-75' style={{ fontSize: '14px', color: '#16213DB2' }}>Specialization
                                        <span className='ms-2' style={{ cursor: 'pointer' }} onClick={() => setShowSpecializationModal(true)}>
                                            <RiAddLine title='Add Specialization' className='text-danger border border-1 rounded-1' />
                                        </span>
                                    </Form.Label>
                                    <Controller
                                        name="specialization"
                                        control={control}
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
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className='mb-1 fw-semibold opacity-75' style={{ fontSize: '14px', color: '#16213DB2' }}>Qualification </Form.Label>
                                    <Form.Select style={{ fontSize: '12px', backgroundColor: '#F9FAFB' }} className='py-3' {...register('qualification')}>
                                        <option value="">Select One</option>
                                        <option value="mbbs">MBBS</option>
                                        <option value="md">MD</option>
                                        <option value="ms">MS</option>
                                        <option value="phd">PhD</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className='mb-1 fw-semibold opacity-75' style={{ fontSize: '14px', color: '#16213DB2' }}>Years Of Experience</Form.Label>
                                    <Form.Select style={{ fontSize: '12px', backgroundColor: '#F9FAFB' }} className='py-3' {...register('experience')}>
                                        <option value="">Enter Your Work Experience</option>
                                        <option value="0-2">0-2 years</option>
                                        <option value="3-5">3-5 years</option>
                                        <option value="6-10">6-10 years</option>
                                        <option value="10+">10+ years</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className='mb-1 fw-semibold opacity-75' style={{ fontSize: '14px', color: '#16213DB2' }}>Medical License Number</Form.Label>
                                    <Form.Control
                                        style={{ fontSize: '12px', backgroundColor: '#F9FAFB' }}
                                        className='py-3'
                                        type="text"
                                        placeholder="Enter Medical License Number"
                                        {...register('licenseNumber')}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className='mb-1 fw-semibold opacity-75' style={{ fontSize: '14px', color: '#16213DB2' }}>Consultation Type</Form.Label>
                                    <Form.Select style={{ fontSize: '12px', backgroundColor: '#F9FAFB' }} className='py-3' {...register('consultationType')}>
                                        <option value="">Select One</option>
                                        <option value="online">Online</option>
                                        <option value="offline">Offline</option>
                                        <option value="both">Both</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className='mb-1 fw-semibold opacity-75' style={{ fontSize: '14px', color: '#16213DB2' }}>Languages Known</Form.Label>
                                    <Form.Select style={{ fontSize: '12px', backgroundColor: '#F9FAFB' }} className='py-3' {...register('languages')}>
                                        <option value="">Select One</option>
                                        <option value="english">English</option>
                                        <option value="hindi">Hindi</option>
                                        <option value="both">Both</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                    </div>
                );
            case 3:
                return (
                    <div className="p-4" style={{ minHeight: '400px' }}>
                        <Row className='mt-5'>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label className='mb-1 fw-semibold opacity-75' style={{ fontSize: '14px', color: '#16213DB2' }}>Clinic Name</Form.Label>
                                    <Form.Control
                                        style={{ fontSize: '12px', backgroundColor: '#F9FAFB' }}
                                        className='py-3'
                                        type="text"
                                        placeholder="Enter Clinic Name"
                                        {...register('clinicName')}
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
                                <h4 className='fw-bold mb-3 mt-2' style={{ fontSize: '16px', color: '#16213D' }}>Clinic Address</h4>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label className='mb-1 fw-semibold opacity-75' style={{ fontSize: '14px', color: '#16213DB2' }}>Street</Form.Label>
                                    <Form.Control
                                        style={{ fontSize: '12px', backgroundColor: '#F9FAFB' }}
                                        className='py-3'
                                        type="text"
                                        placeholder="Enter Street Area"
                                        autoComplete="off"
                                        {...register('street')}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label className='mb-1 fw-semibold opacity-75' style={{ fontSize: '14px', color: '#16213DB2' }}>State</Form.Label>
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
                                                    dispatch(getStates({ search: data }))
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
                                    <Form.Label className='mb-1 fw-semibold opacity-75' style={{ fontSize: '14px', color: '#16213DB2' }}>City</Form.Label>
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
                                                maxMenuHeight={200}
                                            />
                                        )}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label className='mb-1 fw-semibold opacity-75' style={{ fontSize: '14px', color: '#16213DB2' }}>Pincode</Form.Label>
                                    <Form.Control
                                        style={{ fontSize: '12px', backgroundColor: '#F9FAFB' }}
                                        className='py-3'
                                        type="text"
                                        placeholder="Enter PINCODE"
                                        autoComplete="off"
                                        {...register('pincode')}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label className='mb-1 fw-semibold opacity-75' style={{ fontSize: '14px', color: '#16213DB2' }}>Full Address</Form.Label>
                                    <Form.Control
                                        style={{ fontSize: '12px', backgroundColor: '#F9FAFB' }}
                                        className='py-3'
                                        as="textarea"
                                        rows={1}
                                        placeholder="Enter Full Address"
                                        autoComplete="off"
                                        {...register('fullAddress')}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </div>
                );
            case 4:
                return (
                    <div className="p-4" style={{ minHeight: '400px' }}>
                        <Row className='mt-5'>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className='mb-1 fw-semibold opacity-75' style={{ fontSize: '14px', color: '#16213DB2' }}>Registration Date</Form.Label>
                                    <Form.Control
                                        style={{ fontSize: '12px', backgroundColor: '#F9FAFB' }}
                                        className='py-3'
                                        type="date"
                                        autoComplete="off"
                                        {...register('registrationDate')}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className='mb-1 fw-semibold opacity-75' style={{ fontSize: '14px', color: '#16213DB2' }}>Special Skills
                                        <span className='ms-2' style={{ cursor: 'pointer' }} onClick={() => setShowSpecialSkillModal(true)}>
                                            <RiAddLine title='Add Special Skill' className='text-danger border border-1 rounded-1' />
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
                                    <Form.Label className='mb-1 fw-semibold opacity-75' style={{ fontSize: '14px', color: '#16213DB2' }}>About Doctor</Form.Label>
                                    <Form.Control
                                        style={{ fontSize: '12px', backgroundColor: '#F9FAFB' }}
                                        className='py-3'
                                        as="textarea"
                                        rows={4}
                                        placeholder="Write Here"
                                        autoComplete="off"
                                        {...register('aboutDoctor')}
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
            <Modal show={show && !showSpecialSkillModal && !showSpecializationModal} onHide={handleClose} size="xl">
                <Modal.Body className="p-3" style={{ borderRadius: '15px' }}>
                    <div className="position-relative">
                        <div
                            onClick={handleClose}
                            style={{
                                position: 'absolute',
                                top: '13px',
                                right: '13px',
                                zIndex: 1001,
                                cursor: 'pointer',
                                fontSize: '20px',
                                color: '#333',
                                padding: '5px'
                            }}
                        >
                            <FaTimes />
                        </div>
                        <div className="d-flex" style={{ height: '500px', borderRadius: '15px', overflow: 'hidden' }}>
                            {/* Sidebar */}
                            <div style={{
                                width: '350px',
                                minWidth: '350px',
                                maxWidth: '350px',
                                backgroundColor: '#E0ECF8',
                                padding: '30px 20px',
                                borderRadius: '15px',
                                flexShrink: 0
                            }}>
                                <h4 className="fw-bold mb-5 pb-1" style={{ fontSize: '22px', color: '#121212' }}>Update Doctor</h4>
                                {steps.map((step, index) => (
                                    <div key={step.id} className="position-relative mb-5 pb-2">
                                        <div className="d-flex align-items-center">
                                            <div
                                                className={`rounded-circle d-flex align-items-center justify-content-center me-3 ${step.completed || currentStep === step.id ? 'text-white' : 'bg-light text-muted'
                                                    }`}
                                                style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    fontSize: '16px',
                                                    fontWeight: 'bold',
                                                    backgroundColor: step.completed || currentStep === step.id ? '#003465' : '#f8f9fa',
                                                    border: step.completed || currentStep === step.id ? 'none' : '2px solid #dee2e6'
                                                }}
                                            >
                                                {step.completed ? <MdDone /> : step.id}
                                            </div>
                                            <div>
                                                <div className="fw-semibold"
                                                    style={{ fontSize: '14px', lineHeight: '1.2', color: '#003465' }}>
                                                    {step.title}
                                                </div>
                                            </div>
                                        </div>
                                        {index < steps.length - 1 && (
                                            <div
                                                style={{
                                                    width: '2px',
                                                    height: '40px',
                                                    backgroundColor: '#dee2e6',
                                                    position: 'absolute',
                                                    left: '19px',
                                                    top: '50px'
                                                }}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Content */}
                            <div className="flex-fill d-flex flex-column" style={{ borderTopRightRadius: '15px', borderBottomRightRadius: '15px', backgroundColor: 'white' }}>
                                <Form key={currentStep} onSubmit={handleSubmit(onSubmit)} className="h-100 d-flex flex-column" autoComplete="off">
                                    <div className="flex-fill" style={{ height: '480px', overflowY: 'auto' }}>
                                        {renderStepContent()}
                                    </div>

                                    {/* Footer Buttons */}
                                    <div className="d-flex justify-content-end gap-3 p-4 py-1 bg-white" style={{ minHeight: '55px', borderBottomRightRadius: '15px' }}>
                                        {currentStep > 1 && (
                                            <Button
                                                className='bg-secondary border-0'
                                                onClick={handleBack}
                                                style={{
                                                    minWidth: '100px',
                                                    height: '46px',
                                                    fontWeight: '600',
                                                    textTransform: 'uppercase'
                                                }}
                                            >
                                                BACK
                                            </Button>
                                        )}
                                        {currentStep < 4 ? (
                                            <Button
                                                onClick={handleNext}
                                                style={{
                                                    minWidth: '100px',
                                                    height: '46px',
                                                    backgroundColor: '#003465',
                                                    border: 'none',
                                                    fontWeight: '600',
                                                    textTransform: 'uppercase'
                                                }}
                                            >
                                                NEXT
                                            </Button>
                                        ) : (
                                            <Button
                                                type="submit"
                                                disabled={Loading}
                                                style={{
                                                    minWidth: '100px',
                                                    height: '46px',
                                                    backgroundColor: '#003465',
                                                    border: 'none',
                                                    fontWeight: '600',
                                                    textTransform: 'uppercase'
                                                }}
                                            >
                                                {Loading ? 'UPDATING...' : 'UPDATE'}
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
        </>
    );
};

export default UpdateDoctorModal;