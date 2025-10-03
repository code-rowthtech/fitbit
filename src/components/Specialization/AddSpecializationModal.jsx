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

  const handleInputChange = (e) => {
    let value = e.target.value;

    // Prevent space as first character
    if (value.startsWith(" ")) {
      value = value.trimStart();
    }

    return value;
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
                    {...register("name", {
                      required: "Specialization name is required",
                      onChange: (e) => {
                        e.target.value = handleInputChange(e);
                      },
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
                      {...register("category", {
                        required: "Category is required",
                        onChange: (e) => {
                          e.target.value = handleInputChange(e);
                        },
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
                    {...register("description", {
                      required: "Description is required",
                      onChange: (e) => {
                        e.target.value = handleInputChange(e);
                      },
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
                {loading ? "ADDING..." : "ADD SPECIALIZATION"}
              </Button>
            </div>
          </Form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AddSpecializationModal;
