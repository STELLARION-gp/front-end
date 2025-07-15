

import React, { useEffect, useRef, useState } from 'react';
import { Rocket, ArrowRight, Sparkles, Globe } from 'lucide-react';
import { useI18n } from '../../i18n/useI18n';
import Button from '../Button';
import '../../styles/components/CTASection.scss';

const CTASection: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.3 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const { t } = useI18n();
    const { tArray } = useI18n();
    const ctaFeatures = tArray('cta.features') as string[];
    return (
        <section ref={sectionRef} className="cta-section">
            <div className="cta-container">
                <div className={`cta-content ${isVisible ? 'animate' : ''}`}>
                    <div className="cta-background">
                        <div className="cosmic-gradient"></div>
                        <div className="floating-stars">
                            {[...Array(50)].map((_, i) => (
                                <div
                                    key={i}
                                    className="star"
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        top: `${Math.random() * 100}%`,
                                        animationDelay: `${Math.random() * 3}s`
                                    }}
                                ></div>
                            ))}
                        </div>
                    </div>

                    <div className="cta-main">
                        <div className="cta-icon">
                            <Rocket className="w-16 h-16" />
                            <div className="icon-glow"></div>
                        </div>

                        <h2 className="cta-title">{t('cta.title')}</h2>

                        <p className="cta-description">{t('cta.description')}</p>

                        <div className="cta-actions">
                            <Button
                                variant="primary"
                                className="cta-primary"
                                icon={<ArrowRight className="w-5 h-5" />}
                                iconPosition="right"
                            >
                                {t('cta.primary')}
                            </Button>
                            <Button
                                variant="primary"
                                className="cta-primary"
                                icon={<Globe className="w-5 h-5" />}
                                iconPosition="left"
                            >
                                {t('cta.demo')}
                            </Button>
                        </div>

                        <div className="cta-features">
                            {ctaFeatures.map((feature, idx) => (
                                <div className="feature-item" key={idx}>
                                    <Sparkles className="w-4 h-4" />
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="cta-visual">
                        <div className="planet-system">
                            <div className="central-planet">
                                <div className="planet-surface"></div>
                                <div className="planet-atmosphere"></div>
                            </div>
                            <div className="orbit orbit-1">
                                <div className="satellite sat-1"></div>
                            </div>
                            <div className="orbit orbit-2">
                                <div className="satellite sat-2"></div>
                            </div>
                            <div className="orbit orbit-3">
                                <div className="satellite sat-3"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTASection;