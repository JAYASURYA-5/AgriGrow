import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Upload = () => {
  const navigate = useNavigate();
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoFileName, setVideoFileName] = useState('MP4, MOV up to 10MB');
  const [thumbnailFileName, setThumbnailFileName] = useState('PNG, JPG, GIF up to 5MB');
  const [videoType, setVideoType] = useState('short');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const videoInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);

  const handleVideoTypeChange = (e) => {
    setVideoType(e.target.value);
  };

  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setVideoFileName(file.name);
    }
  };

  const handleThumbnailFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailFileName(file.name);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-primary');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-primary');
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-primary');
    const file = e.dataTransfer.files[0];
    if (file) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      if (type === 'video') {
        videoInputRef.current.files = dataTransfer.files;
        setVideoFile(file);
        setVideoFileName(file.name);
      } else if (type === 'thumbnail') {
        thumbnailInputRef.current.files = dataTransfer.files;
        setThumbnailFile(file);
        setThumbnailFileName(file.name);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', { videoType, title, description, keywords, videoFile, thumbnailFile });
    alert('Video upload functionality would be implemented here with backend integration.');
    // Redirect to community page
    navigate('/community');
  };

  const handleBack = () => {
    navigate('/community');
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col font-display">
      <div className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10 border-b border-border-light dark:border-border-dark">
        <div className="flex size-12 shrink-0 items-center text-text-light dark:text-text-dark -ml-2">
          <button className="p-2 ag-back" onClick={handleBack} aria-label="Back to community">
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
        </div>
        <h2 className="text-text-light dark:text-text-dark text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">Upload Video</h2>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <form id="uploadForm" onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 border border-border-light dark:border-border-dark">
            <div className="space-y-4">
              <div>
                <label className="text-text-light dark:text-text-dark font-medium block mb-1">Video Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="videoType"
                      value="short"
                      className="form-radio text-primary"
                      checked={videoType === 'short'}
                      onChange={handleVideoTypeChange}
                    />
                    <span className="ml-2 text-text-light dark:text-text-dark">Short</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="videoType"
                      value="long"
                      className="form-radio text-primary"
                      checked={videoType === 'long'}
                      onChange={handleVideoTypeChange}
                    />
                    <span className="ml-2 text-text-light dark:text-text-dark">Long Video</span>
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="title" className="text-text-light dark:text-text-dark font-medium block mb-1">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="description" className="text-text-light dark:text-text-dark font-medium block mb-1">Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="keywords" className="text-text-light dark:text-text-dark font-medium block mb-1">Keywords (comma separated)</label>
                <input
                  type="text"
                  id="keywords"
                  name="keywords"
                  required
                  placeholder="farming, soil, organic"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="w-full rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-text-light dark:text-text-dark font-medium block mb-1">Upload Video</label>
                <div
                  className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-border-light dark:border-border-dark rounded-lg"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, 'video')}
                >
                  <div className="space-y-1 text-center">
                    <span className="material-symbols-outlined text-4xl text-gray-400 dark:text-gray-500">upload_file</span>
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                      <label htmlFor="video-upload"
                        className="relative cursor-pointer rounded-md font-medium text-primary dark:text-accent hover:text-primary/80 dark:hover:text-accent/80 focus-within:outline-none">
                        <span>Upload a video</span>
                        <input
                          id="video-upload"
                          name="video"
                          type="file"
                          ref={videoInputRef}
                          className="sr-only"
                          accept="video/*"
                          required
                          onChange={handleVideoFileChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400" id="file-name">
                      {videoFileName}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="thumbnail" className="text-text-light dark:text-text-dark font-medium block mb-1">Thumbnail Image</label>
                <div
                  className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-border-light dark:border-border-dark rounded-lg"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, 'thumbnail')}
                >
                  <div className="space-y-1 text-center">
                    <span className="material-symbols-outlined text-4xl text-gray-400 dark:text-gray-500">image</span>
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                      <label htmlFor="thumbnail-upload"
                        className="relative cursor-pointer rounded-md font-medium text-primary dark:text-accent hover:text-primary/80 dark:hover:text-accent/80 focus-within:outline-none">
                        <span>Upload a thumbnail</span>
                        <input
                          id="thumbnail-upload"
                          name="thumbnail"
                          type="file"
                          ref={thumbnailInputRef}
                          className="sr-only"
                          accept="image/*"
                          required
                          onChange={handleThumbnailFileChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400" id="thumbnail-name">
                      {thumbnailFileName}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary dark:bg-accent text-white font-semibold py-3 px-4 rounded-lg hover:bg-primary/90 dark:hover:bg-accent/90 transition-colors"
          >
            Upload Video
          </button>
        </form>
      </div>
    </div>
  );
};

export default Upload;
                     
