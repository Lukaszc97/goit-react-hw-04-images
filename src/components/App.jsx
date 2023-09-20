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
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState('');
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);

  const handleSubmit = useCallback(newQuery => {
    setQuery(newQuery);
    setImages([]);
    setPage(1);
    setAllImagesLoaded(false);
    fetchImages();
  }, []);

  const fetchImages = useCallback(() => {
    if (allImagesLoaded) {
      return;
    }

    const URL = `https://pixabay.com/api/?q=${query}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`;

    setIsLoading(true);

    axios
      .get(URL)
      .then(response => {
        const newImages = response.data.hits.filter(
          image => !images.includes(image)
        );

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
  }, [query, page, images, allImagesLoaded]);

  const openModal = useCallback(src => {
    setShowModal(true);
    setModalImageSrc(src);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  useEffect(() => {
    if (query) {
      fetchImages();
    }
  }, [query, fetchImages]);

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
        <Button onClick={fetchImages} disabled={isLoading} />
      )}
      {showModal && (
        <Modal src={modalImageSrc} alt="Large Image" onClose={closeModal} />
      )}
    </div>
  );
}

export default App;
