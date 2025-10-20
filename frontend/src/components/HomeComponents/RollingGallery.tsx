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
    avatarUrl: 'https://media.licdn.com/dms/image/v2/D5635AQFO7P1teQFOiA/profile-framedphoto-shrink_800_800/B56ZmTz65oJsAg-/0/1759121485761?e=1761562800&v=beta&t=yE0lnlF_S65lTWLzymw0i2KQM7H8SbinfkUTVSj-ueI',
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
    avatarUrl: 'https://media.licdn.com/dms/image/v2/D4D03AQGg9gjFClVSkQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1719045947412?e=1762387200&v=beta&t=hY4Nw1tt-dgUmwoRwEVRxG2-3fUHF__IyWAel8phgBw',
    handle: 'gamage'
  },
  {
    name: 'Abeywickrama I.T.',
    title: 'Team Member',
    email: 'irumiabeywickrama@gmail.com',
    contact: '0703864050',
    avatarUrl: 'https://media.licdn.com/dms/image/v2/D5635AQH2WeEALly5Ow/profile-framedphoto-shrink_800_800/B56ZjSGp2_H8Ag-/0/1755871616833?e=1761562800&v=beta&t=r7NYIix2v34e05oXrJCgScwIK-bQxqwU_YY7qmyTNqs',
    handle: 'irumi'
  },
  {
    name: 'Ranmini H.A.V.',
    title: 'Team Member',
    email: 'vidusharamnini25@gmail.com',
    contact: '0704286921',
    avatarUrl: 'https://media.licdn.com/dms/image/v2/D5635AQGb0lAoirnrcA/profile-framedphoto-shrink_800_800/B56ZhSTkuOHkAg-/0/1753727519956?e=1761562800&v=beta&t=L4uaZOaslByTrh_vgisHtYT4AauYjOuD6lqmT3yBMMQ',
    handle: 'vidusha'
  },
  {
    name: 'Wakishta S.S.',
    title: 'Team Member',
    email: 'sasankasavindi02@gmail.com',
    contact: '0711920472',
    avatarUrl: 'https://media.licdn.com/dms/image/v2/D5635AQHlvyHqaRmICw/profile-framedphoto-shrink_800_800/B56Zmy6ST3KAAg-/0/1759643248207?e=1761562800&v=beta&t=ResZdBW-SctXX98ryye1odvg_NwTYjVvBtLQV9CRvo8',
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
