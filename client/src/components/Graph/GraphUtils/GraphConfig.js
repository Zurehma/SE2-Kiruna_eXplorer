"use strict";

const loadConfig = () => {
  const nodePositions = localStorage.getItem("nodePositions");

  if (nodePositions) {
    return JSON.parse(nodePositions);
  }

  return undefined;
};

const updateConfig = (nodeId, nodeX, nodeY) => {
  let nodePositions = loadConfig() || {};
  nodePositions[nodeId] = { x: nodeX, y: nodeY };
  localStorage.setItem("nodePositions", JSON.stringify(nodePositions));
  return nodePositions;
};

const clearConfig = () => {
  localStorage.removeItem("nodePositions");
};

const GraphConfig = {
  loadConfig,
  updateConfig,
  clearConfig,
};

export default GraphConfig;
