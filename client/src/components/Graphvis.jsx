import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import API from '../../API';

// Define the color scheme for stakeholders
const stakeholderColors = {
  'Kiruna kommun/Residents': '#1f77b4',
  'Kiruna kommun': '#ff7f0e',
  'Kiruna kommun/White Arkitekter': '#2ca02c',
  'LKAB': '#d62728',
};

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

const getRandomColor = () => colorList[Math.floor(Math.random() * colorList.length)];

const DocumentChartStatic = () => {
  const svgRef = useRef();

  const [stakeholders, setStakeholders] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [documentsList, setDocumentsList] = useState([]);
  const [linksMap, setLinksMap] = useState({});
  const [stakeholderColorMap, setStakeholderColorMap] = useState({});

  const fetchDoc = async () => {
    try {
      const [stakeholder, documentType, docs] = await Promise.all([
        API.getStakeholders(),
        API.getDocumentTypes(),
        API.getDocuments(),
      ]);
      setStakeholders(stakeholder);
      setDocumentTypes(documentType);
      setDocumentsList(docs);

      // Fetch links for each document and group them by document ID
      const linksResponse = await Promise.all(
        docs.map(async (doc) => {
          const links = await API.getLinksDoc(doc.id); // Fetch links for each document
          return { docId: doc.id, links: links || [] }; // Return the document ID and its associated links
        })
      );

      // Create a links map to store links by document ID
      const linksMap = {};
      linksResponse.forEach(({ docId, links }) => {
        linksMap[docId] = links;
      });

      setLinksMap(linksMap);
    } catch (error) {
      console.error('Error fetching stakeholders or documents:', error);
    }
  };

  useEffect(() => {
    fetchDoc();
  }, []); // Fetch on mount

  // Assign stable colors for stakeholders
  useEffect(() => {
    const colorMap = {};
    stakeholders.forEach(stakeholder => {
      if (!colorMap[stakeholder.name]) {
        colorMap[stakeholder.name] = getRandomColor(); // Assign a color if not already assigned
      }
    });
    setStakeholderColorMap(colorMap);
  }, [stakeholders]);

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

    // X Scale (using issuanceDate)
    const xScale = d3.scaleTime()
      .domain(d3.extent(documentsList, (d) => new Date(d.issuanceDate)))
      .range([0, innerWidth]);

    // Y Scale (for numeric scale values, adjusted for text, scale, and blueprint)
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(documentsList, (d) => d.scale)]) // Use max scale value
      .range([innerHeight, 0]);

    // Add some padding to Y scale to spread out nodes
    const paddingFactor = 2.5; // You can adjust this value for better spacing
    const yScaleAdjusted = d3.scaleLinear()
      .domain([0, d3.max(documentsList, (d) => d.scale) * paddingFactor])
      .range([innerHeight, 0]);

    // X Axis (issuanceDate)
    const xAxis = d3.axisBottom(xScale)
      .tickFormat(d3.timeFormat('%Y'))
      .tickSize(-innerHeight);

    // Y Axis (numeric scale)
    const yAxis = d3.axisLeft(yScaleAdjusted)
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

    // Filter valid documents
    const validDocuments = documentsList.filter(d => {
      const validDate = new Date(d.issuanceDate).getTime() > 0;
      const validScale = !isNaN(d.scale) && d.scale > 0;
      return validDate && validScale;
    });

    // Create an index for quick lookup of documents by ID
    const idToNode = {};
    validDocuments.forEach((doc) => {
      if (doc && doc.issuanceDate) {
        idToNode[doc.id] = doc;
      }
    });

    // Draw Links based on document relationships
    Object.entries(linksMap).forEach(([docId, links]) => {
      links.forEach((link) => {
        const doc1 = idToNode[docId];
        const doc2 = idToNode[link.linkedDocID];

        // Ensure both documents exist
        if (doc1 && doc2) {
          const linkType = link.type;

          g.append('line')
            .attr('x1', xScale(new Date(doc1.issuanceDate)))
            .attr('y1', yScaleAdjusted(doc1.scale))
            .attr('x2', xScale(new Date(doc2.issuanceDate)))
            .attr('y2', yScaleAdjusted(doc2.scale))
            .style('stroke', '#888')
            .style('stroke-width', 1.5)
            .style('stroke-dasharray', getDashArrayForLink(linkType));
        }
      });
    });

    // Plot Data Points (Documents)
    g.selectAll('.node')
      .data(validDocuments)
      .enter()
      .append('g')
      .attr('transform', (d) => {
        if (d && d.issuanceDate && d.scale) {
          const xPos = xScale(new Date(d.issuanceDate));
          const yPos = yScaleAdjusted(d.scale);
          if (xPos != null && yPos != null) {
            return `translate(${xPos},${yPos})`;
          }
        }
        return '';
      })
      .each(function (d) {
        if (d && d.issuanceDate && d.scale) {
          const stakeholderColor = stakeholderColorMap[d.stakeholders[0]] || '#333'; // Use color from stakeholderColorMap
          d3.select(this)
            .append('foreignObject')
            .attr('width', 20)
            .attr('height', 20)
            .append('xhtml:div')
            .attr('class', 'icon-node')
            .style('color', stakeholderColor)
            .html(`<i class="bi ${iconMap[d.type]}" style="font-size: 18px;"></i>`);
        }
      });

    // Add Y Axis Custom Labels
    const yAxisLabels = [
      { label: 'Text', position: innerHeight / 4 },
      { label: 'Scale', position: innerHeight / 2 },
      { label: 'Blueprint', position: innerHeight },
    ];

    g.selectAll('.y-label')
      .data(yAxisLabels)
      .enter()
      .append('text')
      .attr('x', -15) // Position labels on the left
      .attr('y', (d) => d.position)
      .attr('text-anchor', 'end')
      .style('font-size', '12px')
      .text((d) => d.label);
  }, [documentsList, linksMap, stakeholderColorMap]);

  const getDashArrayForLink = (linkType) => {
    switch (linkType) {
      case 'Collateral':
        return '4,2';
      case 'Projection':
        return '2,2';
      case 'Update':
        return '8,4,2,4';
      default:
        return '0';
    }
  };

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
          <div style={{ fontSize: '8px', display: 'flex', gap: '20px', paddingLeft: '0.5cm' }}>
            <div style={{ flex: 1 }}>
              <h6 style={{ fontSize: '9px', marginBottom: '8px' }}>Stakeholders:</h6>
              {stakeholders.map((stakeholder, index) => {
                const randomColor = stakeholderColorMap[stakeholder.name] || getRandomColor();
                return (
                  <p key={index} style={{ color: randomColor, marginBottom: '2px' }}>
                    ■ {stakeholder.name}
                  </p>
                );
              })}
            </div>
            <div style={{ flex: 1 }}>
              <h6 style={{ fontSize: '9px' }}>Connections:</h6>
              <p style={{ marginBottom: '5px' }}>
                <span style={{ borderBottom: '1px solid black' }}>________</span> Direct consequence
              </p>
              <p style={{ marginBottom: '5px' }}>
                <span style={{ borderBottom: '1px dashed black' }}>--------</span> Collateral consequence
              </p>
              <p>
                <span style={{ borderBottom: '1px dotted black' }}>........</span> Projection
              </p>
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
