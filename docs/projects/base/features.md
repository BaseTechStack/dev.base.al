---
title: Base Framework Features
---

# Base Framework Features

The Base framework provides a robust set of features for building modern Go applications. This page offers a high-level overview of the core components and capabilities, with links to more detailed documentation for each feature.

## Event System

The event system in Base is built around a thread-safe emitter that supports asynchronous event handling. It provides a clean way to implement event-driven architecture in your applications.

### Key Features

- Thread-safe event emission and handling
- Support for synchronous and asynchronous listeners
- Wildcard event pattern matching
- Automatic event propagation throughout the application
- Built-in common events for standard operations

### Common Use Cases

- Triggering notifications when records are created or updated
- Implementing webhooks for third-party integrations
- Building audit logs and activity streams
- Real-time feature implementation with WebSockets

For detailed documentation, code examples, and best practices, see the [Events System Documentation](./core/events.md).

## Email System

Base provides a flexible email system that supports multiple providers through a unified interface, making it easy to integrate email functionality into your applications.

### Key Features

- Multi-provider support (SMTP, SendGrid, Postmark, etc.)
- HTML and plain text email templates
- Attachment handling
- Email queuing and background sending
- Template rendering with variables
- Localization support for email content

### Common Use Cases

- User registration and welcome emails
- Password reset workflows
- Notification emails for application events
- Marketing campaigns and newsletters
- System alerts and monitoring notifications

For detailed documentation, configuration options, and code examples, see the [Email System Documentation](./core/email.md).

## Storage System

The Base framework provides a flexible file storage system that supports various storage providers through a consistent API. It follows the ActiveStorage pattern for file management.

### Key Features

- Provider-agnostic interface for file operations
- Support for local filesystem and cloud storage (S3, Google Cloud Storage, etc.)
- File validation and security scanning
- Image processing and transformations
- Attachment management for models
- Public and private file access control

### Common Use Cases

- User profile pictures and avatars
- Document storage and management
- Media libraries for applications
- Backup and archiving solutions
- Content delivery for web assets

For detailed documentation, configuration options, and code examples, see the [Storage System Documentation](./core/storage.md).

## Authentication System

Base includes a comprehensive authentication system that handles user management, authentication, and authorization through multiple mechanisms.

### Key Features

- Multiple authentication methods (JWT tokens, API keys)
- Secure password handling with bcrypt hashing
- Password reset and account recovery workflows
- OAuth integration with popular providers (Google, Facebook, Apple)
- Role-based access control (RBAC)
- Fine-grained permissions system
- Protection against common security vulnerabilities

### Common Use Cases

- User registration and login flows
- API authentication for third-party integrations
- Single sign-on (SSO) implementation
- Multi-factor authentication
- Session management
- User profile and preference management

For detailed documentation on authentication flows, security best practices, and multi-language support, see the [Authentication System Documentation](./auth.md).

## Module System

Base follows the HMVC (Hierarchical Model-View-Controller) pattern for organizing code, providing a clean, maintainable architecture for your applications.

### Key Features

- Clean separation of concerns with layered architecture
- Dependency injection for better testability
- Automatic module registration and initialization
- Standardized module interfaces and lifecycle hooks
- Self-contained business logic within modules

### Common Use Cases

- Building complex applications with multiple features
- Implementing microservices-style architecture
- Creating reusable business logic components
- Ensuring testability with proper dependency management
- Maintaining large codebases with multiple developers

For detailed documentation on the module system, architectural patterns, and best practices, see the [App System Documentation](./core/app.md).

## WebSocket Support

Base includes robust WebSocket support for building real-time, interactive applications with bidirectional communication between clients and servers.

### Key Features

- Channel-based WebSocket architecture
- Pub/Sub pattern for message distribution
- Authentication integration with the Base auth system
- Automatic connection management
- Support for binary and text messages
- Client presence detection
- Connection handling
- Event subscription

### Common Use Cases

- Real-time dashboards and analytics
- Chat applications and messaging systems
- Collaborative editing tools
- Live notifications and alerts
- Gaming applications
- IoT device communication

For detailed documentation on implementing WebSocket functionality, see the [WebSocket System Documentation](./ws.md).

## Middleware System

Base provides a comprehensive middleware system for HTTP request processing based on Gin's middleware architecture, allowing you to intercept and modify requests and responses.

### Key Features

- Configurable middleware chain with execution order
- Request and response modification capabilities
- Error handling and recovery mechanisms
- Built-in middleware for common functionality
- Simple API for creating custom middleware
- Global and route-specific middleware application

### Common Use Cases

- Authentication and authorization
- Request logging and monitoring
- Response compression and caching
- CORS configuration
- Rate limiting and throttling
- Input validation and sanitization

For detailed documentation on the middleware system, available middleware, and creating custom middleware, see the [Middleware System Documentation](./core/middleware.md).

## API Documentation

Base provides built-in support for Swagger/OpenAPI documentation, making it easy to document and test your APIs with minimal effort.

### Key Features

- Automated API documentation generation
- Interactive API explorer UI at `/swagger/index.html`
- Request/response schema definitions
- Security definitions for authentication methods
- Annotation-based documentation in controllers
- Export to various formats (JSON, YAML, HTML)

### Common Use Cases

- API discovery and exploration
- Client SDK generation
- Testing and debugging endpoints
- Third-party integration documentation
- Frontend-backend communication reference
- API versioning and change tracking

For detailed documentation on setting up API documentation, annotation syntax, and generating documentation, see the [API Documentation Guide](./core/helpers.md#api-documentation).



## Database Integration

Base provides seamless integration with GORM for database operations, making it easy to work with various database systems through a consistent API.

### Key Features

- Multi-database support (MySQL, PostgreSQL, SQLite)
- Model relationships (belongs_to, has_one, has_many)
- Automatic database migrations
- Transaction support with automatic rollback
- Connection pooling and management
- Advanced query building and optimization
- Soft delete support

### Common Use Cases

- Complex data modeling with relationships
- Data persistence across application restarts
- Data migration and schema evolution
- Transactional operations across multiple tables
- Performance optimization for data-intensive applications
- Multi-tenant database architectures

For detailed documentation on database configuration, model definitions, and query operations, see the [Database System Documentation](./core/database.md).



## Media Library

Base includes a comprehensive Media Library system for handling file uploads, storage, and management across your application.

### Key Features

- Secure file upload handling
- Image processing and resizing
- Multiple storage provider support
- Media organization with collections
- Metadata extraction and storage
- Access control and permissions

### Common Use Cases

- User avatar and profile picture management
- Document management systems
- Gallery and portfolio applications
- Content management systems
- File sharing functionalities
- Rich media content in applications

For detailed documentation on implementing and using the Media Library, see the [Media Library Documentation](./media.md).

## Configuration System

Base provides a flexible configuration system that supports environment variables, configuration files, and runtime updates.

### Key Features

- Environment-based configuration
- Multiple configuration formats (JSON, YAML, TOML)
- Configuration validation
- Secure handling of sensitive data
- Hot reloading of configuration changes
- Default values and fallbacks

### Common Use Cases

- Application environment management (dev, staging, production)
- Feature flags and toggles
- Third-party service integration configuration
- Database and storage connection settings
- Application behavior customization
- Security settings management

For detailed documentation on configuration options and best practices, see the [Configuration System Documentation](./core/config.md).

## Logging System

Base provides a powerful, structured logging system built on top of Zap for efficient and flexible application logging.

### Key Features

- Structured, contextual logging
- Multiple output formats (JSON, console)
- Log level configuration
- Contextual fields and metadata
- Performance-optimized logging
- Log rotation and management

### Common Use Cases

- Application monitoring and debugging
- Error tracking and diagnostics
- Audit trails for security-sensitive operations
- Performance analysis and optimization
- User activity tracking
- System health monitoring

For detailed documentation on logging configuration and usage, see the [Logger System Documentation](./core/logger.md).

## Helpers and Utilities

Base includes a collection of helper functions and utilities to simplify common development tasks.

### Key Features

- String manipulation utilities
- Date and time helpers
- Cryptography and security functions
- HTTP request/response utilities
- Validation helpers
- File and path manipulation

### Common Use Cases

- Data validation and sanitization
- Secure password and token generation
- Date formatting and manipulation
- URL handling and parsing
- Content type detection
- Error handling and formatting

For detailed documentation on available helpers and utilities, see the [Helpers System Documentation](./core/helpers.md).

## Types System

Base provides a comprehensive types system for consistent data modeling across your application.

### Key Features

- Common model interfaces and base structures
- Reusable data types and validation
- JSON serialization/deserialization helpers
- Type conversion utilities
- Custom GORM data types
- Default value providers

### Common Use Cases

- Creating consistent model structures
- Building API response objects
- Implementing data validation
- Managing database column types
- Handling custom data formats
- Standardizing timestamp and date formats

For detailed documentation on the types system and data modeling, see the [Types System Documentation](./core/types.md).

## Conclusion

The Base framework offers a comprehensive set of features designed to accelerate your Go application development while maintaining clean, maintainable code. By following the links to the detailed documentation for each feature, you can learn how to implement and customize these capabilities for your specific application needs.

To get started with Base, we recommend:

1. First reading the [Getting Started Guide](./getting-started.md) to set up your development environment
2. Exploring the [Command Line Tool](./cmd.md) to understand how to create and manage projects
3. Following our step-by-step tutorials to build your first Base application

The Base framework continues to evolve with new features and improvements based on community feedback and modern software development practices. We encourage you to join our community and contribute to the ongoing development of the framework.
