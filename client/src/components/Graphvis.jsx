import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import API from '../../API';

// Define the color scheme for stakeholders (larger palette)
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

const colorList = [
  '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf',
];

// Function to cycle through the color list
const getColorFromList = (index) => colorList[index % colorList.length];

// Function to generate unique color based on name (HSL)
const generateColorFromName = (name) => {
  const hashCode = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
    }
    return hash;
  };
  const hash = hashCode(name);
  const color = `hsl(${(hash % 360 + 360) % 360}, 70%, 60%)`; // HSL color based on hash
  return color;
};

const DocumentChartStatic = () => {
  const svgRef = useRef();

  const [stakeholders, setStakeholders] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [links, setLinks] = useState([]);
  const [stakeholderColorMap, setStakeholderColorMap] = useState({});
  const [documentTypeColorMap, setDocumentTypeColorMap] = useState({});

  // Fetch all data
  const fetchData = async () => {
    try {
      const [stakeholder, documentType, documentData, linkData] = await Promise.all([
        API.getStakeholders(),
        API.getDocumentTypes(),
        API.getDocuments(),
        API.allExistingLinks()
      ]);
      setStakeholders(stakeholder);
      setDocumentTypes(documentType);
      setDocuments(documentData);
      setLinks(linkData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Fetch on mount

  // Assign stable colors for stakeholders (using generateColorFromName)
  useEffect(() => {
    const stakeholderColorMap = {};
    stakeholders.forEach((stakeholder) => {
      const color = generateColorFromName(stakeholder.name); // Generate color based on name
      stakeholderColorMap[stakeholder.name] = color;
    });
    setStakeholderColorMap(stakeholderColorMap);
  }, [stakeholders]);

  // Assign stable colors for document types
  useEffect(() => {
    const documentTypeColorMap = {};
    documentTypes.forEach((doc, index) => {
      const color = getColorFromList(index); // Cycling colors for document types
      documentTypeColorMap[doc.name] = color;
    });
    setDocumentTypeColorMap(documentTypeColorMap);
  }, [documentTypes]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous content

    const width = svg.node().getBoundingClientRect().width;
    const height = svg.node().getBoundingClientRect().height;
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create group for chart elements
    const g = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X Scale (dates)
    const xScale = d3.scaleTime()
      .domain([
        // Start one year earlier than the first document
        d3.timeYear.offset(d3.min(documents, d => new Date(d.issuanceDate)), -1), 
        d3.max(documents, d => new Date(d.issuanceDate))  // End at the latest date
      ])
      .range([0, innerWidth]);

    // Y Scale (categorical: Text, Scale, Blueprint)
    const yScale = d3.scaleBand()
      .domain(['Text', 'Scale', 'Blueprint'])
      .range([0, innerHeight])
      .padding(0.2);

    // X Axis (date)
    const xAxis = d3.axisBottom(xScale)
      .tickFormat(d3.timeFormat('%Y'));

    // Y Axis (categorical)
    const yAxis = d3.axisLeft(yScale)
      .tickSize(0);

    // Append X Axis
    g.append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(xAxis)
      .call((g) => g.select('.domain').remove())
      .call((g) => g.selectAll('.tick line').attr('stroke', '#ccc'));

    // Append Y Axis
    g.append('g')
      .call(yAxis)
      .call((g) => g.select('.domain').remove());

    // Plot Documents
    const documentGroup = g.selectAll('.document')
      .data(documents)
      .enter()
      .append('g')
      .attr('class', 'document')
      .attr('transform', d => `translate(${xScale(new Date(d.issuanceDate))}, 0)`)
      .each(function (d) {
        // Get the color for the first stakeholder
        const stakeholderColor = stakeholderColorMap[d.stakeholders[0]] || '#333'; // Default color if not found
        const yPos = yScale(d.type); // Y position based on the type
        const docTypeColor = documentTypeColorMap[d.type] || '#333'; // Color for document type

        // Add icon based on document type
        const iconClass = iconMap[d.type] || 'bi-file-earmark';
        d3.select(this)
          .append('foreignObject') // Use foreignObject to add HTML elements (icons)
          .attr('x', -8) // Adjust to center the icon
          .attr('y', yPos - 10) // Position the icon
          .attr('width', 16)
          .attr('height', 16)
          .append('xhtml:div')
          .attr('class', `bi ${iconClass}`)
          .style('font-size', '16px')
          .style('color', stakeholderColor);  // Ensure the icon uses the stakeholder color

        // Add a label for the document title
        d3.select(this)
          .append('text')
          .attr('x', 0)
          .attr('y', yPos + 20)
          .attr('text-anchor', 'middle')
          .style('fill', '#000')
          .style('font-size', '10px')
          .text(d.title);

        // Add the scale label under "Scale" category
        if (d.scale && yPos === yScale('Scale')) {
          d3.select(this)
            .append('text')
            .attr('x', 0)
            .attr('y', yPos + 35) // Adjust position below the document title
            .attr('text-anchor', 'middle')
            .style('fill', '#000')
            .style('font-size', '8px')
            .text(d.scale); // Display the scale number
        }
      });

    // Plot links between documents (if any)
    links.forEach(link => {
      const sourceDoc = documents.find(d => d.id === link.source);
      const targetDoc = documents.find(d => d.id === link.target);

      if (sourceDoc && targetDoc) {
        const sourceX = xScale(new Date(sourceDoc.issuanceDate));
        const targetX = xScale(new Date(targetDoc.issuanceDate));
        const sourceY = yScale(sourceDoc.type) + 10; // Adjust to position the link near the document
        const targetY = yScale(targetDoc.type) + 10;

        // Get the color for the first stakeholder involved in the link
        const linkColor = stakeholderColorMap[sourceDoc.stakeholders[0]] || '#999';

        g.append('line')
          .attr('x1', sourceX)
          .attr('y1', sourceY)
          .attr('x2', targetX)
          .attr('y2', targetY)
          .attr('stroke', linkColor) // Color the link based on stakeholder
          .attr('stroke-width', 1);
      }
    });
  }, [documents, stakeholderColorMap, documentTypeColorMap, links]);

  return (
    <div className="container-fluid col-12" style={{ height: 'auto', position: 'relative', zIndex: 1000 }}>
      <div className="row" style={{ height: '33.33vh', background: '#f0f0f0' }}>
        <div className="col-2" style={{ background: '#f9f9f9', fontSize: '7px', borderRight: '1px solid #ccc', overflow: 'hidden' }}>
          <h5 style={{ fontSize: '10px', marginBottom: '4px', paddingLeft: '0.5cm' }}>Legend</h5>
          <div style={{ lineHeight: '1', fontSize: '8px', display: 'flex', gap: '10px', paddingLeft: '0.5cm' }}>
            {documentTypes.map((doc, index) => {
              const iconClass = iconMap[doc.name] || 'bi-file-earmark';
              return (
                <p key={index}>
                  <i className={`bi ${iconClass}`} style={{ fontSize: '16px' }}></i> {doc.name} doc.
                </p>
              );
            })}
          </div>
          <div style={{ fontSize: '6px', display: 'flex', gap: '10px', paddingLeft: '0.2cm' }}>
          {/* Stakeholders Section */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h6 style={{ fontSize: '8px', marginBottom: '4px' }}>Stakeholders:</h6>
            {stakeholders.map((stakeholder, index) => {
              const color = stakeholderColorMap[stakeholder.name] || getColorFromList(index);
              return (
                <p key={index} style={{ color, marginBottom: '0', fontSize: '6px' }}>
                  <span style={{ fontSize: '10px' }}>■</span> {stakeholder.name}
                </p>
              );
            })}
          </div>

          {/* Connections Section */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h6 style={{ fontSize: '8px', marginBottom: '4px' }}>Connections:</h6>
            <div style={{ fontSize: '6px' }}>
              <p style={{ marginBottom: '0' }}>
                <span style={{ fontSize: '8px' }}>➔</span> Direct consequence <strong>----</strong>
              </p>
              <p style={{ marginBottom: '0' }}>
                <span style={{ fontSize: '8px' }}>➔</span> Collateral consequence <strong>----</strong>
              </p>
              <p style={{ marginBottom: '0' }}>
                <span style={{ fontSize: '8px' }}>➔</span> Prevision <strong>.....</strong>
              </p>
              <p style={{ marginBottom: '0' }}>
                <span style={{ fontSize: '8px' }}>➔</span> Update <strong>-.-.-.-.</strong>
              </p>
            </div>
          </div>
        </div>

        </div>

        <div className="col-10" style={{ height: '100%', background: '#ffffff', position: 'relative', paddingLeft: '1cm' }}>
          <svg ref={svgRef} style={{ width: '100%', height: '100%' }}></svg>
        </div>
      </div>
    </div>
  );
};

export default DocumentChartStatic;
