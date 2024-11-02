import React, { useState } from 'react';
import '../styles/Home.css';
import { Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const navigate = useNavigate();

  const images = [
    {
      id: 1,
      src: '../public/kirunaSinking.jpg',
      description: 'The town of Kiruna in the Swedish Arctic is sinking...',
      style: { width: '130px', height: '130px', left: '15%', top: '60%' },
    },
    {
      id: 2,
      src: '../public/New_Kiruna_01.jpg',
      description: 'Transportation issues in Kiruna stem from its ongoing relocation...',
      style: { width: '160px', height: '160px', left: '30%', top: '60%' },
    },
    {
      id: 3,
      src: '../public/swed.jpg',
      description: 'Kiruna is the northernmost city in Sweden...',
      style: { width: '180px', height: '180px', left: '45%', top: '60%' },
    },
  ];
  

  const openModal = (image, event) => {
    setCurrentImage(image);
    const rect = event.currentTarget.getBoundingClientRect();
    setModalPosition({
      top: rect.bottom + window.scrollY + 10,
      left: rect.left + window.scrollX + (rect.width / 2),
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentImage(null);
  };

  const handleButtonClick = () => {
    navigate('/map'); // Replace '/new-route' with your actual route path
  };

  return (
    <div className="home-background">
      <div className="home-images">
        {images.map((image) => (
          <img
            key={image.id}
            src={image.src}
            alt={`Image ${image.id}`}
            className="static-image animated-image"
            style={{
              ...image.style,
              position: 'absolute',
              cursor: 'pointer',
            }}
            onClick={(event) => openModal(image, event)}
          />
        ))}
      </div>

      <div className="home-container">
        <h1 className="home-title">
          "Kiruna: The Heart of Sweden's Iron Legacy and Gateway to the Arctic"
        </h1>
        <button className="redirect-button" onClick={handleButtonClick}>
          Relocation of Kiruna
        </button>
      </div>

      {currentImage && (
        <Modal show={showModal} onHide={closeModal} centered={false} className="custom-modal">
          <Modal.Body className="custom-modal-body" style={{ position: 'relative' }}>
            <h2 className="modal-description">{currentImage.description}</h2>
            <img src={currentImage.src} alt={`Image ${currentImage.id}`} className="modal-image" />
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default Home;
