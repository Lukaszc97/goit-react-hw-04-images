import React, { useState, useEffect } from 'react';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import ImageGalleryItem from './ImageGalleryItem/ImageGalleryItem';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import Modal from './Modal/Modal';
import { fetchImages } from './api';

function App() {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState('');
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);

  useEffect(() => {
    if (!query) {
      return;
    }

    fetchImages(query, page)
      .then((data) => {
        const newImages = data.hits.filter(
          (image) => !images.some((existingImage) => existingImage.id === image.id)
        );

        if (newImages.length === 0) {
          setAllImagesLoaded(true);
          return;
        }

        setImages((prevImages) => [...prevImages, ...newImages]);
        setPage((prevPage) => prevPage + 1);
      })
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  }, [query, page, images]);

  const handleSubmit = (newQuery) => {
    setQuery(newQuery);
    setImages([]);
    setPage(1);
    setAllImagesLoaded(false);
  };

  const openModal = (src) => {
    setShowModal(true);
    setModalImageSrc(src);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalImageSrc('');
  };

  return (
    <div className="App">
      <Searchbar onSubmit={handleSubmit} />
      <ImageGallery>
        {images.map((image) => (
          <ImageGalleryItem
            key={image.id}
            src={image.webformatURL}
            alt={image.tags}
            onClick={() => openModal(image.largeImageURL)}
          />
        ))}
      </ImageGallery>
      {isLoading && <Loader />}
      {images.length > 0 && !isLoading && !allImagesLoaded && (
        <Button onClick={() => setIsLoading(true)} disabled={isLoading} />
      )}

      {allImagesLoaded ? (
        <p style={{ textAlign: 'center' }}>All images loaded.</p>
      ) : (
        isLoading && <Loader />
      )}

      {showModal && (
        <Modal src={modalImageSrc} alt="Large Image" onClose={closeModal} />
      )}
    </div>
  );
}

export default App;
