import './../styles/pages/Hero.scss';
import NavBarComponent from '../layouts/NavBarComponent';
import { useI18n } from '../i18n/useI18n';
import Button from './Button';

const Hero = () => {
    const { t } = useI18n();

    return (
        <section className='hero-section relative w-full'>
            {/* NavBar positioned at top */}
            <div className='hero-navbar absolute top-0 left-0 w-full z-50'>
                <NavBarComponent />
            </div>

            {/* Content centered in hero section only */}
            <div className='hero-content'>
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
        </section>
    );
};

export default Hero;