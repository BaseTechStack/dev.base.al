import { defineConfig } from 'vitepress'

export default defineConfig({
  // Site-level options
  title: 'Base Tech Stack',
  description: 'Documentation for BaseTechStack opensource projects',
  lang: 'en-US',
  lastUpdated: true,
  ignoreDeadLinks: true, // Ignore dead links to allow build to complete
  markdown: {
    lineNumbers: true,
    'env': 'production',
  },
  // Theme-related options
  themeConfig: {
    // Logo in the nav bar
    logo: '/logo.png',
    
    // Top navigation bar
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { 
        text: 'Projects', 
        items: [
          { text: 'BaseUX', link: '/projects/bux/' },
          { text: 'Base', link: '/projects/base/' },
          { text: 'Base CMD', link: '/projects/basecmd/' },
          { text: 'BaseQL', link: '/projects/baseql/' },
          { text: 'BaseORM', link: '/projects/baseorm/' },
          { text: 'BaseUI Flutter', link: '/projects/baseui-flutter/' },
          { text: 'BaseUI Flutter CMD', link: '/projects/baseui-flutter-cmd/' },
          { text: 'Hex', link: '/projects/hex/' },
          { text: 'Vue3 Mindmap', link: '/projects/vue3-mindmap/' }
        ]
      },
      { text: 'GitHub', link: 'https://github.com/BaseTechStack' }
    ],
    
    // Sidebar
    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'Getting Started', link: '/guide/' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Configuration', link: '/guide/configuration' }
          ]
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
      '/projects/baseui-flutter-cmd/': [
        {
          text: 'BaseUI Flutter CMD',
          items: [
            { text: 'Overview', link: '/projects/baseui-flutter-cmd/' },
            { text: 'Commands', link: '/projects/baseui-flutter-cmd/commands' }
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
      ],
      '/projects/vue3-mindmap/': [
        {
          text: 'Vue3 Mindmap',
          items: [
            { text: 'Overview', link: '/projects/vue3-mindmap/' },
            { text: 'Usage', link: '/projects/vue3-mindmap/usage' }
          ]
        }
      ]
    },
    
    // Social links
    socialLinks: [
      { icon: 'github', link: 'https://github.com/BaseTechStack' }
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
