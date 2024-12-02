import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import API from '../../API';

// Simple hash function to generate a stable color from a string (e.g., stakeholder name)
const stringToColor = (str) => {
  const normalizedStr = str.trim().toLowerCase();
  let hash = 0;
  for (let i = 0; i < normalizedStr.length; i++) {
    hash = normalizedStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    color += ('00' + ((hash >> (i * 8)) & 0xff).toString(16)).slice(-2);
  }
  return color;
};

const DocumentChartStatic = () => {
  const svgRef = useRef();
  const [documentTypes, setDocumentTypes] = useState([]);
  const [stakeholders, setStakeholders] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [links, setLinks] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedStakeholder, setSelectedStakeholder] = useState(null);
  const [showLegendModal, setShowLegendModal] = useState(false); // State for modal visibility

  // Initialize useNavigate
  const navigate = useNavigate();

  // Define the icon map for different document types (scale)
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

  const fetchData = async () => {
    try {
      const [documentType, stakeholder, documents, links] = await Promise.all([
        API.getDocumentTypes(),
        API.getStakeholders(),
        API.getDocuments(),
        API.allExistingLinks(),
      ]);

      // Assign stable colors to each stakeholder based on their name
      const stakeholdersWithColors = stakeholder.map((stakeholder) => ({
        ...stakeholder,
        color: stringToColor(stakeholder.name),
      }));

      setDocumentTypes(documentType);
      setStakeholders(stakeholdersWithColors);
      setChartData(documents);
      setLinks(links);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous content

    const containerWidth = svgRef.current.parentElement.offsetWidth;
    const containerHeight = svgRef.current.parentElement.offsetHeight;
    const margin = { top: 20, right: 20, bottom: 40, left: 80 };
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    const g = svg
      .attr('viewBox', `0 0 ${containerWidth} ${containerHeight}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Ensure years are sorted in ascending order
    const years = Array.from(
      new Set(chartData.map((d) => new Date(d.issuanceDate).getFullYear()))
    ).sort((a, b) => a - b);

    const scales = Array.from(
      new Set([
        'Text',
        ...chartData.map((d) => d.scale).filter((v, i, a) => a.indexOf(v) === i),
      ])
    );

    // Ensure 'Blueprint' is included once in yScales
    const yScales = scales.includes('Blueprint') ? scales : [...scales, 'Blueprint'];

    // Remove the last element from the yScales
    yScales.pop(); // This removes the last item from the array

    const xScale = d3.scaleBand().domain(years).range([0, width]).padding(0.1);

    const yScale = d3.scaleBand().domain(yScales).range([0, height]).padding(0.2);

    // Customizing the Y-axis ticks to display the '1:' label, but not for "Blueprint" or "Text"
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
    const yAxis = d3
      .axisLeft(yScale)
      .tickFormat((d) => {
        if (d !== 'Blueprint' && d !== 'Text') {
          return `1:${d}`; // Add the "1:" prefix for numeric scales
        }
        return d; // For "Blueprint" and "Text", don't add the prefix
      })
      .tickSize(0); // Remove tick lines

    g.append('g').attr('transform', `translate(0, ${height})`).call(xAxis);

    g.append('g').call(yAxis);

    const documentPositions = chartData.reduce((acc, doc) => {
      const year = new Date(doc.issuanceDate).getFullYear();
      const xPos = xScale(year);
      const yPos = yScale(doc.scale);
      if (xPos !== undefined && yPos !== undefined) {
        acc[doc.id] = {
          x: xPos + xScale.bandwidth() / 2,
          y: yPos + yScale.bandwidth() / 2,
        };
      }
      return acc;
    }, {});

    const stakeholderColorMap = stakeholders.reduce((acc, stakeholder) => {
      acc[stakeholder.name] = stakeholder.color;
      return acc;
    }, {});

    chartData.forEach((doc) => {
      const year = new Date(doc.issuanceDate).getFullYear();
      const xPos = xScale(year);
      const yPos = yScale(doc.scale);

      if (xPos !== undefined && yPos !== undefined) {
        const iconClass = iconMap[doc.type] || 'bi-file-earmark';
        const stakeholderColor = doc.stakeholders
          ? doc.stakeholders.map((stakeholder) => stakeholderColorMap[stakeholder] || 'gray')
          : ['gray'];
        const iconColor = stakeholderColor.length > 0 ? stakeholderColor.join(', ') : 'gray';

        g.append('foreignObject')
          .attr('x', xPos + xScale.bandwidth() / 2 - 12)
          .attr('y', yPos + yScale.bandwidth() / 2 - 12)
          .attr('width', 24)
          .attr('height', 24)
          .append('xhtml:div')
          .html(
            `<i class="bi ${iconClass}" style="font-size: 20px; color: ${iconColor};"></i>`
          )
          .on('click', () => handleDocumentClick(doc)); // Add click handler to document icon
      }
    });

    // Draw links with different styles based on their types
    links.forEach((link) => {
      const doc1Pos = documentPositions[link.DocID1];
      const doc2Pos = documentPositions[link.DocID2];

      if (doc1Pos && doc2Pos) {
        let strokeStyle = '4,4'; // Default to dashed line for 'Update'
        let strokeColor = 'gray'; // Default stroke color

        // Set the stroke style based on the link type
        switch (link.type) {
          case 'Direct':
            strokeStyle = '0'; // Solid line for Direct consequence
            break;
          case 'Collateral':
            strokeStyle = '4,4'; // Dashed line for Collateral consequence
            break;
          case 'Prevision':
            strokeStyle = '2,2'; // Dotted line for Prevision
            break;
          case 'Update':
            strokeStyle = '1,5'; // Dash-dotted line for Update
            break;
          default:
            strokeStyle = '4,4'; // Default dashed style
            break;
        }

        g.append('line')
          .attr('x1', doc1Pos.x)
          .attr('y1', doc1Pos.y)
          .attr('x2', doc2Pos.x)
          .attr('y2', doc2Pos.y)
          .attr('stroke', strokeColor)
          .attr('stroke-width', 1)
          .attr('stroke-dasharray', strokeStyle);
      }
    });
  }, [chartData, links, stakeholders]);

  const handleDocumentClick = (doc) => {
    // Navigate to the document detail page using the document's ID
    navigate(`/document/${doc.id}`);
  };

  return (
    <div
      className="container-fluid"
      style={{ height: 'auto', position: 'relative', zIndex: 1000 }}
    >
      <div className="row" style={{ height: '33.33vh', background: '#f0f0f0' }}>
        {/* Legend Sidebar for Medium and Larger Screens */}
        <div
          className="col-md-2 d-none d-md-block"
          style={{
            background: '#f9f9f9',
            fontSize: '7px',
            borderRight: '1px solid #ccc',
            overflow: 'hidden',
            paddingTop: '0.2cm',
          }}
        >
          <h5 style={{ fontSize: '10px', marginBottom: '4px', paddingLeft: '0.3cm' }}>
            Legend
          </h5>
          <div
            style={{
              lineHeight: '1',
              fontSize: '5px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '3px',
              paddingLeft: '0.3cm',
            }}
          >
            {documentTypes.map((doc, index) => {
              const iconClass = iconMap[doc.name] || 'bi-file-earmark';
              return (
                <p
                  key={index}
                  style={{ display: 'flex', alignItems: 'center', gap: '1px' }}
                >
                  <i className={`bi ${iconClass}`} style={{ fontSize: '16px' }}></i> {doc.name}{' '}
                  doc.
                </p>
              );
            })}
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              fontSize: '5px',
              paddingLeft: '0.3cm',
              flexWrap: 'wrap',
            }}
          >
            {/* Stakeholders Section */}
            <div
              style={{
                marginRight: '1cm',
                maxHeight: '150px',
                overflowY: 'auto',
                paddingRight: '15px',
              }}
            >
              <h6 style={{ fontSize: '8px', marginBottom: '1px' }}>Stakeholders:</h6>
              {stakeholders.map((stakeholder, index) => (
                <p
                  key={index}
                  style={{ fontSize: '6px', color: stakeholder.color }}
                >
                  <span style={{ fontSize: '7px' }}>■</span> {stakeholder.name}
                </p>
              ))}
            </div>

            {/* Connections Section */}
            <div>
              <h6 style={{ fontSize: '7px', marginBottom: '0.3px' }}>Connections:</h6>
              <p style={{ fontSize: '5px' }}>
                Direct consequence <span style={{ float: 'right' }}> ———</span>
              </p>
              <p style={{ fontSize: '5px' }}>
                Collateral consequence <span style={{ float: 'right' }}> ----</span>
              </p>
              <p style={{ fontSize: '5px' }}>
                Prevision <span style={{ float: 'right' }}> ......</span>
              </p>
              <p style={{ fontSize: '5px' }}>
                Update <span style={{ float: 'right' }}> -.-.-.-</span>
              </p>
            </div>
          </div>
        </div>

        {/* Legend Button for Small Screens */}
        <div className="col-12 d-md-none text-right">
          <button
            className="btn btn-sm m-2"
            style={{ backgroundColor: '#006d77', color: '#FFFFFF' }}
            onClick={() => setShowLegendModal(true)}
          >
            See the Legend
          </button>
        </div>

        {/* Main Chart Area */}
        <div
          className="col-md-10 col-12"
          style={{
            height: '100%',
            background: '#ffffff',
            position: 'relative',
            paddingLeft: '1.5cm',
          }}
        >
          <svg ref={svgRef} style={{ width: '100%', height: '100%' }}></svg>
        </div>
      </div>

      {/* Legend Modal */}
      {showLegendModal && (
        <div
          className="modal fade show"
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content" style={{ fontSize: '14px' }}>
              <div className="modal-header">
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
                      <div
                        key={index}
                        className="d-flex align-items-center gap-1"
                      >
                        <i className={`bi ${iconClass}`} style={{ fontSize: '1.2rem' }}></i>
                        <span>{doc.name} doc.</span>
                      </div>
                    );
                  })}
                </div>

                {/* Stakeholders */}
                <h6>Stakeholders</h6>
                <div className="row mb-3">
                  {stakeholders.map((stakeholder, index) => (
                    <div
                      key={index}
                      className="col-6 d-flex align-items-center gap-1 mb-1"
                    >
                      <span style={{ color: stakeholder.color, fontSize: '1.2rem' }}>■</span>
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
              <div className="modal-footer">
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
    </div>
  );
};

export default DocumentChartStatic;
