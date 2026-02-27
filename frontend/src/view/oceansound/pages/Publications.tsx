import React from 'react';
import styles from '../styles.module.scss';

/**
 * Publications Page
 *
 * Edit the content below to add your publications, papers, and bibliography.
 * Add links to papers, DOIs, and references as needed.
 */
export const Publications: React.FC = () => {
  return (
    <div className={styles.page}>
      <article className={styles.markdownContent}>
        <h1>Publications & References</h1>

        <section>
          <h2>Platform Publications</h2>
          <p>
            Publications related to the APLOSE platform and its applications in
            passive acoustic monitoring research.
          </p>

          {/* Add your publications here */}
          <div className={styles.publicationsList}>
            <div className={styles.publicationEntry}>
              <p className={styles.publicationTitle}>
                {/* Example publication - replace with your actual publications */}
                <strong>Example: APLOSE - A Collaborative Platform for Marine Acoustic Annotation</strong>
              </p>
              <p className={styles.publicationAuthors}>
                Author A., Author B., Author C.
              </p>
              <p className={styles.publicationDetails}>
                <em>Journal of Marine Science</em>, 2024, Vol. XX, pp. XXX-XXX
              </p>
              <p className={styles.publicationLinks}>
                <a href="#" target="_blank" rel="noopener noreferrer">PDF</a>
                {' | '}
                <a href="#" target="_blank" rel="noopener noreferrer">DOI: 10.xxxx/xxxxx</a>
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2>Related Research</h2>
          <p>
            Key publications in the field of passive acoustic monitoring that inform
            our methodologies and approaches.
          </p>

          <div className={styles.publicationsList}>
            {/* Add related research publications here */}
            <div className={styles.publicationEntry}>
              <p className={styles.publicationTitle}>
                <strong>Add your related research publications here</strong>
              </p>
              <p className={styles.publicationAuthors}>
                Edit this file to add author names
              </p>
              <p className={styles.publicationDetails}>
                <em>Journal Name</em>, Year
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2>Bibliography</h2>
          <p>
            Reference materials and foundational texts in passive acoustic monitoring.
          </p>

          <h3>Books & Textbooks</h3>
          <ul className={styles.bibliography}>
            <li>
              Au, W. W. L., & Hastings, M. C. (2008). <em>Principles of Marine Bioacoustics</em>.
              Springer.
            </li>
            <li>
              Zimmer, W. M. X. (2011). <em>Passive Acoustic Monitoring of Cetaceans</em>.
              Cambridge University Press.
            </li>
            {/* Add more bibliography entries */}
          </ul>

          <h3>Key Papers</h3>
          <ul className={styles.bibliography}>
            <li>
              Mellinger, D. K., Stafford, K. M., Moore, S. E., Dziak, R. P., & Matsumoto, H. (2007).
              An overview of fixed passive acoustic observation methods for cetaceans.
              <em>Oceanography</em>, 20(4), 36-45.
            </li>
            {/* Add more key papers */}
          </ul>

          <h3>Technical Reports</h3>
          <ul className={styles.bibliography}>
            {/* Add technical reports */}
            <li>
              Add your technical reports and internal documentation here.
            </li>
          </ul>
        </section>

        <section>
          <h2>Datasets</h2>
          <p>
            Publicly available datasets that can be used with APLOSE for research
            and educational purposes.
          </p>
          <ul>
            <li>
              <a href="#" target="_blank" rel="noopener noreferrer">
                Dataset Name 1
              </a> - Description of the dataset
            </li>
            {/* Add more datasets */}
          </ul>
        </section>

        <section>
          <h2>How to Cite</h2>
          <p>
            If you use APLOSE in your research, please cite:
          </p>
          <blockquote className={styles.citation}>
            [Add your preferred citation format here]
          </blockquote>
        </section>
      </article>
    </div>
  );
};
