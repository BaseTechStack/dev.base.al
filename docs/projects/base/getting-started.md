---
title: Getting Started with Base
---

# Getting Started with Base

This guide will help you get started with the Base framework, a powerful Go framework for building web applications, APIs, and services. Base provides a command-line tool that simplifies project creation and management.

## Prerequisites

Before you begin, make sure you have the following installed:

- Go 1.21 or newer
- Git
- MySQL, PostgreSQL, or SQLite (depending on your preference)

## Installing the Base CLI

Base provides a command-line interface (CLI) tool that makes it easy to create and manage projects. Install it with a single command:

```bash
curl -sSL https://raw.githubusercontent.com/base-go/cmd/main/install.sh | bash
```

This will download and install the Base CLI globally on your system.

## Creating a New Project

To create a new Base project, use the `new` command:

```bash
base new myapp
cd myapp
```

This command:
1. Creates a new directory with your project name
2. Initializes a Go module
3. Sets up the Base framework structure
4. Creates necessary configuration files
5. Initializes Git repository

## Project Structure

After creating a project, you'll have a directory structure like this:

```
├── app/                  # Application code
│   ├── models/           # Domain models
│   ├── {modules}/        # Feature modules (posts, users, etc.)
│   └── init.go           # Module initialization
├── core/                 # Framework core components
├── docs/                 # API documentation (Swagger)
├── logs/                 # Application logs
├── static/               # Static files
├── storage/              # File storage
├── .air.toml             # Air configuration for hot reload
├── .env                  # Environment variables
├── .env.sample           # Sample environment variables
├── Dockerfile            # Docker configuration
├── go.mod                # Go module definition
├── go.sum                # Go module checksums
└── main.go              # Application entry point
```
Refer to the [Directory Structure](./directory_structure.md) for more details.

## Configuration

Base CLI creates a `.env` file in your project root with your configuration:

```env
# Server configuration
SERVER_ADDRESS=:8080
APPHOST=http://localhost
ENV=development

# Database configuration (choose one)
# For SQLite
DB_DRIVER=sqlite
DB_PATH=database.db

# For MySQL
# DB_DRIVER=mysql
# DB_USER=root
# DB_PASSWORD=password
# DB_HOST=localhost
# DB_PORT=3306
# DB_NAME=myapp

# For PostgreSQL
# DB_DRIVER=postgres
# DB_USER=postgres
# DB_PASSWORD=password
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=myapp

# Security
JWT_SECRET=your-jwt-secret-key
API_KEY=your-api-key

# Email configuration (optional)
EMAIL_PROVIDER=smtp
EMAIL_FROM_ADDRESS=noreply@example.com
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USERNAME=your-username
SMTP_PASSWORD=your-password

# Storage configuration
STORAGE_PROVIDER=local
STORAGE_PATH=storage/uploads
```

### Running Your Application

Base CLI provides a development server with hot reload capabilities:

```bash
base start
```

Refer to the [Commands](./cmd.md) for more details.

Your Base application should now be running at http://localhost:8080! The server will automatically restart when you make changes to your code.

## Project Structure

When you create a new project with Base CLI, it generates the following structure:

```
.
├── app/
│   ├── models/            # All models in one place
│   │   ├── user.go        # User model (pre-generated)
│   ├── users/             # User module
│   │   ├── controller.go  # HTTP handlers & authentication
│   │   ├── service.go     # Business logic & validation
│   │   └── module.go      # Module registration
│   └── init.go            # Module initialization
├── core/                  # Framework core
│   ├── storage/           # File storage system
│   ├── logger/            # Structured logging
│   └── emitter/           # Event system
├── storage/               # File storage directory
├── .env                   # Environment configuration
├── go.mod                 # Go module file
├── go.sum                 # Go dependencies checksum
└── main.go                # Entry point
```

This structure follows a modular architecture with a centralized models directory, making it easy to manage relationships between entities.

## Generating Modules with Base CLI

Base CLI makes it easy to generate new modules and resources for your application. The generator creates all necessary files, migrations, and routes with a single command.

### Generate a Simple Module

To generate a new module, use the `g` (generate) command followed by the module name and its fields:

```bash
base g product name:string description:text price:float active:bool
```

This command will:
1. Create a new module for products
2. Generate model with the specified fields
3. Create database migrations
4. Set up REST API routes
5. Generate controller with CRUD operations

### Generate with Relationships

You can specify relationships between models:

```bash
base g product \
  name:string \
  description:text \
  price:float \
  category:belongsTo:Category \
  reviews:hasMany:Review
```

This will create a product model with appropriate relationships to categories and reviews.

### Generate with File Attachments

You can include file attachments in your models:

```bash
base g product \
  name:string \
  description:text \
  price:float \
  image:image \
  gallery:attachment \
  documents:hasMany:Document
```

This will create a product model with image and file attachment support.

### Available Field Types

- Basic types: `string`, `text`, `int`, `float`, `bool`, `date`, `datetime`, `json`
- Relationship types: `belongsTo`, `hasOne`, `hasMany`, `manyToMany`
- File types: `image`, `file`, `attachment`

### Module Structure

When you generate a module, Base creates the following structure:

```
modules/
└── products/
    ├── models/
    │   └── product.go      # Data model
    ├── controllers/
    │   └── product.go      # Controller with CRUD operations
    ├── routes/
    │   └── routes.go       # Route definitions
    ├── migrations/
    │   └── product.go      # Database migrations
    └── module.go           # Module initialization
```

### Customizing Generated Code

After generating a module, you can customize any of the generated files to add business logic, validation, or additional endpoints as needed.

```go
// Example of customizing a controller method in modules/products/controllers/product.go

func (c *ProductController) Create(ctx *gin.Context) {
    var product models.Product
    if err := ctx.ShouldBindJSON(&product); err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    
    // Add custom validation
    if product.Price <= 0 {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": "Price must be greater than zero"})
        return
    }
    
    // Save the product
    if err := c.DB.Create(&product).Error; err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    
    ctx.JSON(http.StatusCreated, product)
}
```

## Basic API Usage Examples

### Authentication

#### User Registration

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

#### User Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

Response:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Using Protected Routes

Use the JWT token in the Authorization header:

```http
GET /api/users/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Using Base's Core Features

### File Upload with Media Library

```http
POST /api/media/upload
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: multipart/form-data

file: [binary data]
```

### Working with Events

```go
// Subscribe to events
core.Emitter.On("user.created", func(data interface{}) {
    user, ok := data.(*models.User)
    if !ok {
        return
    }
    
    log.Printf("New user created: %s", user.Email)
})

// Emit events
core.Emitter.Emit("user.created", user)
```

## Removing Modules

If you need to remove a module, use the `d` (destroy) command:

```bash
base d product
```

This command will:
1. Remove the module files (models, controllers, etc.)
2. Create migration to drop the associated database table
3. Clean up any references to the module

## Updating Base Framework

Base CLI provides commands to update the framework:

```bash
# Update framework dependencies
base update

# Upgrade to the latest version
base upgrade
```

## Checking Version

To check your current Base version:

```bash
base version
```

## Next Steps

Now that you have a basic Base application running, you can:

1. Explore the [Core Components](./core/app.md) to understand the architecture
2. Learn about the [Authentication System](./auth.md)
3. Explore the [Media Library](./media.md) for file handling
4. Check out the [WebSocket System](./ws.md) for real-time features

## Troubleshooting

### Database Connection Issues

If you're having trouble connecting to the database, check your `.env` configuration and make sure your database server is running.

### CORS Issues

If you're experiencing CORS issues when calling your API from a frontend application, set the `CORS_ALLOWED_ORIGINS` environment variable:

```env
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

### File Upload Issues

For file upload issues, check that your `STORAGE_PATH` directory exists and is writable by the application.

## Getting Help

If you need assistance with the Base framework, you can:

- Check the [documentation](https://base.al/docs)
- Open an issue on the [GitHub repository](https://github.com/base-al/base)
- Join the community on [Discord](https://discord.gg/base)
