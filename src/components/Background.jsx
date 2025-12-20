import React, { useEffect, useRef } from 'react';
import './Background.css';

const Background = () => {
  const glowRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;

      // Update mouse glow position with smoother offset
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${clientX - 500}px, ${clientY - 500}px)`;
      }

      // Update 3D grid tilt for parallax feel
      if (gridRef.current) {
        const xRotation = (clientY / window.innerHeight - 0.5) * 15; // -7.5 to 7.5 deg
        const yRotation = (clientX / window.innerWidth - 0.5) * -15; // 7.5 to -7.5 deg
        gridRef.current.style.transform = `rotateX(${65 + xRotation}deg) rotateZ(${yRotation}deg)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="app-bg">
      <div className="noise" />
      <div className="scanlines" />

      <div className="grid-container">
        <div className="grid-3d" ref={gridRef} />
      </div>

      <div className="blobs">
        <div className="blob b1" />
        <div className="blob b2" />
        <div className="blob b3" />
        <div className="blob b4" />
      </div>

      <div className="mouse-glow" ref={glowRef} />
      <div className="glass-overlay" />
    </div>
  );
};

export default Background;
