
import React, { useEffect, useRef, useState } from 'react';
import { Globe, Rocket, Satellite, GraduationCap, Star } from 'lucide-react';
import { useI18n } from '../../i18n/useI18n';
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
      className={`stat-item-border ${isVisible ? 'animate' : ''}`}
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
  const { t } = useI18n();
  const iconMap = {
    Globe: <Globe className="w-8 h-8" />,
    Rocket: <Rocket className="w-8 h-8" />,
    Satellite: <Satellite className="w-8 h-8" />,
    GraduationCap: <GraduationCap className="w-8 h-8" />,
    Star: <Star className="w-8 h-8" />,
  };
  const { tArray } = useI18n();
  type Stat = { icon: keyof typeof iconMap; value: string; label: string };
  const stats = tArray('stats.items') as Stat[];

  return (
    <section className="stats-section">
      <div className="stats-container">
        <div className="stats-header">
          <h2 className="stats-title">{t('stats.title')}</h2>
          <p className="stats-subtitle">{t('stats.subtitle')}</p>
        </div>
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <StatItem
              key={index}
              icon={iconMap[stat.icon]}
              value={stat.value}
              label={stat.label}
              delay={index * 200}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;