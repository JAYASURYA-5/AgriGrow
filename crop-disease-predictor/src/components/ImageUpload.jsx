import React, { useRef } from 'react';
import './ImageUpload.css';

function ImageUpload({ onImageSelect, imagePreview, onReset, onAnalyze, loading, hasImage }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="upload-section card">
      <h2>
        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
        Upload Image
      </h2>

      {!imagePreview ? (
        <div
          className="upload-box"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={handleClick}
        >
          <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          <p>Click to upload or drag and drop</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <button className="btn btn-primary" type="button">
            Select Image
          </button>
        </div>
      ) : (
        <div className="image-preview-container">
          <div className="image-preview">
            <img src={imagePreview} alt="Preview" />
            <button className="btn-close" onClick={onReset} aria-label="Remove image">
              ×
            </button>
          </div>
          <button
            className="btn btn-analyze"
            onClick={onAnalyze}
            disabled={loading}
          >
            {loading ? 'Analyzing...' : 'Analyze Image'}
          </button>
        </div>
      )}
    </div>
  );
}

export default ImageUpload;

