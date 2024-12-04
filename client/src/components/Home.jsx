import React from "react";
import "../styles/Home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const scrollToContent = () => {
    const section = document.getElementById("content-section");
    if (section) {
      section.scrollIntoView({
        behavior: "smooth", // Scorrimento fluido
        block: "start", // Posiziona la sezione all'inizio della finestra
      });
    }
  };

  return (
    <div className="homepage">
      {/* Parte superiore con immagine di sfondo */}
      <div className="background-section">
        <div className="content-overlay">
          <h1>Kiruna: A Town in Motion</h1>
          <button onClick={() => navigate("/map")} className="map-button">
            Show Map
          </button>
          <button onClick={scrollToContent} className="scroll-button">
            <i class="bi bi-arrow-down"></i>
          </button>
        </div>
      </div>

      {/* Altre informazioni */}
      {/* Aggiungi una nuova sezione centrale con immagini e testo diviso in tre parti */}
      <div id="content-section" className="image-text-section">
        <div className="info-block">
          <img src="/cause.png" alt="Mining operations" className="info-image" />
          <div className="info-text">
            <h3>The Cause</h3>
            <p>
              Decades of mining have caused the ground beneath Kiruna to become unstable, posing
              risks to buildings and infrastructure.
            </p>
          </div>
        </div>
        <div className="info-block">
          <img src="/solution.png" alt="Relocation process" className="info-image" />
          <div className="info-text">
            <h3>The Solution</h3>
            <p>
              The relocation ensures the safety of residents while preserving Kiruna’s community and
              culture.
            </p>
          </div>
        </div>
        <div className="info-block">
          <img src="/future.png" alt="Vision of the future" className="info-image" />
          <div className="info-text">
            <h3>The Future</h3>
            <p>
              This ambitious move supports the local economy, allowing mining to continue
              sustainably.
            </p>
          </div>
        </div>
      </div>

      <footer className="footer">
        <h2>Kiruna Kommon</h2>
      </footer>
    </div>
  );
};

export default Home;

// // Home.js
// import React, { useState } from "react";
// import "../styles/Home.css";
// import { Modal } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";

// const Home = () => {
//   const [backgroundImage, setBackgroundImage] = useState("kiruna.jpg");
//   const [titleText, setTitleText] = useState(
//     "Kiruna: A Town in Motion – Relocating for a Sustainable Future"
//   );
//   const [showInfo, setShowInfo] = useState(false);
//   const navigate = useNavigate();

//   const handleButtonClick = () => {
//     navigate("/map");
//   };

//   const readMore = () => {
//     setBackgroundImage("kirunadocs.png");
//     setTitleText("Why we do the relocation of Kiruna?");
//     setShowInfo(true);
//   };

//   const goBackHome = () => {
//     setBackgroundImage("kiruna.jpg");
//     setTitleText("Kiruna: A Town in Motion – Relocating for a Sustainable Future");
//     setShowInfo(false);
//   };

//   return (
//     <div className="home-background" style={{ backgroundImage: `url("/${backgroundImage}")` }}>
//       <div className="home-container">
//         <h1 className="home-title">{titleText}</h1>

//         {!showInfo ? (
//           <>
//             <button className="redirect-button" onClick={handleButtonClick}>
//               Relocation of Kiruna
//             </button>
//             <button className="read-more-button" onClick={readMore}>
//               Why do we need this relocation?
//             </button>
//           </>
//         ) : (
//           <>
//             {/* Information Containers */}
//             <div className="info-containers">
//               <div className="info-box">
//                 The relocation of Kiruna is essential due to land subsidence caused by decades of
//                 extensive mining operations beneath the town. As the world’s largest underground
//                 iron ore mine expands, the ground has become unstable, posing serious risks to
//                 buildings and infrastructure. Without relocation, residents and essential services
//                 would be at risk from sinkholes and structural damage. Moving the town ensures the
//                 safety of its community while allowing mining to continue, which is vital for the
//                 local economy. This ambitious project also aims to preserve Kiruna’s historical
//                 landmarks and community identity.
//               </div>
//             </div>

//             {/* Back to Home Button */}
//             <button className="back-home-button" onClick={goBackHome}>
//               Back to Home
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Home;
