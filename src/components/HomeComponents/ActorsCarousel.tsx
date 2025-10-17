import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import guideImage from "../../assets/home/Irumi.png";
import learnerImage from "../../assets/home/Janith.png";
import influencerImage from "../../assets/home/sasanka.png";
import "../../styles/components/ActorsCarousel.scss";

type Actor = {
  id: string;
  name: string;
  role: string;
  description: string;
  image: string;
};

const actors: Actor[] = [
  {
    id: "guide",
    name: "Guide",
    role: "Mentor & Storyteller",
    description:
      "Share the Universe One Star at a Time. Spark curiosity and build connections with learners who value your insight.",
    image: guideImage,
  },
  {
    id: "learner",
    name: "Learner",
    role: "Explorer",
    description:
      "Your Journey Begins Among the Stars. Explore space at your own pace in an intuitive, inspiring environment.",
    image: learnerImage,
  },
  {
    id: "influencer",
    name: "Influencer",
    role: "Inspire & Illuminate",
    description:
      "Illuminate Minds and Inspire Wonder. Share your cosmic passion with a community that listens and grows with you.",
    image: influencerImage,
  },
];

const ActorsCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);


  const getVisibleActors = () => {
    const mainActor = actors[activeIndex];
    const otherActors = actors.filter((_, index) => index !== activeIndex);
    return { mainActor, otherActors };
  };

  const { mainActor, otherActors } = getVisibleActors();

  return (
    <div className="actors-carousel">
      <div className="carousel-container">
        <div className="carousel-grid">
          
          {/* Featured Actor - Left Side */}
          <div className="featured-actor">
            <div 
              key={mainActor.id}
              className={`actor-card ${mainActor.id}`}
            >
              
              <div className="actor-content">
                {/* Actor Image */}
                <div className="actor-image">
                  <img
                    src={mainActor.image}
                    alt={mainActor.name}
                  />
                </div>

                {/* Actor Details */}
                <div className="actor-details">
                  <div className="actor-info">
                    <h1>
                      {mainActor.name}
                    </h1>
                    <p>
                      {mainActor.role}
                    </p>
                  </div>
                  
                  <p className="actor-description">
                    {mainActor.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Actors - Right Side */}
          <div className="preview-actors">
            <h3 className="preview-title">
              Other Cosmic Roles
            </h3>
            
            <div className="preview-list">
              {otherActors.map((actor, index) => (
                <div
                  key={actor.id}
                  onClick={() => setActiveIndex(actors.findIndex(a => a.id === actor.id))}
                  className="preview-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="preview-content">
                    <div className={`preview-image ${actor.id}`}>
                      <div className="image-inner">
                        <img
                          src={actor.image}
                          alt={actor.name}
                        />
                      </div>
                    </div>
                    
                    <div className="preview-info">
                      <h4>
                        {actor.name}
                      </h4>
                      <p>
                        {actor.role}
                      </p>
                    </div>
                    
                    <ChevronRight className="preview-arrow" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActorsCarousel;