---
title: Core Configuration System
---

# Configuration System

The Base framework provides a flexible configuration system that allows you to easily manage application settings across different environments. The system is designed to load configuration from environment variables with sensible defaults, making it simple to configure your application without modifying code.

## Features

- Environment-based configuration
- Sensible defaults for quick setup
- Support for various application components (database, storage, email, etc.)
- Easy access to configuration values throughout the application
- Logging of configuration values during startup

## Environment Variables

The configuration system supports the following environment variables:

### General Settings

```env
# General application settings
SERVER_ADDRESS=:8001         # Server port (format: ":port")
APPHOST=http://localhost     # Base URL for the application
CDN=                         # CDN URL (if used)
ENV=debug                    # Environment (debug, development, production)
APP_VERSION=0.0.1            # Application version
API_KEY=your_api_key         # API key for API access
JWT_SECRET=your_jwt_secret   # Secret for JWT token generation
CORS_ALLOWED_ORIGINS=        # Comma-separated list of allowed origins for CORS
```

### Database Settings

```env
# Database configuration
DB_DRIVER=mysql              # Options: sqlite, mysql, postgres
DB_USER=root                 # Database username
DB_PASSWORD=password         # Database password
DB_HOST=localhost            # Database host
DB_PORT=3306                 # Database port
DB_NAME=mydatabase           # Database name
DB_PATH=test.db              # Path for SQLite database
DB_URL=                      # Complete database URL (overrides individual settings)
```

### Email Settings

```env
# Email configuration
EMAIL_PROVIDER=default       # Email provider (default, smtp, sendgrid, postmark)
EMAIL_FROM_ADDRESS=no-reply@localhost  # From email address

# SMTP Configuration
SMTP_HOST=smtp.example.com   # SMTP host
SMTP_PORT=587                # SMTP port
SMTP_USERNAME=user           # SMTP username
SMTP_PASSWORD=password       # SMTP password

# SendGrid Configuration
SENDGRID_API_KEY=your_key    # SendGrid API key

# Postmark Configuration
POSTMARK_SERVER_TOKEN=token  # Postmark server token
POSTMARK_ACCOUNT_TOKEN=token # Postmark account token
```

### Storage Settings

```env
# Storage configuration
STORAGE_PROVIDER=local       # Storage provider (local, s3, r2)
STORAGE_PATH=storage/uploads # Path for local storage
STORAGE_BASE_URL=            # Base URL for stored files
STORAGE_PUBLIC_URL=          # Public URL for accessing files
STORAGE_MAX_SIZE=10485760    # Maximum file size in bytes (default: 10MB)
STORAGE_ALLOWED_EXT=.jpg,.jpeg,.png,.gif,.pdf,.doc,.docx  # Allowed file extensions

# Cloud storage configuration
STORAGE_ACCOUNT_ID=your_id   # Cloud storage account ID/access key
STORAGE_API_KEY=your_key     # Cloud storage API key/secret key
STORAGE_API_SECRET=secret    # Additional API secret (if needed)
STORAGE_ENDPOINT=url         # Storage endpoint URL (for S3/R2)
STORAGE_REGION=eu-central-1  # Storage region
STORAGE_BUCKET=default       # Storage bucket name
```

## Basic Usage

### Loading Configuration

The configuration is typically loaded during application startup:

```go
import "base/core/config"

// Load configuration with defaults
cfg := config.NewConfig()

// Access configuration values
dbDriver := cfg.DBDriver
serverAddress := cfg.ServerAddress
```

### Accessing Configuration in Components

Components throughout the application can access the configuration:

```go
// Database initialization
func InitDB(cfg *config.Config) (*Database, error) {
    // Use configuration values to connect to the database
    switch cfg.DBDriver {
    case "sqlite":
        // SQLite configuration
    case "mysql":
        // MySQL configuration
    case "postgres":
        // PostgreSQL configuration
    default:
        return nil, fmt.Errorf("unsupported database driver: %s", cfg.DBDriver)
    }
    // ...
}

// Email service configuration
func NewEmailService(cfg *config.Config) (*EmailService, error) {
    provider := cfg.EmailProvider
    fromAddress := cfg.EmailFromAddress
    
    // Configure based on provider
    switch provider {
    case "smtp":
        // SMTP configuration
    case "sendgrid":
        // SendGrid configuration
    // ...
    }
}
```

## Implementation Details

The configuration system is implemented using a struct that holds all configuration values:

```go
// Config holds the application configuration.
type Config struct {
    BaseURL              string
    CDN                  string
    Env                  string
    DBDriver             string
    DBUser               string
    DBPassword           string
    DBHost               string
    DBPort               string
    DBName               string
    DBPath               string
    DBURL                string
    ApiKey               string
    JWTSecret            string
    ServerAddress        string
    CORSAllowedOrigins   []string
    Version              string
    EmailProvider        string
    EmailFromAddress     string
    SMTPHost             string
    SMTPPort             int
    SMTPUsername         string
    SMTPPassword         string
    SendGridAPIKey       string
    PostmarkServerToken  string
    PostmarkAccountToken string
    StorageProvider      string
    StoragePath          string
    StorageBaseURL       string
    StorageAPIKey        string
    StorageAPISecret     string
    StorageAccountID     string
    StorageEndpoint      string
    StorageRegion        string
    StorageBucket        string
    StoragePublicURL     string
    StorageMaxSize       int64
    StorageAllowedExt    []string
}
```

The `NewConfig` function initializes a new configuration with default values and overrides them with environment variables if they exist:

```go
// NewConfig returns a new Config instance with default values.
func NewConfig() *Config {
    serverAddr := getEnvWithLog("SERVER_ADDRESS", ":8001")
    baseURL := getEnvWithLog("APPHOST", "http://localhost")
    
    // Extract port from serverAddr and append to baseURL if not already present
    if serverAddr != "" && serverAddr[0] == ':' {
        port := serverAddr[1:]
        if !strings.HasSuffix(baseURL, port) {
            baseURL = strings.TrimSuffix(baseURL, ":8080") // Remove default port if present
            baseURL = baseURL + ":" + port
        }
    }
    
    config := &Config{
        BaseURL:            baseURL,
        CDN:                getEnvWithLog("CDN", ""),
        Env:                getEnvWithLog("ENV", "debug"),
        DBDriver:           getEnvWithLog("DB_DRIVER", "mysql"),
        // ... other fields
    }
    
    return config
}
```

## Helper Methods

The Config struct provides helper methods to access specific configuration groups:

### Storage Configuration

```go
func (c *Config) GetStorageConfig() map[string]interface{} {
    return map[string]interface{}{
        "provider":    c.StorageProvider,
        "api_key":     c.StorageAPIKey,
        "api_secret":  c.StorageAPISecret,
        "endpoint":    c.StorageEndpoint,
        "region":      c.StorageRegion,
        "bucket":      c.StorageBucket,
        "public_url":  c.StoragePublicURL,
        "base_url":    c.StorageBaseURL,
        "max_size":    c.StorageMaxSize,
        "allowed_ext": c.StorageAllowedExt,
        "path":        c.StoragePath,
        "env":         c.Env,
    }
}
```

## Best Practices

1. **Environment Variables**: Use environment variables for all configuration values that might change between environments.

2. **Defaults**: Provide sensible defaults for all configuration values to make it easy to get started.

3. **Secrets**: Never hardcode sensitive information like passwords or API keys. Use environment variables for these values.

4. **Documentation**: Document all environment variables that your application uses, including their purpose and default values.

5. **Validation**: Validate configuration values during startup to ensure they are valid and provide helpful error messages if they are not.

6. **Environment-Specific Configuration**: Use different configuration values for different environments (development, testing, production).

7. **Logging**: Log configuration values during startup for debugging purposes, but be careful not to log sensitive information.

## Examples

### Setting Up Environment Variables

You can set environment variables in a `.env` file or directly in the environment:

```env
# .env file
ENV=production
SERVER_ADDRESS=:8080
DB_DRIVER=postgres
DB_HOST=db.example.com
DB_USER=prod_user
DB_PASSWORD=secure_password
DB_NAME=prod_db
JWT_SECRET=a_very_secure_jwt_secret
STORAGE_PROVIDER=s3
STORAGE_ACCOUNT_ID=your_access_key
STORAGE_API_KEY=your_secret_key
STORAGE_BUCKET=your_bucket
```

### Using Configuration in a Service

```go
type UserService struct {
    db      *gorm.DB
    config  *config.Config
    emitter *emitter.Emitter
}

func NewUserService(db *gorm.DB, cfg *config.Config, emitter *emitter.Emitter) *UserService {
    return &UserService{
        db:      db,
        config:  cfg,
        emitter: emitter,
    }
}

func (s *UserService) GenerateJWT(user *models.User) (string, error) {
    // Use JWT secret from configuration
    token, err := helper.GenerateJWT(user.ID, s.config.JWTSecret)
    if err != nil {
        return "", err
    }
    return token, nil
}
```
