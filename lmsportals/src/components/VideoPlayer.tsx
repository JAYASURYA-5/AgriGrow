
"use client";
import React from 'react';

interface VideoPlayerProps {
  src: string;
  title?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, title }) => (
  <div className="w-full max-w-3xl mx-auto my-8 rounded-lg shadow-lg overflow-hidden bg-gray-900">
    <video
      className="w-full h-auto"
      controls
      poster="/video-poster.png"
      style={{ background: '#000' }}
    >
      <source src={src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
    {title && (
      <div className="p-4 text-white text-lg font-semibold bg-gray-800 border-t border-gray-700">{title}</div>
    )}
  </div>
);

export default VideoPlayer;
