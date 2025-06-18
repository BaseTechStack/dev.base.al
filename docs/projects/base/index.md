---
title: Base Framework Overview
---

# Base Framework

Base is a modern Go web framework designed for rapid development and maintainable code. It provides a solid foundation for building robust, scalable, and maintainable web applications.

## What is Base?

Base is a Go framework that follows the Hierarchical Model-View-Controller (HMVC) pattern, with a focus on modularity, testability, and developer experience. It combines the best practices from popular frameworks with innovative features to accelerate your development workflow.

## Key Components

### Framework Core

The [Base Framework](./features) provides a robust set of features for building modern Go applications:

- **[Event-Driven Architecture](./core/events)**: Thread-safe event emitter for loose coupling between components
- **[Database Integration](./core/database)**: Seamless GORM integration with relationship modeling
- **[Authentication System](./auth)**: JWT token and API key authentication with fine-grained access control
- **[File Storage](./core/storage)**: ActiveStorage pattern with support for local and cloud storage
- **[Email Service](./core/email)**: Multi-provider email system with template support
- **[WebSocket Support](./ws)**: Real-time communication with channel management
- **[Media Library](./media)**: Comprehensive media management system

### Command Line Tool

The [Base CLI](./cmd) is a companion tool that supercharges your development workflow:

- **Project Scaffolding**: Create new projects with a single command
- **Code Generation**: Generate models, controllers, and services with proper relationships
- **Development Server**: Hot-reloading server for rapid iteration
- **API Documentation**: Automatic Swagger documentation generation

## Philosophy

Base is built on several key principles:

1. **Convention over Configuration**: Sensible defaults with the flexibility to customize
2. **Modularity**: Self-contained modules with clear separation of concerns
3. **Testability**: Design that facilitates unit and integration testing
4. **Developer Experience**: Tools and patterns that make development enjoyable
5. **Performance**: Optimized for high-performance applications

## Getting Started

To start using Base, install the CLI tool and create your first project:

```bash
# Install Base CLI
curl -sSL https://raw.githubusercontent.com/BaseTechStack/basecmd/main/install.sh | bash

# Create a new project
base new myapp
cd myapp

# Start the development server
base start -r
```

Visit [Command Line Tool](./cmd) for more detailed instructions.

## Project Structure

Base follows a modular architecture that promotes clean code organization. See the [Framework Features](./features) page for more details on the project structure.

## Documentation

For detailed documentation on Base features and usage, refer to:

- [Base Command Line Tool](./cmd): Documentation for the Base CLI, including project creation, code generation, and other commands.
- [Framework Features](./features): Detailed documentation on the framework's core features and components, including event system, storage, and Swagger integration.
- [Directory Structure](./directory_structure): Comprehensive guide to the Base project structure, organization, and best practices.
- [Authentication System](./auth): Complete guide to Base's authentication system, including user management, JWT tokens, OAuth integration, and security best practices.
- [Media Library](./media): Detailed documentation on Base's Media Library for application-wide storage of files and assets.
- [WebSocket System](./ws): Comprehensive guide to Base's WebSocket support for building real-time, interactive applications.

## Community and Support

- [GitHub Repository](https://github.com/BaseTechStack/base)
- [Issue Tracker](https://github.com/BaseTechStack/base/issues)
- [CLI Repository](https://github.com/BaseTechStack/basecmd)

## License

Base is licensed under the MIT License. See the LICENSE file for details.
 