import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import ImageGalleryItem from './ImageGalleryItem/ImageGalleryItem';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import Modal from './Modal/Modal';

const API_KEY = '38011218-cb164cf0dde7e2df63faecdfa';

function App() {
  const [query, setQuery] = useState(localStorage.getItem('lastQuery') || '');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState('');
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);

  const fetchImages = useCallback(
    (fetchQuery, fetchPage) => {
      if (allImagesLoaded) {
        return;
      }

      const URL = `https://pixabay.com/api/?q=${fetchQuery}&page=${fetchPage}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`;

      setIsLoading(true);

      axios
        .get(URL)
        .then(response => {
          const newImages = response.data.hits;

          if (newImages.length === 0) {
            setAllImagesLoaded(true);
            return;
          }

          setImages(prevImages => [...prevImages, ...newImages]);
          setPage(prevPage => prevPage + 1);
        })
        .catch(error => console.error(error))
        .finally(() => {
          setIsLoading(false);
        });
    },
    [allImagesLoaded]
  );

  const handleSubmit = useCallback(
    newQuery => {
      setQuery(newQuery);
      localStorage.setItem('lastQuery', newQuery); // Zapisz zapytanie w localStorage
      setImages([]);
      setPage(1);
      setAllImagesLoaded(false);
      fetchImages(newQuery, 1);
    },
    [fetchImages]
  );

  const openModal = useCallback(src => {
    setShowModal(true);
    setModalImageSrc(src);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  useEffect(() => {
    if (query) {
      fetchImages(query, page);
    }
  }, [query, page, fetchImages]);

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
        <Button onClick={() => fetchImages(query, page)} disabled={isLoading} />
      )}
      {showModal && (
        <Modal src={modalImageSrc} alt="Large Image" onClose={closeModal} />
      )}
    </div>
  );
}

export default App;
