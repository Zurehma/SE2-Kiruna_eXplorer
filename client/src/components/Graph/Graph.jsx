import React, { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import API from "../../../API";
import "../../styles/DocumentChartStatic.css";
import Legend from "./Legend"; 
import GraphUtils from "./GraphUtils/GraphUtils";
// import MyFilterDropdown from "../MapNavigation/MyFilterDropdown";
import { Modal, Button, Offcanvas, Accordion } from "react-bootstrap"; 
import useWebSocket from "../../hooks/useWebSocket";
import Filters from "../Filters/Filters";
import { useLocation } from "react-router-dom";


const DocumentChartStatic = (props) => {
  const svgRef = useRef();
  const docCoordsRef = useRef({});
  const controlPointsRef = useRef({});
  const [documentTypes, setDocumentTypes] = useState([]);
  const [stakeholders, setStakeholders] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [links, setLinks] = useState([]);
  const [showLegendModal, setShowLegendModal] = useState(false);
  const [selectedType, setSelectedType] = useState("All");
  const { isOpen, messageReceived, sendMessage } = useWebSocket();
  const [selectedDoc, setSelectedDoc] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  // States for handling deletion modal
  const [deleteLink, setDeleteLink] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // State for sidebar visibility
  const [showSidebar, setShowSidebar] = useState(false);

  // State for advanced filters
  const [advancedFilters, setAdvancedFilters] = useState({
    startDate: "",
    endDate: "",
    stakeholderGovernment: false,
    stakeholderPrivate: false,
    stakeholderCommunity: false,
    // Add more fields as per your advanced filters
  });

  const handleSidebarClose = () => setShowSidebar(false);
  const handleSidebarShow = () => setShowSidebar(true);

  const fetchData = async () => {
    try {
      const [documentType, stakeholder, links] = await Promise.all([
        API.getDocumentTypes(),
        API.getStakeholders(),
        API.allExistingLinks(),
      ]);

      const stakeholdersWithColors = stakeholder.map((s) => ({
        ...s,
        color: GraphUtils.colorNameToHex(s.name),
      }));

      setDocumentTypes(documentType);
      setStakeholders(stakeholdersWithColors);
      setLinks(links);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Handle filtering based on selectedType and advancedFilters
  useEffect(() => {
    const fetchFilteredDocuments = async () => {
      const filters = {
        type: selectedType !== "All" ? selectedType : undefined,
        // Advanced Filters
        startDate: advancedFilters.startDate || undefined,
        endDate: advancedFilters.endDate || undefined,
        stakeholderTypes: [
          ...(advancedFilters.stakeholderGovernment ? ["Government"] : []),
          ...(advancedFilters.stakeholderPrivate ? ["Private Sector"] : []),
          ...(advancedFilters.stakeholderCommunity ? ["Community"] : []),
        ],
        // Add more advanced filter parameters as needed
      };

      try {
        const docs = await API.getDocuments(filters, true);
        setChartData(docs);
      } catch (error) {
        console.error("Error fetching filtered documents:", error);
      }
    };

    fetchFilteredDocuments();
  }, [selectedType, advancedFilters]);

  useEffect(() => {
    fetchData();
  }, []);

  // Define openDeleteModal using useCallback to ensure stability
  const openDeleteModal = useCallback((link) => {
    setDeleteLink(link);
    setShowDeleteModal(true);
  }, []);

  const confirmDeleteLink = async () => {
    if (!deleteLink) return;
    try {
      await API.deleteLink(deleteLink.linkID);
      setShowDeleteModal(false);
      setDeleteLink(null);
      fetchData(); // Refresh the data to update the graph immediately
    } catch (error) {
      console.error("Failed to delete the link:", error);
      setShowDeleteModal(false);
      setDeleteLink(null);
      // Optionally, handle error display here (e.g., another modal or toast)
    }
  };

  const cancelDeleteLink = () => {
    setShowDeleteModal(false);
    setDeleteLink(null);
  };

  const getDocumentTitle = (docID) => {
    const doc = chartData.find((d) => d.id === docID);
    return doc ? doc.title : "Unknown";
  };

  useEffect(() => {
    if (!isOpen) return;

    if (chartData.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const container = svgRef.current.parentElement;
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    const margin = { top: 20, right: 20, bottom: 40, left: 80 };
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    const g = svg
      .attr("viewBox", `0 0 ${containerWidth} ${containerHeight}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    d3.select(svgRef.current).style(
      "background",
      "linear-gradient(to bottom, #fafafa, #f0f0f0)"
    );

    const years = Array.from(
      new Set(chartData.map((d) => new Date(d.issuanceDate).getFullYear()))
    ).sort((a, b) => a - b);
    const scales = Array.from(
      new Set([
        "Text",
        ...chartData
          .map((d) => d.scale)
          .filter((v, i, a) => a.indexOf(v) === i),
      ])
    );

    const yScales = scales.includes("Blueprint")
      ? scales
      : [...scales, "Blueprint"];
    yScales.pop();

    const xScale = d3.scaleBand().domain(years).range([0, width]).padding(0.1);
    const yScale = d3
      .scaleBand()
      .domain(yScales)
      .range([0, height])
      .padding(0.2);

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    const yAxis = d3
      .axisLeft(yScale)
      .tickFormat((d) =>
        d !== "Blueprint" && d !== "Text" ? `1:${d}` : d
      )
      .tickSize(0);

    g.append("g").attr("transform", `translate(0, ${height})`).call(xAxis);
    g.append("g").call(yAxis);

    g.selectAll("text")
      .style("font-family", "'Inter', sans-serif")
      .style("font-size", "14px")
      .style("fill", "#000"); // Changed text color to black

    const stakeholderColorMap = stakeholders.reduce((acc, stakeholder) => {
      acc[stakeholder.name] = stakeholder.color;
      return acc;
    }, {});

    // Grid lines
    const cellWidth = xScale.bandwidth();
    const cellHeight = yScale.bandwidth();

    const allXPositions = years.map((year) => xScale(year) + cellWidth);
    allXPositions.unshift(xScale(years[0]));
    allXPositions.forEach((xPos) => {
      g.append("line")
        .attr("x1", xPos)
        .attr("y1", 0)
        .attr("x2", xPos)
        .attr("y2", height)
        .attr("stroke", "#ccc")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "2,2");
    });

    const allYPositions = yScales.map((s) => yScale(s) + cellHeight);
    allYPositions.unshift(yScale(yScales[0]));
    allYPositions.forEach((yPos) => {
      g.append("line")
        .attr("x1", 0)
        .attr("y1", yPos)
        .attr("x2", width)
        .attr("y2", yPos)
        .attr("stroke", "#ccc")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "2,2");
    });

    function getCellCoords(doc) {
      const year = new Date(doc.issuanceDate).getFullYear();
      return {
        cellX: xScale(year),
        cellY: yScale(doc.scale),
      };
    }

    // Initialize docCoordsRef.current
    docCoordsRef.current = {}; // Reset before setting
    chartData.forEach((doc) => {
      const { cellX, cellY } = getCellCoords(doc);

      if (cellX != null && cellY != null) {
        docCoordsRef.current[doc.id] = {
          x: cellWidth / 2,
          y: cellHeight / 2,
        };
      }
    });

    // Initialize controlPointsRef.current with dynamic positioning
    if (Object.keys(controlPointsRef.current).length === 0) {
      links.forEach((link) => {
        const doc1 = chartData.find((d) => d.id === link.DocID1);
        const doc2 = chartData.find((d) => d.id === link.DocID2);
        if (doc1 && doc2) {
          const pos1 = docCoordsRef.current[doc1.id];
          const pos2 = docCoordsRef.current[doc2.id];
          const { x: startX, y: startY } = pos1;
          const { x: endX, y: endY } = pos2;

          // Calculate midpoint
          const midX = (startX + endX) / 2;
          const midY = (startY + endY) / 2;

          // Calculate angle of the link
          const angle = Math.atan2(endY - startY, endX - startX);

          // Calculate perpendicular offset (smaller value for closer positioning)
          const offsetMagnitude = 20; // Adjust this value as needed
          const offsetX = -Math.sin(angle) * offsetMagnitude;
          const offsetY = Math.cos(angle) * offsetMagnitude;

          // Set control point position closer to the link
          controlPointsRef.current[link.linkID] = {
            x: midX + offsetX,
            y: midY + offsetY,
          };
        }
      });
    }

    // Update docCoordsRef.current with messageReceived
    Object.keys(messageReceived).forEach((docId) => {
      if (docCoordsRef.current[docId]) {
        // Check if docCoordsRef.current[docId] exists
        const dx = messageReceived[docId].x;
        const dy = messageReceived[docId].y;
        docCoordsRef.current[docId].x = cellWidth / 2 + dx * cellWidth;
        docCoordsRef.current[docId].y = cellHeight / 2 + dy * cellHeight;
      } else {
        console.warn(`Received message for unknown docId: ${docId}`);
        // Optionally, initialize it or handle accordingly
      }
    });

    // Tooltip setup
    const tooltip = d3
      .select(svgRef.current.parentElement)
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background", "#fff") // Fixed missing '#' for white background
      .style("padding", "12px 16px")
      .style("border", "1px solid #ddd")
      .style("border-radius", "8px")
      .style("box-shadow", "0 4px 12px rgba(0,0,0,0.1)")
      .style("font-size", "14px")
      .style("line-height", "1.4")
      .style("font-family", "'Inter', sans-serif")
      .style("color", "#000") // Changed tooltip text color to black
      .style("pointer-events", "none")
      .style("opacity", 0)
      .style("z-index", 9999)
      .style("transition", "opacity 0.2s ease-in-out");

    const arrowSize = 8;
    tooltip
      .append("div")
      .attr("class", "tooltip-arrow")
      .style("position", "absolute")
      .style("width", "0")
      .style("height", "0")
      .style("border-left", `${arrowSize}px solid transparent`)
      .style("border-right", `${arrowSize}px solid transparent`)
      .style("border-bottom", `${arrowSize}px solid #ddd`)
      .style("left", "50%")
      .style("transform", "translateX(-50%)");

    let hideTooltipTimeout;

    function showTooltip(html, x, y) {
      clearTimeout(hideTooltipTimeout);
      tooltip.html(html);

      const arrow = tooltip.select(".tooltip-arrow");
      if (arrow.empty()) {
        tooltip
          .append("div")
          .attr("class", "tooltip-arrow")
          .style("position", "absolute")
          .style("width", "0")
          .style("height", "0")
          .style("border-left", `${arrowSize}px solid transparent`)
          .style("border-right", `${arrowSize}px solid transparent`)
          .style("border-bottom", `${arrowSize}px solid #ddd`)
          .style("left", "50%")
          .style("transform", "translateX(-50%)");
      }

      tooltip.style("opacity", 1).style("pointer-events", "all");
      const rect = tooltip.node().getBoundingClientRect();

      let left = x - rect.width / 2;
      let top = y - (rect.height + arrowSize + 5);

      if (left < 0) left = 0;
      if (top < 0) top = 0;
      if (left + rect.width > container.offsetWidth)
        left = container.offsetWidth - rect.width;
      if (top + rect.height > container.offsetHeight)
        top = container.offsetHeight - rect.height;

      tooltip.style("left", `${left}px`).style("top", `${top}px`);

      tooltip.select(".tooltip-arrow").style("top", `${rect.height}px`);
    }

    function hideTooltip() {
      hideTooltipTimeout = setTimeout(() => {
        tooltip.style("opacity", 0).style("pointer-events", "none");
      }, 300);
    }

    tooltip
      .on("mouseover", () => clearTimeout(hideTooltipTimeout))
      .on("mouseout", hideTooltip);

    function updateLinkPath(selection) {
      selection.each(function (d) {
        const path = d3.select(this);
        const doc1 = chartData.find((doc) => doc.id === d.DocID1);
        const doc2 = chartData.find((doc) => doc.id === d.DocID2);
        if (!doc1 || !doc2) return;

        const { cellX: cellX1, cellY: cellY1 } = getCellCoords(doc1);
        const { cellX: cellX2, cellY: cellY2 } = getCellCoords(doc2);
        if (cellX1 == null || cellY1 == null || cellX2 == null || cellY2 == null)
          return;

        const pos1 = docCoordsRef.current[doc1.id];
        const pos2 = docCoordsRef.current[doc2.id];
        if (!pos1 || !pos2) return;

        const startX = cellX1 + pos1.x;
        const startY = cellY1 + pos1.y;
        const endX = cellX2 + pos2.x;
        const endY = cellY2 + pos2.y;

        // Retrieve control point for this link
        const control = controlPointsRef.current[d.linkID];
        if (!control) {
          // If no control point, set to midpoint with dynamic offset
          const midX = (startX + endX) / 2;
          const midY = (startY + endY) / 2;

          const angle = Math.atan2(endY - startY, endX - startX);
          const offsetMagnitude = 20; // Adjust as needed
          const offsetX = -Math.sin(angle) * offsetMagnitude;
          const offsetY = Math.cos(angle) * offsetMagnitude;

          controlPointsRef.current[d.linkID] = {
            x: midX + offsetX,
            y: midY + offsetY,
          };
        }

        const controlPoint = controlPointsRef.current[d.linkID];
        const cx = controlPoint.x;
        const cy = controlPoint.y;

        let strokeStyle = "4,4";
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

        path
          .attr("fill", "none")
          .attr("stroke", "gray")
          .attr("stroke-width", 1.5)
          .attr("stroke-dasharray", strokeStyle)
          .attr("d", `M${startX},${startY} Q${cx},${cy} ${endX},${endY}`);
      });
    }

    // === UPDATED SECTION START ===
    // Bind data to link elements using linkID as the key
    const linkSelection = g
      .selectAll(".link")
      .data(links, (d) => d.linkID) // Changed from d.DocID1 + "-" + d.DocID2 to d.linkID
      .enter()
      .append("path")
      .attr("class", "link");

    updateLinkPath(linkSelection);

    function getLinkMidpoint(d) {
      const doc1 = chartData.find((doc) => doc.id === d.DocID1);
      const doc2 = chartData.find((doc) => doc.id === d.DocID2);
      if (!doc1 || !doc2) return null;

      const { cellX: cellX1, cellY: cellY1 } = getCellCoords(doc1);
      const { cellX: cellX2, cellY: cellY2 } = getCellCoords(doc2);
      if (cellX1 == null || cellY1 == null || cellX2 == null || cellY2 == null)
        return null;

      const pos1 = docCoordsRef.current[doc1.id];
      const pos2 = docCoordsRef.current[doc2.id];
      if (!pos1 || !pos2) return null;

      const startX = cellX1 + pos1.x;
      const startY = cellY1 + pos1.y;
      const endX = cellX2 + pos2.x;
      const endY = cellY2 + pos2.y;

      const control = controlPointsRef.current[d.linkID];
      const cx = control.x;
      const cy = control.y;

      return { x: cx, y: cy };
    }

    linkSelection
      .on("mouseover", function (event, d) {
        clearTimeout(hideTooltipTimeout);
        const doc1 = chartData.find((doc) => doc.id === d.DocID1);
        const doc2 = chartData.find((doc) => doc.id === d.DocID2);
        const midpoint = getLinkMidpoint(d);
        if (!midpoint) return;

        // Conditionally include Delete Button and Info Icon based on role
        const actionButtons =
          props.role === "Urban Planner"
            ? `
              <div style="display:flex;align-items:center; margin-top:8px;">
                <button class="delete-link-btn btn btn-sm btn-danger me-2">
                  Delete Link
                </button>
                <span class="info-icon" title="This action cannot be undone and will permanently remove the link.">
                  <i class="bi bi-info-circle"></i>
                </span>
              </div>
            `
            : "";

        const html = `
          <div style="position:relative; color:#000;">
            <div style="margin-bottom:4px;font-weight:bold;">Link Type: ${d.type}</div>
            <div style="margin-bottom:8px;">
              <b>Documents:</b><br/>
              ${doc1.title}<br/>
              ${doc2.title}
            </div>
            ${actionButtons}
          </div>
        `;

        showTooltip(html, midpoint.x + margin.left, midpoint.y + margin.top);

        if (props.role === "Urban Planner") {
          // Add click event handler for the delete button to open the confirmation modal
          d3.select(tooltip.node())
            .select(".delete-link-btn")
            .on("click", () => {
              setShowDeleteModal(false); // Hide the tooltip
              openDeleteModal(d); // Open the confirmation modal with the link data
            });
        }
      })
      .on("mouseout", hideTooltip);

    // === ADDING CONTROL POINTS ===
    // Append control points as draggable circles
    const controlPointSelection = g
      .selectAll(".control-point")
      .data(links, (d) => d.linkID)
      .enter()
      .append("circle")
      .attr("class", "control-point")
      .attr("r", 6)
      .attr("fill", "orange")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .attr("cursor", "pointer")
      .attr("cx", (d) => controlPointsRef.current[d.linkID].x)
      .attr("cy", (d) => controlPointsRef.current[d.linkID].y)
      .call(
        d3
          .drag()
          .on("drag", function (event, d) {
            // Update control point position
            controlPointsRef.current[d.linkID].x = event.x;
            controlPointsRef.current[d.linkID].y = event.y;

            // Update the link path
            updateLinkPath(g.selectAll(".link"));

            // Update the position of the control point itself
            d3.select(this).attr("cx", event.x).attr("cy", event.y);
          })
          .on("end", (event, d) => {})
      );

    g.selectAll(".control-point").raise();

    const drag = d3
      .drag()
      .on("drag", function (event, d) {
        const docId = d.id;
        const { cellX, cellY } = getCellCoords(d);
        if (cellX == null || cellY == null) return;

        const cellWidth = xScale.bandwidth();
        const cellHeight = yScale.bandwidth();
        const halfSize = 12;

        const oldPos = docCoordsRef.current[docId];
        if (!oldPos) return;

        let newX = oldPos.x + event.dx;
        let newY = oldPos.y + event.dy;

        if (newX < halfSize) newX = halfSize;
        if (newX > cellWidth - halfSize) newX = cellWidth - halfSize;
        if (newY < halfSize) newY = halfSize;
        if (newY > cellHeight - halfSize) newY = cellHeight - halfSize;

        docCoordsRef.current[docId] = { x: newX, y: newY };

        d3.select(this).attr("transform", `translate(${cellX + newX},${cellY + newY})`);

        // Update the links connected to this document
        g.selectAll(".link").call(updateLinkPath);

        // Update control points for connected links
        links.forEach((link) => {
          if (link.DocID1 === docId || link.DocID2 === docId) {
            const otherDocId = link.DocID1 === docId ? link.DocID2 : link.DocID1;
            const otherDoc = chartData.find((doc) => doc.id === otherDocId);
            if (otherDoc) {
              const pos1 = docCoordsRef.current[link.DocID1];
              const pos2 = docCoordsRef.current[link.DocID2];
              const { x: startX, y: startY } = pos1;
              const { x: endX, y: endY } = pos2;

              const midX = (startX + endX) / 2;
              const midY = (startY + endY) / 2;
              const angle = Math.atan2(endY - startY, endX - startX);
              const offsetMagnitude = 20; // Adjust as needed
              const offsetX = -Math.sin(angle) * offsetMagnitude;
              const offsetY = Math.cos(angle) * offsetMagnitude;

              controlPointsRef.current[link.linkID] = {
                x: midX + offsetX,
                y: midY + offsetY,
              };
            }
          }
        });

        g.selectAll(".control-point")
          .attr("cx", (d) => controlPointsRef.current[d.linkID].x)
          .attr("cy", (d) => controlPointsRef.current[d.linkID].y);
      })
      .on("end", (event, d) => {
        const docId = d.id;
        const x = (docCoordsRef.current[docId].x - cellWidth / 2) / cellWidth;
        const y = (docCoordsRef.current[docId].y - cellHeight / 2) / cellHeight;
        sendMessage({ docId, x, y });
      });

    const docSelection = g
      .selectAll(".doc")
      .data(chartData, (d) => d.id)
      .enter()
      .append("g")
      .attr("class", "doc")
      .attr("transform", (d) => {
        const { cellX, cellY } = getCellCoords(d);
        const pos = docCoordsRef.current[d.id];
        return `translate(${cellX + pos.x},${cellY + pos.y})`;
      });

    if (props.role === "Urban Planner") {
      docSelection.call(drag);
    }

    function getDocPosition(d) {
      const { cellX, cellY } = getCellCoords(d);
      if (cellX == null || cellY == null) return null;
      const pos = docCoordsRef.current[d.id];
      return {
        x: cellX + pos.x + margin.left,
        y: cellY + pos.y + margin.top,
      };
    }

    docSelection.each(function (d) {
      const iconClass = GraphUtils.iconMap[d.type] || "bi-file-earmark";
      const stakeholderColor = d.stakeholders
        ? d.stakeholders.map((s) => stakeholderColorMap[s] || "black")
        : ["black"];
      const iconColor = stakeholderColor.join(", ") || "black";

      d3.select(this)
        .append("foreignObject")
        .attr("x", -12)
        .attr("y", -12)
        .attr("width", 24)
        .attr("height", 24)
        .style("pointer-events", "all")
        .html(
          `<div style="width:24px;height:24px;display:flex;align-items:center;justify-content:center;pointer-events:all;transition:transform 0.2s, box-shadow 0.2s;">
            <i class="bi ${iconClass}" style="font-size: 20px; color: ${iconColor}; cursor: ${
            props.role === "Urban Planner" ? "move" : "default"
          }; pointer-events:all;"></i>
          </div>`
        )
        .on("click", () => handleDocumentClick(d));
    });

    docSelection
      .on("mouseover", function (event, d) {
        clearTimeout(hideTooltipTimeout);
        const docPos = getDocPosition(d);
        if (docPos) {
          const html = `<b style="color:#000;">Title:</b> <span style="color:#000;">${d.title}</span>`;
          showTooltip(html, docPos.x, docPos.y - 10);
        }

        d3.select(this)
          .select("foreignObject div")
          .transition()
          .duration(200)
          .style("transform", "scale(1.1)")
          .style("box-shadow", "0 4px 10px rgba(0,0,0,0.15)");
      })
      .on("mouseout", function () {
        hideTooltip();
        d3.select(this)
          .select("foreignObject div")
          .transition()
          .duration(200)
          .style("transform", "scale(1)")
          .style("box-shadow", "none");
      });
  }, [chartData, links, stakeholders, props.role, messageReceived, isOpen]);

  const handleDocumentClick = (doc) => {
    navigate(`/document/${doc.id}`);
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const docId = parseInt(searchParams.get("id"));

    if (docId) {
      setSelectedDoc(docId);
    }
  });

  //if selected document then highlight the document
  useEffect(() => {
    if (selectedDoc) {
      const doc = chartData.find((d) => d.id === selectedDoc);
      if (doc) {
        //fill the shape as blue and zoom in and out
        const svg = d3.select(svgRef.current);
        const docSelection = svg.selectAll(".doc");
        const selectedDoc = docSelection.filter((d) => d.id === doc.id);
        if (selectedDoc) {
          selectedDoc.select("foreignObject div")
            .style("background", "#006d77")
            .transition().duration(200)
            .style("transform", "scale(1.5)")
            .style("box-shadow", "0 4px 10px rgba(0,0,0,0.15)");
        }
      }
    }
  });

  return (
    <div className="d-flex align-items-center justify-content-center graph-outer-wrapper">
      {/* Sidebar Toggle Button */}
      <div className="sidebar-toggle-btn">
        <Button variant="primary" onClick={handleSidebarShow}>
          <i className="bi bi-funnel"></i> Filters & Legend
        </Button>
      </div>

      {/* Offcanvas Sidebar */}
      <Offcanvas show={showSidebar} onHide={handleSidebarClose} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Filters & Legend</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <hr />

          {/* Advanced Filters Accordion */}
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Advanced Filters</Accordion.Header>
              <Accordion.Body>
              < Filters
            loggedIn={props.loggedIn}
            typeDoc={documentTypes}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
          />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <hr />

          {/* Legend */}
          <Legend
            documentTypes={documentTypes}
            stakeholders={stakeholders}
            mode="sidebar"
          />
        </Offcanvas.Body>
      </Offcanvas>

      {/* Existing Graph Components */}
      <div className="graph-inner-wrapper">
        <div id="image" style={{ width: "100%", height: "100%", position: "relative" }}>
          <svg ref={svgRef} style={{ width: "100%", height: "100%" }}></svg>
        </div>
      </div>

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
                <i
                  className="bi bi-exclamation-triangle-fill"
                  style={{ color: "orange", marginRight: "8px" }}
                ></i>
                This action cannot be undone.
              </p>
            </>
          ) : (
            <p>Are you sure you want to delete this link?</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDeleteLink}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDeleteLink}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default DocumentChartStatic;
