import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Assign a color to each stakeholder for differentiation
const stakeholderColors = {
  'Kiruna kommun/Residents': '#1f77b4', // Blue
  'Kiruna kommun': '#ff7f0e', // Orange
  'Kiruna kommun/White Arkitekter': '#2ca02c', // Green
  'LKAB': '#d62728', // Red
};

const iconMap = {
  Informative: 'bi-info-circle',
  Prescriptive: 'bi-arrow-right-square',
  Design: 'bi-file-earmark-text',
  Technical: 'bi-file-earmark-code',
};

const DocumentChartStatic = () => {
  const svgRef = useRef();

  // Mocked data for chart
  const documents = [
    { id: 1, title: "Compilation of responses", stakeholder: 'Kiruna kommun/Residents', scale: 'Text', issuanceDate: '2007-01-01', type: 'Informative' },
    { id: 2, title: "Detail plan for Bolaget", stakeholder: 'Kiruna kommun', scale: '1:8,000', issuanceDate: '2010-10-20', type: 'Prescriptive' },
    { id: 3, title: "Development Plan", stakeholder: 'Kiruna kommun/White Arkitekter', scale: '1:7,500', issuanceDate: '2014-03-17', type: 'Design' },
    { id: 4, title: "Deformation forecast", stakeholder: 'LKAB', scale: '1:12,000', issuanceDate: '2014-12-01', type: 'Technical' },
    { id: 5, title: "Feasibility Study for New Area", stakeholder: 'Kiruna kommun', scale: 'Blueprint', issuanceDate: '2019-07-20', type: 'Design' },
  ];

  const links = [
    { docID1: 3, docID2: 5, type: 'Direct' },
    { docID1: 3, docID2: 1, type: 'Collateral' },
    { docID1: 5, docID2: 3, type: 'Projection' },
    { docID1: 1, docID2: 2, type: 'Update' },
    { docID1: 4, docID2: 2, type: 'Projection' },
  ];

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

    // X Scale
    const xScale = d3.scaleTime()
      .domain(d3.extent(documents, d => new Date(d.issuanceDate)))
      .range([0, innerWidth]);

    // Y Categories (now simplified)
    const yCategories = ['Text', 'Scale', 'Blueprint'];
    const yScale = d3.scalePoint()
      .domain(yCategories)
      .range([0, innerHeight])
      .padding(1);

    // X Axis
    const xAxis = d3.axisBottom(xScale)
      .tickFormat(d3.timeFormat('%Y'))
      .tickSize(-innerHeight);

    // Y Axis without tick lines
    const yAxis = d3.axisLeft(yScale)
      .tickSize(0); // Remove default horizontal grid lines

    // Append X Axis
    g.append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(xAxis)
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line').attr('stroke', '#ccc'));

    // Append Y Axis
    g.append('g')
      .call(yAxis)
      .call(g => g.select('.domain').remove());

    // Draw custom lines for specific y-axis categories (Text, Scale, Blueprint)
    yCategories.forEach((category, index) => {
      const yPos = yScale(category);
      if (category === 'Scale') {
        // Draw a combined line for scales (single unified line)
        g.append('line')
          .attr('x1', 0)
          .attr('y1', yPos)
          .attr('x2', innerWidth)
          .attr('y2', yPos)
          .attr('stroke', '#ccc')
          .attr('stroke-width', 1)
          .attr('stroke-dasharray', '4,4');
      } else {
        // Draw lines for Text and Blueprint separately
        g.append('line')
          .attr('x1', 0)
          .attr('y1', yPos)
          .attr('x2', innerWidth)
          .attr('y2', yPos)
          .attr('stroke', '#ccc')
          .attr('stroke-width', 1);
      }
    });

    // Draw Links
    const idToNode = {};
    documents.forEach(d => { idToNode[d.id] = d; });

    g.selectAll('.link')
      .data(links)
      .enter()
      .append('line')
      .attr('x1', d => xScale(new Date(idToNode[d.docID1].issuanceDate)))
      .attr('y1', d => yScale(idToNode[d.docID1].scale === 'Blueprint' ? 'Blueprint' : (idToNode[d.docID1].scale === 'Text' ? 'Text' : 'Scale')))
      .attr('x2', d => xScale(new Date(idToNode[d.docID2].issuanceDate)))
      .attr('y2', d => yScale(idToNode[d.docID2].scale === 'Blueprint' ? 'Blueprint' : (idToNode[d.docID2].scale === 'Text' ? 'Text' : 'Scale')))
      .style('stroke', '#888')
      .style('stroke-width', 1.5)
      .style('stroke-dasharray', d => {
        if (d.type === 'Collateral') return '4,2';
        if (d.type === 'Projection') return '2,2';
        if (d.type === 'Update') return '8,4,2,4';
        return '0';
      });

    // Plot Data Points
    g.selectAll('.node')
      .data(documents)
      .enter()
      .append('g')
      .attr('transform', d => `translate(${xScale(new Date(d.issuanceDate))},${yScale(d.scale === 'Blueprint' ? 'Blueprint' : (d.scale === 'Text' ? 'Text' : 'Scale'))})`)
      .each(function(d) {
        d3.select(this)
          .append('foreignObject')
          .attr('width', 20)
          .attr('height', 20)
          .append('xhtml:div')
          .attr('class', 'icon-node')
          .style('color', stakeholderColors[d.stakeholder] || '#333')
          .html(`<i class="bi ${iconMap[d.type]}"></i>`);
      });

  }, []);

  return (
    <div className="container-fluid" style={{ height: 'auto', position: 'relative' }}>
      {/* Fixed bottom container for legend and graph */}
      <div className="row" style={{ height: '33.33vh', background: '#f0f0f0' }}>
        {/* Legend Section */}
        <div className="col-2 p-2" style={{ background: '#f9f9f9', fontSize: '7px', borderRight: '1px solid #ccc', overflow: 'hidden'}}>
          <h5 style={{ fontSize: '10px', marginBottom: '4px', paddingLeft: '0.5cm' }}>Legend</h5>
          <div style={{ lineHeight: '1', fontSize: '8px', display: 'flex', gap: '10px', paddingLeft: '0.5cm'}}>
            <p><i className="bi bi-file-earmark-text"></i> Design doc.</p>
            <p><i className="bi bi-info-circle"></i> Informative doc.</p>
            <p><i className="bi bi-arrow-right-square"></i> Prescriptive doc.</p>
            <p><i className="bi bi-file-earmark-code"></i> Technical doc.</p>
          </div>
          <div style={{  fontSize: '8px', display: 'flex', gap: '20px', paddingLeft: '0.5cm' }}>
            {/* Stakeholders Column */}
            <div style={{ flex: 1 }}>
              <h6 style={{ fontSize: '9px', marginBottom: '8px' }}>Stakeholders:</h6>
              <p style={{ color: '#1f77b4', marginBottom: '2px' }}>■ Kiruna kommun/Residents</p>
              <p style={{ color: '#ff7f0e', marginBottom: '2px' }}>■ Kiruna kommun</p>
              <p style={{ color: '#2ca02c', marginBottom: '2px' }}>■ Kiruna kommun/White Arkitekter</p>
              <p style={{ color: '#d62728', marginBottom: '2px' }}>■ LKAB</p>
            </div>

            {/* Connections Column */}
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

        {/* Graph Section */}
        <div className="col-10" style={{ height: '100%', background: '#ffffff', position: 'relative', paddingLeft: '1cm' }}>
          <svg ref={svgRef} style={{ width: '100%', height: '100%' }}></svg>
        </div>
      </div>
    </div>
  );
};

export default DocumentChartStatic;
