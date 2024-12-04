import React from "react";
import "../styles/Home.css";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";

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
        <Row className="button-row">
          <Col md={6} className="button-col">
            <button onClick={() => navigate("/map")} className="styled-button">
              Relocation of Kiruna
              <span className="button-icon">
                <i class="bi bi-geo-alt"></i>{" "}
              </span>
            </button>
          </Col>
          <Col md={6} className="button-col">
            <button onClick={scrollToContent} className="styled-button">
              About us
              <span className="button-icon">
                <i class="bi bi-arrow-down"></i>
              </span>
            </button>
          </Col>
        </Row>
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
        <div className="footer-content">
          <h5>Kiruna eXplorer</h5>
          <p>
            <a
              href="https://www.polito.it"
              target="_blank"
              rel="noopener noreferrer"
              className="politecnico-link"
            >
              Politecnico di Torino
            </a>
            | Corso Duca degli Abruzzi, 24 | 10129 Torino
          </p>
          <div className="footer-icons">
            <a
              href="https://github.com/Zurehma/SE2-Kiruna_eXplorer"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="bi bi-github"></i>
            </a>
            <a
              href="https://en.wikipedia.org/wiki/Kiruna"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="bi bi-globe"></i>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
