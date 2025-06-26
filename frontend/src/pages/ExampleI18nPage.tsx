import React from 'react';
import { useI18n } from '../i18n/useI18n';
import LanguageSwitcher from '../components/LanguageSwitcher';
import Button from '../components/Button';
import {
    PlusIcon,
    TrashIcon,
    PencilIcon
} from '@heroicons/react/24/outline';

/**
 * Example component demonstrating i18n usage
 * This can be used as a reference for other developers
 */
const ExampleI18nPage: React.FC = () => {
    const { t, getCurrentLanguage, formatText } = useI18n();
    const currentLang = getCurrentLanguage();

    return (
        <div className="example-i18n-page">
            <header>
                <h1>{t('pages.about.title')}</h1>
                <p>Current Language: {currentLang.nativeName} ({currentLang.name})</p>
                <LanguageSwitcher variant="buttons" showLabels={true} />
            </header>

            <main>
                <section>
                    <h2>{t('hero.title')}</h2>
                    <p>{t('hero.description')}</p>
                    <Button variant="primary" size="medium">
                        {t('hero.getStarted')}
                    </Button>
                </section>

                <section>
                    <h2>{t('auth.signIn')}</h2>
                    <form>
                        <div>
                            <label>{t('auth.email')}</label>
                            <input type="email" placeholder={t('auth.email')} />
                        </div>
                        <div>
                            <label>{t('auth.password')}</label>
                            <input type="password" placeholder={t('auth.password')} />
                        </div>
                        <Button type="submit" variant="primary" size="medium">
                            {t('auth.signIn')}
                        </Button>
                    </form>
                    <p>
                        {t('auth.dontHaveAccount')}
                        <a href="/signup">{t('auth.signUp')}</a>
                    </p>
                </section>

                <section>
                    <h2>{t('features.exploration.title')}</h2>
                    <p>{t('features.exploration.description')}</p>

                    <h2>{t('features.learning.title')}</h2>
                    <p>{t('features.learning.description')}</p>

                    <h2>{t('features.community.title')}</h2>
                    <p>{t('features.community.description')}</p>
                </section>

                <section>
                    <h2>Enhanced Button System</h2>
                    <div>
                        <h3>Size Variants:</h3>
                        <Button variant="primary" size="small">Small</Button>
                        <Button variant="primary" size="medium">Medium</Button>
                        <Button variant="primary" size="large">Large</Button>
                    </div>
                    <div>
                        <h3>Color Variants:</h3>
                        <Button variant="primary" size="medium">Primary</Button>
                        <Button variant="secondary" size="medium">Secondary</Button>
                        <Button variant="success" size="medium">Success</Button>
                        <Button variant="danger" size="medium">Danger</Button>
                        <Button variant="ghost" size="medium">Ghost</Button>
                    </div>
                    <div>
                        <h3>With Icons:</h3>
                        <Button
                            variant="success"
                            icon={<PlusIcon className="w-4 h-4" />}
                            iconPosition="left"
                        >
                            Add Item
                        </Button>
                        <Button
                            variant="danger"
                            icon={<TrashIcon className="w-4 h-4" />}
                            iconPosition="left"
                        >
                            Delete
                        </Button>
                        <Button
                            variant="secondary"
                            icon={<PencilIcon className="w-4 h-4" />}
                            iconPosition="right"
                        >
                            Edit
                        </Button>
                    </div>
                    <div>
                        <h3>Button States:</h3>
                        <Button variant="primary">Normal</Button>
                        <Button variant="primary" disabled>Disabled</Button>
                        <Button variant="primary" loading>Loading</Button>
                    </div>
                </section>

                <section>
                    <h2>Common Actions</h2>
                    <div>
                        <Button variant="success" size="small">{t('common.save')}</Button>
                        <Button variant="secondary" size="small">{t('common.edit')}</Button>
                        <Button variant="danger" size="small">{t('common.delete')}</Button>
                        <Button variant="ghost" size="small">{t('common.cancel')}</Button>
                    </div>
                </section>

                <section>
                    <h2>Navigation Example</h2>
                    <nav>
                        <a href="/">{t('navbar.home')}</a>
                        <a href="/about">{t('navbar.about')}</a>
                        <a href="/contact">{t('navbar.contact')}</a>
                        <a href="/profile">{t('navbar.profile')}</a>
                        <a href="/settings">{t('navbar.settings')}</a>
                    </nav>
                </section>

                <section>
                    <h2>Different Language Switcher Variants</h2>

                    <div>
                        <h3>Dropdown Variant:</h3>
                        <LanguageSwitcher variant="dropdown" />
                    </div>

                    <div>
                        <h3>Button Variant:</h3>
                        <LanguageSwitcher variant="buttons" showLabels={true} />
                    </div>

                    <div>
                        <h3>Flag Variant:</h3>
                        <LanguageSwitcher variant="flags" showLabels={false} />
                    </div>
                </section>

                <section>
                    <h2>Text with Interpolation Example</h2>
                    <p>{formatText('welcome')}</p>
                    {/* 
            For interpolation, you would add to your translation files:
            "welcomeUser": "Welcome {{name}} to Stellarion!"
            Then use: {formatText('welcomeUser', { name: 'John' })}
          */}
                </section>
            </main>
        </div>
    );
};

export default ExampleI18nPage;
