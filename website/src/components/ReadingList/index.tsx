import React, {type ReactNode, useState} from 'react';
import Link from '@docusaurus/Link';

import styles from '@site/src/pages/reading-list/styles.module.css';

type CoverStyle = 'moss' | 'ink' | 'clay' | 'sand';

type ReadingShelfProps = {
  children: ReactNode;
  id: string;
  title: string;
};

type ReadingItemProps = {
  author: string;
  cover?: CoverStyle;
  finishedOn?: string;
  href: string;
  isbn?: string;
  notesHref?: string;
  summary: string;
  title: string;
  topic: string;
  type: 'Book' | 'Essay' | 'Post' | 'Guide';
};

function formatFinishedDate(value: string) {
  const [year, month] = value.split('-').map(Number);

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1)));
}

export function ReadingShelf({children, id, title}: ReadingShelfProps) {
  return (
    <section className={styles.shelfSection} aria-labelledby={id}>
      <h2 id={id}>{title}</h2>
      <div className={styles.grid}>{children}</div>
    </section>
  );
}

export function ReadingItem({
  author,
  cover = 'moss',
  finishedOn,
  href,
  isbn,
  notesHref,
  summary,
  title,
  topic,
  type,
}: ReadingItemProps) {
  const [coverFailed, setCoverFailed] = useState(false);
  const destination = notesHref ?? href;
  const coverImage =
    isbn && !coverFailed
      ? `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`
      : null;

  return (
    <Link className={styles.card} to={destination}>
      <div
        className={`${styles.cover} ${styles[cover]} ${
          coverImage ? styles.hasCoverImage : ''
        }`}>
        {coverImage ? (
          <img
            className={styles.coverImage}
            src={coverImage}
            alt={`Cover of ${title}`}
            loading="lazy"
            onError={() => setCoverFailed(true)}
          />
        ) : (
          <div className={styles.decorativeCover} aria-hidden="true">
            <span className={styles.coverTopic}>{topic}</span>
            <span className={styles.coverTitle}>{title}</span>
            <span className={styles.coverRule} />
          </div>
        )}
      </div>
      <div className={styles.cardCopy}>
        <div className={styles.cardMeta}>
          <span className={styles.topic}>{topic}</span>
          <span className={styles.contentType}>{type}</span>
        </div>
        <h3>{title}</h3>
        <p className={styles.author}>{author}</p>
        {finishedOn && (
          <time className={styles.finishedDate} dateTime={finishedOn}>
            Finished {formatFinishedDate(finishedOn)}
          </time>
        )}
        <p className={styles.summary}>{summary}</p>
        <span className={styles.readNote}>
          {notesHref ? 'View notes' : 'View source'}{' '}
          <span aria-hidden="true">{notesHref ? '→' : '↗'}</span>
        </span>
      </div>
    </Link>
  );
}
