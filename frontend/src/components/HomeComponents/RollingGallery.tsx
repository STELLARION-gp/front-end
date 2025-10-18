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
    avatarUrl: 'data:image/jpeg;base64,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',
    handle: 'eshan'
  },
  {
    name: 'Kashmira R.K.J.P.',
    title: 'Team Member',
    email: 'jainthprobash944ugc@gmail.com',
    contact: '071235174',
    avatarUrl: 'https://media.licdn.com/dms/image/v2/D5603AQEujsMADs_Jow/profile-displayphoto-shrink_400_400/B56ZXQWy6bHQAg-/0/1742957392077?e=2147483647&v=beta&t=lBfafgFke6j_2RpAxpymXBJoRgY19pYSJppOKw27Q_4',
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
