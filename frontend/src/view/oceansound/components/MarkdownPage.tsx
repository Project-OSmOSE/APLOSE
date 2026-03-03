import React, { useState, useEffect } from 'react';
import { IonSpinner } from '@ionic/react';
import { Link } from 'react-router-dom';
import styles from '../styles.module.scss';

interface MarkdownPageProps {
  contentPath: string;
}

/**
 * MarkdownPage Component
 *
 * Loads and renders markdown content from public/content/oceansound/ folder.
 * Edit the markdown files directly to update page content.
 *
 * Supported markdown features:
 * - Headings (# ## ###)
 * - Paragraphs
 * - Bold (**text**) and Italic (*text*)
 * - Unordered lists (- item)
 * - Ordered lists (1. item)
 * - Links [text](url)
 * - Images ![alt](url)
 * - Blockquotes (> quote)
 * - Horizontal rules (---)
 */
export const MarkdownPage: React.FC<MarkdownPageProps> = ({ contentPath }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(contentPath);
        if (!response.ok) {
          throw new Error('Content not found');
        }
        const text = await response.text();
        setContent(text);
        setLoading(false);
      } catch (e) {
        console.error('Error loading content:', e);
        setError('Failed to load content');
        setLoading(false);
      }
    };

    loadContent();
  }, [contentPath]);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingContainer}>
          <IonSpinner />
          <p>Loading content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.emptyState}>
          <p>{error}</p>
          <p>Please check that the content file exists.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <article className={styles.markdownContent}>
        <MarkdownRenderer content={content} />
      </article>
    </div>
  );
};

/**
 * Simple markdown renderer
 * Converts markdown text to React elements
 */
const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;
  let blockquoteLines: string[] = [];
  let key = 0;

  const processInlineMarkdown = (text: string): React.ReactNode => {
    // Process images ![alt](url) and links [text](url) in a single pass
    const tokenRegex = /(!?\[([^\]]*)\]\(([^)]+)\))/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = tokenRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(processTextStyles(text.slice(lastIndex, match.index)));
      }

      const isImage = match[0].startsWith('!');
      const altOrText = match[2];
      const url = match[3];

      if (isImage) {
        parts.push(
          <img key={`img-${match.index}`} src={url} alt={altOrText} className={styles.markdownImage} />
        );
      } else if (url.startsWith('/')) {
        parts.push(
          <Link key={`link-${match.index}`} to={url} className={styles.inlineLink}>
            {altOrText}
          </Link>
        );
      } else {
        parts.push(
          <a key={`link-${match.index}`} href={url} target="_blank" rel="noopener noreferrer">
            {altOrText}
          </a>
        );
      }

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(processTextStyles(text.slice(lastIndex)));
    }

    return parts.length === 0 ? text : parts.length === 1 ? parts[0] : <>{parts}</>;
  };

  const processTextStyles = (text: string): React.ReactNode => {
    // Process bold and italic
    const parts: React.ReactNode[] = [];

    // Simple approach: split by ** for bold and * for italic
    const boldRegex = /\*\*([^*]+)\*\*/g;
    const italicRegex = /\*([^*]+)\*/g;

    let lastIndex = 0;
    let match;

    // Process bold first
    while ((match = boldRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      parts.push(<strong key={`bold-${match.index}`}>{match[1]}</strong>);
      lastIndex = match.index + match[0].length;
    }

    if (parts.length > 0) {
      if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
      }
      return <>{parts}</>;
    }

    // Process italic if no bold found
    lastIndex = 0;
    while ((match = italicRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      parts.push(<em key={`italic-${match.index}`}>{match[1]}</em>);
      lastIndex = match.index + match[0].length;
    }

    if (parts.length > 0) {
      if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
      }
      return <>{parts}</>;
    }

    return text;
  };

  const flushList = () => {
    if (currentList) {
      const ListTag = currentList.type === 'ul' ? 'ul' : 'ol';
      elements.push(
        <ListTag key={key++}>
          {currentList.items.map((item, i) => (
            <li key={i}>{processInlineMarkdown(item)}</li>
          ))}
        </ListTag>
      );
      currentList = null;
    }
  };

  const flushBlockquote = () => {
    if (blockquoteLines.length > 0) {
      elements.push(
        <blockquote key={key++} className={styles.citation}>
          {blockquoteLines.map((line, i) => (
            <p key={i}>{processInlineMarkdown(line)}</p>
          ))}
        </blockquote>
      );
      blockquoteLines = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Horizontal rule
    if (trimmedLine === '---' || trimmedLine === '***') {
      flushList();
      flushBlockquote();
      elements.push(<hr key={key++} />);
      continue;
    }

    // Headings
    if (trimmedLine.startsWith('# ')) {
      flushList();
      flushBlockquote();
      elements.push(<h1 key={key++}>{processInlineMarkdown(trimmedLine.slice(2))}</h1>);
      continue;
    }
    if (trimmedLine.startsWith('## ')) {
      flushList();
      flushBlockquote();
      elements.push(<h2 key={key++}>{processInlineMarkdown(trimmedLine.slice(3))}</h2>);
      continue;
    }
    if (trimmedLine.startsWith('### ')) {
      flushList();
      flushBlockquote();
      elements.push(<h3 key={key++}>{processInlineMarkdown(trimmedLine.slice(4))}</h3>);
      continue;
    }

    // Blockquote
    if (trimmedLine.startsWith('> ')) {
      flushList();
      blockquoteLines.push(trimmedLine.slice(2));
      continue;
    } else if (blockquoteLines.length > 0 && trimmedLine === '') {
      flushBlockquote();
      continue;
    }

    // Unordered list
    if (trimmedLine.startsWith('- ')) {
      flushBlockquote();
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(trimmedLine.slice(2));
      continue;
    }

    // Ordered list
    const orderedMatch = trimmedLine.match(/^(\d+)\. (.+)$/);
    if (orderedMatch) {
      flushBlockquote();
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(orderedMatch[2]);
      continue;
    }

    // Empty line ends lists
    if (trimmedLine === '') {
      flushList();
      flushBlockquote();
      continue;
    }

    // Regular paragraph
    flushList();
    flushBlockquote();
    elements.push(<p key={key++}>{processInlineMarkdown(trimmedLine)}</p>);
  }

  // Flush any remaining list or blockquote
  flushList();
  flushBlockquote();

  return <>{elements}</>;
};

export default MarkdownPage;
