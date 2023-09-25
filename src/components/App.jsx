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
  const [totalHits, setTotalHits] = useState(0);
  

  useEffect(() => {
    const savedQuery = localStorage.getItem('lastQuery');
    if (savedQuery) {
      setQuery(savedQuery);
    }
  }, []);

  const handleSubmit = newQuery => {
    setQuery(newQuery);
    setImages([]);
    setPage(1);
   

    fetchImages(newQuery)
      .then(data => {
        
        const newImages = data.hits;
        setImages(newImages);
        setTotalHits(data.totalHits);
        localStorage.setItem('lastQuery', newQuery);
      })
      .catch(error => console.error(error));
  };

  const fetchMoreImages = () => {
    setIsLoading(true);
    fetchImages(query, page+1)
      .then(data => {
        const newImages = data.hits;
        if (newImages.length === 0) {
          
          setIsLoading(false);
          return;
        }
        
        setImages(prevImages => [...prevImages, ...newImages]);
        setPage(prevPage => prevPage + 1)
        console.log("próba");
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
    if (query !== '') {
      handleSubmit(query);
    }
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
      {totalHits > images.length ? (
        isLoading ? (
          <Loader />
        ) : (
          <Button onClick={fetchMoreImages} disabled={isLoading} />
        )
      ) : (
        <p style={{ textAlign: 'center' }}>All images loaded.</p>
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
