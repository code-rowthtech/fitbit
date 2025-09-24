import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { createReport, resetCreateReport } from '../redux/reports/action';
import { FaTimes } from 'react-icons/fa';

const CreateReportModal = ({ show, onHide, metricLabel = '' }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        label: metricLabel,
        min: '',
        max: ''
    });

    const { data: createReportData, loading } = useSelector(state => state.createReportReducer);

    useEffect(() => {
        if (show) {
            setFormData({
                label: metricLabel,
                min: '',
                max: ''
            });
        }
    }, [show, metricLabel]);

    useEffect(() => {
        if (createReportData?.report?.status === 201) {
            handleClose();
            dispatch(resetCreateReport());
        }
    }, [createReportData]);

    const handleClose = () => {
        setFormData({ label: '', min: '', max: '' });
        onHide();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.label && formData.min && formData.max) {
            dispatch(createReport({
                label: formData.label,
                min: formData.min,
                max: formData.max
            }));
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Body className="p-4">
                <div
                    onClick={handleClose}
                    style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        cursor: 'pointer',
                        fontSize: '18px',
                        color: '#666'
                    }}
                >
                    <FaTimes />
                </div>

                <h5 className="fw-bold mb-4" style={{ color: '#003465' }}>
                    Set Normal Range
                </h5>

                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={12}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold" style={{ fontSize: '14px', color: '#16213DB2' }}>
                                    Metric <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="label"
                                    value={formData.label}
                                    onChange={handleInputChange}
                                    placeholder="Enter metric name"
                                    required
                                    style={{ fontSize: '12px', backgroundColor: '#F9FAFB' }}
                                    className="py-3"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold" style={{ fontSize: '14px', color: '#16213DB2' }}>
                                    Minimum Value <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                    type="number"
                                    name="min"
                                    value={formData.min}
                                    onChange={handleInputChange}
                                    placeholder="Enter minimum value"
                                    required
                                    style={{ fontSize: '12px', backgroundColor: '#F9FAFB' }}
                                    className="py-3"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold" style={{ fontSize: '14px', color: '#16213DB2' }}>
                                    Maximum Value <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                    type="number"
                                    name="max"
                                    value={formData.max}
                                    onChange={handleInputChange}
                                    placeholder="Enter maximum value"
                                    required
                                    style={{ fontSize: '12px', backgroundColor: '#F9FAFB' }}
                                    className="py-3"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <div className="d-flex justify-content-end gap-3 mt-4">
                        <Button
                            variant="secondary"
                            onClick={handleClose}
                            style={{ minWidth: '100px', height: '46px' }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading || !formData.label || !formData.min || !formData.max}
                            style={{
                                minWidth: '100px',
                                height: '46px',
                                backgroundColor: '#003465',
                                border: 'none'
                            }}
                        >
                            {loading ? 'Saving...' : 'Save Range'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default CreateReportModal;