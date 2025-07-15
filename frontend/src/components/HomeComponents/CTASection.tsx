
import React, { useEffect, useRef, useState } from 'react';
import { Rocket, ArrowRight, Sparkles, Globe } from 'lucide-react';
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

                        <h2 className="cta-title">
                            Ready to Explore the
                            <span className="gradient-text"> Universe?</span>
                        </h2>

                        <p className="cta-description">
                            Join thousands of space enthusiasts and start your cosmic journey today.
                            Discover real-time satellite tracking, interactive star maps, and connect
                            with a community that shares your passion for the stars.
                        </p>

                        <div className="cta-actions">
                            <Button
                                variant="primary"
                                className="cta-primary"
                                icon={<ArrowRight className="w-5 h-5" />}
                                iconPosition="right"
                            >
                                Start Exploring
                            </Button>
                            <Button
                                variant="primary"
                                className="cta-primary"
                                icon={<Globe className="w-5 h-5" />}
                                iconPosition="left"
                            >
                                View Demo
                            </Button>
                        </div>

                        <div className="cta-features">
                            <div className="feature-item">
                                <Sparkles className="w-4 h-4" />
                                <span>Free to start</span>
                            </div>
                            <div className="feature-item">
                                <Sparkles className="w-4 h-4" />
                                <span>Real-time data</span>
                            </div>
                            <div className="feature-item">
                                <Sparkles className="w-4 h-4" />
                                <span>Expert community</span>
                            </div>
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