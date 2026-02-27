import React from 'react';
import { MarkdownPage } from '../components/MarkdownPage';

/**
 * Publications Page
 *
 * Content is loaded from: public/content/oceansound/publications.md
 * Edit that markdown file to update this page's content.
 */
export const Publications: React.FC = () => {
  return <MarkdownPage contentPath="/content/oceansound/publications.md" />;
};
