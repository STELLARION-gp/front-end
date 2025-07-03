import React, { useState, useEffect, useRef } from "react";
import "../../styles/pages/learner/NasaImagesPage.scss";
import NasaImageCard from "../../components/Learner/NasaImageCard";
import NasaMissionCard from "../../components/Learner/NasaMissionCard";
import NasaImageModal from "../../components/Learner/NasaImageModal";
import NasaMissionModal from "../../components/Learner/NasaMissionModal";

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

const nasaMissions = [
  {
    name: "Apollo 11",
    description: "First crewed mission to land on the Moon. Neil Armstrong and Buzz Aldrin walked on the lunar surface in 1969.",
    image: "https://www.omegon.eu/CMS/images/text/category/mondlandung_astronaut_flagge_all.jpg",
    years: "1969"
  },
  {
    name: "Voyager 1",
    description: "Launched in 1977, Voyager 1 is now the farthest human-made object from Earth, exploring interstellar space.",
    image: "https://scitechdaily.com/images/NASA-Voyager-Spacecraft-Illustration.jpg",
    years: "1977–present"
  },
  {
    name: "Curiosity Rover",
    description: "Mars Science Laboratory rover exploring the surface of Mars since 2012.",
    image: "https://www.datocms-assets.com/117510/1722389708-slh_news34_curiosity_rover_original.jpg?auto=format&fit=max&w=1200",
    years: "2012–present"
  },
  {
    name: "James Webb Space Telescope",
    description: "The most powerful space telescope ever built, launched in 2021 to study the early universe.",
    image: "https://cdn.mos.cms.futurecdn.net/NQRzVz58E3xE3i4Jvopew5.jpg",
    years: "2021–present"
  }
];

const FADE_DURATION = 1250; // ms
const NasaImagesPage: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<typeof nasaImages[0] | null>(null);
  const [modalComments, setModalComments] = useState<{[url: string]: {id: number; user: string; rating: number; text: string;}[]}>({});
  const [modalFavorite, setModalFavorite] = useState<{[url: string]: boolean}>({});
  const [missionModalOpen, setMissionModalOpen] = useState(false);
  const [missionModalMission, setMissionModalMission] = useState<typeof nasaMissions[0] | null>(null);
  const [missionModalComments, setMissionModalComments] = useState<{[name: string]: {id: number; user: string; rating: number; text: string;}[]}>({
    "Apollo 11": [
      { id: 1, user: "Alice", rating: 5, text: "A giant leap for mankind!" },
      { id: 2, user: "Bob", rating: 4, text: "Historic and inspiring." }
    ],
    "Voyager 1": [
      { id: 3, user: "Charlie", rating: 5, text: "Still going strong!" }
    ],
    "Curiosity Rover": [
      { id: 4, user: "Dana", rating: 5, text: "Mars exploration at its best." }
    ],
    "James Webb Space Telescope": [
      { id: 5, user: "Eve", rating: 5, text: "Revealing the universe!" }
    ]
  });

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

  const handleImageClick = (img: typeof nasaImages[0]) => {
    setModalImage(img);
    setModalOpen(true);
  };
  const handleCloseModal = () => setModalOpen(false);
  const handleAddComment = (comment: {rating: number; text: string}) => {
    if (!modalImage) return;
    setModalComments(prev => ({
      ...prev,
      [modalImage.url]: [
        ...(prev[modalImage.url] || []),
        { id: Date.now(), user: "You", ...comment }
      ]
    }));
  };
  const handleToggleFavorite = () => {
    if (!modalImage) return;
    setModalFavorite(prev => ({
      ...prev,
      [modalImage.url]: !prev[modalImage.url]
    }));
  };
  const handleMissionCardClick = (mission: typeof nasaMissions[0]) => {
    setMissionModalMission(mission);
    setMissionModalOpen(true);
  };
  const handleCloseMissionModal = () => setMissionModalOpen(false);
  const handleAddMissionComment = (comment: {rating: number; text: string}) => {
    if (!missionModalMission) return;
    setMissionModalComments(prev => ({
      ...prev,
      [missionModalMission.name]: [
        ...(prev[missionModalMission.name] || []),
        { id: Date.now(), user: "You", ...comment }
      ]
    }));
  };

  return (
    <div className="nasa-images-page">
        <h2>NASA Images</h2>
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
              style={{zIndex: 3, cursor: 'pointer'}}
              onClick={() => handleImageClick(nasaImages[currentIndex])}
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
            <NasaImageCard key={img.url} image={img.url} title={img.title} rating={5} onClick={() => handleImageClick(img)} />
          ))}
        </div>
      </div>
      <div>
        <h2>NASA Missions</h2>
        <div className="nasa-missions-grid">
          {nasaMissions.map((mission) => (
            <NasaMissionCard key={mission.name} {...mission} onClick={() => handleMissionCardClick(mission)} />
          ))}
        </div>
      </div>
      <NasaImageModal
        open={modalOpen}
        onClose={handleCloseModal}
        image={modalImage || nasaImages[0]}
        comments={modalComments[modalImage?.url || nasaImages[0].url] || []}
        onAddComment={handleAddComment}
        isFavorite={!!modalFavorite[modalImage?.url || nasaImages[0].url]}
        onToggleFavorite={handleToggleFavorite}
      />
      <NasaMissionModal
        open={missionModalOpen}
        onClose={handleCloseMissionModal}
        mission={missionModalMission || nasaMissions[0]}
        comments={missionModalComments[missionModalMission?.name || nasaMissions[0].name] || []}
        onAddComment={handleAddMissionComment}
      />
    </div>
  );
};

export default NasaImagesPage;
