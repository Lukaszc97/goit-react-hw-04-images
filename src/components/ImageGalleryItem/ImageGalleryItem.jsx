import React from 'react';
import styles from './ImageGalleryItem.module.css';

function ImageGalleryItem({ src, alt, onClick }) {
  return (
    <li className={styles.galleryItem} onClick={onClick}>
      <img src={src} alt={alt} />
    </li>
  );
}

export default ImageGalleryItem;
