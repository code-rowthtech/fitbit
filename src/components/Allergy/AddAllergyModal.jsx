import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { createAllergies, getAllergies, resetCreateAllergies } from '../../redux/actions';

const AddAllergyModal = ({ show, onHide }) => {
    const dispatch = useDispatch();
    const { data, loading } = useSelector(state => state.createAllergiesReducer);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        reaction: '',
        severity: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.name.trim()) {
            dispatch(createAllergies(formData));
        }
    };

    const handleClose = () => {
        setFormData({ name: '', description: '', reaction: '', severity: '' });
        dispatch(resetCreateAllergies());
        onHide();
    };

    useEffect(() => {
        if (data?.status === 201) {
            handleClose();
            dispatch(getAllergies());
        }
    }, [data]);
    return (
        <Modal show={show} onHide={onHide} >
            <Modal.Body className="p-0" style={{ borderRadius: '15px' }}>
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

                {/* Header */}
                <div className="p-4 pb-2">
                    <h4 className="fw-bold mb-0" style={{ fontSize: '22px', color: '#121212' }}>Add Allergy</h4>
                </div>

                {/* Content */}
                <Form className="px-4 pb-4" autoComplete="off" onSubmit={handleSubmit}>
                    <Row>
                        <Col md={12}>
                            <Form.Group className="mb-3">
                                <Form.Label className='mb-1 fw-semibold opacity-75' style={{ fontSize: '14px', color: '#16213DB2' }}>Name <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    style={{ fontSize: '12px', backgroundColor: '#F9FAFB' }}
                                    className='py-3'
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter allergy name"
                                    autoComplete="off"
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className='mb-1 fw-semibold opacity-75' style={{ fontSize: '14px', color: '#16213DB2' }}>Reaction</Form.Label>
                                <Form.Control
                                    style={{ fontSize: '12px', backgroundColor: '#F9FAFB' }}
                                    className='py-3'
                                    type="text"
                                    name="reaction"
                                    value={formData.reaction}
                                    onChange={handleInputChange}
                                    placeholder="Enter reaction"
                                    autoComplete="off"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-4">
                                <Form.Label className='mb-1 fw-semibold opacity-75' style={{ fontSize: '14px', color: '#16213DB2' }}>Severity</Form.Label>
                                <Form.Select
                                    style={{ fontSize: '12px', backgroundColor: '#F9FAFB' }}
                                    className='py-3'
                                    name="severity"
                                    value={formData.severity}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select severity</option>
                                    <option value="mild">Mild</option>
                                    <option value="moderate">Moderate</option>
                                    <option value="severe">Severe</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={12}>
                            <Form.Group className="mb-3">
                                <Form.Label className='mb-1 fw-semibold opacity-75' style={{ fontSize: '14px', color: '#16213DB2' }}>Description</Form.Label>
                                <Form.Control
                                    style={{ fontSize: '12px', backgroundColor: '#F9FAFB' }}
                                    className='py-3'
                                    as="textarea"
                                    rows={4}
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Enter description"
                                    autoComplete="off"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Footer Buttons */}
                    <div className="d-flex justify-content-end gap-3">
                        {/* <Button
                            className='bg-secondary border-0'
                            onClick={handleClose}
                            disabled={loading}
                            style={{
                                minWidth: '100px',
                                height: '46px',
                                fontWeight: '600',
                                textTransform: 'uppercase'
                            }}
                        >
                            CANCEL
                        </Button> */}
                        <Button
                            type="submit"
                            disabled={loading || !formData.name.trim()}
                            style={{
                                minWidth: '100px',
                                height: '46px',
                                backgroundColor: '#003465',
                                border: 'none',
                                fontWeight: '600',
                                textTransform: 'uppercase'
                            }}
                        >
                            {loading ? 'ADDING...' : 'ADD ALLERGY'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddAllergyModal;