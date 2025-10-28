import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Pagination, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {
  addNotes,
  getNotes,
  updateNotes,
  deleteNotes,
  resetAddNotes,
  resetUpdateNotes,
  resetDeleteNotes,
} from "../../../redux/notes/action";

const PatientNotes = () => {
  const dispatch = useDispatch();
 const { id: pathId } = useParams();

  // Function to decode HTML entities
  const decodeHtmlEntities = (text) => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  };

  // Function to get plain text without HTML tags
  const getPlainText = (content) => {
    const decodedContent = decodeHtmlEntities(content);
    return decodedContent.replace(/<[^>]*>/g, '');
  };

  // Function to truncate content after 50 characters
  const truncateContent = (content) => {
    const decodedContent = decodeHtmlEntities(content);
    const textContent = decodedContent.replace(/<[^>]*>/g, '');
    if (textContent.length <= 200) {
      return textContent.substring(0, 200);
    }
    return textContent.substring(0, 200) + '...';
  };
  const [searchParams] = useSearchParams();
  const patientId = pathId || searchParams.get('id') || searchParams.get('patientId');  const Store = useSelector((state) => state);
  
  const notesCount = Store?.getNotesReducer?.data;
  const notesData = Store?.getNotesReducer?.data?.notes || [];
  const notesLoading = Store?.getNotesReducer?.loading || false;
  const addNotesResponse = Store?.addNotesReducer?.data?.status;
  const updateNotesResponse = Store?.updateNotesReducer?.data?.status;
  const deleteNotesResponse = Store?.deleteNotesReducer?.data?.status;
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [noteTitle, setNoteTitle] = useState("");

  useEffect(() => {
    if (patientId) {
      const params = { patientId, page: currentPage, limit: 10 };
      dispatch(getNotes(params));
    }
  }, [dispatch, patientId, currentPage]);

  useEffect(() => {
    if (notesCount) {
      setTotalPages(notesCount.totalPages || 1);
    }
  }, [notesCount]);

  useEffect(() => {
    if (addNotesResponse === 201 || updateNotesResponse === 200 || deleteNotesResponse === 200) {
      const params = { patientId, page: currentPage, limit: 10 };
      dispatch(getNotes(params));
      if (addNotesResponse === 201) dispatch(resetAddNotes());
      if (updateNotesResponse === 200) dispatch(resetUpdateNotes());
      if (deleteNotesResponse === 200) dispatch(resetDeleteNotes());
    }
  }, [addNotesResponse, updateNotesResponse, deleteNotesResponse, dispatch, patientId, currentPage]);

  const handleAddNote = () => {
    setEditingNote(null);
    setNoteTitle("");
    setNoteText("");
    setShowModal(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setNoteTitle(note.title);
    setNoteText(decodeHtmlEntities(note.content));
    setShowModal(true);
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
    const textContent = noteText.replace(/<[^>]*>/g, '').trim();
    if (!noteTitle.trim() || !textContent) return;

    if (editingNote) {
      // Update existing note
      const updateData = {
        noteId: editingNote._id,
        body: {
          title: noteTitle,
          content: noteText,
        },
      };
      dispatch(updateNotes(updateData));
    } else {
      // Add new note
      const newNoteData = {
        patientId,
        title: noteTitle,
        content: noteText,
      };
      dispatch(addNotes(newNoteData));
    }
    
    setShowModal(false);
    setNoteTitle("");
    setNoteText("");
    setEditingNote(null);
  };


  return (
    <>
      <div
        className="card border-0"
        style={{
          backgroundColor: "white",
          borderRadius: '0px'
        }}
      >
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="card-title mb-0 fs-6 fw-bold" style={{ color: "#003465" }}>
              Patient Notes ({notesCount?.total || 0})
            </h5>
            <button
              className="btn btn-primary btn-sm fw-bold d-flex align-items-center gap-2"
              onClick={handleAddNote}
              style={{
                backgroundColor: "#003465",
                border: "1px solid #003465",
                fontSize: "12px",
                padding: "6px 12px",
              }}
            >
              <FaPlus size={12} />
              Add Note
            </button>
          </div>

          {notesLoading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : notesData.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted mb-3">No notes available</p>
              <button
                className="btn btn-sm"
                onClick={handleAddNote}
                style={{ 
                  fontSize: "12px",
                  backgroundColor: "#003465",
                  border: "1px solid #003465",
                  color: "white"
                }}
              >
                Add First Note
              </button>
            </div>
          ) : (
            <div className="notes-container" style={{ minHeight: "550px", overflowY: "auto", overflowX: "hidden" }}>
              <div className="row">
                {notesData.map((note) => (
                  <div key={note._id} className="col-md-6 mb-3">
                    <div
                      className="card border h-100"
                      style={{ borderRadius: "8px", borderColor: "#e9ecef" }}
                    >
                      <div className="card-body px-2 py-1" style={{backgroundColor:'#F6FAFF'}}>
                        <div className="d-flex justify-content-between align-items-center mb-2" >
                          <div className="d-flex align-items-center gap-2">
                            <h6 className="mb-0 fw-semibold" style={{ fontSize: "14px", color: "#003465" }}>
                              {note.title}
                            </h6>
                            {/* <span
                              className="badge px-2 py-1"
                              style={{
                                backgroundColor: getPriorityColor(note.priority),
                                fontSize: "10px"
                              }}
                            >
                              {note.priority}
                            </span> */}
                          </div>
                          <div className="d-flex gap-1">
                            <button
                              className="btn btn-sm btn-link p-1"
                              onClick={() => handleEditNote(note)}
                              style={{ color: "#007bff" }}
                            >
                              <FaEdit size={12} />
                            </button>
                            <button
                              className="btn btn-sm btn-link p-1"
                              onClick={() => handleDeleteNote(note)}
                              style={{ color: "#dc3545" }}
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        </div>
                        <div 
                          className="mb-2" 
                          style={{ fontSize: "13px", lineHeight: "1.4" }}
                        >
                          {truncateContent(note.content)}
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted" style={{ fontSize: "11px" }}>
                            By: {note.createdBy?.firstName} {note.createdBy?.lastName}
                          </small>
                          <small className="text-muted" style={{ fontSize: "11px" }}>
                            {new Date(note.createdAt).toLocaleString()}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {notesCount?.totalPages > 1 && (
            <div
              className="d-flex justify-content-between align-items-center mt-3 pt-3"
              style={{ borderTop: "1px solid #e9ecef" }}
            >
              <div
                style={{
                  fontSize: "14px",
                  color: "#003465",
                  fontWeight: "500",
                }}
              >
                Showing{" "}
                <span className="fw-bold">{(currentPage - 1) * 10 + 1}</span> -{" "}
                <span className="fw-bold">
                  {Math.min(currentPage * 10, notesCount?.total || 0)}
                </span>{" "}
                of{" "}
                <span className="fw-bold">
                  {notesCount?.total || 0}
                </span>{" "}
                notes
              </div>
              <Pagination className="mb-0" style={{
                "--bs-pagination-color": "#003465",
                "--bs-pagination-border-color": "#e9ecef",
                "--bs-pagination-hover-bg": "#f8f9fa",
                "--bs-pagination-hover-border-color": "#003465",
                "--bs-pagination-active-bg": "#003465",
                "--bs-pagination-active-border-color": "#003465"
              }}>
                <Pagination.First
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                />
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
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return <Pagination.Ellipsis key={page} />;
                  }
                  return null;
                })}
                <Pagination.Next
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === notesCount?.totalPages}
                />
                <Pagination.Last
                  onClick={() => setCurrentPage(notesCount?.totalPages)}
                  disabled={currentPage === notesCount?.totalPages}
                />
              </Pagination>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Note Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header className="border-0 pb-0">
          <Modal.Title style={{ fontSize: "18px", color: "#003465" }}>
            {editingNote ? "Edit Note" : "Add New Note"}
          </Modal.Title>
          {/* <button
            type="button"
            className="btn-close"
            onClick={() => setShowModal(false)}
          ></button> */}
        </Modal.Header>
        <Modal.Body className="pt-2">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold" style={{ fontSize: "14px", color: "#16213DB2" }}>
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
                  borderRadius: "6px"
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold" style={{ fontSize: "14px", color: "#16213DB2" }}>
                Note Content <span className="text-danger">*</span>
              </Form.Label>
              <div style={{
                border: "1px solid #e9ecef",
                borderRadius: "6px",
                backgroundColor: "#F9FAFB"
              }}>
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
                      'heading', '|',
                      'bold', 'italic', 'underline', '|',
                      'bulletedList', 'numberedList', '|',
                      'outdent', 'indent', '|',
                      'blockQuote', 'insertTable', '|',
                      'undo', 'redo'
                    ]
                  }}
                />
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button
            variant="secondary"
            size="sm fw-bold"
            onClick={() => setShowModal(false)}
            style={{ fontSize: "12px", padding: "6px 12px" }}
          >
            Cancel
          </Button>
          <Button
            size="sm fw-bold"
            onClick={handleSaveNote}
            disabled={!noteTitle.trim() || !noteText.replace(/<[^>]*>/g, '').trim()}
            style={{
              backgroundColor: "#003465",
              border: "1px solid #003465",
              fontSize: "12px",
              padding: "6px 12px"
            }}
          >
            {editingNote ? "Update Note" : "Save Note"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
      >
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fs-6 fw-bold">
            Delete Confirmation
          </Modal.Title>
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
            className="fw-bold"
            onClick={() => setShowConfirmModal(false)}
            style={{ fontSize: "12px", padding: "6px 12px" }}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            className="fw-bold"
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

export default PatientNotes;