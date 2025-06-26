import React from "react";
import styles from "../styles/components/_navBar.module.scss";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../i18n/useI18n";
import Button from "../components/Button";
import LanguageSwitcher from "../components/LanguageSwitcher";

type NavItem = {
    label: string; // label should be the i18n key
    href: string;
};

type NavbarProps = {
    logo?: string;
    navItemsR: NavItem[];
    navItemsL: NavItem[];
};

const Navbar: React.FC<NavbarProps> = ({ logo, navItemsR, navItemsL }) => {
    const navigate = useNavigate();
    const { t } = useI18n();

    const handleLogoClick = () => {
        navigate("/");
    };

    return (
        <nav className={styles.navbar}>
            <ul className={styles.navLinks}>
                {navItemsR.map((item, index) => (
                    <li key={index}>
                        <a href={item.href}>{t(item.label)}</a>
                    </li>
                ))}
            </ul>

            <div className={styles.logo} onClick={handleLogoClick}>
                {logo ? <img src={logo} alt="Logo" /> : <h1>Logo</h1>}
            </div>

            <ul className={styles.navLinks}>
                {navItemsL.map((item, index) => (
                    <li key={index}>
                        <a href={item.href}>{t(item.label)}</a>
                    </li>
                ))}
                <li>
                    <LanguageSwitcher variant="dropdown" />
                </li>
                <li>
                    <Button
                        className="hidden"
                        white={true}
                        variant="primary"
                        size="medium"
                    >
                        {t('auth.signIn')}
                    </Button>
                </li>
            </ul>

        </nav>
    );
};

export default Navbar;
