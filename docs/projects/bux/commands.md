---
title: Commands
---

# BaseUX Commands

BaseUX provides a powerful command-line interface (CLI) to streamline your development workflow. This guide covers all available commands, with special focus on the entity generation system.

## Command Overview

BaseUX CLI provides the following commands:

| Command | Description |
|---------|-------------|
| `bux new <project-name>` | Create a new BaseUX project |
| `bux g entity <entity-name> [fields]` | Generate a new entity with CRUD operations |
| `bux start` or `bux s` | Start the BaseUX application server |
| `bux update` | Update framework core components |
| `bux upgrade` | Upgrade the BaseUX CLI tool |
| `bux version` | Display version information |

Once installed, the BaseUX CLI is accessible via the `bux` command globally and provides all the functionality needed for project scaffolding and development.

## Creating a New Project

To create a new BaseUX project:

```bash
bux new my-app
```

This command:
1. Creates a new project directory
2. Installs all necessary dependencies
3. Sets up the initial project structure
4. Initializes Git repository

## Start Application Server

BaseUX provides a command to start the application server:

```bash
bux start
# or the shorthand
bux s
```

### Options:

- `--hot-reload`, `-r`: Enable hot reloading using air
- `--docs`, `-d`: Generate Swagger documentation??

### Examples:

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

## Entity Generation

The entity generation system is one of BaseUX's most powerful features. It creates a complete set of files for managing a data entity with full CRUD operations.

### Basic Entity Generation

```bash
bux g posts title:string content:text publishedAt:datetime
```

This command generates:

1. A complete entity structure in `structures/posts/`
2. TypeScript models with validation
3. API services for CRUD operations
4. Pinia store for state management
5. UI components (grid, table, modals)
6. Pages for listing and detail views

### Available Field Types

When defining entity fields, you can use the following types:

| Type | Description | Example |
|------|-------------|---------|
| `string` | Text field | `title:string` |
| `text` | Longer text field | `content:text` |
| `number` | Numeric field | `count:number` |
| `boolean` | True/false field | `isPublished:boolean` |
| `date` | Date field | `createdAt:date` |
| `datetime` | Date with time | `publishedAt:datetime` |
| `email` | Email field | `contact:email` |
| `password` | Password field | `password:password` |
| `url` | URL field | `website:url` |
| `select` | Dropdown selection | `status:select:draft,published,archived` |
| `relation` | Entity relation | `author:relation:users` |

### Field Options

You can add options to fields using the following syntax:

```bash
fieldName:type:option1,option2
```

Common options include:

- `required`: Field is required
- `unique`: Field must be unique
- `min:X`: Minimum value/length
- `max:X`: Maximum value/length
- `default:X`: Default value

Example:

```bash
bux g entity products name:string:required,min:3 price:number:required,min:0 category:select:electronics,clothing,food:default:electronics
```

### Relation Fields

To create relations between entities:

```bash
bux g entity comments content:text:required post:relation:posts user:relation:users
```

This creates a comments entity with relations to both posts and users entities.

## Component Generation

Generate a new component:

```bash
bux g component UserProfile
```

This creates:
- `app/components/UserProfile.vue`

## Composable Generation

Generate a custom composable:

```bash
bux g composable useAuth
```

This creates:
- `app/composables/useAuth.ts`

## Service Generation

Generate a new service:

```bash
bux g service notification
```

This creates:
- `app/services/notificationService.ts`

## Store Generation

Generate a new Pinia store:

```bash
bux g store settings
```

This creates:
- `app/stores/settingsStore.ts`

## Running Your Project

After generating entities, you can run your project using the `bux run` command, which executes `bun run <subcommand>` for any subcommand:

```bash
# Start the development server
bux run dev

# Build for production
bux run build

# Generate static files
bux run generate

# Start the production server
bux run preview
```

This approach is more straightforward and flexible, as it works with any script defined in your package.json file.

You can also use Bun directly if you prefer:

```bash
bun run dev
bun run build
bun run generate
bun run preview
```

Note: BaseUX provides both scaffolding tools and convenient wrappers around common development commands.

## Update Framework Components

To update the framework core components:

```bash
bux update
```

This command updates the core components of your BaseUX application without affecting your custom code.

## Upgrade CLI Tool

To upgrade the BaseUX CLI tool itself:

```bash
bux upgrade
```

This ensures you have the latest version of the BaseUX command-line interface.

## Version Information

To display version information about your BaseUX installation:

```bash
bux version
```

This shows the current version of the BaseUX CLI and its components.

## Advanced Usage

### Custom Templates

BaseUX allows you to create custom templates for generation:

1. Create a `templates` directory in your project
2. Add template files with the `.tmpl` extension
3. Use the `--template` flag to specify your custom template

```bash
bux g  product 
```

### Extending Entities

You can extend existing entities:

```bash
bux g entity products --extend
```

This will preserve your custom modifications while updating the base structure.
