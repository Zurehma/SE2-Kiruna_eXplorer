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
      description: 'Kiruna is sinking due to underground iron ore mining, threatening its infrastructure. As a result, the town is being relocated 3 kilometers away to ensure residents safety and preserve its cultural heritage.',
      style: { width: '130px', height: '130px', left: '10%', top: '60%' },
    },
    {
      id: 2,
      src: '../public/New_Kiruna_01.jpg',
      description: 'Kiruna faces transportation issues due to its remote location and harsh weather conditions, which can disrupt travel and logistics. Limited public transport options and dependence on road networks complicate access to and from the town. Additionally, ongoing construction related to the town`s relocation further impacts transportation efficiency.',
      style: { width: '160px', height: '160px', left: '18%', top: '58%' },
    },
    {
      id: 3,
      src: '../public/swed.jpg',
      description: 'Kiruna is a town in northern Sweden known for its rich iron ore deposits and stunning Arctic landscapes. Founded in the late 19th century, it became the largest town in Lapland and is famous for attractions like the Icehotel and the Northern Lights. Currently, Kiruna is undergoing a significant relocation project due to subsidence from mining, reflecting its adaptability and commitment to preserving its cultural heritage.',
      style: { width: '180px', height: '180px', left: '28%', top: '57%' },
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
