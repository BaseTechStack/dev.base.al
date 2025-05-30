---
title: Installation
---

# Installing BaseUX

This guide will walk you through the process of installing and setting up a new BaseUX project.

## Prerequisites

Before you begin, make sure you have the following installed:

- Node.js (v20.x or later recommended)
- Bun (recommended) or npm
- Git

## Installation

### macOS and Linux

```bash
curl -sSL https://raw.githubusercontent.com/BaseTechStack/bux/main/install.sh | bash
```

If you need to install in a protected directory (like `/usr/local/bin`), use:

```bash
curl -sSL https://raw.githubusercontent.com/BaseTechStack/bux/main/install.sh | sudo bash
```

### Windows

#### Option 1: Using PowerShell (Recommended)

1. Open PowerShell as Administrator
2. Run:

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://raw.githubusercontent.com/BaseTechStack/bux/main/install.ps1'))
```

#### Option 2: Using Git Bash

```bash
curl -sSL https://raw.githubusercontent.com/BaseTechStack/bux/main/install.sh | bash
```

## Creating Your First Project

After installing the BaseUX CLI, you can create a new project:

```bash
# Create a new project
bux new my-app

# Navigate to your new project
cd my-app

# Start the development server
bux s
```

Note: Once installed, the BaseUX CLI is accessible via the `bux` command and serves as both the command-line tool and source code for scaffolding.

## Project Structure

After installation, your BaseUX project will have the following structure:

```
my-app/
├── app/             # Core application code
│   ├── components/  # Global components
│   ├── composables/ # Global composables
│   ├── layouts/     # Application layouts
│   ├── pages/       # Application routes
│   ├── plugins/     # Nuxt plugins
│   ├── services/    # API services
│   ├── stores/      # Pinia stores
│   └── types/       # TypeScript types
├── structures/      # This is where generated entities will be stored
├── assets/          # Static assets
├── public/          # Public files
├── nuxt.config.ts   # Nuxt configuration
├── package.json     # Project dependencies
└── tsconfig.json    # TypeScript configuration
```

## Configuration

### Basic Configuration

The main configuration file is `nuxt.config.ts`. Here's an example of a basic configuration:

```typescript
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiUrl: process.env.NODE_ENV === 'production' 
        ? 'https://api.example.com/api'
        : (process.env.API_URL || 'http://localhost:8001/api')
    }
  },
  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@pinia/nuxt'
  ],
  extends: [], // Entity structures will be added here
  css: ['~/assets/css/main.css'],
})
```

### API Configuration

BaseUX uses environment variables for API configuration:

- In development: Set `API_URL` environment variable or use the default `http://localhost:8001/api`
- In production: The API URL defaults to `https://[your-project]-api.base.al/api`

You can create a `.env` file in your project root to set environment variables:

```
# .env
API_URL=http://localhost:8001/api
```

## Next Steps

After installation, you can:

1. [Generate your first entity](/projects/bux/commands.html#generating-entities)
2. [Explore the architecture](/projects/bux/architecture.html)
3. [Learn about available UI components](/projects/bux/ui-components.html)
