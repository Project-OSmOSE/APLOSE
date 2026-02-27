import React from 'react';
import { MarkdownPage } from '../components/MarkdownPage';

/**
 * Passive Acoustic Monitoring Page
 *
 * Content is loaded from: public/content/oceansound/pam.md
 * Edit that markdown file to update this page's content.
 */
export const PassiveAcousticMonitoring: React.FC = () => {
  return <MarkdownPage contentPath="/content/oceansound/pam.md" />;
};
