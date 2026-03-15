// IconButton for edit, delete, upload
import React, { useRef } from 'react';

export function IconButton({ icon, onClick, label, ...props }) {
  return (
    <button
      className="icon-btn"
      onClick={onClick}
      title={label}
      {...props}
    >
      {icon}
    </button>
  );
}

export function ImageUploadButton({ onImageSelect }) {
  const fileInput = useRef();
  return (
    <>
      <button
        className="icon-btn"
        title="Upload Image"
        onClick={() => fileInput.current.click()}
      >
        <span role="img" aria-label="Upload">📷</span>
      </button>
      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        ref={fileInput}
        onChange={e => {
          if (e.target.files && e.target.files[0]) {
            onImageSelect(e.target.files[0]);
            e.target.value = '';
          }
        }}
      />
    </>
  );
}
