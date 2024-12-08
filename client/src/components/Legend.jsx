import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Legend = ({ documentTypes, stakeholders, showLegendModal, setShowLegendModal }) => {
  const iconMap = {
    Design: 'bi-file-earmark-text',
    Informative: 'bi-info-circle',
    Prescriptive: 'bi-arrow-right-square',
    Technical: 'bi-file-earmark-code',
    Agreement: 'bi-people-fill',
    Conflict: 'bi-x-circle',
    Consultation: 'bi-chat-dots',
    Action: 'bi-exclamation-triangle',
    Material: 'bi-file-earmark-binary',
  };

  return (
    <>
      {/* Floating Legend Button */}
      <button
        className="btn btn-sm legend-floating-button"
        onClick={() => setShowLegendModal(true)}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          backgroundColor: '#fff',
          border: '2px solid #ccc',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          cursor: 'pointer'
        }}
      >
        <i className="bi bi-info-lg" style={{ color: '#333', fontSize: '1.2rem' }}></i>
      </button>

      {/* Legend Modal */}
      {showLegendModal && (
        <div
          className="modal fade show legend-modal-overlay"
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content" style={{ borderRadius: '10px', overflow: 'hidden' }}>
              <div className="modal-header" style={{ background: '#f8f9fa' }}>
                <h5 className="modal-title">Legend</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setShowLegendModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {/* Document Types */}
                <h6>Document Types</h6>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {documentTypes.map((doc, index) => {
                    const iconClass = iconMap[doc.name] || 'bi-file-earmark';
                    return (
                      <div key={index} className="d-flex align-items-center gap-1">
                        <i className={`bi ${iconClass} modal-doc-icon`}></i>
                        <span>{doc.name} doc.</span>
                      </div>
                    );
                  })}
                </div>

                {/* Stakeholders */}
                <h6>Stakeholders</h6>
                <div className="row mb-3">
                  {stakeholders.map((stakeholder, index) => (
                    <div key={index} className="col-6 d-flex align-items-center gap-1 mb-1">
                      <span className="stakeholder-icon" style={{ color: stakeholder.color }}>■</span>
                      <span>{stakeholder.name}</span>
                    </div>
                  ))}
                </div>

                {/* Connections */}
                <h6>Connections</h6>
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
              <div className="modal-footer" style={{ background: '#f8f9fa' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowLegendModal(false)}
                >
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
