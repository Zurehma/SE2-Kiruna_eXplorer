"use strict";

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

const colorNameToHex = (colorName) => {
  const normalizedStr = colorName.trim().toLowerCase();
  let hash = 0;

  for (let i = 0; i < normalizedStr.length; i++) {
    hash = normalizedStr.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (let i = 0; i < 3; i++) {
    color += ("00" + ((hash >> (i * 8)) & 0xff).toString(16)).slice(-2);
  }

  return color;
};

const getCellPosition = (document) => {
  const year = new Date(document.issuanceDate).getFullYear();

  return {
    cellX: xScale(year),
    cellY: yScale(doc.scale),
  };
};

const GraphUtils = { iconMap, colorNameToHex, getCellPosition };

export default GraphUtils;
