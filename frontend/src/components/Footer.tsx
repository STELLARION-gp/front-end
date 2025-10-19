import React from 'react';
import { useI18n } from '../i18n/useI18n';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();
    const { t } = useI18n();

    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Main Footer Content */}
                <div className="footer-content">
                    {/* Brand Section */}
                    <div className="footer-brand">
                        <div className="brand-header">
                            <img
                                src="/STELLARION.svg"
                                alt="Stellarion"
                                className="brand-logo"
                            />
                        </div>
                        <p className="brand-description">
                            {t('footer.brand.description')}
                        </p>
                        {/* Social Links */}
                        <div className="social-links">
                            <a
                                href="https://twitter.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={t('footer.socialMedia.twitter')}
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-2.719 0-4.924 2.206-4.924 4.924 0 .39.045.765.127 1.124C7.691 8.095 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.708.87 3.216 2.188 4.099-.807-.026-1.566-.247-2.229-.616v.062c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.318-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.179 1.397 4.768 2.212 7.557 2.212 9.054 0 14-7.496 14-13.986 0-.21 0-.423-.016-.634.962-.689 1.797-1.56 2.457-2.548z" />
                                </svg>
                            </a>
                            <a
                                href="https://youtube.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-theme4 hover:text-theme3 transition-colors duration-200"
                                aria-label="YouTube"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.498 6.186a2.993 2.993 0 0 0-2.107-2.117C19.479 3.5 12 3.5 12 3.5s-7.479 0-9.391.569A2.993 2.993 0 0 0 .502 6.186C0 8.1 0 12 0 12s0 3.9.502 5.814a2.993 2.993 0 0 0 2.107 2.117C4.521 20.5 12 20.5 12 20.5s7.479 0 9.391-.569a2.993 2.993 0 0 0 2.107-2.117C24 15.9 24 12 24 12s0-3.9-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                            </a>
                            <a
                                href="https://facebook.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-theme4 hover:text-theme3 transition-colors duration-200"
                                aria-label="Facebook"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.405 24 24 23.408 24 22.674V1.326C24 .592 23.405 0 22.675 0" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="col-span-1">
                        <h3 className="text-text-light font-semibold mb-4">{t('footer.quickLinks.title')}</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="/" className="text-theme4 hover:text-theme3 transition-colors duration-200">
                                    {t('footer.quickLinks.home')}
                                </a>
                            </li>
                            <li>
                                <a href="#about" className="text-theme4 hover:text-theme3 transition-colors duration-200">
                                    {t('footer.quickLinks.about')}
                                </a>
                            </li>
                            <li>
                                <a href="#features" className="text-theme4 hover:text-theme3 transition-colors duration-200">
                                    {t('footer.quickLinks.features') || 'Features'}
                                </a>
                            </li>
                            {/* <li>
                                <a href="/login" className="text-theme4 hover:text-theme3 transition-colors duration-200">
                                    {t('footer.quickLinks.login')}
                                </a>
                            </li> */}
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="col-span-1">
                        <h3 className="text-text-light font-semibold mb-4">{t('footer.support.title')}</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-theme4 hover:text-theme3 transition-colors duration-200">
                                    {t('footer.support.helpCenter')}
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-theme4 hover:text-theme3 transition-colors duration-200">
                                    {t('footer.support.contactUs')}
                                </a>
                            </li>
                            <li>
                                <a href="/privacy-policy" className="text-theme4 hover:text-theme3 transition-colors duration-200">
                                    {t('footer.support.privacyPolicy')}
                                </a>
                            </li>
                            <li>
                                <a href="/terms-and-conditions" className="text-theme4 hover:text-theme3 transition-colors duration-200">
                                    {t('footer.support.termsOfService')}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-border py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-theme4 text-sm">
                            {t('footer.legal.copyright', { year: currentYear })}
                        </p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <a href="/privacy-policy" className="text-theme4 hover:text-theme3 transition-colors duration-200 text-sm">
                                {t('footer.legal.privacy')}
                            </a>
                            <a href="/terms-and-conditions" className="text-theme4 hover:text-theme3 transition-colors duration-200 text-sm">
                                {t('footer.legal.terms')}
                            </a>
                            {/* <a href="#" className="text-theme4 hover:text-theme3 transition-colors duration-200 text-sm">
                                {t('footer.legal.cookies')}
                            </a> */}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
