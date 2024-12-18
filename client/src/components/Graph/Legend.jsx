// Legend.js
import React from "react";
import GraphUtils from '../../utils/graphUtils'

const Legend = ({ documentTypes, stakeholders }) => {
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
    <div>
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
            <span className="stakeholder-icon" style={{ color: GraphUtils.colorNameToHex(stakeholder.name) }}>
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
  );
};
export default Legend;
