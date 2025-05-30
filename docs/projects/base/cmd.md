---
title: Base Command Line Tool
---

# Base - Command Line Tool

Base CLI is a powerful command-line tool designed to streamline development with the Base framework. It offers scaffolding, module generation, and utilities to accelerate Go application development.

## Installation & Usage

Install Base CLI with a single command:

```bash
curl -sSL https://raw.githubusercontent.com/base-go/cmd/main/install.sh | bash
```

## Available Commands

```bash
# Create a new project
base new myapp

# Start development server with base start or base s for short
base start 
base s

# Start development server with hot reload and generate swagger docs
base s -d -r


# Generate modules with base generate command or base g for short
base g post title:string content:text published:bool

# Generate with relationships and attachments
base g post \
  title:string \
  content:text \
  featured_image:image \
  gallery:attachment \
  author:belongsTo:User \
  comments:hasMany:Comment

# Generate with specialized attachments
base g document \
  title:string \
  file:file          # Document attachment with validation
  author:belongsTo:User

# Remove modules with base destroy command or base d for short
base d post

# Update framework
base update   # Update Core directory to latest version
base upgrade  # Upgrade CLI to latest version

# Other commands
base version  # Show version information
```

## Create a New Project

```bash
# Create a new project
base new myapp
cd myapp

# Start the development server with hot reload
base start
```

Your API will be available at http://localhost:8080

## Configuration

Base uses environment variables for configuration. A .env file is automatically created with your new project:

```bash
SERVER_ADDRESS=:8080
JWT_SECRET=your_jwt_secret
API_KEY=your_api_key

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp
DB_USER=postgres
DB_PASSWORD=postgres

# Storage
STORAGE_DRIVER=local  # local, s3, r2
STORAGE_PATH=storage

# Email
MAIL_DRIVER=smtp     # smtp, sendgrid, postmark
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=username
MAIL_PASSWORD=password
```

## Project Structure

Base follows a modular architecture with a centralized models directory:

```
.
├── app/
│   ├── models/            # All models in one place
│   │   ├── post.go       # Post model with GORM tags
│   │   ├── user.go       # User model
│   │   └── comment.go    # Comment model
│   ├── posts/            # Post module
│   │   ├── controller.go # HTTP handlers & file upload
│   │   ├── service.go    # Business logic & storage
│   │   └── module.go     # Module registration
│   ├── users/            # User module
│   │   ├── controller.go
│   │   ├── service.go
│   │   └── module.go
│   └── init.go           # Module initialization
├── core/                 # Framework core
│   ├── storage/         # File storage system
│   ├── logger/          # Structured logging
│   └── emitter/         # Event system
├── storage/              # File storage directory
├── .env                  # Environment config
└── main.go              # Entry point
```

## Module Generation

When you generate a new module:

```bash
# Generate a post module
base g post title:string content:text

# Creates:
app/
├── models/
│   └── post.go         # Post model with GORM tags
└── posts/              # Post module
    ├── controller.go   # HTTP handlers & validation
    ├── service.go      # Business logic
    └── module.go       # Module registration
```

## Field Types

Base supports various field types for model generation:

### Basic Types:

- `string`: String field
- `int`: Integer field
- `bool`: Boolean field
- `float`: Float field
- `text`: Text field (for longer strings)

### Special Types:

- `image`: Image attachment with validation (5MB limit, image extensions)
- `file`: File attachment with validation (50MB limit, document extensions)
- `attachment`: Generic attachment (10MB limit, mixed extensions)
- `time`: Time field
- `date`: Date field
- `datetime`: DateTime field

### Relationship Types:

- `belongs_to`: One-to-one relationship (with foreign key in this model)
- `has_one`: One-to-one relationship (with foreign key in the other model)
- `has_many`: One-to-many relationship

## Example: Building a Blog System

Here's a comprehensive example of building a blog system with categories, posts, tags, and comments:

```bash
# Generate Category model
base g Category \
  name:string \
  description:text \
  image:attachment \
  parent:belongsTo:Category \
  posts:hasMany:Post

# Generate Post model
base g Post \
  title:string \
  content:text \
  excerpt:text \
  featured_image:attachment \
  gallery:attachment \
  published_at:datetime \
  author:belongsTo:users.User \
  category:belongsTo:Category \
  comments:hasMany:Comment

# Generate Tag model
base g Tag \
  name:string \
  slug:string

# Generate Comment model
base g Comment \
  content:text \
  author:belongsTo:users.User \
  post:belongsTo:Post
```

This will create:

- Full CRUD operations for all models
- RESTful API endpoints with Swagger documentation
- File upload handling for images
- Proper relationships and preloading
- Authentication and authorization integration

## License

Base CLI is licensed under the MIT License. See the LICENSE file for details.

## Links

- [GitHub Repository](https://github.com/BaseTechStack/cmd)
- [Base Framework](./index)
