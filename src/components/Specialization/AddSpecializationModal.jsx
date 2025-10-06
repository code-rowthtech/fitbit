import React, { useEffect, useState } from "react";
import { Modal, Form, Row, Col, Button } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { FaTimes, FaPlus } from "react-icons/fa";
import Select from "react-select";
import {
  createSpecializations,
  getSpecializations,
  getSpecializationsCategory,
} from "../../redux/actions";

const AddSpecializationModal = ({ show, onHide }) => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  // const SpecializationData = useSelector((state) => state?.getSpecializationsReducer?.data?.data);
  const SpecializationCategoryData = useSelector(
    (state) => state?.getSpecializationsCategoryReducer?.data?.category
  );
  const { data, loading } = useSelector(
    (state) => state.createSpecializationsReducer
  );
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);

  const categoryOptions =
    SpecializationCategoryData?.map((item) => ({
      value: item,
      label: item,
    })) || [];

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

  const onSubmit = (data) => {
    const specializationData = {
      name: data.name,
      category: data.category?.value || data?.category,
      description: data.description,
    };
    dispatch(createSpecializations(specializationData));
  };

  const handleClose = () => {
    reset();
    onHide();
  };

  useEffect(() => {
    if (data?.status === 201) {
      handleClose();
      dispatch(getSpecializations());
    }
  }, [data]);

  useEffect(() => {
    dispatch(getSpecializations());
    dispatch(getSpecializationsCategory());
  }, [dispatch]);

  return (
    <Modal show={show} onHide={handleClose} size="lg" backdrop="static" style={{ zIndex: 1060 }}>
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
            Add Specialization
          </h4>

          <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label
                    className="mb-1 fw-semibold opacity-75"
                    style={{ fontSize: "14px", color: "#16213DB2" }}
                  >
                    Specialization Name <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    style={{ fontSize: "12px", backgroundColor: "#F9FAFB" }}
                    className="py-3"
                    type="text"
                    placeholder="Enter Specialization Name"
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
                    {...register("name", {
                      required: "Specialization name is required",
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
                          setValue("name", e.target.value)
                        ),
                    })}
                  />
                  {errors.name && (
                    <span className="text-danger" style={{ fontSize: "10px" }}>
                      {errors.name.message}
                    </span>
                  )}
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label
                    className="mb-1 fw-semibold opacity-75 d-flex align-items-center justify-content-between"
                    style={{ fontSize: "14px", color: "#16213DB2" }}
                  >
                    <span>
                      Category <span className="text-danger">*</span>
                    </span>
                    {isAddingNewCategory ? (
                      <FaTimes
                        className="text-danger"
                        title="Close"
                        style={{ cursor: "pointer", fontSize: "12px" }}
                        onClick={() =>
                          setIsAddingNewCategory(!isAddingNewCategory)
                        }
                      />
                    ) : (
                      <FaPlus
                        className="text-primary"
                        title="Add Category"
                        style={{ cursor: "pointer", fontSize: "12px" }}
                        onClick={() =>
                          setIsAddingNewCategory(!isAddingNewCategory)
                        }
                      />
                    )}
                  </Form.Label>
                  {isAddingNewCategory ? (
                    <Form.Control
                      style={{ fontSize: "12px", backgroundColor: "#F9FAFB" }}
                      className="py-3"
                      type="text"
                      placeholder="Enter New Category"
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
                          !["Backspace", "Delete", "Tab", "Enter"].includes(
                            e.key
                          )
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
                      {...register("category", {
                        required: "Category is required",
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
                            setValue("category", e.target.value)
                          ),
                      })}
                    />
                  ) : (
                    <Controller
                      name="category"
                      control={control}
                      rules={{ required: "Category is required" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={categoryOptions}
                          placeholder="Select Category"
                          styles={{
                            control: (base) => ({
                              ...base,
                              fontSize: "12px",
                              backgroundColor: "#F9FAFB",
                              minHeight: "48px",
                            }),
                          }}
                        />
                      )}
                    />
                  )}
                  {errors.category && (
                    <span className="text-danger" style={{ fontSize: "10px" }}>
                      {errors.category.message}
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
                {loading ? "ADDING..." : "NEXT"}
              </Button>
            </div>
          </Form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AddSpecializationModal;
