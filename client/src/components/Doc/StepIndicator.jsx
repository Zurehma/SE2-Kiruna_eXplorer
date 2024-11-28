import React from "react";
import "../../styles/Documents.css";

function StepIndicator({ step, setStep, validateStep }) {
  const steps = [
    { label: "STEP 1", icon: <i className="bi bi-person-circle"></i> },
    { label: "STEP 2", icon: <i className="bi bi-file-earmark-text"></i> },
    { label: "STEP 3", icon: <i className="bi bi-geo-alt"></i> },
    { label: "STEP 4", icon: <i className="bi bi-cloud-arrow-up"></i> },
  ];

  const handleStepChange = (newStep) => {
    if (newStep > step) {
      let isValid = false;
      if (step === 1) isValid = validateStep(1);
      else if (step === 2) isValid = validateStep(2);
      else if (step === 3) isValid = validateStep(3);

      if (isValid) setStep(newStep);
    } else {
      setStep(newStep);
    }
  };

  return (
    <div className="step-indicator-container">
      <div className="step-line">
        {steps.map((item, index) => (
          <React.Fragment key={index}>
            <button
              className={`step-icon-btn ${index + 1 <= step ? "active" : ""}`}
              onClick={() => handleStepChange(index + 1)}
              disabled={index + 1 > step + 1 || index + 1 < step - 1}
            >
              <div className="step-icon">{item.icon}</div>
              <span className="step-label">{item.label}</span>
            </button>
            {index < steps.length - 1 && (
              <div
                className={`step-bar ${
                  index + 1 < step ? "completed" : index + 1 === step ? "half-filled" : "disabled"
                }`}
                style={{ backgroundColor: "red" }} // Per debug
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default StepIndicator;
