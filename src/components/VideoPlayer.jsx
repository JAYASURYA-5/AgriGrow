import React, { useState, useRef, useEffect } from 'react';
import '../styles/VideoPlayer.css';

const VideoPlayer = ({ videoUrl, title, onClose, description = '', autoPlay = true }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [playing, setPlaying] = useState(autoPlay);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(1);
  const [isYouTube, setIsYouTube] = useState(false);

  useEffect(() => {
    // Check if URL is YouTube
    if (videoUrl && (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') || videoUrl.includes('youtube.com/embed'))) {
      setIsYouTube(true);
    } else if (videoUrl && videoUrl.startsWith('data:video/')) {
      // Handle base64 video data
      setIsYouTube(false);
    }
  }, [videoUrl]);

  useEffect(() => {
    if (isYouTube) {
      // Auto-play for YouTube videos is handled by the iframe
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    // Update duration
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    // Update progress
    const handleTimeUpdate = () => {
      setProgress(video.currentTime);
    };

    // Auto hide controls
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(controlsTimeoutRef.current);
      if (playing) {
        controlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
        }, 3000);
      }
    };

    // Exit fullscreen on Escape
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullScreen) {
        handleFullScreen();
      }
      // Spacebar to play/pause
      if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
      // Arrow keys for seeking
      if (e.key === 'ArrowRight') {
        seek(video.currentTime + 5);
      }
      if (e.key === 'ArrowLeft') {
        seek(video.currentTime - 5);
      }
      // M for mute
      if (e.key.toLowerCase() === 'm') {
        toggleMute();
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    containerRef.current?.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      containerRef.current?.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(controlsTimeoutRef.current);
    };
  }, [playing, isFullScreen]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying(!playing);
  };

  const seek = (time) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(time, duration));
    }
  };

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    seek(percent * duration);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    if (newVolume > 0) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(previousVolume);
      setIsMuted(false);
      if (videoRef.current) {
        videoRef.current.volume = previousVolume;
      }
    } else {
      setPreviousVolume(volume);
      setVolume(0);
      setIsMuted(true);
      if (videoRef.current) {
        videoRef.current.volume = 0;
      }
    }
  };

  const handlePlaybackRateChange = (rate) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const handleFullScreen = () => {
    const elem = containerRef.current;
    if (!isFullScreen) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullScreen(false);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const downloadVideo = () => {
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = `${title}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="video-player-modal-overlay" onClick={onClose}>
      <div className="video-player-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="video-player-container" ref={containerRef}>
          {isYouTube ? (
            // YouTube Video Embed
            <iframe
              className="youtube-video-element"
              width="100%"
              height="100%"
              src={`${videoUrl}?autoplay=1&controls=1`}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            // Regular Video Player
            <>
              <video
                ref={videoRef}
                className="video-element"
                onClick={togglePlay}
                onEnded={() => setPlaying(false)}
              >
                <source src={videoUrl} type={videoUrl?.startsWith('data:video/') ? 'video/mp4' : 'video/mp4'} />
                Your browser does not support the video tag.
              </video>

              {/* Big Play Button */}
              {!playing && (
                <button className="play-button-overlay" onClick={togglePlay}>
                  <span className="material-symbols-outlined">play_circle</span>
                </button>
              )}

              {/* Controls */}
              <div className={`video-controls ${showControls ? 'visible' : ''}`}>
                {/* Progress Bar */}
                <div className="progress-container">
                  <div
                    className="progress-bar"
                    onClick={handleProgressClick}
                    role="slider"
                    tabIndex="0"
                    aria-label="Video progress"
                  >
                    <div
                      className="progress-fill"
                      style={{ width: `${(progress / duration) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="controls-bottom">
                  <div className="controls-left">
                    <button className="control-btn" onClick={togglePlay} title={playing ? 'Pause' : 'Play'}>
                      <span className="material-symbols-outlined">
                        {playing ? 'pause' : 'play_arrow'}
                      </span>
                    </button>

                    <div className="volume-control">
                      <button className="control-btn" onClick={toggleMute} title={isMuted ? 'Unmute' : 'Mute'}>
                        <span className="material-symbols-outlined">
                          {isMuted || volume === 0 ? 'volume_off' : volume < 0.5 ? 'volume_mute' : 'volume_up'}
                        </span>
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="volume-slider"
                        title="Volume"
                      />
                    </div>

                    <div className="time-display">
                      <span>{formatTime(progress)}</span>
                      <span> / </span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  <div className="controls-right">
                    {/* Playback Speed */}
                    <div className="speed-control">
                      <select
                        value={playbackRate}
                        onChange={(e) => handlePlaybackRateChange(parseFloat(e.target.value))}
                        className="speed-select"
                        title="Playback speed"
                      >
                        <option value={0.5}>0.5x</option>
                        <option value={0.75}>0.75x</option>
                        <option value={1}>1x</option>
                        <option value={1.25}>1.25x</option>
                        <option value={1.5}>1.5x</option>
                        <option value={2}>2x</option>
                      </select>
                    </div>

                    {/* Download Button */}
                    <button
                      className="control-btn"
                      onClick={downloadVideo}
                      title="Download video"
                    >
                      <span className="material-symbols-outlined">download</span>
                    </button>

                    {/* Fullscreen Button */}
                    <button
                      className="control-btn fullscreen-btn"
                      onClick={handleFullScreen}
                      title={isFullScreen ? 'Exit fullscreen' : 'Fullscreen'}
                    >
                      <span className="material-symbols-outlined">
                        {isFullScreen ? 'fullscreen_exit' : 'fullscreen'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Video Info */}
        <div className="video-info">
          <h2>{title}</h2>
          {description && <p>{description}</p>}
          <div className="video-metadata">
            <span className="duration-badge">
              <span className="material-symbols-outlined">schedule</span>
              {formatTime(duration)}
            </span>
            <span className="quality-badge">HD</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
