---
title: Getting Started
---

# Getting Started

To start using BaseUX, after installing the CLI tool and create your first project, you can start the development server with `bux s`. Your application will be available at `http://localhost:3000` by default.

### Project Structure

After creating a new project with `bux new my-app`, you'll have a complete application scaffold ready for development. Let's explore what you get out of the box.

```
my-app/
├── app/             # Core application code
│   ├── components/  # Global components
│   ├── composables/ # Global composables
│   ├── layouts/     # Application layouts
│   ├── middleware/  # Route middleware
│   ├── pages/       # Application routes
│   ├── plugins/     # Nuxt plugins
│   ├── services/    # API services
│   ├── stores/      # Pinia stores
│   └── types/       # TypeScript types
├── structures/      # Generated entity modules go here
├── assets/          # Static assets
├── public/          # Public files
├── nuxt.config.ts   # Nuxt configuration
└── package.json     # Project dependencies
```

### Starting Your Application

BaseUX provides a simple command to start your development server:

```bash
# Navigate to your project directory
cd my-app

# Start the development server
bux s
```

This is a shorthand for the `bux start` command, which starts the Nuxt development server. Your application will be available at `http://localhost:3000` by default.

### Authentication Integration

Your new project comes with authentication already configured to work with [Base](/projects/base/). The authentication system includes:

- Login and registration pages
- Auth middleware for protected routes
- User profile management
- Token handling and refresh logic

### Entity Generation

Now that your project is running, the next step is to generate your first entity. BaseUX's entity generation system is its most powerful feature, allowing you to create complete CRUD modules with a single command.

```bash
# Generate a posts entity
bux g posts title:string content:text publishedAt:datetime
```

This command creates:

1. **Structures Directory**: A new `structures/posts` directory containing all entity-related files
2. **Components**: Grid, table, and modal components for the entity
3. **Store**: A Pinia store for state management
4. **Services**: API service layer for communication with the backend
5. **Routes**: Automatically configured routes and pages
6. **Sidebar Navigation**: Automatic integration with the application sidebar

### Exploring Your Entity

After generating an entity, refresh your browser and navigate to the entity page (e.g., `/posts`). You'll see:

1. **Grid/Table View**: A complete UI for viewing and managing your entity
2. **CRUD Operations**: Add, edit, view, and delete functionality
3. **Search and Filtering**: Built-in search functionality
4. **Pagination**: Automatic pagination for large datasets

### API Integration

BaseUX works best with a [Base](/projects/base/) backend, but can be configured to work with any API:

1. **Environment Configuration**: Set your API URL in the `.env` file:
   ```
   API_URL=http://localhost:8001/api
   ```

2. **Service Configuration**: The generated services are pre-configured to work with RESTful APIs, following the Base API conventions.

3. **Authentication**: The authentication system is pre-configured to work with JWT tokens from a Base backend.

## Core Commands

### bux new &lt;project-name&gt;

Create a new Nuxt.js project with the BaseUX framework.

```bash
bux new myapp
```

### bux generate or bux g

Generate a new entity module with fields.

```bash
bux g <entity-name> [field:type ...] [options]
```

### bux start or bux s

Start the BaseUX application server.

**Options:**

- `--hot-reload`, `-r`: Enable hot reloading using air
- `--docs`, `-d`: Generate Swagger documentation

**Examples:**

```bash
# Start the server normally
bux start

# Start with hot reloading
bux start -r

# Start with Swagger documentation
bux start -d

# Start with both hot reloading and Swagger docs
bux start -r -d
```

### bux update

Update framework core components:

```bash
bux update
```

### bux upgrade

Upgrade the BaseUX CLI tool:

```bash
bux upgrade
```

### bux version

Display version information:

```bash
bux version
```

## Project Structure

BaseUX follows a modular architecture that promotes clean code organization, uses Nuxt 3 layers inside the structures folder:

```
my-app/
├── app/             # Core application code
│   ├── components/  # Global components
│   ├── composables/ # Global composables
│   ├── layouts/     # Application layouts
│   ├── middleware/  # Route middleware
│   ├── pages/       # Application routes
│   ├── plugins/     # Nuxt plugins
│   ├── services/    # API services
│   ├── stores/      # Pinia stores
│   └── types/       # TypeScript types
├── structures/      # Generated entity modules
│   └── posts/       # Example entity
│       ├── components/    # Entity-specific components
│       ├── composables/   # Entity-specific composables
│       ├── pages/         # Entity-specific pages
│       ├── services/      # Entity-specific services
│       ├── stores/        # Entity-specific stores
│       └── nuxt.config.ts # Entity layer configuration
├── assets/          # Static assets
├── public/          # Public files
├── nuxt.config.ts   # Nuxt configuration
└── package.json     # Project dependencies
```

## Key Features

### Entity Generation System

The entity generation system is a cornerstone of the BaseUX framework:

- **Complete Module Generation**: Creates all necessary files for full CRUD operations
- **Automatic Sidebar Integration**: Newly generated entities are automatically added to navigation
- **Type Safety**: Full TypeScript integration for type-safe development
- **Field Type Inference**: Appropriate input controls based on field types
- **Form Validation**: Built-in validation rules based on field types

### Advanced Store Pattern

BaseUX implements a sophisticated store pattern using Pinia:

- **Composition-Based Design**: Uses Pinia's defineStore with specialized entity methods
- **Integrated Entity Methods**: Entity-specific methods directly incorporated into the store object
- **Consistent Interface**: Components can use either generic methods (fetch, create) or entity-specific methods (fetchUsers, createUser)
- **UI State Management**: Handles view modes, pagination, and loading states

### Component System

The component system is designed for maximum reusability:

- **Flexible Prop Naming**: Components accept both entity-specific and generic props
- **Consistent Interfaces**: Standardized props and events across components
- **Responsive Design**: Mobile-first approach for all components
- **Slot-Based Customization**: Extensive slot system for component customization

### Complete Entity Lifecycle Management

BaseUX handles the complete lifecycle of entities:

- **Creation**: Generate all necessary files with a single command
- **Updates**: Preserve custom modifications while updating base structure
- **Destruction**: Clean removal including configuration and sidebar navigation

## Documentation

For detailed documentation on BaseUX features and usage, refer to:

- [Commands](./commands): Comprehensive reference for all BaseUX CLI commands
- [Installation](./installation): Detailed installation instructions for different environments
- [Architecture](./architecture): Overview of the BaseUX architecture and design principles

### Core Features

- [Entity Generation](./core/entity-generation): In-depth guide to the entity generation system
- [Components](./core/components): Documentation for the core UI components
- [Stores](./core/stores): Explanation of the Pinia store pattern
- [Services](./core/services): Guide to the service layer for API communication
- [Layouts](./core/layouts): Overview of the layout system
- [Middleware](./core/middleware): Documentation for route middleware
- [Types](./core/types): Reference for the TypeScript type system
- [Composables](./core/composables): Guide to framework composables

## Community and Support

- [GitHub Repository](https://github.com/BaseTechStack/bux)
- [Issue Tracker](https://github.com/BaseTechStack/bux/issues)

## License

BaseUX is licensed under the MIT License. See the LICENSE file for details.