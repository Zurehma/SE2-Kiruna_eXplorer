// DocumentChart.jsx
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import '../styles/FlowDiagram.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons
import Legend from './Legend'; // Import the Legend component

const iconMap = {
  Informative: 'bi-info-circle',
  Prescriptive: 'bi-arrow-right-square',
  Design: 'bi-file-earmark-text',
  Technical: 'bi-file-earmark-code',
  Material: 'bi-file-earmark-binary',
};

// Assign a color to each stakeholder for differentiation
const stakeholderColors = {
  'Kiruna kommun/Residents': '#1f77b4', // Blue
  'Kiruna kommun': '#ff7f0e', // Orange
  'Kiruna kommun/White Arkitekter': '#2ca02c', // Green
  'LKAB': '#d62728', // Red
};

const DocumentChart = () => {
  const svgRef = useRef();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({});

  // Expanded mocked data for a more populated chart
  const documents = [
    {
      id: 1,
      title: "Compilation of responses",
      stakeholder: 'Kiruna kommun/Residents',
      scale: 'Text',
      issuanceDate: '2007-01-01',
      type: 'Informative',
      connections: 1,
    },
    {
      id: 2,
      title: "Detail plan for Bolaget",
      stakeholder: 'Kiruna kommun',
      scale: 8000,
      issuanceDate: '2010-10-20',
      type: 'Prescriptive',
      connections: 1,
    },
    {
      id: 3,
      title: "Development Plan (41)",
      stakeholder: 'Kiruna kommun/White Arkitekter',
      scale: 7500,
      issuanceDate: '2014-03-17',
      type: 'Design',
      connections: 2,
    },
    {
      id: 4,
      title: "Deformation forecast",
      stakeholder: 'LKAB',
      scale: 12000,
      issuanceDate: '2014-12-01',
      type: 'Technical',
      connections: 0,
    },
    {
      id: 5,
      title: "Adjusted development plan",
      stakeholder: 'Kiruna kommun/White Arkitekter',
      scale: 7500,
      issuanceDate: '2015-01-01',
      type: 'Design',
      connections: 0,
    },
    {
      id: 6,
      title: "Detail plan for square",
      stakeholder: 'Kiruna kommun',
      scale: 1000,
      issuanceDate: '2016-06-22',
      type: 'Prescriptive',
      connections: 0,
    },
    {
      id: 7,
      title: "Environmental Impact Report",
      stakeholder: 'LKAB',
      scale: 5000,
      issuanceDate: '2017-03-11',
      type: 'Informative',
      connections: 1,
    },
    {
      id: 8,
      title: "Community Workshop Report",
      stakeholder: 'Kiruna kommun/Residents',
      scale: 'Text',
      issuanceDate: '2018-05-30',
      type: 'Informative',
      connections: 1,
    },
    {
      id: 9,
      title: "Feasibility Study for New Area",
      stakeholder: 'Kiruna kommun',
      scale: 15000,
      issuanceDate: '2019-07-20',
      type: 'Design',
      connections: 2,
    },
  ];

  const links = [
    {
      docID1: 3,
      docID2: 1,
      type: 'Direct',
    },
    {
      docID1: 3,
      docID2: 2,
      type: 'Direct',
    },
    {
      docID1: 7,
      docID2: 4,
      type: 'Collateral',
    },
    {
      docID1: 9,
      docID2: 5,
      type: 'Update',
    },
    {
      docID1: 9,
      docID2: 8,
      type: 'Projection',
    },
  ];

  useEffect(() => {
    renderChart();
    // Cleanup function
    return () => {
      d3.select(svgRef.current).selectAll('*').remove();
      d3.select('body').selectAll('.tooltip').remove();
    };
  }, []);

  const renderChart = () => {
    const data = processData(documents);

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous content

    const width = svg.node().getBoundingClientRect().width;
    const height = svg.node().getBoundingClientRect().height;
    const margin = { top: 20, right: 30, bottom: 50, left: 60 };

    // Append group element
    const g = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create scales
    const xScale = createXScale(data, innerWidth);
    const yScale = createYScale(data, innerHeight);

    // Create axes
    createAxes(g, xScale, yScale, innerWidth, innerHeight);

    // Draw links first with offset
    drawLinks(g, data, xScale, yScale, links);

    // Plot data points with jittering to avoid overlaps
    plotData(g, data, xScale, yScale);
  };

  const processData = (documents) => {
    const uniqueScales = Array.from(new Set(documents.map((d) => (typeof d.scale === 'number' ? d.scale : 0)))).sort((a, b) => a - b);
    const yCategories = ['Text', ...uniqueScales.map((scale) => `Plan (1:${scale.toLocaleString()})`)];

    return documents.map((doc) => {
      let yCategory = doc.scale === 'Text' ? 'Text' : `Plan (1:${doc.scale.toLocaleString()})`;
      return {
        ...doc,
        yCategory,
        yCategories,
      };
    });
  };

  const createXScale = (data, width) => {
    const xExtent = d3.extent(data, (d) => new Date(d.issuanceDate));
    return d3.scaleTime().domain(xExtent).range([0, width]).nice();
  };

  const createYScale = (data, height) => {
    const yCategories = data[0].yCategories;
    return d3.scalePoint().domain(yCategories).range([0, height]).padding(1.5);
  };

  const createAxes = (g, xScale, yScale, width, height) => {
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat('%Y')).tickSize(-height).tickPadding(5);
    const yAxis = d3.axisLeft(yScale).tickSize(-width).tickPadding(5);

    g.append('g')
      .attr('transform', `translate(0, ${height})`)
      .attr('class', 'x axis')
      .call(xAxis)
      .call((g) => g.select('.domain').remove())
      .call((g) => g.selectAll('.tick line').attr('stroke', '#ccc'));

    g.append('g')
      .attr('class', 'y axis')
      .call(yAxis)
      .call((g) => g.select('.domain').remove())
      .call((g) => g.selectAll('.tick line').attr('stroke', '#ccc'));
  };

  const drawLinks = (g, data, xScale, yScale, links) => {
    const idToNode = {};
    data.forEach((d) => {
      idToNode[d.id] = d;
    });

    g.selectAll('.link')
      .data(links)
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('x1', (d) => xScale(new Date(idToNode[d.docID1].issuanceDate)))
      .attr('y1', (d) => yScale(idToNode[d.docID1].yCategory) + (Math.random() * 10 - 5))
      .attr('x2', (d) => xScale(new Date(idToNode[d.docID2].issuanceDate)))
      .attr('y2', (d) => yScale(idToNode[d.docID2].yCategory) + (Math.random() * 10 - 5))
      .style('stroke', '#888')
      .style('stroke-width', 2.5)
      .style('stroke-dasharray', (d) => {
        switch (d.type) {
          case 'Direct':
            return '0';
          case 'Collateral':
            return '6,4';
          case 'Projection':
            return '3,3';
          case 'Update':
            return '8,4,2,4';
          default:
            return '0';
        }
      });
  };

  const plotData = (g, data, xScale, yScale) => {
    g.selectAll('.node')
      .data(data)
      .enter()
      .append('foreignObject')
      .attr('x', (d) => xScale(new Date(d.issuanceDate)) - 10)
      .attr('y', (d) => yScale(d.yCategory) - 10 + (Math.random() * 5 - 2.5))
      .attr('width', 20)
      .attr('height', 20)
      .append('xhtml:div')
      .attr('class', 'icon-node')
      .style('color', (d) => stakeholderColors[d.stakeholder] || '#333')
      .html((d) => `<i class="bi ${iconMap[d.type] || 'bi-info-circle'}"></i>`)
      .on('click', (event, d) => {
        setModalContent({
          title: d.title,
          stakeholder: d.stakeholder,
          type: d.type,
          scale: d.scale ? '1:' + d.scale.toLocaleString() : '',
          date: d.issuanceDate,
          connections: d.connections,
          icon: iconMap[d.type] || 'bi-info-circle',
        });
        setIsModalOpen(true);
      });
  };

  return (
    <div className="document-chart-container">
      <div className="legend-container">
        <Legend stakeholderColors={stakeholderColors} />
      </div>
      <div className="chart-container">
        <svg ref={svgRef}></svg>
      </div>
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>
              <i className={`bi ${modalContent.icon}`} style={{ marginRight: '10px' }}></i>
              {modalContent.title}
            </h2>
            <div><strong>Stakeholder:</strong> {modalContent.stakeholder}</div>
            <div><strong>Type:</strong> {modalContent.type}</div>
            <div><strong>Scale:</strong> {modalContent.scale}</div>
            <div><strong>Date:</strong> {modalContent.date}</div>
            <div><strong>Connections:</strong> {modalContent.connections}</div>
            <button onClick={() => setIsModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentChart;
