// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
export default {
  title: 'On my way to Oodi',
  tagline: '"Siempre imaginé que el paraíso sería algún tipo de biblioteca"',
  url: 'https://oreo.life',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenAnchors: 'warn',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/logo.png',
  stylesheets: [
      {
          href: "https://unpkg.com/@antonz/codapi@0.12.0/dist/snippet.css",
      },
  ],
  scripts: [
    {
      src: 'https://platform.twitter.com/widgets.js',
      async: true,
    },
    {
      src: 'https://umm.oreo.life/juicy.js',
      async: true,
      'data-website-id': '7a07d44e-77c0-43c5-aaa3-5071404be998'
    },
    {
      src: "https://unpkg.com/@antonz/codapi@0.12.0/dist/snippet.js",
      defer: true,
    },
    {
      src: "https://unpkg.com/@antonz/runno@0.6.1/dist/runno.js",
      defer: true,
    },
    {
      src: "https://unpkg.com/@antonz/codapi@0.12.0/dist/engine/wasi.js",
      defer: true,
    }
  ],

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'Oreoxmt', // Usually your GitHub org/user name.
  projectName: 'oreo.life-v2', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans', 'en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
              'https://github.com/Oreoxmt/oreo.life-v2',
        },
        blog: {
          blogTitle: "Oreo's blog",
          postsPerPage: 'ALL',
          blogSidebarCount: 'ALL',
          showReadingTime: true,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        gtag: {
          trackingID: 'G-HCWG2900CK',
          anonymizeIP: true,
        }
      }),
    ],
  ],

  themeConfig:
  /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
      ({
        /*announcementBar: {
          id: 'support-us',
          content: 'Star me on <a target="_blank" rel="noopener noreferrer" href="https://github.com/Oreoxmt">GitHub</a>!',
          backgroundColor: '#fafafa',
          textColor: '#333',
          isCloseable: true,
        },*/
        navbar: {
          title: 'Oreo\'s way to Oodi',
          hideOnScroll: true,
          logo: {
            alt: 'Oreo',
            src: 'img/logo.png',
          },
          items: [
            {
              type: 'search',
              position: 'left',
            },
            {
              type: 'localeDropdown',
              position: 'right',
            },
            {
              type: 'doc',
              docId: 'intro',
              position: 'right',
              label: 'Notes',
            },
            {
              to: '/blog',
              label: 'Blog',
              position: 'right'
            },
            {
              href: 'https://github.com/Oreoxmt',
              label: 'GitHub',
              position: 'right',
            },
          ],
        },
        footer: {
          style: 'dark',
          /*links: [
            {
              title: 'Notes',
              items: [
                {
                  label: 'Tutorial',
                  to: '/docs/intro',
                },
              ],
            },
            {
              title: 'Tools',
              items: [
                {
                  label: 'Docusaurus',
                  href: 'https://github.com/docusaurus',
                },
              ],
            },
            {
              title: 'More',
              items: [
                {
                  label: 'Blog',
                  to: '/blog',
                },
                {
                  label: 'GitHub',
                  href: 'https://github.com/Oreoxmt',
                },
              ],
            },
          ],*/
          copyright: `Copyright © ${new Date().getFullYear()} Oreo. Built with Docusaurus.`,
        },
        prism: {
          theme: prismThemes.github,
          darkTheme: prismThemes.dracula,
          additionalLanguages: [
            'bash',
            'cmake',
            'diff',
            'docker',
            'ini',
            'javascript',
            'json',
            'python',
            'rust',
            'shell-session'
          ],
        },
        colorMode: {
          respectPrefersColorScheme: true,
        },
        algolia: {
          appId: '3EPKB2DNI5',
          apiKey: '3d350d4d4294747e2f651af8dba69e01',
          indexName: 'oreo',
          contextualSearch: true,
        },
        docs: {
          sidebar: {
            hideable: true, // make the entire sidebar hideable
            autoCollapseCategories: true, // auto collapse categories
          }
        },
      }),
};
