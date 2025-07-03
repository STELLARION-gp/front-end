import React, { useState, useEffect, useRef } from "react";
import "../../styles/pages/learner/NasaImagesPage.scss";
import NasaImageCard from "../../components/Learner/NasaImageCard";

// Mock image data
const nasaImages = [
  {
    title: "Pillars of Creation",
    url: "https://images-assets.nasa.gov/image/PIA01320/PIA01320~orig.jpg",
    description: "The iconic Pillars of Creation in the Eagle Nebula, captured by Hubble."
  },
  {
    title: "Andromeda Galaxy",
    url: "https://images-assets.nasa.gov/image/PIA19831/PIA19831~orig.jpg",
    description: "A stunning view of the Andromeda Galaxy, our nearest galactic neighbor."
  },
  {
    title: "Jupiter's Great Red Spot",
    url: "https://images-assets.nasa.gov/image/PIA02873/PIA02873~orig.jpg",
    description: "A close-up of Jupiter's Great Red Spot, a giant storm larger than Earth."
  },
  {
    title: "Saturn's Rings",
    url: "https://images-assets.nasa.gov/image/PIA11141/PIA11141~orig.jpg",
    description: "Saturn's magnificent rings as seen by the Cassini spacecraft."
  },
  {
    title: "Orion Nebula",
    url: "https://skyandtelescope.org/wp-content/uploads/M42_M43_341_210.jpg",
    description: "The Orion Nebula, a stellar nursery where new stars are born."
  },
];

const FADE_DURATION = 1250; // ms
const NasaImagesPage: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setPrevIndex(currentIndex);
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % nasaImages.length);
        setIsTransitioning(false);
        setPrevIndex(null);
      }, FADE_DURATION);
    }, 5000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentIndex]);

  const handleThumbnailClick = (idx: number) => {
    if (idx !== currentIndex && !isTransitioning) {
      setPrevIndex(currentIndex);
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(idx);
        setIsTransitioning(false);
        setPrevIndex(null);
      }, FADE_DURATION);
    }
  };

  return (
    <div className="nasa-images-page">
      <div className="nasa-featured-section">
        <div className="nasa-featured-image-wrapper">
          {prevIndex !== null && isTransitioning && (
            <img
              src={nasaImages[prevIndex].url}
              alt={nasaImages[prevIndex].title}
              className="nasa-featured-image crossfade-out"
              style={{zIndex: 2}}
            />
          )}
          {isTransitioning && (
            <img
              src={nasaImages[(currentIndex + 1) % nasaImages.length].url}
              alt={nasaImages[(currentIndex + 1) % nasaImages.length].title}
              className="nasa-featured-image crossfade-in"
              style={{zIndex: 3}}
            />
          )}
          {!isTransitioning && (
            <img
              src={nasaImages[currentIndex].url}
              alt={nasaImages[currentIndex].title}
              className="nasa-featured-image"
              style={{zIndex: 3}}
            />
          )}
          <div className="nasa-featured-title-overlay">
            <h2>{nasaImages[currentIndex].title}</h2>
          </div>
        </div>
        <div className="nasa-thumbnails-row">
          {nasaImages.map((img, idx) => (
            <img
              key={img.url}
              src={img.url}
              alt={img.title}
              className={`nasa-thumbnail${idx === currentIndex ? " active" : ""}`}
              onClick={() => handleThumbnailClick(idx)}
            />
          ))}
        </div>
      </div>
      <div className="nasa-gallery-section">
        <div className="nasa-gallery-grid">
          {nasaImages.map((img) => (
            <NasaImageCard key={img.url} image={img.url} title={img.title} rating={5} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NasaImagesPage;
