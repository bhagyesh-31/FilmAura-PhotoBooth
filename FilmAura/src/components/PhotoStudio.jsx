import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import "./PhotoStudio.css";
import html2canvas from "html2canvas";

const filters = [
  "90s",
  "2000s",
  "Noir",
  "Fisheye",
  "Rainbow",
  "Glitch",
  "Crosshatch",
];

// Filter configurations with CSS filter strings
const filterConfigs = {
  "90s": {
    filter: "sepia(0.4) contrast(1.2) saturate(0.8) hue-rotate(-10deg)",
    className: "_90s"
  },
  "2000s": {
    filter: "saturate(1.6) contrast(1.1) brightness(1.05)",
    className: "_2000s"
  },
  "Noir": {
    filter: "grayscale(1) contrast(1.3)",
    className: "noir"
  },
  "Fisheye": {
    filter: "brightness(1.1) contrast(1.2)",
    className: "fisheye"
  },
  "Rainbow": {
    filter: "hue-rotate(90deg) saturate(1.5)",
    className: "rainbow"
  },
  "Glitch": {
    filter: "contrast(1.5) saturate(2)",
    className: "glitch"
  },
  "Crosshatch": {
    filter: "grayscale(0.5) blur(0.5px)",
    className: "crosshatch"
  }
};

const PhotoStudio = () => {
  const [selectedFilter, setSelectedFilter] = useState("90s");
  const [photos, setPhotos] = useState([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const webcamRef = useRef(null);
  const [webcamFilter, setWebcamFilter] = useState("");

  // Delay function
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  // Take photo with filter applied
// Enhanced takePhoto function with better filter effects
const takePhoto = async () => {
  if (!webcamRef.current) return null;
  
  const screenshot = webcamRef.current.getScreenshot();
  if (!screenshot) return null;
  
  const img = new Image();
  
  return new Promise((resolve) => {
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      
      // Draw original image first
      ctx.drawImage(img, 0, 0);
      
      // Apply special effects based on filter
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Apply different effects based on filter
      switch(selectedFilter) {
        case "90s":
          // Vintage 90s effect - warmer tones
          for(let i = 0; i < data.length; i += 4) {
            // Add sepia/brown tint
            data[i] = data[i] * 1.1;     // Red
            data[i+1] = data[i+1] * 0.9; // Green
            data[i+2] = data[i+2] * 0.8; // Blue
          }
          break;
          
        case "Noir":
          // Black and white with contrast
          for(let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i+1] + data[i+2]) / 3;
            data[i] = avg;     // Red
            data[i+1] = avg;   // Green
            data[i+2] = avg;   // Blue
            // Increase contrast
            data[i] = data[i] < 128 ? data[i] * 0.8 : data[i] * 1.2;
            data[i+1] = data[i+1] < 128 ? data[i+1] * 0.8 : data[i+1] * 1.2;
            data[i+2] = data[i+2] < 128 ? data[i+2] * 0.8 : data[i+2] * 1.2;
          }
          break;
          
        case "Rainbow":
          // Color shift
          for(let i = 0; i < data.length; i += 4) {
            const temp = data[i];
            data[i] = data[i+2];     // Red gets Blue
            data[i+1] = temp;        // Green gets Red
            data[i+2] = data[i+1];   // Blue gets Green
          }
          break;
          
        // Add other custom effects as needed
      }
      
      ctx.putImageData(imageData, 0, 0);
      
      // Add CSS filter on top for additional effects
      const filterConfig = filterConfigs[selectedFilter];
      ctx.filter = filterConfig.filter;
      
      // Draw filtered version
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext("2d");
      tempCtx.filter = filterConfig.filter;
      tempCtx.drawImage(canvas, 0, 0);
      
      const filteredImage = tempCanvas.toDataURL("image/jpeg", 0.9);
      
      resolve({
        src: filteredImage,
        filter: selectedFilter,
        filterClass: filterConfig.className
      });
    };
    
    img.src = screenshot;
  });
};

  // Countdown sequence
  const countdownStep = async (value) => {
    setCountdown(value);
    await delay(1000);
  };

  // Start photo sequence
  const startPhotoSequence = async () => {
    if (isCapturing) return;
    
    setIsCapturing(true);
    setPhotos([]);
    setShowResult(false);

    // Take 3 photos with countdown
    for (let i = 0; i < 3; i++) {
      await countdownStep("3");
      await countdownStep("2");
      await countdownStep("1");
      await countdownStep("📸");
      
      const photo = await takePhoto();
      if (photo) {
        setPhotos(prev => [...prev, photo]);
      }
      
      setCountdown(null);
      await delay(500);
    }

    setIsCapturing(false);
    setShowResult(true);
  };

  // Handle reshoot
  const handleReshoot = () => {
    setPhotos([]);
    setShowResult(false);
  };

  // Handle download
  const handleDownload = async () => {
    const frame = document.getElementById("photostrip-frame");
    if (!frame) return;

    try {
      const canvas = await html2canvas(frame, { 
        scale: 2,
        backgroundColor: null,
        useCORS: true
      });
      
      const link = document.createElement("a");
      link.download = `filmaura-vintage-strip-${Date.now()}.jpg`;
      link.href = canvas.toDataURL("image/jpeg", 1.0);
      link.click();
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download. Please try again.");
    }
  };

  return (
    <div className="photoStudio">
      {!showResult ? (
        <div className="studio-container">
          <h2 style={{
            color: "#ffd700",
            fontFamily: "'Cinzel', serif",
            fontSize: "2.5rem",
            marginBottom: "20px",
            textAlign: "center",
            textShadow: "2px 2px 4px #000"
          }}>
            📷 VINTAGE STUDIO 📷
          </h2>

          {/* Webcam Preview */}
          <div className="webcam-container">
            {countdown && (
              <div className="countdown-overlay">{countdown}</div>
            )}
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              className="webcam-view"
              mirrored={true}
              style={{
                filter: filterConfigs[selectedFilter].filter,
                transition: "filter 0.3s ease"
              }}
            />
          </div>

          {/* Filter Selection */}
          <div className="filter-bar">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`filter-btn ${
                  selectedFilter === filter ? "active" : ""
                }`}
                disabled={isCapturing}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Capture Button */}
          <button
            className="capture-btn"
            onClick={startPhotoSequence}
            disabled={isCapturing}
          >
            {isCapturing ? "⏳" : "📸"}
          </button>

          {/* Instructions */}
          <div className="instructions">
            <p>🎞️ SELECT FILTER → CLICK CAMERA → TAKE 3 PHOTOS! 🎞️</p>
            <p style={{ fontSize: "0.9rem", marginTop: "10px", opacity: 0.8 }}>
              Current Filter: <strong>{selectedFilter}</strong>
            </p>
          </div>
        </div>
      ) : (
        <div className="result-screen">
          <h2 style={{
            color: "#ffd700",
            fontFamily: "'Cinzel', serif",
            fontSize: "2.5rem",
            marginBottom: "20px",
            textAlign: "center",
            textShadow: "2px 2px 4px #000"
          }}>
            🎞️ YOUR VINTAGE STRIP 🎞️
          </h2>

          {/* Photo Strip */}
          <div className="photostrip-frame" id="photostrip-frame">
            <div className="photo-grid">
              {photos.map((photo, index) => (
                <div className="photo-item" key={index}>
                  <img 
                    src={photo.src} 
                    alt={`Vintage Photo ${index + 1}`}
                    style={{
                      filter: filterConfigs[photo.filter].filter
                    }}
                  />
                </div>
              ))}
            </div>
            
            <p className="photostrip-caption">
              FilmAura Vintage • {new Date().toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button onClick={handleReshoot} className="action-btn reshoot-btn">
              <span>🔄</span> Reshoot
            </button>
            <button onClick={handleDownload} className="action-btn download-btn">
              <span>⬇️</span> Download Strip
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoStudio;