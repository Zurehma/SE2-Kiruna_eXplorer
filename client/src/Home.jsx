import React, { useState } from 'react';
import './styles/Home.css';
import { Modal } from 'react-bootstrap';

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  const images = [
    {
      id: 1,
      src: '../public/kirunaSinking.jpg',
      description:
        'The town of Kiruna in the Swedish Arctic is sinking due to the giant mine below and the town is in danger of collapsing. The residents have to evacuate, but the mining town is sinking faster than anyone thought.',
      style: { width: '150px', height: '150px', left: '10%', top: '60%' },
    },
    {
      id: 2,
      src: '../public/New_Kiruna_01.jpg',
      description:
        'Transportation issues in Kiruna stem from its ongoing relocation due to mining subsidence. The existing road infrastructure has become unusable in some areas, leading to disruptions and the need for realignments. Public transportation services must adapt to new routes, which can create confusion for users and require additional infrastructure.',
      style: { width: '180px', height: '180px', left: '30%', top: '60%' },
    },
    {
      id: 3,
      src: '../public/swed.jpg',
      description:
        'Kiruna is the northernmost city in Sweden, situated in the province of Lapland. It had 17,002 inhabitants in 2016 and is the seat of Kiruna Municipality (population: 23,167 in 2016) in Norrbotten County. The city was originally built in the 1890s to serve the Kiruna Mine.',
      style: { width: '200px', height: '200px', left: '50%', top: '60%' },
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

  return (
    <div className="home-background">
        <div className="home-images">
        {images.map((image) => (
            <img
            key={image.id}
            src={image.src}
            alt={`Image ${image.id}`}
            className="static-image animated-image" // Ensure animated-image is added here
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
        <h1 className="home-title">"Kiruna: The Heart of Sweden's Iron Legacy and Gateway to the Arctic"</h1>
      </div>

      {currentImage && (
        <Modal
          show={showModal}
          onHide={closeModal}
          centered={false}
          className="custom-modal"
        >
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
