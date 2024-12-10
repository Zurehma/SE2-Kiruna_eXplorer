import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import API from "../../../API";
import "../../styles/DocumentChartStatic.css";
import Legend from "./Legend";
import GraphConfig from "./GraphUtils/GraphConfig";
import GraphUtils from "./GraphUtils/GraphUtils";

const DocumentChartStatic = (props) => {
  const svgRef = useRef();
  const [documentTypes, setDocumentTypes] = useState([]);
  const [stakeholders, setStakeholders] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [links, setLinks] = useState([]);
  const [showLegendModal, setShowLegendModal] = useState(false);

  const navigate = useNavigate();

  // We'll store current document coordinates in this dictionary:
  // { docId: { x: number, y: number } }
  const docCoords = {};

  const fetchData = async () => {
    try {
      const [documentType, stakeholder, documents, links] = await Promise.all([
        API.getDocumentTypes(),
        API.getStakeholders(),
        API.getDocuments(undefined, true),
        API.allExistingLinks(),
      ]);

      const stakeholdersWithColors = stakeholder.map((s) => ({
        ...s,
        color: GraphUtils.colorNameToHex(s.name),
      }));

      setDocumentTypes(documentType);
      setStakeholders(stakeholdersWithColors);
      setChartData(documents);
      setLinks(links);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (chartData.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const containerWidth = svgRef.current.parentElement.offsetWidth;
    const containerHeight = svgRef.current.parentElement.offsetHeight;
    const margin = { top: 20, right: 20, bottom: 40, left: 80 };
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    const g = svg
      .attr("viewBox", `0 0 ${containerWidth} ${containerHeight}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const years = Array.from(new Set(chartData.map((d) => new Date(d.issuanceDate).getFullYear()))).sort((a, b) => a - b);

    const scales = Array.from(new Set(["Text", ...chartData.map((d) => d.scale).filter((v, i, a) => a.indexOf(v) === i)]));

    const yScales = scales.includes("Blueprint") ? scales : [...scales, "Blueprint"];
    yScales.pop();

    const xScale = d3.scaleBand().domain(years).range([0, width]).padding(0.1);
    const yScale = d3.scaleBand().domain(yScales).range([0, height]).padding(0.2);

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    const yAxis = d3
      .axisLeft(yScale)
      .tickFormat((d) => (d !== "Blueprint" && d !== "Text" ? `1:${d}` : d))
      .tickSize(0);

    g.append("g").attr("transform", `translate(0, ${height})`).call(xAxis);
    g.append("g").call(yAxis);

    const stakeholderColorMap = stakeholders.reduce((acc, stakeholder) => {
      acc[stakeholder.name] = stakeholder.color;
      return acc;
    }, {});

    // Vertical and horizontal grid lines
    const cellWidth = xScale.bandwidth();
    const cellHeight = yScale.bandwidth();

    // Vertical lines
    const allXPositions = years.map((year) => xScale(year) + cellWidth);
    allXPositions.unshift(xScale(years[0]));
    allXPositions.forEach((xPos) => {
      g.append("line").attr("x1", xPos).attr("y1", 0).attr("x2", xPos).attr("y2", height).attr("stroke", "#ccc").attr("stroke-width", 1);
    });

    // Horizontal lines
    const allYPositions = yScales.map((s) => yScale(s) + cellHeight);
    allYPositions.unshift(yScale(yScales[0]));
    allYPositions.forEach((yPos) => {
      g.append("line").attr("x1", 0).attr("y1", yPos).attr("x2", width).attr("y2", yPos).attr("stroke", "#ccc").attr("stroke-width", 1);
    });

    // Helper to get cell coordinates of a doc
    function getCellCoords(doc) {
      const year = new Date(doc.issuanceDate).getFullYear();

      return {
        cellX: xScale(year),
        cellY: yScale(doc.scale),
      };
    }

    const config = GraphConfig.loadConfig();

    // Initialize docCoords
    chartData.forEach((doc) => {
      const { cellX, cellY } = getCellCoords(doc);
      if (cellX != null && cellY != null) {
        docCoords[doc.id] = {
          x: config && config[doc.id] ? config[doc.id].x : xScale.bandwidth() / 2,
          y: config && config[doc.id] ? config[doc.id].y : yScale.bandwidth() / 2,
        };
      }
    });

    // Function to update link paths
    function updateLinkPath(selection) {
      selection.each(function (d) {
        const path = d3.select(this);
        const doc1 = chartData.find((doc) => doc.id === d.DocID1);
        const doc2 = chartData.find((doc) => doc.id === d.DocID2);
        if (!doc1 || !doc2) return;

        const { cellX: cellX1, cellY: cellY1 } = getCellCoords(doc1);
        const { cellX: cellX2, cellY: cellY2 } = getCellCoords(doc2);
        if (cellX1 == null || cellY1 == null || cellX2 == null || cellY2 == null) return;

        const pos1 = docCoords[doc1.id];
        const pos2 = docCoords[doc2.id];
        if (!pos1 || !pos2) return;

        const startX = cellX1 + pos1.x;
        const startY = cellY1 + pos1.y;
        const endX = cellX2 + pos2.x;
        const endY = cellY2 + pos2.y;

        let strokeStyle = "4,4";
        let strokeColor = "gray";

        switch (d.type) {
          case "Direct":
            strokeStyle = "0";
            break;
          case "Collateral":
            strokeStyle = "4,4";
            break;
          case "Prevision":
            strokeStyle = "2,2";
            break;
          case "Update":
            strokeStyle = "1,5";
            break;
          default:
            strokeStyle = "4,4";
            break;
        }

        const radius = 15;
        const dx = endX - startX;
        const dy = endY - startY;
        const angle = Math.atan2(dy, dx);

        const sX = startX + Math.cos(angle) * radius;
        const sY = startY + Math.sin(angle) * radius;
        const eX = endX - Math.cos(angle) * radius;
        const eY = endY - Math.sin(angle) * radius;

        const cx = (sX + eX) / 2;
        const cy = (sY + eY) / 2 - 30;

        path
          .attr("fill", "none")
          .attr("stroke", strokeColor)
          .attr("stroke-width", 1)
          .attr("stroke-dasharray", strokeStyle)
          .attr("d", `M${sX},${sY} Q${cx},${cy} ${eX},${eY}`);
      });
    }

    // Draw links
    const linkSelection = g
      .selectAll(".link")
      .data(links, (d) => d.DocID1 + "-" + d.DocID2)
      .enter()
      .append("path")
      .attr("class", "link");

    updateLinkPath(linkSelection); // initial position

    // Define drag behavior
    // Define drag behavior
    const drag = d3
      .drag()
      .on("drag", function (event, d) {
        const docId = d.id;
        const { cellX, cellY } = getCellCoords(d);
        if (cellX == null || cellY == null) return;

        const cellWidth = xScale.bandwidth();
        const cellHeight = yScale.bandwidth();
        const halfSize = 12;

        const oldPos = docCoords[docId];
        if (!oldPos) return;

        let newX = oldPos.x + event.dx;
        let newY = oldPos.y + event.dy;

        // Clamp inside the cell
        if (newX < halfSize) newX = halfSize;
        if (newX > cellWidth - halfSize) newX = cellWidth - halfSize;
        if (newY < halfSize) newY = halfSize;
        if (newY > cellHeight - halfSize) newY = cellHeight - halfSize;

        docCoords[docId] = { x: newX, y: newY };

        d3.select(this).attr("transform", `translate(${cellX + newX},${cellY + newY})`);

        g.selectAll(".link").call(updateLinkPath);
      })
      .on("end", (event, d) => {
        GraphConfig.updateConfig(d.id, docCoords[d.id].x, docCoords[d.id].y);
      });

    // Draw documents
    const docSelection = g
      .selectAll(".doc")
      .data(chartData, (d) => d.id)
      .enter()
      .append("g")
      .attr("class", "doc")
      .attr("transform", (d) => {
        const { cellX, cellY } = getCellCoords(d);
        const pos = docCoords[d.id];
        return `translate(${cellX + pos.x},${cellY + pos.y})`;
      });

    // Conditionally apply drag behavior only if role is "Urban Planner"
    if (props.role === "Urban Planner") {
      docSelection.call(drag);
    }

    docSelection.each(function (d) {
      const iconClass = GraphUtils.iconMap[d.type] || "bi-file-earmark";
      const stakeholderColor = d.stakeholders ? d.stakeholders.map((s) => stakeholderColorMap[s] || "gray") : ["gray"];
      const iconColor = stakeholderColor.join(", ") || "gray";

      d3.select(this)
        .append("foreignObject")
        .attr("x", -12)
        .attr("y", -12)
        .attr("width", 24)
        .attr("height", 24)
        .style("pointer-events", "all")
        .html(
          `<div style="width:24px;height:24px;display:flex;align-items:center;justify-content:center;pointer-events:all;">
            <i class="bi ${iconClass}" style="font-size: 20px; color: ${iconColor}; cursor: ${
            props.role === "Urban Planner" ? "move" : "default"
          }; pointer-events:all;"></i>
          </div>`
        )
        .on("click", () => handleDocumentClick(d));
    });
  }, [chartData, links, stakeholders, props.role]);

  const handleDocumentClick = (doc) => {
    navigate(`/document/${doc.id}`);
  };

  return (
    <div className="d-flex align-items-center justify-content-center graph-outer-wrapper">
      <div className="graph-inner-wrapper">
        <Legend documentTypes={documentTypes} stakeholders={stakeholders} showLegendModal={showLegendModal} setShowLegendModal={setShowLegendModal} />
        <div style={{ width: "100%", height: "100%" }}>
          <svg ref={svgRef} style={{ width: "100%", height: "100%" }}></svg>
        </div>
      </div>
    </div>
  );
};

export default DocumentChartStatic;
