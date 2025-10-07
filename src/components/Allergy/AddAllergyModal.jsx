import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  createAllergies,
  getAllergies,
  resetCreateAllergies,
} from "../../redux/actions";

const AddAllergyModal = ({ show, onHide }) => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector(
    (state) => state.createAllergiesReducer
  );

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    reaction: "",
    severity: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Prevent leading spaces for required fields
    let processedValue =
      ["name", "reaction", "severity"].includes(name) && value.startsWith(" ")
        ? value.trimStart()
        : value;

    // Capitalize first letter for text inputs
    if (
      ["name", "reaction", "description"].includes(name) &&
      processedValue.length > 0
    ) {
      processedValue =
        processedValue.charAt(0).toUpperCase() + processedValue.slice(1);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.reaction.trim()) newErrors.reaction = "Reaction is required";
    if (!formData.severity.trim()) newErrors.severity = "Severity is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      dispatch(createAllergies(formData));
    }
  };

  const handleClose = () => {
    setFormData({ name: "", description: "", reaction: "", severity: "" });
    setErrors({});
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
    <Modal show={show} onHide={onHide}>
      <Modal.Body className="p-0" style={{ borderRadius: "15px" }}>
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

        {/* Header */}
        <div className="p-4 pb-2">
          <h4
            className="fw-bold mb-0"
            style={{ fontSize: "22px", color: "#121212" }}
          >
            Add Allergy
          </h4>
        </div>

        {/* Content */}
        <Form className="px-4 pb-4" autoComplete="off" onSubmit={handleSubmit}>
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label
                  className="mb-1 fw-semibold opacity-75"
                  style={{ fontSize: "14px", color: "#16213DB2" }}
                >
                  Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  style={{ fontSize: "12px", backgroundColor: "#F9FAFB" }}
                  className="py-3"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter allergy name"
                  autoComplete="off"
                  required
                  isInvalid={!!errors.name}
                />
                {errors.name && (
                  <span className="text-danger" style={{ fontSize: "10px" }}>
                    {errors.name}
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
                  Reaction <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  style={{ fontSize: "12px", backgroundColor: "#F9FAFB" }}
                  className="py-3"
                  type="text"
                  name="reaction"
                  value={formData.reaction}
                  onChange={handleInputChange}
                  placeholder="Enter reaction"
                  autoComplete="off"
                  required
                  isInvalid={!!errors.reaction}
                />
                {errors.reaction && (
                  <span className="text-danger" style={{ fontSize: "10px" }}>
                    {errors.reaction}
                  </span>
                )}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label
                  className="mb-1 fw-semibold opacity-75"
                  style={{ fontSize: "14px", color: "#16213DB2" }}
                >
                  Severity <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  style={{ fontSize: "12px", backgroundColor: "#F9FAFB" }}
                  className="py-3"
                  name="severity"
                  value={formData.severity}
                  onChange={handleInputChange}
                  required
                  isInvalid={!!errors.severity}
                >
                  <option value="">Select severity</option>
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                </Form.Select>
                {errors.severity && (
                  <span className="text-danger" style={{ fontSize: "10px" }}>
                    {errors.severity}
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
                  Description
                </Form.Label>
                <Form.Control
                  style={{ fontSize: "12px", backgroundColor: "#F9FAFB" }}
                  className="py-3"
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
              disabled={loading}
              style={{
                minWidth: "100px",
                height: "46px",
                backgroundColor: "#003465",
                border: "none",
                fontWeight: "600",
                textTransform: "uppercase",
              }}
            >
              {loading ? "ADDING..." : "ADD ALLERGY"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddAllergyModal;
