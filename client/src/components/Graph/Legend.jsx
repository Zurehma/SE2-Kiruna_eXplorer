import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const Legend = ({ documentTypes, stakeholders, showLegendModal, setShowLegendModal }) => {
  const iconMap = {
    Design: "bi-file-earmark-text",
    Informative: "bi-info-circle",
    Prescriptive: "bi-arrow-right-square",
    Technical: "bi-file-earmark-code",
    Agreement: "bi-people-fill",
    Conflict: "bi-x-circle",
    Consultation: "bi-chat-dots",
    Action: "bi-exclamation-triangle",
    Material: "bi-file-earmark-binary",
  };

  return (
    <>
      {/* Redesigned Legend Button */}
      <button
        className="legend-floating-button"
        onClick={() => setShowLegendModal(true)}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          background: "linear-gradient(to bottom, #ffffff, #f2f2f2)",
          border: "1px solid #ccc",
          borderRadius: "8px",
          width: "40px",
          height: "40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
          cursor: "pointer",
          fontFamily: "'Inter', sans-serif",
          transition: "transform 0.2s, background 0.2s",
          padding: "0"
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = "linear-gradient(to bottom, #f8f8f8, #ededed)";
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = "linear-gradient(to bottom, #ffffff, #f2f2f2)";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <i className="bi bi-info-lg" style={{ color: "#333", fontSize: "1.2rem" }}></i>
      </button>

      {/* Legend Modal */}
      {showLegendModal && (
        <div
          className="modal fade show legend-modal-overlay"
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
          style={{ 
            display: "block", 
            backgroundColor: "rgba(0,0,0,0.5)", 
            paddingTop: "80px",
            zIndex: 10000
          }}
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable" style={{ maxWidth: "350px", margin: "auto" }}>
            <div className="modal-content" style={{ borderRadius: "10px", overflow: "hidden", maxHeight: "80vh", fontFamily: "'Inter', sans-serif" }}>
              <div className="modal-header" style={{ background: "#f8f9fa" }}>
                <h5 className="modal-title" style={{ fontFamily: "'Inter', sans-serif", fontWeight: "600" }}>Legend</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowLegendModal(false)}></button>
              </div>
              <div className="modal-body" style={{ overflowY: "auto", fontSize: "14px" }}>
                {/* Document Types */}
                <h6 style={{ fontWeight: "600" }}>Document Types</h6>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {documentTypes.map((doc, index) => {
                    const iconClass = iconMap[doc.name] || "bi-file-earmark";
                    return (
                      <div key={index} className="d-flex align-items-center gap-1">
                        <i className={`bi ${iconClass} modal-doc-icon`}></i>
                        <span>{doc.name} doc.</span>
                      </div>
                    );
                  })}
                </div>

                {/* Stakeholders */}
                <h6 style={{ fontWeight: "600" }}>Stakeholders</h6>
                <div className="row mb-3">
                  {stakeholders.map((stakeholder, index) => (
                    <div key={index} className="col-6 d-flex align-items-center gap-1 mb-1">
                      <span className="stakeholder-icon" style={{ color: stakeholder.color }}>
                        ■
                      </span>
                      <span>{stakeholder.name}</span>
                    </div>
                  ))}
                </div>

                {/* Connections */}
                <h6 style={{ fontWeight: "600" }}>Connections</h6>
                <div>
                  <p className="d-flex justify-content-between mb-1">
                    <span>Direct consequence</span>
                    <span>———</span>
                  </p>
                  <p className="d-flex justify-content-between mb-1">
                    <span>Collateral consequence</span>
                    <span>----</span>
                  </p>
                  <p className="d-flex justify-content-between mb-1">
                    <span>Prevision</span>
                    <span>......</span>
                  </p>
                  <p className="d-flex justify-content-between">
                    <span>Update</span>
                    <span>-.-.-.-</span>
                  </p>
                </div>
              </div>
              <div className="modal-footer" style={{ background: "#f8f9fa" }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowLegendModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Legend;
