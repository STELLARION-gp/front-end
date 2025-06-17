import React from "react";
import styles from "../styles/components/_navBar.module.scss";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "../components/Button";

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
    const { t, i18n } = useTranslation();

    const handleLogoClick = () => {
        navigate("/");
    };

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        i18n.changeLanguage(e.target.value);
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
                    <div className={styles.langSelect}>
                        <select onChange={handleLanguageChange} value={i18n.language} name="language">
                            <option value="en">EN</option>
                            <option value="sin">සිං</option>
                        </select>
                    </div>
                </li>
                <li>
                    <Button className="hidden" white={true}>Sign In</Button>
                </li>
            </ul>

        </nav>
    );
};

export default Navbar;
