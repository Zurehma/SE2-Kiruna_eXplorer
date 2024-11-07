// Home.js
import React, { useState } from 'react';
import '../styles/Home.css';
import { Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [backgroundImage, setBackgroundImage] = useState("kiruna.jpg"); // Initial background image
  const [titleText, setTitleText] = useState("Kiruna: The Heart of Sweden's Iron Legacy and Gateway to the Arctic");
  const [showInfo, setShowInfo] = useState(false); // State to show/hide additional information
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/map');
  };

  const readMore = () => {
    // Toggle between the two background images and texts
    setBackgroundImage("kirunadocs.png");
    setTitleText("Why we do this?");
    setShowInfo(true); // Show additional information section
  };

  const goBackHome = () => {
    // Reset to the original background and title
    setBackgroundImage("kiruna.jpg");
    setTitleText("Kiruna: The Heart of Sweden's Iron Legacy and Gateway to the Arctic");
    setShowInfo(false); // Hide additional information section
  };

  return (
    <div
      className="home-background"
      style={{ backgroundImage: `url("../public/${backgroundImage}")` }}
    >
      <div className="home-container">
        <h1 className="home-title">{titleText}</h1>
        
        {!showInfo ? (
          <>
            <button className="redirect-button" onClick={handleButtonClick}>
              Relocation of Kiruna
            </button>
            <button className="read-more-button" onClick={readMore}>
              Why we need this relocation? 
            </button>
          </>
        ) : (
          <>
            {/* Information Containers */}
            <div className="info-containers">
              <div className="info-box">The relocation of Kiruna is essential due to land subsidence caused by decades of extensive mining operations beneath the town. As the world’s largest underground iron ore mine expands, the ground has become unstable, posing serious risks to buildings and infrastructure. Without relocation, residents and essential services would be at risk from sinkholes and structural damage. Moving the town ensures the safety of its community while allowing mining to continue, which is vital for the local economy. This ambitious project also aims to preserve Kiruna’s historical landmarks and community identity.</div>
            </div>
            
            {/* Back to Home Button */}
            <button className="back-home-button" onClick={goBackHome}>
              Back to Home
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
