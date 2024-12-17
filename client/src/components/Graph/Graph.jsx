import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import API from "../../../API";
import "../../styles/DocumentChartStatic.css";
import GraphUtils from "../../utils/graphUtils";
import useWebSocket from "../../hooks/useWebSocket";
import FilterAndLegendSidebar from "./FilterAndLegendSidebar";
import DeleteLinkModal from "./deleteLinkModal";
import { useLocation } from "react-router-dom";

const DocumentChartStatic = (props) => {
  const svgRef = useRef();
  const docCoordsRef = useRef({});
  const controlPointsRef = useRef({});

  const { isOpen, messageReceived, sendMessage } = useWebSocket();
  const [selectedDoc, setSelectedDoc] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const [documentTypes, setDocumentTypes] = useState([]);
  const [stakeholders, setStakeholders] = useState([]);
  const [links, setLinks] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [documentTypes, stakeholders, linksData, documents] = await Promise.all([
          API.getDocumentTypes(),
          API.getStakeholders(),
          API.allExistingLinks(),
          API.getDocuments(undefined, true),
        ]);
  
        setDocumentTypes(documentTypes);
        setStakeholders(stakeholders);
  
        // Convert all document IDs to strings for consistency
        const validDocumentIds = new Set(documents.map(doc => String(doc.id)));
  
        const validLinks = linksData.filter(link => 
          validDocumentIds.has(String(link.DocID1)) && validDocumentIds.has(String(link.DocID2))
        );
  
        setLinks(validLinks);
        setChartData(documents);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);
  
  

  // States for handling deletion modal
  const [deleteLink, setDeleteLink] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const openDeleteModal = (link) => {
    setDeleteLink(link);
    setShowDeleteModal(true);
  };

  const handleLinkDeleted = (deletedLinkID) => {
    setLinks((prevLinks) => prevLinks.filter((link) => link.linkID !== deletedLinkID));
  };

  useEffect(() => {
    if (!isOpen || chartData.length === 0) return;

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

    d3.select(svgRef.current).style("background", "linear-gradient(to bottom, #fafafa, #f0f0f0)");

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

    g.selectAll("text").style("font-family", "'Inter', sans-serif").style("font-size", "14px").style("fill", "#000");

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
      } else {
        console.warn(`Document with id ${doc.id} has invalid issuanceDate or scale.`);
      }
    });

    // PRUNE CONTROL POINTS TO MATCH CURRENT LINKS
    const currentLinkIDs = new Set(links.map((link) => link.linkID));
    Object.keys(controlPointsRef.current).forEach((linkID) => {
      if (!currentLinkIDs.has(linkID)) {
        delete controlPointsRef.current[linkID];
      }
    });

    // Initialize controlPointsRef.current for new links
    const linkPairCount = {};
    links.forEach((link) => {
      const pairKey = [link.DocID1, link.DocID2].sort().join("-");

      if (!controlPointsRef.current[link.linkID]) {
        const doc1 = chartData.find((d) => d.id === link.DocID1);
        const doc2 = chartData.find((d) => d.id === link.DocID2);
        if (doc1 && doc2) {
          const pos1 = docCoordsRef.current[doc1.id];
          const pos2 = docCoordsRef.current[doc2.id];
          const { cellX: cellX1, cellY: cellY1 } = getCellCoords(doc1);
          const { cellX: cellX2, cellY: cellY2 } = getCellCoords(doc2);

          if (!pos1 || !pos2 || cellX1 == null || cellY1 == null || cellX2 == null || cellY2 == null) {
            console.warn(`Link with linkID ${link.linkID} has invalid positioning.`);
            return;
          }

          const startX = cellX1 + pos1.x;
          const startY = cellY1 + pos1.y;
          const endX = cellX2 + pos2.x;
          const endY = cellY2 + pos2.y;

          // Calculate midpoint of the straight line between docs
          const midX = (startX + endX) / 2;
          const midY = (startY + endY) / 2;

          // Calculate angle of the line connecting the two docs
          const angle = Math.atan2(endY - startY, endX - startX);

          if (!linkPairCount[pairKey]) {
            linkPairCount[pairKey] = 0;
          }

          const linkIndexForPair = linkPairCount[pairKey];
          const offsetBaseMagnitude = 40;
          const offsetMagnitude = offsetBaseMagnitude * (linkIndexForPair + 1);

          const rotationAngle = (Math.PI / 6) * linkIndexForPair;
          const direction = linkIndexForPair % 2 === 0 ? 1 : -1;
          const perpendicularAngle = angle + Math.PI / 2 + rotationAngle * direction;

          const offsetX = Math.cos(perpendicularAngle) * offsetMagnitude;
          const offsetY = Math.sin(perpendicularAngle) * offsetMagnitude;

          controlPointsRef.current[link.linkID] = {
            x: midX + offsetX,
            y: midY + offsetY,
          };

          linkPairCount[pairKey]++;
        } else {
          console.warn(`Link with linkID ${link.linkID} has invalid DocID1 or DocID2.`);
        }
      }
    });

    // console.log("After initialization, controlPointsRef.current:", controlPointsRef.current);

    // Update docCoordsRef.current with messageReceived
    if (messageReceived.messageType === "update-configuration") {
      const nodes = messageReceived["nodes"];
      const connections = messageReceived["connections"];

      if (messageReceived.messageType === "update-configuration") {
        const nodes = messageReceived["nodes"];
        const connections = messageReceived["connections"];

        // console.log("nodes: ", nodes);
        // console.log("connections: ", connections);

        Object.entries(nodes).forEach(([nodeId, node]) => {
          if (docCoordsRef.current.hasOwnProperty(nodeId)) {
            docCoordsRef.current[nodeId].x = cellWidth / 2 + node.x * cellWidth;
            docCoordsRef.current[nodeId].y = cellHeight / 2 + node.y * cellHeight;
          }
        });

        Object.entries(connections).forEach(([connectionId, connection]) => {
          if (controlPointsRef.current.hasOwnProperty(connectionId)) {
            controlPointsRef.current[connectionId].x = connection.x * width;
            controlPointsRef.current[connectionId].y = connection.y * height;
          }
        });
      }
    }

    // Tooltip setup
    const tooltip = d3
      .select(container)
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background", "#fff")
      .style("padding", "12px 16px")
      .style("border", "1px solid #ddd")
      .style("border-radius", "8px")
      .style("box-shadow", "0 4px 12px rgba(0,0,0,0.1)")
      .style("font-size", "14px")
      .style("line-height", "1.4")
      .style("font-family", "'Inter', sans-serif")
      .style("color", "#000")
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

      tooltip.style("opacity", 1).style("pointer-events", "all");
      const rect = tooltip.node().getBoundingClientRect();

      let left = x - rect.width / 2;
      let top = y - (rect.height + arrowSize + 5);

      if (left < 0) left = 0;
      if (top < 0) top = 0;
      if (left + rect.width > container.offsetWidth) left = container.offsetWidth - rect.width;
      if (top + rect.height > container.offsetHeight) top = container.offsetHeight - rect.height;

      tooltip.style("left", `${left}px`).style("top", `${top}px`);

      tooltip.select(".tooltip-arrow").style("top", `${rect.height}px`);
    }

    function hideTooltip() {
      hideTooltipTimeout = setTimeout(() => {
        tooltip.style("opacity", 0).style("pointer-events", "none");
      }, 300);
    }

    tooltip.on("mouseover", () => clearTimeout(hideTooltipTimeout)).on("mouseout", hideTooltip);

    // Modified updateLinkPath to use a cubic Bezier that passes through the control point
    function updateLinkPath(selection) {
      selection.each(function (d) {
        const path = d3.select(this);
        const doc1 = chartData.find((doc) => doc.id === d.DocID1);
        const doc2 = chartData.find((doc) => doc.id === d.DocID2);
        if (!doc1 || !doc2) return;

        const { cellX: cellX1, cellY: cellY1 } = getCellCoords(doc1);
        const { cellX: cellX2, cellY: cellY2 } = getCellCoords(doc2);
        if (cellX1 == null || cellY1 == null || cellX2 == null || cellY2 == null) return;

        const pos1 = docCoordsRef.current[doc1.id];
        const pos2 = docCoordsRef.current[doc2.id];
        if (!pos1 || !pos2) return;

        const startX = cellX1 + pos1.x;
        const startY = cellY1 + pos1.y;
        const endX = cellX2 + pos2.x;
        const endY = cellY2 + pos2.y;

        // Use existing control points if they exist
        let control = controlPointsRef.current[d.linkID];
        if (!control) {
          // Initialize if no control point exists
          const midX = (startX + endX) / 2;
          const midY = (startY + endY) / 2;
          control = { x: midX, y: midY };
          controlPointsRef.current[d.linkID] = control;
        }

        const cx = control.x;
        const cy = control.y;

        // Calculate P1 = P2 so that the curve passes through (cx, cy) at t=0.5
        // Formula derived:
        // CP = (S + E)/8 + (3/4)*X  =>  X = [CP - (S+E)/8]*(4/3)
        const Px = (cx - (startX + endX) / 8) * (4 / 3);
        const Py = (cy - (startY + endY) / 8) * (4 / 3);

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
          .attr("d", `M${startX},${startY} C${Px},${Py} ${Px},${Py} ${endX},${endY}`);
      });
    }

    // === Bind data to link elements using linkID as the key ===
    const linkSelection = g
      .selectAll(".link")
      .data(links, (d) => d.linkID)
      .enter()
      .append("path")
      .attr("class", "link");

    updateLinkPath(linkSelection);

    linkSelection
      .on("mouseover", function (event, d) {
        clearTimeout(hideTooltipTimeout);
        const doc1 = chartData.find((doc) => doc.id === d.DocID1);
        const doc2 = chartData.find((doc) => doc.id === d.DocID2);

        const [mouseX, mouseY] = d3.pointer(event, container);

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
              ${doc1 ? doc1.title : "Unknown"}<br/>
              ${doc2 ? doc2.title : "Unknown"}
            </div>
            ${actionButtons}
          </div>
        `;

        showTooltip(html, mouseX + margin.left, mouseY + margin.top);

        if (props.role === "Urban Planner") {
          d3.select(tooltip.node())
            .select(".delete-link-btn")
            .on("click", () => {
              setShowDeleteModal(false);
              openDeleteModal(d);
            });
        }
      })
      .on("mouseout", hideTooltip);

    if (props.role === "Urban Planner") {
      // Render control points
      const controlPointsGroup = g.append("g").attr("class", "control-points");

      const controlPointSelection = controlPointsGroup
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
        .attr("cx", (d) => {
          if (!controlPointsRef.current[d.linkID]) {
            console.warn(`Control point missing for linkID: ${d.linkID}`);
            return 0;
          }
          return controlPointsRef.current[d.linkID].x;
        })
        .attr("cy", (d) => {
          if (!controlPointsRef.current[d.linkID]) {
            console.warn(`Control point missing for linkID: ${d.linkID}`);
            return 0;
          }
          return controlPointsRef.current[d.linkID].y;
        })
        .style("display", (d) => (controlPointsRef.current[d.linkID] ? "block" : "none"))
        .call(
          d3
            .drag()
            .on("start", function (event, d) {
              g.selectAll(".link")
                .filter((linkData) => linkData.linkID === d.linkID)
                .classed("active-link", true);
            })
            .on("drag", function (event, d) {
              let [mx, my] = d3.pointer(event, g.node());

              // Clamp the control point within the chart area
              if (mx < 0) mx = 0;
              if (mx > width) mx = width;
              if (my < 0) my = 0;
              if (my > height) my = height;

              controlPointsRef.current[d.linkID].x = mx;
              controlPointsRef.current[d.linkID].y = my;

              d3.select(this).attr("cx", mx).attr("cy", my);

              updateLinkPath(g.selectAll(".link"));
            })
            .on("end", function (event, d) {
              g.selectAll(".link")
                .filter((linkData) => linkData.linkID === d.linkID)
                .classed("active-link", false);

              sendMessage({
                messageType: "update-connection",
                id: d.linkID,
                x: controlPointsRef.current[d.linkID].x / width,
                y: controlPointsRef.current[d.linkID].y / height,
              });
            })
        )
        .on("mouseover", function (event, d) {
          d3.select(this).transition().duration(200).attr("fill", "red");
          g.selectAll(".link")
            .filter((linkData) => linkData.linkID === d.linkID)
            .attr("stroke", "red");
        })
        .on("mouseout", function (event, d) {
          d3.select(this).transition().duration(200).attr("fill", "orange");
          g.selectAll(".link")
            .filter((linkData) => linkData.linkID === d.linkID)
            .attr("stroke", "gray");
        });

      controlPointSelection.raise();
    }

    const drag = d3
      .drag()
      .on("drag", function (event, d) {
        const docId = d.id;
        const { cellX, cellY } = getCellCoords(d);
        if (cellX == null || cellY == null) return;

        const oldPos = docCoordsRef.current[docId];
        if (!oldPos) return;

        let newX = oldPos.x + event.dx;
        let newY = oldPos.y + event.dy;

        const halfSize = 12;

        if (newX < halfSize) newX = halfSize;
        if (newX > cellWidth - halfSize) newX = cellWidth - halfSize;
        if (newY < halfSize) newY = halfSize;
        if (newY > cellHeight - halfSize) newY = cellHeight - halfSize;

        docCoordsRef.current[docId] = { x: newX, y: newY };

        d3.select(this).attr("transform", `translate(${cellX + newX},${cellY + newY})`);

        g.selectAll(".link").call(updateLinkPath);

        if (props.role === "Urban Planner") {
          g.selectAll(".control-point")
            .attr("cx", (d) => controlPointsRef.current[d.linkID]?.x || 0)
            .attr("cy", (d) => controlPointsRef.current[d.linkID]?.y || 0);
        }
      })
      .on("end", (event, d) => {
        const docId = d.id;
        const x = (docCoordsRef.current[docId].x - cellWidth / 2) / cellWidth;
        const y = (docCoordsRef.current[docId].y - cellHeight / 2) / cellHeight;
        sendMessage({ messageType: "update-node", id: docId, x, y });
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
      const iconColor = d.stakeholders.map((stakeholder) => GraphUtils.colorNameToHex(stakeholder)).join(", ") || "black";

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
        d3.select(this).select("foreignObject div").transition().duration(200).style("transform", "scale(1)").style("box-shadow", "none");
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
        const svg = d3.select(svgRef.current);
        const docSelection = svg.selectAll(".doc");
        const selectedDocEl = docSelection.filter((d) => d.id === doc.id);
        if (!selectedDocEl.empty()) {
          selectedDocEl.select("foreignObject div").classed("highlighted", true);
          // Remove highlight after 10 seconds
          const timeout = setTimeout(() => {
            selectedDocEl.select("foreignObject div").classed("highlighted", false);
          }, 10000); // 10 seconds

          // Clean up timeout on unmount or when `selectedDoc` changes
          return () => clearTimeout(timeout);
        } else {
          svg.selectAll(".doc").select("foreignObject div").style("background", null).style("transform", "scale(1)").style("box-shadow", null);
        }
      }
    }
  });

  return (
    <div className="d-flex align-items-center justify-content-center graph-outer-wrapper">
      {/* Sidebar component for the legend and the filters */}
      <FilterAndLegendSidebar documentTypes={documentTypes} stakeholders={stakeholders} setDocuments={setChartData} onSetLoading={setLoading} />

      {/* Modal component to confirm the deletion of a link */}
      <DeleteLinkModal
        deleteLink={deleteLink}
        showDeleteModal={showDeleteModal}
        setDeleteLink={setDeleteLink}
        setShowDeleteModal={setShowDeleteModal}
        chartData={chartData}
        onLinkDeleted={handleLinkDeleted}
      />

      <div className="graph-inner-wrapper">
        <div id="image" style={{ width: "100%", height: "100%", position: "relative" }}>
          <svg ref={svgRef} style={{ width: "100%", height: "100%" }}></svg>
        </div>
      </div>
    </div>
  );
};

export default DocumentChartStatic;
