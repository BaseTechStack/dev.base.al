---
title: Core Logger System
---

# Logger System

The Base framework includes a powerful, structured logging system built on top of the Zap logging library. This system provides consistent, performant logging with support for multiple outputs and log levels.

## Features

- Structured JSON logging
- Console output with emoji-based level indicators
- File-based logging with rotation
- Environment-based configuration (development/production)
- Multiple log levels (debug, info, warn, error, fatal)
- Support for structured fields
- Colorized console output

## Configuration

The logger system can be configured through environment variables:

```env
# Logger configuration
LOG_LEVEL=info        # Options: debug, info, warn, error, fatal
LOG_PATH=logs         # Directory for log files
ENVIRONMENT=development # Options: development, production
```

## Basic Usage

### Initializing the Logger

The logger is typically initialized during application startup:

```go
import "base/core/logger"

// Create logger configuration
config := logger.Config{
    Environment: "development",
    LogPath:     "logs",
    Level:       "info",
}

// Initialize the logger
log, err := logger.NewLogger(config)
if err != nil {
    panic("Failed to initialize logger: " + err.Error())
}
```

### Simple Logging

```go
// Basic log messages
log.Info("Application started")
log.Debug("Debug information")
log.Warn("Warning message")
log.Error("Error occurred")
```

### Structured Logging

```go
// Log with structured fields
log.Info("User created",
    logger.String("email", user.Email),
    logger.Int("id", int(user.ID)),
    logger.String("role", user.Role),
)

// Log error with context
log.Error("Database connection failed",
    logger.String("host", config.DBHost),
    logger.Int("port", config.DBPort),
    logger.String("error", err.Error()),
)
```

## Field Types

The logger supports various field types for structured logging:

```go
// String field
logger.String("key", "value")

// Integer field
logger.Int("count", 42)

// Unsigned integer field
logger.Uint("id", user.ID)

// Float field
logger.Float64("price", 19.99)

// Boolean field
logger.Bool("enabled", true)

// Duration field
logger.Duration("latency", request.Duration)

// Error field
logger.Error(err)

// Time field
logger.Time("timestamp", time.Now())
```

## Contextual Loggers

You can create loggers with predefined context:

```go
// Create a logger with user context
userLogger := log.With(
    logger.String("user_id", user.ID),
    logger.String("email", user.Email),
)

// Use the contextual logger
userLogger.Info("User logged in")
userLogger.Info("Profile updated")
```

## Implementation Details

The logger system is implemented using a custom interface that wraps the Zap logger:

```go
// Logger interface
type Logger interface {
    Info(msg string, fields ...Field)
    Error(msg string, fields ...Field)
    Debug(msg string, fields ...Field)
    Warn(msg string, fields ...Field)
    Fatal(msg string, fields ...Field)
    With(fields ...Field) Logger
    GetZapLogger() *zap.Logger
}
```

Under the hood, the logger creates a multi-writer core that outputs to both a file and the console:

```go
// Create multi-writer core
core := zapcore.NewTee(
    zapcore.NewCore(
        encoder,            // JSON encoder for file
        zapcore.AddSync(f), // File output
        level,              // Log level
    ),
    zapcore.NewCore(
        consoleEncoder,          // Pretty console encoder
        zapcore.AddSync(os.Stdout), // Console output
        level,                   // Log level
    ),
)
```

## Console Output Formatting

In development mode, the logger uses a custom console encoder that produces readable, colorful output:

```
ℹ️  INFO  2023-05-30 15:04:05  app/main.go:42  Application started  {"version": "1.2.3"}
⚠️  WARN  2023-05-30 15:04:10  app/auth/service.go:123  Invalid login attempt  {"email": "user@example.com"}
❌ ERROR  2023-05-30 15:04:15  app/database/db.go:78  Query failed  {"query": "SELECT * FROM users", "error": "connection refused"}
```

## File Output Format

The file output uses a structured JSON format for easy parsing and analysis:

```json
{"level":"info","ts":"2023-05-30T15:04:05.123Z","caller":"app/main.go:42","msg":"Application started","version":"1.2.3"}
{"level":"warn","ts":"2023-05-30T15:04:10.456Z","caller":"app/auth/service.go:123","msg":"Invalid login attempt","email":"user@example.com"}
{"level":"error","ts":"2023-05-30T15:04:15.789Z","caller":"app/database/db.go:78","msg":"Query failed","query":"SELECT * FROM users","error":"connection refused"}
```

## Best Practices

1. **Use Structured Logging**: Always include relevant context as structured fields rather than embedding them in the message string.

2. **Consistent Log Levels**: Use the appropriate log level for each message:
   - `Debug`: Detailed information for debugging
   - `Info`: General information about application progress
   - `Warn`: Warning conditions that don't cause errors
   - `Error`: Error conditions that affect operation
   - `Fatal`: Critical errors that require application termination

3. **Contextual Loggers**: Create contextual loggers for operations that span multiple functions or components.

4. **Error Context**: When logging errors, always include the original error and relevant context.

5. **Performance Consideration**: In hot paths, check if the log level is enabled before constructing expensive log messages:

```go
if logger.IsDebugEnabled() {
    logger.Debug("Expensive debug message", 
        logger.String("data", expensiveFunction()))
}
```

## Integration with Middleware

The logger integrates well with the Base middleware system:

```go
// Request logging middleware
func LoggingMiddleware(log logger.Logger) gin.HandlerFunc {
    return func(c *gin.Context) {
        start := time.Now()
        
        // Process request
        c.Next()
        
        // Log after request processing
        duration := time.Since(start)
        status := c.Writer.Status()
        path := c.Request.URL.Path
        
        if status >= 400 {
            log.Error("Request failed",
                logger.String("path", path),
                logger.Int("status", status),
                logger.Duration("duration", duration),
                logger.String("method", c.Request.Method),
                logger.String("ip", c.ClientIP()),
            )
        } else {
            log.Info("Request processed",
                logger.String("path", path),
                logger.Int("status", status),
                logger.Duration("duration", duration),
                logger.String("method", c.Request.Method),
            )
        }
    }
}
```
