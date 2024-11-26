// DocumentChart.jsx
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import '../styles/FlowDiagram.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons

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

const DocumentChart = () => {
  const svgRef = useRef();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({});

  // Mocked data
  const documents = [
    {
      id: 1,
      title: "Citizen Feedback",
      date: new Date(2007, 0, 1),
      stakeholder: 'Citizens',
      category: 'Text',
      type: 'Informative doc',
      scale: 15000,
      connections: 2,
      linksTo: [
        { linkedDocID: 2, linkType: 'Collateral consequence' },
        { linkedDocID: 3, linkType: 'Update' },
      ],
    },
    {
      id: 2,
      title: 'Development Plan (41)',
      date: new Date(2008, 0, 1),
      stakeholder: 'Municipality',
      category: 'Plan',
      type: 'Design doc',
      scale: 15000,
      connections: 1,
      linksTo: [{ linkedDocID: 1, linkType: 'Revision' }],
    },
    {
      id: 3,
      title: 'City Infrastructure Plan',
      date: new Date(2009, 0, 1),
      stakeholder: 'Architecture firms',
      category: 'Plan',
      type: 'Technical doc',
      scale: 10000,
      connections: 3,
      linksTo: [{ linkedDocID: 1, linkType: 'Direct consequence' }],
    },
    {
      id: 4,
      title: 'Environmental Impact Study',
      date: new Date(2010, 0, 1),
      stakeholder: 'Environmental Agency',
      category: 'Concept',
      type: 'Consultation',
      scale: 11000,
      connections: 2,
      linksTo: [{ linkedDocID: 2, linkType: 'Collateral consequence' }, { linkedDocID: 3, linkType: 'Direct consequence' }],
    },
    {
      id: 5,
      title: 'Blueprint Action Plan',
      date: new Date(2011, 0, 1),
      stakeholder: 'Municipality',
      category: 'Blueprints/actions',
      type: 'Action',
      scale: 15000,
      connections: 1,
      linksTo: [{ linkedDocID: 4, linkType: 'Update' }],
    },
    {
      id: 6,
      title: 'Revised Development Plan',
      date: new Date(2012, 0, 1),
      stakeholder: 'Municipality',
      category: 'Plan',
      type: 'Design doc',
      scale: 10000,
      connections: 3,
      linksTo: [{ linkedDocID: 5, linkType: 'Revision' }, { linkedDocID: 1, linkType: 'Update' }],
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

    const width = window.innerWidth;
    const height = window.innerHeight / 2;
    const margin = { top: 40, right: 50, bottom: 70, left: 250 };

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

    // Draw links first
    drawLinks(g, data, xScale, yScale);

    // Plot data points
    plotData(g, data, xScale, yScale);

    // Add a legend
    createLegend(svg);
  };

  const processData = (documents) => {
    // Define yCategories in desired order
    const yCategories = [
      'Text',
      'Concept',
      'Plan (1:1,000)',
      'Plan (1:5,000)',
      'Plan (1:10,000)',
      'Plan (1:15,000)',
      'Blueprints/actions'
    ];

    return documents.map((doc) => {
      let yCategory = '';
      if (doc.category === 'Text') {
        yCategory = 'Text';
      } else if (doc.category === 'Concept') {
        yCategory = 'Concept';
      } else if (doc.category === 'Plan') {
        if (doc.scale === 1000) {
          yCategory = 'Plan (1:1,000)';
        } else if (doc.scale === 5000) {
          yCategory = 'Plan (1:5,000)';
        } else if (doc.scale === 10000) {
          yCategory = 'Plan (1:10,000)';
        } else if (doc.scale === 15000) {
          yCategory = 'Plan (1:15,000)';
        }
      } else if (doc.category === 'Blueprints/actions') {
        yCategory = 'Blueprints/actions';
      }
      return {
        ...doc,
        yCategory,
        yCategories, // Include yCategories for use in createYScale
      };
    });
  };

  const createXScale = (data, width) => {
    const xExtent = d3.extent(data, (d) => d.date);
    const xScale = d3.scaleTime().domain(xExtent).range([0, width]).nice();
    return xScale;
  };

  const createYScale = (data, height) => {
    const yCategories = data[0].yCategories;

    const yScale = d3
      .scalePoint()
      .domain(yCategories)
      .range([0, height]) // 'Text' at the top
      .padding(1.5);
    return yScale;
  };

  const createAxes = (g, xScale, yScale, width, height) => {
    const xAxis = d3
      .axisBottom(xScale)
      .tickFormat(d3.timeFormat('%Y'))
      .tickSize(-height)
      .tickPadding(15);

    const yAxis = d3.axisLeft(yScale).tickSize(-width).tickPadding(15);

    // X-axis
    g.append('g')
      .attr('transform', `translate(0, ${height})`)
      .attr('class', 'x axis')
      .call(xAxis)
      .call((g) => g.select('.domain').remove())
      .call((g) => g.selectAll('.tick line').attr('stroke', '#ccc'));

    // Y-axis
    g.append('g')
      .attr('class', 'y axis')
      .call(yAxis)
      .call((g) => g.select('.domain').remove())
      .call((g) => g.selectAll('.tick line').attr('stroke', '#ccc'));
  };

  const drawLinks = (g, data, xScale, yScale) => {
    const idToNode = {};
    data.forEach((d) => {
      idToNode[d.id] = d;
    });

    const links = [];
    data.forEach((d) => {
      if (d.linksTo && d.linksTo.length > 0) {
        d.linksTo.forEach((link) => {
          const target = idToNode[link.linkedDocID];
          if (target) {
            links.push({ source: d, target, linkType: link.linkType });
          }
        });
      }
    });

    g.selectAll('.link')
      .data(links)
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('x1', (d) => xScale(d.source.date))
      .attr('y1', (d) => yScale(d.source.yCategory))
      .attr('x2', (d) => xScale(d.target.date))
      .attr('y2', (d) => yScale(d.target.yCategory))
      .style('stroke', (d) => {
        switch (d.linkType) {
          case 'Direct consequence':
            return '#ff6347'; // Tomato color for visibility
          case 'Collateral consequence':
            return '#4682b4'; // Steel blue
          case 'Revision':
            return '#32cd32'; // Lime green
          case 'Update':
            return '#ffa500'; // Orange
          default:
            return 'gray';
        }
      })
      .style('stroke-width', 2.5)
      .style('stroke-dasharray', (d) => {
        switch (d.linkType) {
          case 'Direct consequence':
            return '0'; // Solid line
          case 'Collateral consequence':
            return '6,4'; // Dashed line
          case 'Revision':
            return '3,3'; // Dotted line
          case 'Update':
            return '8,4,2,4'; // Dash-dot
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
      .attr('x', (d) => xScale(d.date) - 15) // Position and center the icon
      .attr('y', (d) => yScale(d.yCategory) - 15)
      .attr('width', 30)
      .attr('height', 30)
      .append('xhtml:div')
      .attr('class', 'icon-node')
      .html((d) => `<i class="bi ${iconMap[d.type.split(' ')[0]] || 'bi-info-circle'}"></i>`)
      .on('click', (event, d) => {
        setModalContent({
          title: d.title,
          stakeholder: d.stakeholder,
          category: d.category,
          type: d.type,
          scale: d.scale ? '1:' + d.scale.toLocaleString() : '',
          date: d3.timeFormat('%Y')(d.date),
          connections: d.connections,
          icon: iconMap[d.type.split(' ')[0]] || 'bi-info-circle',
        });
        setIsModalOpen(true);
      });
  };

  const createLegend = (svg) => {
    const legendData = [
      { label: 'Direct consequence', color: '#ff6347' },
      { label: 'Collateral consequence', color: '#4682b4' },
      { label: 'Revision', color: '#32cd32' },
      { label: 'Update', color: '#ffa500' },
    ];

    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', 'translate(20, 60)');

    legend.selectAll('rect')
      .data(legendData)
      .enter()
      .append('rect')
      .attr('x', 0)
      .attr('y', (d, i) => i * 25)
      .attr('width', 15)
      .attr('height', 15)
      .style('fill', d => d.color);

    legend.selectAll('text')
      .data(legendData)
      .enter()
      .append('text')
      .attr('x', 25)
      .attr('y', (d, i) => i * 25 + 12)
      .text(d => d.label)
      .style('font-size', '14px')
      .attr('alignment-baseline', 'middle');
  };

  return (
    <div className="chart-container">
      <svg ref={svgRef}></svg>
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>
              <i className={`bi ${modalContent.icon}`} style={{ marginRight: '10px' }}></i>
              {modalContent.title}
            </h2>
            <div><strong>Stakeholder:</strong> {modalContent.stakeholder}</div>
            <div><strong>Category:</strong> {modalContent.category}</div>
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

