import React from 'react';
import Layout from '@theme/Layout';
import ReadingListContent from '@site/src/data/reading-list.mdx';

import styles from './styles.module.css';

export default function ReadingListPage(): JSX.Element {
  return (
    <Layout
      title="Reading List"
      description="Books, essays, posts, and guides Oreo is reading or has finished.">
      <main className={styles.page}>
        <header className={styles.pageHeader}>
          <h1>Reading List</h1>
          <p>Here are the books and articles I’m reading or have finished.</p>
        </header>
        <div className={styles.shelves}>
          <ReadingListContent />
        </div>
      </main>
    </Layout>
  );
}
