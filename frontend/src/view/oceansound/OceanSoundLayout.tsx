import React, { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import { menuOutline, closeOutline } from 'ionicons/icons';
import styles from './styles.module.scss';
import logo from '/images/ode_logo_192x192.png';

interface OceanSoundLayoutProps {
  children: ReactNode;
}

interface NavItem {
  path: string;
  label: string;
  external?: boolean;
}

const navItems: NavItem[] = [
  { path: '/oceansound', label: 'Home' },
  { path: '/oceansound/pam', label: 'Passive Acoustic Monitoring' },
  { path: '/oceansound/sounds', label: 'Sound Library' },
  { path: '/oceansound/publications', label: 'Publications' },
];

export const OceanSoundLayout: React.FC<OceanSoundLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/oceansound') {
      return location.pathname === '/oceansound' || location.pathname === '/oceansound/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className={styles.layoutContainer}>
      {/* Mobile Menu Toggle */}
      <button
        className={styles.mobileMenuToggle}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <IonIcon icon={menuOpen ? closeOutline : menuOutline} />
      </button>

      {/* Left Navigation Panel */}
      <nav className={`${styles.sideNav} ${menuOpen ? styles.open : ''}`}>
        <div className={styles.logoSection}>
          <img src={logo} alt="OceanSound" className={styles.logo} />
          <h1 className={styles.siteTitle}>OceanSound</h1>
          <p className={styles.siteSubtitle}>Passive Acoustic Monitoring Platform</p>
        </div>

        <div className={styles.navLinks}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.navLink} ${isActive(item.path) ? styles.active : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className={styles.navDivider} />

        <div className={styles.navLinks}>
          <Link to="/app/login" className={styles.loginButton}>
            Log In to APLOSE
          </Link>
        </div>

        <div className={styles.navFooter}>
          <p>APLOSE - Annotation Platform for Ocean Sound Exploration</p>
        </div>
      </nav>

      {/* Overlay for mobile */}
      {menuOpen && (
        <div
          className={styles.overlay}
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
};
