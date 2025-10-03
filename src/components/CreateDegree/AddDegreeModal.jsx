import React, { useEffect } from "react";
import { Modal, Form, Row, Col, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { FaTimes } from "react-icons/fa";
import { createDegree, getQualification } from "../../redux/actions";

const AddDegreeModal = ({ show, onHide }) => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { data, loading } = useSelector((state) => state.createDegreeReducer);

  const preventFirstSpace = (e) => {
    if (e.target.value.length === 0 && e.key === " ") {
      e.preventDefault();
    }
  };

  const handleInputChange = (e, onChange) => {
    let { value } = e.target;

    if (value.length === 1 && value[0] === " ") {
      return;
    }

    onChange(e);
  };

  const onSubmit = (data) => {
    const degreeData = {
      degree: data.degree,
      description: data.description,
    };
    dispatch(createDegree(degreeData));
  };

  const handleClose = () => {
    reset();
    onHide();
  };

  useEffect(() => {
    if (data?.status === 201) {
      handleClose();
      dispatch(getQualification());
    }
  }, [data]);

  return (
    <Modal show={show} onHide={handleClose} size="lg" backdrop="static">
      <Modal.Body className="p-4" style={{ borderRadius: "15px" }}>
        <div className="position-relative">
          <div
            onClick={handleClose}
            style={{
              position: "absolute",
              top: "0px",
              right: "0px",
              zIndex: 1001,
              cursor: "pointer",
              fontSize: "20px",
              color: "#333",
              padding: "5px",
            }}
          >
            <FaTimes />
          </div>

          <h4
            className="fw-bold mb-4"
            style={{ fontSize: "20px", color: "#121212" }}
          >
            Add Degree
          </h4>

          <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label
                    className="mb-1 fw-semibold opacity-75"
                    style={{ fontSize: "14px", color: "#16213DB2" }}
                  >
                    Degree Name <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    style={{ fontSize: "12px", backgroundColor: "#F9FAFB" }}
                    className="py-3"
                    type="text"
                    placeholder="Enter Degree Name"
                    onKeyDown={preventFirstSpace}
                    {...register("degree", {
                      required: "Degree name is required",
                      onChange: (e) => handleInputChange(e, (e) => {}),
                    })}
                  />
                  {errors.degree && (
                    <span className="text-danger" style={{ fontSize: "10px" }}>
                      {errors.degree.message}
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
                    Description <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    style={{ fontSize: "12px", backgroundColor: "#F9FAFB" }}
                    className="py-3"
                    as="textarea"
                    rows={3}
                    placeholder="Enter Description"
                    onKeyDown={preventFirstSpace}
                    {...register("description", {
                      required: "Description is required",
                      onChange: (e) => handleInputChange(e, (e) => {}),
                    })}
                  />
                  {errors.description && (
                    <span className="text-danger" style={{ fontSize: "10px" }}>
                      {errors.description.message}
                    </span>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end gap-3 mt-4">
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
                {loading ? "ADDING..." : "ADD DEGREE"}
              </Button>
            </div>
          </Form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AddDegreeModal;
