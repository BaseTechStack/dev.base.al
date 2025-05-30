import { defineConfig } from 'vitepress'

export default defineConfig({
  // Site-level options
  title: 'Base Tech Stack',
  description: 'Documentation for BaseTechStack opensource projects',
  lang: 'en-US',
  lastUpdated: true,
  
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
          { text: 'BaseNuxt', link: '/projects/basenuxt/' },
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
      '/projects/basenuxt/': [
        {
          text: 'BaseNuxt',
          items: [
            { text: 'Overview', link: '/projects/basenuxt/' },
            { text: 'Store Pattern', link: '/projects/basenuxt/store-pattern' },
            { text: 'Entity Generation', link: '/projects/basenuxt/entity-generation' },
            { text: 'Sidebar Navigation', link: '/projects/basenuxt/sidebar-navigation' }
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
