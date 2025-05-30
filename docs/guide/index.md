---
title: Getting Started
---

# Getting Started with Base Dev Ecosystem

Welcome to the Base Dev documentation! This guide will help you understand how our ecosystem works together to accelerate your development process.

## The Base Ecosystem Architecture

Base Dev provides a comprehensive suite of frameworks and tools that work seamlessly together:

![Base Ecosystem](/images/base-ecosystem.png)

### Core Components

1. **Backend Framework (Base)**: Go-based API framework for building robust, scalable backends
2. **Frontend Framework (BaseUX)**: Vue/Nuxt.js-based framework for rapid UI development
3. **Mobile Framework (BaseUI Flutter)**: Flutter component library for consistent web / desktop experiences
4. **Tools & Utilities**: CLI tools for code generation and project management

## How the Ecosystem Works Together

### API Development with Base

Base is our core Go framework for building APIs. It provides:

- Rapid API development with convention-over-configuration patterns
- Built-in authentication, middleware, and database integration
- GraphQL support through BaseQL for flexible data queries
- RESTful API generation based on entity models

```bash
# Creating a new Base API project
base new myproject
```

### Frontend Development with BaseUX

BaseUX (formerly BaseNuxt) is our Vue/Nuxt.js framework that:

- Automatically connects to Base APIs
- Provides entity management with generated CRUD interfaces
- Includes a robust component library and store system
- Supports customizable layouts and middleware

```bash
# Creating a new BaseUX project
bux new myproject
```

### Mobile Development with BaseUI Flutter

BaseUI Flutter is our Flutter component library that:

- Provides consistent UI components matching web interfaces
- Includes multi-language support for global applications
- Offers CLI tools for rapid code generation
- Connects seamlessly to Base APIs

```bash
# Generating Flutter components
baseui new myproject
```

## Getting the Most from Base Dev

### Full-Stack Development Workflow

For maximum productivity, we recommend this workflow:

1. **Define your entities** in Base API first
2. **Generate corresponding frontends** with BaseUX 
3. **Create mobile interfaces** with BaseUI Flutter
4. **Customize as needed** while maintaining the core architecture

### Cross-Platform Consistency

The Base ecosystem ensures consistent experiences across platforms:

- **Shared entity models** between backend, web, and mobile
- **Consistent design language** across all platforms
- **Unified authentication** and authorization
- **Centralized business logic** in the API layer

### Development Acceleration

Our tools are designed to eliminate repetitive tasks:

- **Code generation** for entities across all platforms
- **Automatic CRUD operations** for all entities
- **Pre-built components** for common UI patterns
- **CLI tools** for rapid scaffolding
 

## Next Steps

Explore our detailed documentation for each component:

- [Base API Framework](/projects/base/)
- [BaseUX Framework](/projects/bux/)
- [BaseUI Flutter](/projects/baseui-flutter/)
- [CLI Tools](/projects/basecmd/)

Or continue with our [Installation Guide](/guide/installation) for detailed setup instructions.
