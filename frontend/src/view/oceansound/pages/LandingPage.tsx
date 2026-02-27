import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles.module.scss';

export const LandingPage: React.FC = () => {
  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <h1>Welcome to OceanSound</h1>
        <p className={styles.heroSubtitle}>
          Explore the underwater soundscape through passive acoustic monitoring
        </p>
      </section>

      {/* Introduction */}
      <section className={styles.contentSection}>
        <h2>About the Platform</h2>
        <p>
          OceanSound is a comprehensive platform for passive acoustic monitoring (PAM)
          of marine environments. Our tools enable researchers and conservationists to
          record, analyze, and annotate underwater sounds to better understand marine
          ecosystems and the species that inhabit them.
        </p>
        <p>
          From whale songs to dolphin clicks, from ship noise to the sounds of healthy
          coral reefs, acoustic monitoring provides a non-invasive window into the
          underwater world.
        </p>
      </section>

      {/* Features Grid */}
      <section className={styles.contentSection}>
        <h2>Platform Features</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <h3>Sound Library</h3>
            <p>
              Browse our collection of annotated marine sounds, from cetacean
              vocalizations to anthropogenic noise sources.
            </p>
            <Link to="/oceansound/sounds" className={styles.featureLink}>
              Explore Sounds
            </Link>
          </div>

          <div className={styles.featureCard}>
            <h3>Annotation Tools</h3>
            <p>
              Powerful tools for visualizing spectrograms and annotating acoustic
              events with precision and efficiency.
            </p>
            <Link to="/app/login" className={styles.featureLink}>
              Access APLOSE
            </Link>
          </div>

          <div className={styles.featureCard}>
            <h3>Research & Publications</h3>
            <p>
              Access peer-reviewed research and publications on passive acoustic
              monitoring methodologies and findings.
            </p>
            <Link to="/oceansound/publications" className={styles.featureLink}>
              View Publications
            </Link>
          </div>
        </div>
      </section>

      {/* Screenshot/Figure Placeholder */}
      <section className={styles.contentSection}>
        <h2>Spectrogram Visualization</h2>
        <div className={styles.screenshotContainer}>
          <div className={styles.screenshotPlaceholder}>
            <p>Spectrogram visualization example</p>
            <small>Add your screenshots here by editing this component</small>
          </div>
        </div>
        <p className={styles.caption}>
          Example of a spectrogram showing whale vocalizations analyzed in APLOSE.
        </p>
      </section>

      {/* Quick Tutorial */}
      <section className={styles.contentSection}>
        <h2>Getting Started</h2>
        <div className={styles.tutorialSteps}>
          <div className={styles.tutorialStep}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <h4>Create an Account</h4>
              <p>Request access to the APLOSE annotation platform by contacting the administrator.</p>
            </div>
          </div>

          <div className={styles.tutorialStep}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <h4>Join a Campaign</h4>
              <p>Participate in annotation campaigns organized by research teams.</p>
            </div>
          </div>

          <div className={styles.tutorialStep}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <h4>Annotate Sounds</h4>
              <p>Use our spectrogram tools to identify and label acoustic events.</p>
            </div>
          </div>

          <div className={styles.tutorialStep}>
            <div className={styles.stepNumber}>4</div>
            <div className={styles.stepContent}>
              <h4>Contribute to Science</h4>
              <p>Your annotations help build datasets for marine research and conservation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Learn More */}
      <section className={styles.contentSection}>
        <h2>Learn More</h2>
        <p>
          Interested in learning about passive acoustic monitoring? Visit our
          <Link to="/oceansound/pam" className={styles.inlineLink}> PAM introduction page </Link>
          for an overview of the technology and methods used in underwater acoustic research.
        </p>
      </section>
    </div>
  );
};
