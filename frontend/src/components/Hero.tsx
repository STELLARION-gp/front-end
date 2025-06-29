import GalaxyHero from './HeroComponents/GalaxyHero';
import './../styles/pages/Hero.scss';
import NavBarComponent from '../layouts/NavBarComponent';
import { useI18n } from '../i18n/useI18n';
import Button from './Button';

const Hero = () => {
    const { t } = useI18n();

    return (
        <div className='relative w-full h-screen overflow-hidden'>
            <NavBarComponent />

            {/* GalaxyHero in background */}
            <div className='absolute top-0 left-0 w-full h-full z-10 pointer-events-none'>
                <GalaxyHero />
            </div>

            {/* Content above GalaxyHero */}
            <div className='hero-content z-30'>
                <h1>{t('hero.title')}</h1>
                <p className='mt-4'>{t('hero.description')}</p>
                <Button
                    href="#features"
                    className="signup-btn mt-8 hero-cta-btn"
                    variant="primary"
                    size="large"
                    white={false}
                >
                    {t('hero.getStarted')}
                </Button>
            </div>
        </div>
    );
};

export default Hero;