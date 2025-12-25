import React, { useState } from "react";
import Webcam from "react-webcam";
import PhotoStudio from "./PhotoStudio";
import "./PhotoBooth.css";

const PhotoBooth = () => {
  const [coinInserted, setCoinInserted] = useState(false);
  const [curtainOpen, setCurtainOpen] = useState(false);
  const [showStudio, setShowStudio] = useState(false);

  const handleInsertClick = () => setCoinInserted(true);

  const handleCoinClick = () => {
    setCurtainOpen(true);
    setTimeout(() => {
      setShowStudio(true);
    }, 1500); // Slightly longer for vintage feel
  };

  if (showStudio) {
    return <PhotoStudio />;
  }

  return (
    <div className="booth-container">
      {/* Vintage decorative elements */}
      <div className="film-strip">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="film-perf" />
        ))}
      </div>
      
      {/* Vintage light bulbs */}
      <div className="vintage-light top-left" />
      <div className="vintage-light top-right" />
      <div className="vintage-light bottom-left" />
      <div className="vintage-light bottom-right" />

      <div className="booth-header">FilmAura Vintage Booth</div>

      <div className="booth-body">
        <div className="coin-slot">
          {!coinInserted ? (
            <p className="insert-text" onClick={handleInsertClick}>
              INSERT
              <br />
              COIN
              <br />
              HERE
            </p>
          ) : (
            <div className="coin" onClick={handleCoinClick}></div>
          )}
          <div className="slot" />
          <div style={{
            color: '#ffd700',
            fontSize: '0.8rem',
            marginTop: '20px',
            fontFamily: 'Courier New, monospace',
            textAlign: 'center',
            textShadow: '1px 1px 2px #000'
          }}>
            ₹10 PER SESSION
          </div>
        </div>

        <div className="curtain-wrapper">
          <Webcam
            audio={false}
            screenshotFormat="image/jpeg"
            className="webcam-preview"
          />
          <div className={`curtain ${curtainOpen ? "open" : ""}`} />
        </div>
      </div>

      <div className="instructions">
        <p>1. INSERT COIN TO START</p>
        <p>2. CLICK COIN TO BEGIN</p>
        <p>3. SMILE FOR THE CAMERA!</p>
      </div>

      {/* Vintage film scratches overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: `
          repeating-linear-gradient(0deg, 
            transparent 0px, 
            transparent 2px, 
            rgba(0,0,0,0.05) 2px, 
            rgba(0,0,0,0.05) 4px),
          repeating-linear-gradient(90deg, 
            transparent 0px, 
            transparent 2px, 
            rgba(255,255,255,0.02) 2px, 
            rgba(255,255,255,0.02) 4px)
        `,
        pointerEvents: 'none',
        zIndex: 1,
        mixBlendMode: 'overlay'
      }} />
    </div>
  );
};

export default PhotoBooth;