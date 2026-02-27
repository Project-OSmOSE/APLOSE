import React from 'react';
import { MarkdownPage } from '../components/MarkdownPage';

/**
 * Landing Page (Home)
 *
 * Content is loaded from: public/content/oceansound/home.md
 * Edit that markdown file to update this page's content.
 */
export const LandingPage: React.FC = () => {
  return <MarkdownPage contentPath="/content/oceansound/home.md" />;
};
