import React from 'react';
import { MarkdownPage } from '../oceansound/components/MarkdownPage';

/**
 * Documentation Page
 *
 * Content is loaded from: public/content/aplose/documentation.md
 * Edit that markdown file to update this page's content.
 */
export const DocumentationPage: React.FC = () => {
  return <MarkdownPage contentPath="/content/aplose/documentation.md" />;
};

export default DocumentationPage;
