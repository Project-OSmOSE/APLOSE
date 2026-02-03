import { Parser } from 'html-to-react';

export const getFormattedDate = (date?: string) => {
  if (!date) return;
  return Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
  }).format(new Date(date)).replaceAll('/', '-');
}

export const getYear = (date?: string) => {
  if (!date) return;
  return Intl.DateTimeFormat('en-US', {
    year: 'numeric',
  }).format(new Date(date));
}

export const parseHTML = (body: string) => {
  const pImgContainer: Array<string> | null = body.match(/<p([\s\w="]*?)>(<img([\w\W]+?)\/>)+<\/p>/g);
  if (!pImgContainer) return Parser().parse(body ?? '');
  for (const pContainer of pImgContainer) {
    const div = document.createElement('div');
    div.className = 'figure-container';
    const imgData: Array<string> | null = pContainer.match(/<img(.+?)\/>/g);
    if (!imgData) continue;
    for (const img of imgData) {
      const figure = getFigureFromImgHTML(img);
      if (!figure) continue;
      div.appendChild(figure);
    }
    body = body.replace(pContainer, div.outerHTML);
  }
  return Parser().parse(body ?? '');
}

export const getFigureFromImgHTML = (img: string): HTMLElement | undefined => {
  const figure = document.createElement('figure');
  figure.innerHTML = img;
  const imgTag = figure.children[0] as HTMLImageElement;
  if (!imgTag) return;

  if (imgTag.alt) {
    const caption = document.createElement('figcaption');
    caption.innerText = imgTag.alt;
    caption.className = 'text-muted';
    figure.appendChild(caption);
  }

  return figure;
}