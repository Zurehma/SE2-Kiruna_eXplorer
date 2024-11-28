// Legend.jsx
import React from 'react';

const Legend = ({ stakeholderColors }) => {
  const legendData = [
    { label: 'Direct consequence (solid line)', shape: 'line', dash: '0' },
    { label: 'Collateral consequence (dashed line)', shape: 'line', dash: '6,4' },
    { label: 'Projection (dotted line)', shape: 'line', dash: '3,3' },
    { label: 'Update (dash-dot line)', shape: 'line', dash: '8,4,2,4' },
  ];

  return (
    <svg className="legend">
      {/* Legend for links */}
      {legendData.map((item, index) => (
        <React.Fragment key={index}>
          <line
            x1={0}
            y1={index * 18 + 7} // Adjusted y position for smaller spacing
            x2={40}
            y2={index * 18 + 7}
            stroke="#888"
            strokeWidth={2.5}
            strokeDasharray={item.dash}
          />
          <text
            x={50}
            y={index * 18 + 10} // Adjusted y position for proper alignment
            fontSize="10px" // Reduced font size
            alignmentBaseline="middle"
          >
            {item.label}
          </text>
        </React.Fragment>
      ))}

      {/* Legend for stakeholders */}
      {Object.keys(stakeholderColors).map((stakeholder, index) => (
        <React.Fragment key={stakeholder}>
          <circle
            cx={0}
            cy={(legendData.length + index) * 18 + 7} // Adjusted y position for smaller spacing
            r={5} // Smaller radius for compact layout
            fill={stakeholderColors[stakeholder]}
          />
          <text
            x={20}
            y={(legendData.length + index) * 18 + 10} // Adjusted y position for proper alignment
            fontSize="10px" // Reduced font size
            alignmentBaseline="middle"
          >
            {stakeholder}
          </text>
        </React.Fragment>
      ))}
    </svg>
  );
};

export default Legend;
