import React, { useState, useEffect } from 'react';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import ImageGalleryItem from './ImageGalleryItem/ImageGalleryItem';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import Modal from './Modal/Modal';
import { fetchImages } from './api';

function App() {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState('');
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);

  useEffect(() => {
    const savedQuery = localStorage.getItem('lastQuery');
    if (savedQuery) {
      setQuery(savedQuery);
    }
  }, []);

  const handleSubmit = newQuery => {
    setImages([]);
    setPage(1);
    setQuery(newQuery);
    setAllImagesLoaded(false);
   
    fetchImages(newQuery)
      .then(data => {
        const newImages = data.hits;
        setImages(newImages);
        localStorage.setItem('lastQuery', newQuery);
        
      })
      .catch(error => console.error(error));
  };

  const fetchMoreImages = () => {
    setIsLoading(true);
    fetchImages(query, page)
      .then(data => {
        const newImages = data.hits;
        if (newImages.length === 0) {
          setAllImagesLoaded(true);
          setIsLoading(false);
          return;
        }
        setImages(prevImages => [...prevImages, ...newImages]);
        setPage(prevPage => prevPage + 1);
      })
      .catch(error => console.error(error))
      .finally(() => {
        setIsLoading(false);
      });
  };
  

  const openModal = src => {
    setShowModal(true);
    setModalImageSrc(src);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if (query === '') {
      return;
    }

    fetchMoreImages();
  }, [query]);

  return (
    <div className="App">
      <Searchbar onSubmit={handleSubmit} />
      <ImageGallery>
        {images.map(image => (
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
        <Button onClick={fetchMoreImages} disabled={isLoading} />
      )}

      {allImagesLoaded ? (
        <p style={{ textAlign: 'center' }}>All images loaded.</p>
      ) : (
        isLoading && <Loader />
      )}

      {showModal && (
        <Modal
          src={modalImageSrc}
          alt="Large Image"
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default App;
