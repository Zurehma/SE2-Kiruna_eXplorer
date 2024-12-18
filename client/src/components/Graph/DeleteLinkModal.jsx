import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import API from "../../../API";

const DeleteLinkModal = ({ deleteLink, showDeleteModal, setDeleteLink, setShowDeleteModal, chartData, onLinkDeleted }) => {
  const getDocumentTitle = (docID) => {
    const doc = chartData.find((d) => d.id === docID);
    return doc ? doc.title : "Unknown";
  };

  const confirmDeleteLink = async () => {
    if (!deleteLink) return;

    try {
      await API.deleteLink(deleteLink.linkID);
      setShowDeleteModal(false);
      setDeleteLink(null);
      onLinkDeleted(deleteLink.linkID);
      fetchData();
    } catch (error) {
      console.error("Failed to delete the link:", error);
      setShowDeleteModal(false);
      setDeleteLink(null);
    }
  };

  const cancelDeleteLink = () => {
    setShowDeleteModal(false);
    setDeleteLink(null);
  };

  return (
    <>
      {/* Existing Modals */}
      <Modal show={showDeleteModal} onHide={cancelDeleteLink} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {deleteLink ? (
            <>
              <p>Are you sure you want to delete this link?</p>
              <p>
                <strong>Link Type:</strong> {deleteLink.type}
              </p>
              <p>
                <strong>Between:</strong>
                <br />
                {getDocumentTitle(deleteLink.DocID1)} and {getDocumentTitle(deleteLink.DocID2)}
              </p>
              <p style={{ color: "red", display: "flex", alignItems: "center" }}>
                <i className="bi bi-exclamation-triangle-fill" style={{ color: "orange", marginRight: "8px" }}></i>
                This action cannot be undone.
              </p>
            </>
          ) : (
            <p>Are you sure you want to delete this link?</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={confirmDeleteLink}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteLinkModal;
