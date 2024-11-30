import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
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
        API.allExistingLinks()
      ]);

      // Assign stable colors to each stakeholder based on their name
      const stakeholdersWithColors = stakeholder.map(stakeholder => ({
        ...stakeholder,
        color: stringToColor(stakeholder.name)
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

    const width = svg.node().getBoundingClientRect().width;
    const height = svg.node().getBoundingClientRect().height;
    const margin = { top: 20, right: 20, bottom: 40, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Ensure years are sorted in ascending order
    const years = Array.from(new Set(chartData.map(d => new Date(d.issuanceDate).getFullYear())))
      .sort((a, b) => a - b);  // Sort the years

    const scales = Array.from(new Set([
      'Text',
      ...chartData.map(d => d.scale).filter((v, i, a) => a.indexOf(v) === i)
    ]));

    // Ensure 'Blueprint' is included once in yScales
    const yScales = scales.includes('Blueprint') ? scales : [...scales, 'Blueprint'];

    // Remove the last element from the yScales
    yScales.pop();  // This removes the last item from the array

    const xScale = d3.scaleBand()
      .domain(years)  // Use the sorted years
      .range([0, innerWidth])
      .padding(0.1);

    const yScale = d3.scaleBand()
      .domain(yScales)
      .range([0, innerHeight])
      .padding(0.2);

    // Customizing the Y-axis ticks to display the '1:' label, but not for "Blueprint" or "Text"
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
    const yAxis = d3.axisLeft(yScale)
      .tickFormat(d => {
        if (d !== 'Blueprint' && d !== 'Text') {
          return `1:${d}`; // Add the "1:" prefix for numeric scales
        }
        return d; // For "Blueprint" and "Text", don't add the prefix
      })
      .tickSize(0);  // Remove tick lines

    g.append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(xAxis);

    g.append('g')
      .call(yAxis);

    const documentPositions = chartData.reduce((acc, doc) => {
      const year = new Date(doc.issuanceDate).getFullYear();
      const xPos = xScale(year);
      const yPos = yScale(doc.scale);
      acc[doc.id] = { x: xPos + xScale.bandwidth() / 2, y: yPos + yScale.bandwidth() / 2 };
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

      const iconClass = iconMap[doc.type] || 'bi-file-earmark';
      const stakeholderColor = doc.stakeholders ? doc.stakeholders.map(stakeholder => stakeholderColorMap[stakeholder] || 'gray') : ['gray'];
      const iconColor = stakeholderColor.length > 0 ? stakeholderColor.join(', ') : 'gray';

      g.append('foreignObject')
        .attr('x', xPos + xScale.bandwidth() / 2 - 12)
        .attr('y', yPos + yScale.bandwidth() / 2 - 12)
        .attr('width', 24)
        .attr('height', 24)
        .append('xhtml:div')
        .html(`<i class="bi ${iconClass}" style="font-size: 20px; color: ${iconColor};"></i>`)
        .on('click', () => handleDocumentClick(doc)); // Add click handler to document icon
    });

    // Draw links with different styles based on their types
    links.forEach(link => {
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

  const handleTypeClick = (type) => {
    setSelectedType(type);
    // Filter chartData by selected document type
    const filteredData = chartData.filter(doc => doc.type === type);
    setChartData(filteredData);
  };

  const handleStakeholderClick = (stakeholder) => {
    setSelectedStakeholder(stakeholder);
    // Filter chartData by selected stakeholder
    const filteredData = chartData.filter(doc => doc.stakeholders.includes(stakeholder.name));
    setChartData(filteredData);
  };

  return (
    <div className="container-fluid col-12" style={{ height: 'auto', position: 'relative', zIndex: 1000 }}>
      <div className="row" style={{ height: '33.33vh', background: '#f0f0f0' }}>
        <div className="col-2" style={{ background: '#f9f9f9', fontSize: '7px', borderRight: '1px solid #ccc', overflow: 'hidden',paddingTop:'0.2cm' }}>
          <h5 style={{ fontSize: '10px', marginBottom: '4px', paddingLeft: '0.3cm' }}>Legend</h5>
          <div style={{ lineHeight: '1', fontSize: '5px', display: 'flex', gap: '3px', paddingLeft: '0.3cm' }}>
            {documentTypes.map((doc, index) => {
              const iconClass = iconMap[doc.name] || 'bi-file-earmark';
              return (
                <p key={index} style={{ display: 'flex', alignItems: 'center', gap: '1px' }} onClick={() => handleTypeClick(doc.name)}>
                  <i className={`bi ${iconClass}`} style={{ fontSize: '16px' }}></i> {doc.name} doc.
                </p>
              );
            })}
          </div>
    
          <div style={{ display: 'flex', flexDirection: 'row', fontSize: '5px', paddingLeft: '0.3cm' }}>
            {/* Stakeholders Section */}
            <div style={{ marginRight: '1cm', maxHeight: '150px', overflowY: 'auto', paddingRight:'15px'}}>
              <h6 style={{ fontSize: '8px', marginBottom: '1px' }}>Stakeholders:</h6>
              {stakeholders.map((stakeholder, index) => (
                <p
                  key={index}
                  style={{ fontSize: '6px', color: stakeholder.color }}
                  onClick={() => handleStakeholderClick(stakeholder.name)}
                >
                  <span style={{ fontSize: '7px' }}>■</span> {stakeholder.name}
                </p>
              ))}
            </div>
    
            {/* Connections Section */}
            <div>
              <h6 style={{ fontSize: '7px', marginBottom: '0.3px' }}>Connections:</h6>
              <p style={{ fontSize: '5px' }}>
                Direct consequence <span style={{ float: 'right' }}>   ———</span>
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
        <div className="col-10" style={{ height: '100%', background: '#ffffff', position: 'relative', paddingLeft: '1.5cm' }}>
          <svg ref={svgRef} style={{ width: '100%', height: '100%' }}></svg>
        </div>
      </div>
    </div>
  );
};

export default DocumentChartStatic;
