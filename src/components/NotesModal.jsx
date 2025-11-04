import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Button,
  Pagination,
} from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import { RiEdit2Fill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {
  addNotes,
  getNotes,
  updateNotes,
  deleteNotes,
  resetAddNotes,
  resetUpdateNotes,
  resetDeleteNotes,
} from "../redux/notes/action";

const NotesModal = ({ show, onHide, patientId, title = "Notes", type, value, masterDataId }) => {
  const dispatch = useDispatch();
  const Store = useSelector((state) => state);
  const fieldKey = `${type}_${value}`;

  const notesCount = Store?.getNotesReducer?.data?.[fieldKey];
  const notesData = Store?.getNotesReducer?.data?.[fieldKey]?.notes || [];
  const notesLoading = Store?.getNotesReducer?.loading?.[fieldKey] || false;
  const addNotesResponse = Store?.addNotesReducer?.data?.status;
  const updateNotesResponse = Store?.updateNotesReducer?.data?.status;
  const deleteNotesResponse = Store?.deleteNotesReducer?.data?.status;

  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [noteTitle, setNoteTitle] = useState("");

  const decodeHtmlEntities = (text) => {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = text;
    return textarea.value;
  };

  const truncateContent = (content) => {
    const decodedContent = decodeHtmlEntities(content);
    const textContent = decodedContent.replace(/<[^>]*>/g, "");
    if (textContent.length <= 200) {
      return textContent.substring(0, 200);
    }
    return textContent.substring(0, 200) + "...";
  };

  useEffect(() => {
    if (show && patientId) {
      const params = { patientId, page: currentPage, limit: 10, type, value };
      dispatch(getNotes(params, fieldKey));
    }
  }, [dispatch, patientId, currentPage, show, type, value, fieldKey]);

  useEffect(() => {
    if (
      addNotesResponse === 201 ||
      updateNotesResponse === 200 ||
      deleteNotesResponse === 200
    ) {
      const params = { patientId, page: currentPage, limit: 10, type, value };
      dispatch(getNotes(params, fieldKey));
      if (addNotesResponse === 201) dispatch(resetAddNotes());
      if (updateNotesResponse === 200) dispatch(resetUpdateNotes());
      if (deleteNotesResponse === 200) dispatch(resetDeleteNotes());
    }
  }, [
    addNotesResponse,
    updateNotesResponse,
    deleteNotesResponse,
    dispatch,
    patientId,
    currentPage,
  ]);

  const handleAddNote = () => {
    setEditingNote(null);
    setNoteTitle("");
    setNoteText("");
    setShowAddModal(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setNoteTitle(note.title);
    setNoteText(decodeHtmlEntities(note.content));
    setShowAddModal(true);
  };

  const handleDeleteNote = (note) => {
    setNoteToDelete(note);
    setShowConfirmModal(true);
  };

  const confirmDeleteNote = () => {
    if (noteToDelete?._id) {
      dispatch(deleteNotes(noteToDelete._id));
    }
    setShowConfirmModal(false);
    setNoteToDelete(null);
  };

  const handleSaveNote = () => {
    const textContent = noteText.replace(/<[^>]*>/g, "").trim();
    if (!noteTitle.trim() || !textContent) return;

    if (editingNote) {
      const updateData = {
        noteId: editingNote._id,
        body: {
          title: noteTitle,
          content: noteText,
        },
      };
      dispatch(updateNotes(updateData));
    } else {
      const newNoteData = {
        content: noteText,
        patientId,
        title: noteTitle,
        masterDataId,
        value
      };
      dispatch(addNotes(newNoteData));
    }

    setShowAddModal(false);
    setNoteTitle("");
    setNoteText("");
    setEditingNote(null);
  };

  return (
    <>
      <Modal show={show && !showAddModal} onHide={onHide} size="xl" centered>
        <Modal.Header closeButton className="border-0 py-2" style={{ background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)", borderRadius: "0.5rem 0.5rem 0 0" }}>
          <Modal.Title className="d-flex justify-content-between align-items-center w-100">
            <div className="d-flex align-items-center gap-2">
              <div className="d-flex align-items-center justify-content-center" style={{ width: "32px", height: "32px", backgroundColor: "#003465", borderRadius: "8px" }}>
                <span style={{ color: "white", fontSize: "14px", fontWeight: "bold" }}>📝</span>
              </div>
              <h5 className="mb-0 d-flex align-items-center gap-2" style={{ fontSize: "16px", color: "#003465", fontWeight: "700" }}>
                {title}
                <span className="badge" style={{ backgroundColor: "#e9ecef", color: "#6c757d", fontSize: "11px", fontWeight: "500" }}>
                  {notesCount?.total || 0}
                </span>
              </h5>
            </div>
            <button
              className="btn btn-primary me-2 btn-sm d-flex align-items-center gap-2 shadow-sm"
              onClick={handleAddNote}
              style={{
                backgroundColor: "#003465",
                border: "none",
                fontSize: "12px",
                padding: "8px 16px",
                borderRadius: "8px",
                fontWeight: "600",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => e.target.style.transform = "translateY(-1px)"}
              onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
            >
              <FaPlus size={12} />
              Add Note
            </button>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-2" style={{ height: "520px", overflowY: "auto" }}>

          {notesLoading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "150px" }}>
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : notesData.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted mb-2" style={{ fontSize: "13px" }}>No notes available</p>
              <button className="btn btn-sm" onClick={handleAddNote} style={{ fontSize: "11px", backgroundColor: "#003465", border: "none", color: "white", padding: "4px 12px" }}>
                Add First Note
              </button>
            </div>
          ) : (
            <div className="row g-2">
              {notesData.map((note) => (
                <div key={note._id} className="col-md-6">
                  <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "8px", background: "#f8f9fa" }}>
                    <div className="card-body p-2">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <h6 className="mb-0 fw-semibold text-truncate" style={{ fontSize: "13px", color: "#003465" }} title={note.title}>
                          {note.title}
                        </h6>
                        <div className="d-flex gap-1 ms-2">
                          <button className="btn btn-sm p-1" onClick={() => handleEditNote(note)} style={{ color: "#003465", backgroundColor: "transparent", border: "none", width: "24px", height: "24px" }} title="Edit">
                            <RiEdit2Fill size={12} />
                          </button>
                          <button className="btn btn-sm p-1" onClick={() => handleDeleteNote(note)} style={{ color: "#dc3545", backgroundColor: "transparent", border: "none", width: "24px", height: "24px" }} title="Delete">
                            <FiTrash2 size={12} />
                          </button>
                        </div>
                      </div>
                      <div className="text-muted mb-2" style={{
                        fontSize: "11px", lineHeight: "1.3", display: "-webkit-box", WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                      >
                        {truncateContent(note.content)}
                      </div>

                      <div
                        className="d-flex justify-content-between align-items-center pt-1"
                        style={{
                          borderTop: "1px solid #f0f0f0",
                          fontSize: "10px",
                        }}
                      >
                        <div className="d-flex align-items-center gap-1">
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                              width: "20px",
                              height: "20px",
                              backgroundColor: "#003465",
                              color: "white",
                              fontSize: "8px",
                              fontWeight: "bold",
                            }}
                          >
                            {note.createdBy?.firstName?.charAt(0)}
                            {note.createdBy?.lastName?.charAt(0)}
                          </div>
                          <span className="text-muted">
                            {note.createdBy?.firstName} {note.createdBy?.lastName}
                          </span>
                        </div>
                        <span className="text-muted">
                          {new Date(note.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </Modal.Body>
        {notesCount?.totalPages > 1 && (
          <Modal.Footer className="border-0 pt-0 pb-3 d-flex justify-content-center">
            <Pagination
              size="sm"
              className="mb-0"
              style={{
                "--bs-pagination-color": "#003465",
                "--bs-pagination-border-color": "#e9ecef",
                "--bs-pagination-hover-bg": "#f8f9fa",
                "--bs-pagination-hover-border-color": "#003465",
                "--bs-pagination-active-bg": "#003465",
                "--bs-pagination-active-border-color": "#003465",
              }}
            >
              <Pagination.Prev
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              />
              {[...Array(notesCount?.totalPages)].map((_, index) => {
                const page = index + 1;
                if (
                  page === currentPage ||
                  page === 1 ||
                  page === notesCount?.totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <Pagination.Item
                      key={page}
                      active={page === currentPage}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Pagination.Item>
                  );
                }
                return null;
              })}
              <Pagination.Next
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === notesCount?.totalPages}
              />
            </Pagination>
          </Modal.Footer>
        )}
      </Modal>

      {/* Add/Edit Note Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg" centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title style={{ fontSize: "18px", color: "#003465" }}>
            {editingNote ? "Edit Note" : "Add New Note"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-2">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label
                className="fw-semibold"
                style={{ fontSize: "14px", color: "#16213DB2" }}
              >
                Note Title <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter note title"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                style={{
                  fontSize: "13px",
                  backgroundColor: "#F9FAFB",
                  border: "1px solid #e9ecef",
                  borderRadius: "6px",
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label
                className="fw-semibold"
                style={{ fontSize: "14px", color: "#16213DB2" }}
              >
                Note Content <span className="text-danger">*</span>
              </Form.Label>
              <div
                style={{
                  border: "1px solid #e9ecef",
                  borderRadius: "6px",
                  backgroundColor: "#F9FAFB",
                }}
              >
                <CKEditor
                  editor={ClassicEditor}
                  data={noteText}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setNoteText(data);
                  }}
                  config={{
                    placeholder: "Enter detailed note content...",
                    toolbar: [
                      "heading",
                      "|",
                      "bold",
                      "italic",
                      "underline",
                      "|",
                      "bulletedList",
                      "numberedList",
                      "|",
                      "outdent",
                      "indent",
                      "|",
                      "blockQuote",
                      "insertTable",
                      "|",
                      "undo",
                      "redo",
                    ],
                  }}
                />
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowAddModal(false)}
            style={{ fontSize: "12px", padding: "6px 12px" }}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSaveNote}
            disabled={
              !noteTitle.trim() || !noteText.replace(/<[^>]*>/g, "").trim()
            }
            style={{
              backgroundColor: "#003465",
              border: "1px solid #003465",
              fontSize: "12px",
              padding: "6px 12px",
            }}
          >
            {editingNote ? "Update Note" : "Save Note"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fs-6 fw-bold">Delete Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4" style={{ fontSize: "12px" }}>
          <div>
            Are you sure you want to delete the note{" "}
            <span className="fw-bold" style={{ color: "#003465" }}>
              "{noteToDelete?.title}"
            </span>
            ? This action cannot be undone.
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowConfirmModal(false)}
            style={{ fontSize: "12px", padding: "6px 12px" }}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={confirmDeleteNote}
            style={{ fontSize: "12px", padding: "6px 12px" }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default NotesModal;