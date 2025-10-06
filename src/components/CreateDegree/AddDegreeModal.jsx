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
    setValue,
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
                    {...register("degree", {
                      required: "Degree name is required",
                      minLength: {
                        value: 2,
                        message: "Name is too short",
                      },
                      maxLength: {
                        value: 50,
                        message: "Maximum 50 characters allowed",
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
                          setValue("degree", e.target.value)
                        ),
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
                    autoComplete="off"
                    onKeyDown={(e) => {
                      preventFirstSpace(e);
                      // Block emojis
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
                    {...register("description", {
                      required: "Description is required",
                      minLength: {
                        value: 10,
                        message: "Description is too short",
                      },
                      validate: {
                        noLeadingSpace: (value) =>
                          value?.trim() === value ||
                          "Description cannot start or end with spaces",
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
                          setValue("description", e.target.value)
                        ),
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

            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button
                variant="outline-secondary"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Degree"}
              </Button>
            </div>
          </Form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AddDegreeModal;
