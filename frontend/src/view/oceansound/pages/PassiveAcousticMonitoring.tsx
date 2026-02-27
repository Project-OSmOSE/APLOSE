import React from 'react';
import styles from '../styles.module.scss';

/**
 * Passive Acoustic Monitoring Page
 *
 * Edit the content below to describe PAM basics and data analysis methods.
 * This page explains passive acoustic monitoring to visitors.
 */
export const PassiveAcousticMonitoring: React.FC = () => {
  return (
    <div className={styles.page}>
      <article className={styles.markdownContent}>
        <h1>Passive Acoustic Monitoring</h1>

        <section>
          <h2>What is Passive Acoustic Monitoring?</h2>
          <p>
            Passive Acoustic Monitoring (PAM) is a non-invasive technique used to study marine
            environments by recording and analyzing underwater sounds. Unlike active acoustics
            (such as sonar), PAM systems only listen - they do not emit any sounds that could
            disturb marine life.
          </p>
          <p>
            PAM has become an essential tool for marine biologists, conservationists, and
            oceanographers to monitor ocean health, track marine species, and assess the
            impact of human activities on marine ecosystems.
          </p>
        </section>

        <section>
          <h2>How Does PAM Work?</h2>
          <p>
            PAM systems consist of hydrophones (underwater microphones) that are deployed in
            the ocean to continuously record sounds. These recordings capture a wide range
            of acoustic signals including:
          </p>
          <ul>
            <li><strong>Biological sounds:</strong> Whale songs, dolphin clicks, fish choruses, snapping shrimp</li>
            <li><strong>Geophysical sounds:</strong> Earthquakes, ice cracking, underwater volcanic activity</li>
            <li><strong>Anthropogenic sounds:</strong> Ship traffic, sonar, seismic surveys, construction</li>
          </ul>
        </section>

        <section>
          <h2>Recording Equipment</h2>
          <p>
            Modern PAM systems use high-quality hydrophones capable of recording frequencies
            from infrasound (below 20 Hz) to ultrasound (above 20 kHz). Common deployment
            methods include:
          </p>
          <ul>
            <li><strong>Bottom-mounted recorders:</strong> Anchored to the seafloor for long-term monitoring</li>
            <li><strong>Drifting buoys:</strong> Free-floating systems that follow ocean currents</li>
            <li><strong>Towed arrays:</strong> Hydrophones towed behind research vessels</li>
            <li><strong>Gliders and AUVs:</strong> Autonomous underwater vehicles with integrated hydrophones</li>
          </ul>
        </section>

        <section>
          <h2>Data Analysis: Manual Methods</h2>
          <p>
            Manual analysis involves trained experts examining spectrograms - visual
            representations of sound showing frequency over time. Analysts identify and
            annotate acoustic events by:
          </p>
          <ol>
            <li>Reviewing spectrograms for distinctive patterns</li>
            <li>Listening to audio segments to confirm identifications</li>
            <li>Marking the time and frequency bounds of detected sounds</li>
            <li>Classifying sounds into categories (species, call types, noise sources)</li>
            <li>Recording confidence levels and additional notes</li>
          </ol>
          <p>
            While time-consuming, manual analysis remains the gold standard for accuracy
            and is essential for training automated systems.
          </p>
        </section>

        <section>
          <h2>Data Analysis: Automated Methods</h2>
          <p>
            With the vast amounts of data collected by PAM systems, automated detection
            and classification methods have become increasingly important:
          </p>

          <h3>Template Matching</h3>
          <p>
            Comparing recorded sounds against known templates using cross-correlation
            techniques. Effective for stereotyped calls but limited for variable sounds.
          </p>

          <h3>Energy Detection</h3>
          <p>
            Identifying sounds based on energy levels exceeding background noise thresholds.
            Simple but prone to false positives in noisy environments.
          </p>

          <h3>Machine Learning</h3>
          <p>
            Modern approaches use deep learning models trained on annotated datasets to
            automatically detect and classify sounds:
          </p>
          <ul>
            <li><strong>Convolutional Neural Networks (CNNs):</strong> Process spectrogram images</li>
            <li><strong>Recurrent Neural Networks (RNNs):</strong> Capture temporal patterns</li>
            <li><strong>Transformers:</strong> State-of-the-art models for acoustic classification</li>
          </ul>
        </section>

        <section>
          <h2>Applications</h2>
          <p>
            PAM data supports a wide range of research and conservation applications:
          </p>
          <ul>
            <li>Population monitoring of endangered marine mammals</li>
            <li>Studying animal behavior and communication</li>
            <li>Assessing impacts of noise pollution on marine life</li>
            <li>Monitoring marine protected areas</li>
            <li>Environmental impact assessments for offshore development</li>
            <li>Climate change research through soundscape ecology</li>
          </ul>
        </section>

        <section>
          <h2>The Role of APLOSE</h2>
          <p>
            APLOSE (Annotation Platform for Ocean Sound Exploration) is designed to streamline
            the manual annotation process. By providing efficient tools for visualizing and
            annotating spectrograms, APLOSE helps researchers:
          </p>
          <ul>
            <li>Process large acoustic datasets more efficiently</li>
            <li>Maintain consistent annotation standards across teams</li>
            <li>Build high-quality training datasets for machine learning</li>
            <li>Collaborate on annotation campaigns</li>
          </ul>
        </section>
      </article>
    </div>
  );
};
