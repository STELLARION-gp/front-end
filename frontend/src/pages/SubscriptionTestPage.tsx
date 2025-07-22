import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SubscriptionPlansDisplay from '../components/SubscriptionPlansDisplay';

const SubscriptionTestPage: React.FC = () => {
    const { i18n, t } = useTranslation();

    // Listen for language changes
    useEffect(() => {
        console.log('SubscriptionTestPage: Language changed to:', i18n.language);
    }, [i18n.language]);

    const changeLanguage = (language: string) => {
        console.log('SubscriptionTestPage: Changing language to:', language);
        i18n.changeLanguage(language);
    };

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Language Switcher */}
            <div className="bg-gray-800 p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-white text-xl font-bold">
                        {t('subscription.plans.galaxy_explorer.name')} - Test Page
                    </h1>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => changeLanguage('en')}
                            className={`px-3 py-1 rounded transition-colors ${
                                i18n.language === 'en' 
                                    ? 'bg-purple-600 text-white' 
                                    : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                            }`}
                        >
                            English
                        </button>
                        <button
                            onClick={() => changeLanguage('sin')}
                            className={`px-3 py-1 rounded transition-colors ${
                                i18n.language === 'sin' 
                                    ? 'bg-purple-600 text-white' 
                                    : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                            }`}
                        >
                            සිංහල
                        </button>
                        <button
                            onClick={() => changeLanguage('ta')}
                            className={`px-3 py-1 rounded transition-colors ${
                                i18n.language === 'ta' 
                                    ? 'bg-purple-600 text-white' 
                                    : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                            }`}
                        >
                            தமிழ்
                        </button>
                    </div>
                </div>
            </div>

            {/* Current Language Display */}
            <div className="container mx-auto px-4 py-4">
                <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4 mb-4">
                    <p className="text-blue-300">
                        <strong>Current Language:</strong> {i18n.language} | 
                        <strong> Navbar Plans:</strong> {t('navbar.plans')} | 
                        <strong> Auth Sign Out:</strong> {t('auth.signOut')}
                    </p>
                </div>
            </div>

            {/* Subscription Plans */}
            <SubscriptionPlansDisplay />

            {/* Test Translation Output */}
            <div className="container mx-auto px-4 py-8">
                <div className="bg-gray-800 rounded-lg p-6 max-w-4xl mx-auto">
                    <h3 className="text-white text-lg font-bold mb-4">Translation Test - Current Language: {i18n.language}</h3>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div className="bg-gray-700 p-4 rounded">
                            <h4 className="text-purple-400 font-medium mb-2">StarSeeker Plan</h4>
                            <p className="text-gray-300 mb-2">
                                Name: {t('subscription.plans.starseeker.name')}
                            </p>
                            <p className="text-gray-300 mb-2">
                                Price: {t('subscription.plans.starseeker.price')}
                            </p>
                            <p className="text-gray-300">
                                Description: {t('subscription.plans.starseeker.description')}
                            </p>
                        </div>
                        
                        <div className="bg-gray-700 p-4 rounded">
                            <h4 className="text-purple-400 font-medium mb-2">Galaxy Explorer Plan</h4>
                            <p className="text-gray-300 mb-2">
                                Name: {t('subscription.plans.galaxy_explorer.name')}
                            </p>
                            <p className="text-gray-300 mb-2">
                                Price: {t('subscription.plans.galaxy_explorer.price')}
                            </p>
                            <p className="text-gray-300">
                                Description: {t('subscription.plans.galaxy_explorer.description')}
                            </p>
                        </div>
                        
                        <div className="bg-gray-700 p-4 rounded">
                            <h4 className="text-purple-400 font-medium mb-2">Cosmic Voyager Plan</h4>
                            <p className="text-gray-300 mb-2">
                                Name: {t('subscription.plans.cosmic_voyager.name')}
                            </p>
                            <p className="text-gray-300 mb-2">
                                Price: {t('subscription.plans.cosmic_voyager.price')}
                            </p>
                            <p className="text-gray-300">
                                Description: {t('subscription.plans.cosmic_voyager.description')}
                            </p>
                        </div>
                    </div>

                    {/* Navbar Translation Test */}
                    <div className="mt-6 bg-gray-700 p-4 rounded">
                        <h4 className="text-green-400 font-medium mb-2">Navbar Translations</h4>
                        <div className="grid grid-cols-2 gap-2 text-gray-300">
                            <p>Home: {t('navbar.home')}</p>
                            <p>About: {t('navbar.about')}</p>
                            <p>Plans: {t('navbar.plans')}</p>
                            <p>Features: {t('navbar.features')}</p>
                            <p>Dashboard: {t('navbar.dashboard')}</p>
                            <p>Sign Out: {t('auth.signOut')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionTestPage;
