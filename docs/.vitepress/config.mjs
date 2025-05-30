import { defineConfig } from 'vitepress'

export default defineConfig({
  // Site-level options
  title: 'Base',
  description: 'Documentation for Base opensource projects by BaseCode Inc.',
  lang: 'en-US',
  lastUpdated: true,
  ignoreDeadLinks: true, // Ignore dead links to allow build to complete
  // Theme-related options
  themeConfig: {
    // Logo in the nav bar
    logo: '/logo.svg',
    
    // Top navigation bar
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { 
        text: 'Projects',
        items: [
          { 
            text: 'Backend Frameworks',
            items: [
              { text: 'Base', link: '/projects/base/' },
              { text: 'BaseQL', link: '/projects/baseql/' },
              { text: 'Hex', link: '/projects/hex/' }
            ]
          },
          {
            text: 'Frontend Frameworks',
            items: [
              { text: 'BaseUX', link: '/projects/bux/' },
              { text: 'BaseUI Flutter', link: '/projects/baseui-flutter/' },
              { text: 'Vue3 Mindmap', link: '/projects/vue3-mindmap/' }
            ]
          },
          {
            text: 'Tools',
            items: [
              { text: 'Base CMD', link: '/projects/basecmd/' },
              { text: 'Base ORM', link: '/projects/baseorm/' },
              { text: 'BaseUI Flutter CMD', link: '/projects/baseui-flutter-cmd/' }
            ]
          }
        ]
      },
      { text: 'GitHub', link: 'https://github.com/BaseTechStack' }
    ],
    
    // Sidebar
    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          link: '/guide/'
        }
      ],
      '/projects/bux/': [
        {
          text: 'BaseUX',
          items: [
            { text: 'Overview', link: '/projects/bux/' },
            { text: 'Installation', link: '/projects/bux/installation' },
            { text: 'Getting Started', link: '/projects/bux/getting-started' },
            { text: 'Architecture', link: '/projects/bux/architecture' },
            { text: 'Module Features', link: '/projects/bux/module-features' },
            { text: 'Commands', link: '/projects/bux/commands' },
          ]
        },
        {
          text: 'Core Features',
          items: [
            { text: 'Components', link: '/projects/bux/core/components' },
            { text: 'Composables', link: '/projects/bux/core/composables' },
            { text: 'Entity Generation', link: '/projects/bux/core/entity-generation' },
            { text: 'Layouts', link: '/projects/bux/core/layouts' },
            { text: 'Middleware', link: '/projects/bux/core/middleware' },
            { text: 'Services', link: '/projects/bux/core/services' },
            { text: 'Stores', link: '/projects/bux/core/stores' },
            { text: 'Types', link: '/projects/bux/core/types' },
          ]
        }
      ],
      '/projects/basenuxt/': [
        {
          text: '⚠️ Important Notice',
          items: [
            { text: 'BaseNuxt Renamed to BaseUX', link: '/projects/basenuxt/name-change-notice' }
          ]
        },
        {
          text: 'BaseNuxt Documentation',
          items: [
            { text: 'Overview', link: '/projects/basenuxt/' },
            { text: 'Installation', link: '/projects/basenuxt/installation' },
            { text: 'Commands', link: '/projects/basenuxt/commands' }
          ]
        },
        {
          text: 'New BaseUX Documentation',
          items: [
            { text: 'Go to BaseUX Documentation', link: '/projects/bux/' }
          ]
        }
      ],
      '/projects/base/': [
        {
          text: 'Base',
          items: [
            { text: 'Overview', link: '/projects/base/' },
            { text: 'Getting Started', link: '/projects/base/getting-started' },
            { text: 'Features', link: '/projects/base/features' },
            { text: 'Directory Structure', link: '/projects/base/directory_structure' },
            { text: 'Authentication', link: '/projects/base/auth' },
            { text: 'Media Library', link: '/projects/base/media' },
            { text: 'WebSocket System', link: '/projects/base/ws' },
            { text: 'Core Components', items: [
              { text: 'App', link: '/projects/base/core/app' },
              { text: 'Storage', link: '/projects/base/core/storage' },
              { text: 'Events', link: '/projects/base/core/events' },
              { text: 'Email', link: '/projects/base/core/email' },
              { text: 'Logger', link: '/projects/base/core/logger' },
              { text: 'Middleware', link: '/projects/base/core/middleware' },
              { text: 'Database', link: '/projects/base/core/database' },
              { text: 'Configuration', link: '/projects/base/core/config' },
              { text: 'Helpers', link: '/projects/base/core/helpers' },
              { text: 'Types', link: '/projects/base/core/types' }
            ] }
          ]
        }
      ],
      '/projects/basecmd/': [
        {
          text: 'Base CMD',
          items: [
            { text: 'Overview', link: '/projects/basecmd/' },
            { text: 'Commands', link: '/projects/basecmd/commands' }
          ]
        }
      ],
      '/projects/baseql/': [
        {
          text: 'BaseQL',
          items: [
            { text: 'Overview', link: '/projects/baseql/' },
            { text: 'Schema Definition', link: '/projects/baseql/schema' },
            { text: 'Resolvers', link: '/projects/baseql/resolvers' }
          ]
        }
      ],
      '/projects/baseorm/': [
        {
          text: 'BaseORM',
          items: [
            { text: 'Overview', link: '/projects/baseorm/' },
            { text: 'Models', link: '/projects/baseorm/models' }
          ]
        }
      ],
      '/projects/baseui-flutter/': [
        {
          text: 'BaseUI Flutter',
          items: [
            { text: 'Overview', link: '/projects/baseui-flutter/' },
            { text: 'Components', link: '/projects/baseui-flutter/components' }
          ]
        }
      ],
      '/projects/hex/': [
        {
          text: 'Hex',
          items: [
            { text: 'Overview', link: '/projects/hex/' },
            { text: 'Hexagonal Architecture', link: '/projects/hex/architecture' }
          ]
        }
      ]
    },
    
    // Social links
    socialLinks: [
      { icon: 'github', link: 'https://github.com/BaseTechStack' },
      { icon: 'twitter', link: 'https://x.com/basecode' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/company/basecode-llc' },
      { icon: 'instagram', link: 'https://www.instagram.com/basecode.AL' },
      { icon: 'facebook', link: 'https://www.facebook.com/basecodeLLC' }
    ],
    
    // Footer
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present Base Tech Stack'
    },
    
    // Search
    search: {
      provider: 'local'
    }
  }
})