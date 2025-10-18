import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useAnimation, useTransform } from 'motion/react';
import './RollingGallery.css';
import ProfileCard from './ProfileCard.tsx';

interface TeamMember {
  name: string;
  title: string;
  email: string;
  contact: string;
  avatarUrl: string;
  handle: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Eshan S.P.N.P.',
    title: 'Team Member',
    email: 'ninnapathum30@gmail.com',
    contact: '0703954031',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    handle: 'eshan'
  },
  {
    name: 'Kashmira R.K.J.P.',
    title: 'Team Member',
    email: 'jainthprobash944ugc@gmail.com',
    contact: '071235174',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    handle: 'kashmira'
  },
  {
    name: 'Gamage K.G.S.D.',
    title: 'Team Member',
    email: 'kgsdgamage2000@gmail.com',
    contact: '0707017043',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    handle: 'gamage'
  },
  {
    name: 'Abeywickrama I.T.',
    title: 'Team Member',
    email: 'irumiabeywickrama@gmail.com',
    contact: '0703864050',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    handle: 'irumi'
  },
  {
    name: 'Rannnini H.A.V.',
    title: 'Team Member',
    email: 'vidusharamnini25@gmail.com',
    contact: '0704286921',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
    handle: 'vidusha'
  },
  {
    name: 'Wakishta S.S.',
    title: 'Team Member',
    email: 'sasankasavindi02@gmail.com',
    contact: '0711920472',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
    handle: 'sasanka'
  }
];

interface RollingGalleryProps {
  autoplay?: boolean;
  pauseOnHover?: boolean;
}

const RollingGallery: React.FC<RollingGalleryProps> = ({ autoplay = true, pauseOnHover = true }) => {
  const [isScreenSizeSm, setIsScreenSizeSm] = useState(window.innerWidth <= 640);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const cylinderWidth = isScreenSizeSm ? 1100 : 1800;
  const faceCount = TEAM_MEMBERS.length;
  const faceWidth = (cylinderWidth / faceCount) * 1.5;
  const dragFactor = 0.05;
  const radius = cylinderWidth / (2 * Math.PI);

  const rotation = useMotionValue(0);
  const controls = useAnimation();
  const autoplayRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const handleDrag = (_event: unknown, info: { offset: { x: number } }) => {
    rotation.set(rotation.get() + info.offset.x * dragFactor);
  };

  const handleDragEnd = (_event: unknown, info: { velocity: { x: number } }) => {
    controls.start({
      rotateY: rotation.get() + info.velocity.x * dragFactor,
      transition: { type: 'spring', stiffness: 60, damping: 20, mass: 0.1, ease: 'easeOut' }
    });
  };

  const transform = useTransform(rotation, value => {
    return `rotate3d(0, 1, 0, ${value}deg)`;
  });

  useEffect(() => {
    if (autoplay) {
      autoplayRef.current = setInterval(() => {
        controls.start({
          rotateY: rotation.get() - 360 / faceCount,
          transition: { duration: 2, ease: 'linear' }
        });
        rotation.set(rotation.get() - 360 / faceCount);
      }, 2000);

      return () => {
        if (autoplayRef.current) clearInterval(autoplayRef.current);
      };
    }
  }, [autoplay, rotation, controls, faceCount]);

  useEffect(() => {
    const handleResize = () => {
      setIsScreenSizeSm(window.innerWidth <= 640);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseEnter = () => {
    if (autoplay && pauseOnHover) {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
      controls.stop();
    }
  };

  const handleMouseLeave = () => {
    if (autoplay && pauseOnHover) {
      controls.start({
        rotateY: rotation.get() - 360 / faceCount,
        transition: { duration: 2, ease: 'linear' }
      });
      rotation.set(rotation.get() - 360 / faceCount);

      autoplayRef.current = setInterval(() => {
        controls.start({
          rotateY: rotation.get() - 360 / faceCount,
          transition: { duration: 2, ease: 'linear' }
        });
        rotation.set(rotation.get() - 360 / faceCount);
      }, 2000);
    }
  };

  const handleCardClick = (index: number, member: TeamMember) => {
    setFocusedIndex(index);
    console.log('Contact:', member.email, member.contact);
  };

  return (
    <div className="gallery-container">
      <div className="gallery-gradient gallery-gradient-left"></div>
      <div className="gallery-gradient gallery-gradient-right"></div>
      <div className="gallery-content">
        <motion.div
          drag="x"
          className="gallery-track"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: transform,
            rotateY: rotation,
            width: cylinderWidth,
            transformStyle: 'preserve-3d'
          }}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          animate={controls}
        >
          {TEAM_MEMBERS.map((member, i) => (
            <div
              key={i}
              className={`gallery-item ${focusedIndex === i ? 'focused' : ''}`}
              style={{
                width: `${faceWidth}px`,
                transform: `rotateY(${i * (360 / faceCount)}deg) translateZ(${radius}px)`
              }}
              onClick={() => handleCardClick(i, member)}
            >
              <ProfileCard
                name={member.name}
                title={member.title}
                handle={member.handle}
                status="Available"
                contactText="Contact"
                avatarUrl={member.avatarUrl}
                showUserInfo={true}
                enableTilt={focusedIndex === i}
                enableMobileTilt={false}
                onContactClick={() => {
                  window.location.href = `mailto:${member.email}`;
                }}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default RollingGallery;
