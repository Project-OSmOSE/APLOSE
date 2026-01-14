import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
// https://vitepress.dev/reference/default-theme-config
// https://vitepress.dev/reference/default-theme-sidebar
export default defineConfig({
  title: 'APLOSE',
  description: 'A web-based annotation plateform developed by and for Marine Passive Acoustic Monitoring researchers',
  cleanUrls: true,
  lastUpdated: true,

  locales: {
    root: {
      label: 'English',
      lang: 'en',
      themeConfig: {
        nav: [
          { text: 'User', link: '/user' },
          { text: 'Developer', link: '/dev/docker' },
          { text: 'Changelog', link: 'https://github.com/Project-OSmOSE/osmose-app/releases', target: '_blank' },
          { text: 'OSmOSE', link: 'https://osmose.ifremer.fr/', target: '_blank' },
        ],
        sidebar: {
          '/user': {
            base: '/user',
            items: [
              { text: 'Start using APLOSE', link: '/' },
              { text: 'Manage your account', link: '/account' },
              {
                text: 'Data',
                base: '/user/data',
                collapsed: true,
                items: [
                  { text: 'Generate a dataset', link: '/generate' },
                  { text: 'Import a dataset', link: '/import' },
                  { text: 'Manage a dataset', link: '/manage' },
                ],
              },
              {
                text: 'Annotation Campaign',
                base: '/user/annotation-campaign',
                items: [
                  { text: 'All campaigns', link: '/all' },
                  { text: 'Campaign detail', link: '/detail' },
                  { text: 'Phase detail', link: '/phase-detail' },
                  { text: 'Phase progress and results', link: '/phase-progress-result' },
                  {
                    text: 'Manage',
                    collapsed: true,
                    items: [
                      { text: 'Create a campaign', link: '/create' },
                      { text: 'Add an "Annotation" phase', link: '/add-annotation-phase' },
                      { text: 'Add a "Verification" phase', link: '/add-verification-phase' },
                      { text: 'Manage annotators', link: '/manage-annotators' },
                      { text: 'Import annotations', link: '/import-annotations' },
                    ],
                  },
                ],
              },
              {
                text: 'Annotation',
                base: '/user/annotation',
                items: [
                  { text: 'Overview', link: '/overview' },
                  { text: 'Annotate', link: '/annotate' },

                ],
              },
              {
                text: 'Administrator',
                base: '/user/administrator',
                collapsed: true,
                items: [
                  { text: 'Overview', link: '/overview' },
                  { text: 'User management', link: '/manage-users' },
                ],
              },
              { text: 'Terminology', link: '/terminology' },
              { text: 'FAQ', link: '/faq' },
            ],
          },
          '/dev': [
            {
              text: 'Developer',
              items: [
                { text: 'Local installation', link: '/dev/local' },
                { text: 'Docker installation', link: '/dev/docker' },
              ],
            },
          ],
        },
      },
    },
    fr: {
      label: 'Français',
      lang: 'fr',
      themeConfig: {
        nav: [
          { text: 'Utilisateur', link: '/fr/user' },
          { text: 'Developer', link: '/dev/docker' },
          { text: 'Changelog', link: 'https://github.com/Project-OSmOSE/osmose-app/releases', target: '_blank' },
          { text: 'OSmOSE', link: 'https://osmose.ifremer.fr/', target: '_blank' },
        ],
        sidebar: {
          'fr/user': {
            base: '/fr/user',
            items: [
              { text: 'Commencer à utiliser APLOSE', link: '/' },
              { text: 'Gérer votre compte', link: '/account' },
              {
                text: 'Données',
                base: '/fr/user/data',
                collapsed: true,
                items: [
                  { text: 'Générer un dataset', link: '/generate' },
                  { text: 'Importer un dataset', link: '/import' },
                  { text: 'Gérer un dataset', link: '/manage' },
                ],
              },
              {
                text: 'Campagnes d\'annotation',
                base: '/fr/user/annotation-campaign',
                items: [
                  { text: 'Liste des campagnes', link: '/all' },
                  { text: 'Détail d\'une campagne', link: '/detail' },
                  { text: 'Détail d\'une phase', link: '/phase-detail' },
                  { text: 'Progression et résultats', link: '/phase-progress-result' },
                  {
                    text: 'Gestion',
                    collapsed: true,
                    items: [
                      { text: 'Créer une campagne', link: '/create' },
                      { text: 'Ajouter une phase d\'"Annotation"', link: '/add-annotation-phase' },
                      { text: 'Ajouter une phase de "Verification"', link: '/add-verification-phase' },
                      { text: 'Gérer les annotateurs', link: '/manage-annotators' },
                      { text: 'Importer des annotations', link: '/import-annotations' },
                    ],
                  },
                ],
              },
              {
                text: 'Annotation',
                base: '/fr/user/annotation',
                items: [
                  { text: 'Présentation', link: '/overview' },
                  { text: 'Annoter', link: '/annotate' },
                ],
              },
              {
                text: 'Administrator',
                base: '/fr/user/administrator',
                collapsed: true,
                items: [
                  { text: 'Présentation', link: '/overview' },
                  { text: 'Gestion des utilisateurs', link: '/manage-users' },
                ],
              },


              { text: 'Terminologie', link: '/terminology' },
              { text: 'FAQ', link: '/faq' },
            ],
          },
        },
      },
    },
  },

  themeConfig: {
    logo: '/logo.png',
    outline: 'deep',
    // https://vitepress.dev/reference/default-theme-config
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Project-OSmOSE/osmose-app' },
    ],
    search: {
      provider: 'local',
      options: {
        locales: {
          fr: {
            translations: {
              button: {
                buttonText: 'Rechercher',
              },
              modal: {
                noResultsText: 'Pas de résultats pour',
                footer: {
                  navigateText: 'pour naviguer',
                  selectText: 'pour sélectionner',
                  closeText: 'pour fermer',
                },
              },
            },
          },
        },
      },
    },
  },
  markdown: {
    image: {
      lazyLoading: true,
    },
  },
})
