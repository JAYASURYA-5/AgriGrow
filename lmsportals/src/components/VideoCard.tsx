"use client";
import React from 'react';

interface VideoCardProps {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  channel: string;
  views: string;
  uploadedAt: string;
  videoUrl?: string;
}

const VideoCard: React.FC<VideoCardProps> = ({
  id,
  title,
  description,
  thumbnail,
  channel,
  views,
  uploadedAt,
  videoUrl,
}) => {
  const [showPlayer, setShowPlayer] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [isWatched, setIsWatched] = React.useState(false);
  const [isFavorited, setIsFavorited] = React.useState(false);

  React.useEffect(() => {
    // Check if video is in favorites
    try {
      const stored = localStorage.getItem('farmtube_favorites');
      if (stored) {
        const favorites = JSON.parse(stored);
        setIsFavorited(favorites.some((v: any) => v.id === id.toString()));
      }
    } catch (error) {
      console.error('Error checking favorites:', error);
    }
  }, [id]);

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    const percent = (video.currentTime / video.duration) * 100;
    setProgress(percent);
    setCurrentTime(video.currentTime);
  };

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    setDuration(e.currentTarget.duration);
  };

  const addToPlaylist = () => {
    const playlistName = prompt('Which playlist to add this video to?');
    if (playlistName) {
      alert(`✓ Video added to "${playlistName}" playlist!`);
    }
  };

  const toggleFavorite = () => {
    try {
      const stored = localStorage.getItem('farmtube_favorites');
      let favorites = stored ? JSON.parse(stored) : [];

      if (isFavorited) {
        // Remove from favorites
        favorites = favorites.filter((v: any) => v.id !== id.toString());
        setIsFavorited(false);
      } else {
        // Add to favorites
        const newFavorite = {
          id: id.toString(),
          title,
          description,
          thumbnail,
          channel,
          views,
          uploadedAt,
          videoUrl: videoUrl || '',
          addedAt: new Date().toLocaleDateString(),
        };
        favorites.push(newFavorite);
        setIsFavorited(true);
      }

      localStorage.setItem('farmtube_favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Video Card */}
      <div 
        className="bg-white rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 group hover:scale-108 cursor-pointer border-2 border-transparent hover:border-emerald-400 relative"
        onClick={() => setShowPlayer(true)}
      >
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/10 group-hover:to-teal-500/10 transition-all duration-500 pointer-events-none"></div>
        
        <div className="relative bg-gradient-to-br from-emerald-300 to-teal-300 h-48 overflow-hidden">
          <img src={thumbnail} alt={title} className="w-full h-full object-cover group-hover:scale-125 transition duration-500 filter group-hover:brightness-110" />
          
          {/* Duration badge */}
          <span className="absolute bottom-3 right-3 bg-black bg-opacity-90 text-white text-xs px-4 py-2 rounded-full font-black shadow-2xl">12:45</span>

          {/* Favorite button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite();
            }}
            className={`absolute top-3 left-3 w-14 h-14 rounded-full flex items-center justify-center text-4xl font-black transition-all duration-300 shadow-2xl hover:scale-125 hover:shadow-amber-500/50 backdrop-blur-sm ${
              isFavorited
                ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/70'
                : 'bg-white bg-opacity-90 text-amber-500 hover:bg-opacity-100 hover:text-amber-600 shadow-lg'
            }`}
            title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorited ? '⭐' : '☆'}
          </button>
          
          {/* Play button overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition duration-500 flex items-center justify-center">
            <div className="w-16 h-16 bg-white bg-opacity-0 group-hover:bg-opacity-90 transition duration-500 rounded-full flex items-center justify-center shadow-2xl">
              <span className="text-emerald-600 text-3xl font-black group-hover:scale-125 transition duration-300">▶</span>
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="flex gap-4">
            {/* Channel Avatar */}
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 rounded-full flex-shrink-0 shadow-lg flex items-center justify-center font-bold text-white text-lg">
              👨‍🌾
            </div>
            
            <div className="flex-1 min-w-0">
              {/* Title with Favorite Badge */}
              <div className="flex items-start gap-2">
                <h3 className="font-black text-gray-900 line-clamp-2 group-hover:text-emerald-600 text-sm leading-tight transition duration-300 flex-1">{title}</h3>
                {isFavorited && <span className="text-amber-500 font-black text-sm mt-0.5 flex-shrink-0">⭐</span>}
              </div>
              
              {/* Channel */}
              <p className="text-xs font-bold text-emerald-600 group-hover:text-emerald-800 mt-1">{channel}</p>
              
              {/* Stats */}
              <p className="text-xs text-gray-500 font-semibold mt-1">{views} • {uploadedAt}</p>
              
              {/* Description */}
              <p className="text-xs text-gray-700 line-clamp-2 mt-2 leading-relaxed group-hover:text-gray-900">{description}</p>
            </div>
          </div>
        </div>
        
        {/* Bottom accent bar */}
        <div className="h-1 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-400 group-hover:h-2 transition-all duration-300"></div>
      </div>

      {/* Modal Video Player */}
      {showPlayer && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="bg-black rounded-3xl overflow-hidden max-w-4xl w-full shadow-2xl relative">
            {/* Close Button */}
            <button
              onClick={() => setShowPlayer(false)}
              className="absolute top-4 right-4 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full w-10 h-10 flex items-center justify-center text-black font-bold text-xl z-10 transition-all duration-300 hover:scale-110"
            >
              ✕
            </button>

            {/* Video Player with Progress */}
            <div className="relative">
              <video
                controls
                autoPlay
                className="w-full h-auto"
                src={videoUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
              >
                Your browser does not support the video tag.
              </video>
              
              {/* Remaining Time Display */}
              <div className="absolute top-4 left-4 bg-black bg-opacity-80 text-white px-4 py-2 rounded-xl font-bold flex gap-4">
                <span>⏱️ {formatTime(currentTime)} / {formatTime(duration)}</span>
                <span className="ml-4 text-yellow-300">⏳ {formatTime(duration - currentTime)} remaining</span>
              </div>
            </div>

            {/* Video Info */}
            <div className="bg-gradient-to-r from-emerald-900 to-teal-900 p-6 text-white">
              <h2 className="text-2xl font-black mb-2">{title}</h2>
              <p className="text-emerald-200 font-bold mb-3">{channel}</p>
              <p className="text-gray-300 text-sm mb-4">{description}</p>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs font-bold">Watched Progress</p>
                  <p className="text-xs font-bold">{Math.round(progress)}%</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-400 to-teal-400 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 flex-wrap">
                <button 
                  onClick={addToPlaylist}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-3 rounded-full font-black text-white hover:scale-110 hover:shadow-2xl transition duration-300 shadow-xl flex items-center gap-2 text-lg border-2 border-white"
                >
                  ➕ Add to Playlist
                </button>
                <button 
                  onClick={toggleFavorite}
                  className={`px-8 py-3 rounded-full font-black transition duration-300 shadow-xl flex items-center gap-2 hover:scale-110 text-lg border-2 ${
                    isFavorited
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-2xl border-white hover:from-amber-600 hover:to-orange-600'
                      : 'bg-gradient-to-r from-yellow-400 to-amber-400 text-white hover:shadow-2xl border-white hover:from-yellow-500 hover:to-amber-500'
                  }`}
                >
                  {isFavorited ? '⭐ Favorited' : '☆ Add to Favorites'}
                </button>
                <button className="bg-gradient-to-r from-pink-500 to-rose-500 px-8 py-3 rounded-full font-black text-white hover:scale-110 hover:shadow-2xl transition duration-300 shadow-xl border-2 border-white text-lg">
                  👍 Like
                </button>
                {progress > 90 && (
                  <button 
                    onClick={() => setIsWatched(true)}
                    className="bg-green-500 px-6 py-2 rounded-full font-bold hover:scale-105 transition duration-300 shadow-lg"
                  >
                    ✓ Mark as Watched
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoCard;
