import React, { useEffect, useRef, useState } from 'react';
import { Globe, Rocket, Satellite, GraduationCap, Star } from 'lucide-react';
import '../../styles/components/StatsSection.scss';

interface StatItemProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  delay: number;
}

const StatItem: React.FC<StatItemProps> = ({ icon, value, label, delay }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValue, setAnimatedValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Animate the number
          const numericValue = parseFloat(value.replace(/[^\d.]/g, ''));
          let start = 0;
          const duration = 2000;
          const increment = numericValue / (duration / 16);

          const timer = setInterval(() => {
            start += increment;
            if (start >= numericValue) {
              setAnimatedValue(numericValue);
              clearInterval(timer);
            } else {
              setAnimatedValue(start);
            }
          }, 16);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value]);

  const formatValue = (num: number) => {
    const originalValue = value;
    if (originalValue.includes('K')) {
      return `${(num / 1000).toFixed(1)}K+`;
    }
    if (originalValue.includes('.')) {
      return `${num.toFixed(1)}`;
    }
    return Math.floor(num).toString() + (originalValue.includes('+') ? '+' : '');
  };

  return (
    <div
      ref={ref}
      className={`stat-item ${isVisible ? 'animate' : ''}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="stat-icon">
        {icon}
      </div>
      <div className="stat-content">
        <div className="stat-value">
          {isVisible ? formatValue(animatedValue) : '0'}
        </div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
};

const StatsSection: React.FC = () => {
  const stats = [
    {
      icon: <Globe className="w-8 h-8" />,
      value: "25000",
      label: "Global Users",
      delay: 0
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      value: "1200",
      label: "Celestial Events Tracked",
      delay: 200
    },
    {
      icon: <Satellite className="w-8 h-8" />,
      value: "600",
      label: "Active Satellite Feeds",
      delay: 400
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      value: "300",
      label: "Expert-led Sessions",
      delay: 600
    },
    {
      icon: <Star className="w-8 h-8" />,
      value: "4.9",
      label: "Average User Rating",
      delay: 800
    }
  ];

  return (
    <section className="stats-section">
      <div className="stats-container">
        <div className="stats-header">
          <h2 className="stats-title">Our Impact Across the Galaxy</h2>
          <p className="stats-subtitle">
            Join thousands of space enthusiasts exploring the cosmos together
          </p>
        </div>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <StatItem
              key={index}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
              delay={stat.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;