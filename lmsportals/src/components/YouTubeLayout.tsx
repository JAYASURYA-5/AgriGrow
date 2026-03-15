"use client";
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => (
  <aside className={`bg-gradient-to-b from-emerald-50 via-white to-teal-50 border-b-4 border-emerald-400 transition-all duration-300 fixed top-24 left-0 right-0 z-40 shadow-2xl ${isOpen ? 'h-auto' : 'h-0 overflow-hidden'}`}>
    <nav className="flex items-center justify-center gap-3 px-8 py-4 overflow-x-auto">
      <Link to="/" className="flex items-center justify-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-100 to-teal-100 hover:from-emerald-200 hover:to-teal-200 transition-all whitespace-nowrap hover:scale-110 duration-300 text-emerald-700 hover:text-emerald-900 font-bold shadow-md hover:shadow-lg border-2 border-emerald-300 min-w-fit h-12">
        <span className="text-2xl">🏠</span>
        <span className="text-sm">Home</span>
      </Link>
      <Link to="/farming-videos" className="flex items-center justify-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-100 to-teal-100 hover:from-emerald-200 hover:to-teal-200 transition-all whitespace-nowrap hover:scale-110 duration-300 text-emerald-700 hover:text-emerald-900 font-bold shadow-md hover:shadow-lg border-2 border-emerald-300 min-w-fit h-12">
        <span className="text-2xl">🎥</span>
        <span className="text-sm">Farming Videos</span>
      </Link>
      <Link to="/courses" className="flex items-center justify-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-100 to-teal-100 hover:from-emerald-200 hover:to-teal-200 transition-all whitespace-nowrap hover:scale-110 duration-300 text-emerald-700 hover:text-emerald-900 font-bold shadow-md hover:shadow-lg border-2 border-emerald-300 min-w-fit h-12">
        <span className="text-2xl">📚</span>
        <span className="text-sm">Courses</span>
      </Link>
      <Link to="/favorites" className="flex items-center justify-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-100 to-teal-100 hover:from-emerald-200 hover:to-teal-200 transition-all whitespace-nowrap hover:scale-110 duration-300 text-emerald-700 hover:text-emerald-900 font-bold shadow-md hover:shadow-lg border-2 border-emerald-300 min-w-fit h-12">
        <span className="text-2xl">⭐</span>
        <span className="text-sm">Favorites</span>
      </Link>
      <Link to="/playlists" className="flex items-center justify-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-100 to-teal-100 hover:from-emerald-200 hover:to-teal-200 transition-all whitespace-nowrap hover:scale-110 duration-300 text-emerald-700 hover:text-emerald-900 font-bold shadow-md hover:shadow-lg border-2 border-emerald-300 min-w-fit h-12">
        <span className="text-2xl">📋</span>
        <span className="text-sm">Playlists</span>
      </Link>
      <div className="border-l-4 border-emerald-400 mx-3 h-8"></div>
      <Link to="/upload" className="flex items-center justify-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 transition-all whitespace-nowrap hover:scale-110 duration-300 text-purple-700 hover:text-purple-900 font-bold shadow-md hover:shadow-lg border-2 border-purple-400 min-w-fit h-12">
        <span className="text-2xl">📤</span>
        <span className="text-sm">Upload</span>
      </Link>
      <Link to="/my-videos" className="flex items-center justify-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-rose-100 to-red-100 hover:from-rose-200 hover:to-red-200 transition-all whitespace-nowrap hover:scale-110 duration-300 text-rose-700 hover:text-rose-900 font-bold shadow-md hover:shadow-lg border-2 border-rose-400 min-w-fit h-12">
        <span className="text-2xl">🎬</span>
        <span className="text-sm">My Videos</span>
      </Link>
      <div className="flex items-center justify-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-amber-100 to-orange-100 hover:from-amber-200 hover:to-orange-200 transition-all cursor-pointer whitespace-nowrap hover:scale-110 duration-300 text-amber-700 hover:text-amber-900 font-bold shadow-md hover:shadow-lg border-2 border-amber-400 min-w-fit h-12">
        <span className="text-2xl">👨‍🌾</span>
        <span className="text-sm">Expert Farmers</span>
      </div>
    </nav>
  </aside>
);

export default function YouTubeLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="fixed top-0 w-full bg-gradient-to-r from-emerald-600 via-green-500 to-teal-600 shadow-2xl z-50 border-b-4 border-emerald-700 backdrop-blur-lg bg-opacity-95">
        <div className="flex items-center justify-between px-8 h-24">
          {/* Back Button on Left - if not on home */}
          {location.pathname !== '/' && (
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-white hover:text-emerald-100 font-bold transition-colors text-xl mr-4 hover:scale-110 duration-300"
            >
              ← Back
            </button>
          )}
          
          {/* Logo on Left - with animation */}
          <Link to="/" className="flex items-center gap-3 font-black text-4xl text-white hover:scale-110 transition-transform duration-300 drop-shadow-lg">
            <span className="animate-bounce">🌾</span> FarmTube
          </Link>

          {/* Search Bar in Center - Premium style */}
          <div className="flex-1 max-w-xl mx-12">
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 Search farming tutorials, techniques..."
                className="w-full px-6 py-4 bg-white text-gray-800 border-2 border-emerald-300 rounded-full focus:outline-none focus:border-white focus:ring-4 focus:ring-emerald-300 transition-all duration-300 font-semibold shadow-lg placeholder-gray-500"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-2 rounded-full font-bold hover:scale-105 transition-transform duration-300 shadow-lg">
                Search
              </button>
            </div>
          </div>

          {/* Right Actions - Upload & Menu Button */}
          <div className="flex items-center gap-4">
            <Link
              to="/upload"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-bold hover:scale-110 transition-transform duration-300 shadow-lg flex items-center gap-2 hover:shadow-pink-500/50"
            >
              📤 Upload
            </Link>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-4 hover:bg-emerald-700 rounded-full transition-all duration-300 text-3xl font-bold text-white hover:scale-125 shadow-lg hover:shadow-emerald-500/50"
              title="Toggle Menu"
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 mt-24">
        {/* Main Content - adjusted for horizontal menu */}
        <main className={`flex-1 transition-all duration-300 overflow-y-auto bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 ${sidebarOpen ? 'mt-20' : ''}`}>
          {children}
        </main>
      </div>

      {/* Horizontal Sidebar */}
      <Sidebar isOpen={sidebarOpen} />
    </div>
  );
}
