---
title: Core Middleware System
---

# Middleware System

The Base framework includes a robust middleware system that provides essential functionality for web applications. These middleware components can be easily integrated into your application to handle common tasks such as authentication, rate limiting, logging, and API key validation.

## Available Middleware

Base provides the following middleware components:

1. **Authentication** - JWT token validation for protected routes
2. **API Key** - API key validation for secure API access
3. **Logger** - Request/response logging with configurable detail levels
4. **Rate Limiter** - IP-based rate limiting to prevent abuse
5. **Header** - Manages response headers for security and caching

## Authentication Middleware

The authentication middleware validates JWT tokens provided in the Authorization header.

### Features

- Validates Bearer token format
- Verifies JWT signature and expiration
- Extracts user ID and extension data
- Provides error responses for invalid tokens

### Usage

```go
import "base/core/middleware"

// Apply to a router group
protected := router.Group("/protected")
protected.Use(middleware.AuthMiddleware())
{
    protected.GET("/profile", profileHandler)
    protected.PUT("/settings", settingsHandler)
}
```

### Accessing User Information

Once the middleware successfully validates a token, you can access the user ID in your handlers:

```go
func profileHandler(c *gin.Context) {
    userId, _ := c.Get("user_id")
    extend, _ := c.Get("extend")
    
    // Use userId to fetch user data
    user, err := userService.GetById(userId.(uint))
    // ...
}
```

## API Key Middleware

The API Key middleware validates requests using an API key provided in the request headers.

### Features

- Validates API keys for secure API access
- Configurable via environment variables
- Skips validation for non-JSON requests and WebSocket connections
- Smart detection of JSON requests based on headers and URL

### Configuration

Set your API key in your environment variables:

```env
API_KEY=your-secure-api-key
```

### Usage

```go
import "base/core/middleware"

// Apply globally
router.Use(middleware.APIKeyMiddleware())

// Or apply to specific routes
apiGroup := router.Group("/api")
apiGroup.Use(middleware.APIKeyMiddleware())
{
    apiGroup.GET("/data", dataHandler)
}
```

### Client Implementation

Clients must include the API key in the request headers:

```
X-Api-Key: your-secure-api-key
```

## Logger Middleware

The logger middleware records detailed information about HTTP requests and responses.

### Features

- Logs request method, path, status code, and latency
- Captures request and response bodies
- Truncates large bodies to prevent log bloat
- Skips logging for binary content (images, files)
- Extracts error messages from response bodies

### Usage

```go
import (
    "base/core/logger"
    "base/core/middleware"
)

// Create a logger
log, _ := logger.NewLogger(logger.Config{
    Environment: "development",
    LogPath:     "logs",
    Level:       "info",
})

// Apply the middleware
router.Use(middleware.Logger(log))
```

### Log Output Example

```
ℹ️  INFO  2023-05-30 15:04:05  app/middleware/logger.go:112  HTTP Request  {"method": "POST", "path": "/api/users", "status": 201, "latency": "15.2ms", "request": "{\"email\":\"user@example.com\",\"name\":\"Test User\"}", "response": "{\"id\":123,\"email\":\"user@example.com\",\"name\":\"Test User\"}", "error": ""}
```

## Rate Limiter Middleware

The rate limiter middleware prevents abuse by limiting the number of requests from each IP address.

### Features

- IP-based rate limiting
- Configurable rate and burst limits
- Thread-safe implementation using sync.RWMutex
- Returns 429 Too Many Requests when limit is exceeded

### Usage

```go
import (
    "base/core/middleware"
    "golang.org/x/time/rate"
)

// Create a rate limiter with 10 requests per second and burst of 20
limiter := middleware.NewIPRateLimiter(10, 20)

// Apply globally
router.Use(middleware.RateLimitMiddleware(limiter))

// Or apply to specific routes
apiGroup := router.Group("/api")
apiGroup.Use(middleware.RateLimitMiddleware(limiter))
{
    apiGroup.GET("/data", dataHandler)
}
```

### Configuration Options

You can create different rate limiters for different route groups:

```go
// Strict rate limiting for authentication routes
authLimiter := middleware.NewIPRateLimiter(5, 10) // 5 requests/second, burst of 10

// More permissive for public API
publicLimiter := middleware.NewIPRateLimiter(20, 50) // 20 requests/second, burst of 50

// Apply to different route groups
authRoutes.Use(middleware.RateLimitMiddleware(authLimiter))
publicRoutes.Use(middleware.RateLimitMiddleware(publicLimiter))
```

## Header Middleware

The header middleware adds security and caching headers to responses.

### Features

- Sets security headers (CORS, Content-Security-Policy, etc.)
- Configures caching behavior
- Prevents clickjacking attacks
- Enables HTTP Strict Transport Security

### Usage

```go
import "base/core/middleware"

// Apply globally
router.Use(middleware.HeaderMiddleware())
```

## Combining Middleware

You can combine multiple middleware components for comprehensive request handling:

```go
// Create necessary instances
log, _ := logger.NewLogger(logger.Config{
    Environment: "development",
    LogPath:     "logs",
    Level:       "info",
})
limiter := middleware.NewIPRateLimiter(10, 20)

// Apply globally
router.Use(
    middleware.HeaderMiddleware(),
    middleware.Logger(log),
    middleware.RateLimitMiddleware(limiter),
)

// Apply authentication to protected routes only
protected := router.Group("/protected")
protected.Use(middleware.AuthMiddleware())
{
    protected.GET("/profile", profileHandler)
}

// Apply API key validation to API routes
apiRoutes := router.Group("/api")
apiRoutes.Use(middleware.APIKeyMiddleware())
{
    apiRoutes.GET("/data", dataHandler)
}
```

## Custom Middleware

You can easily create custom middleware following the Gin middleware pattern:

```go
func CustomMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        // Do something before the request is processed
        
        c.Next()
        
        // Do something after the request is processed
    }
}
```

## Best Practices

1. **Order Matters**: The order in which you apply middleware can impact behavior. Generally, apply more generic middleware first (headers, logging) before more specific ones (authentication, rate limiting).

2. **Performance Considerations**: Some middleware like logging and rate limiting can impact performance. Configure them appropriately for your production environment.

3. **Security First**: Always apply security middleware globally to ensure all routes are protected.

4. **Error Handling**: Ensure middleware provides clear error messages when rejecting requests.

5. **Route-Specific Configuration**: Apply different middleware configurations to different route groups based on their requirements.

6. **Monitoring**: Use the logger middleware to monitor request patterns and identify potential issues.

7. **Testing**: Write tests for your middleware to ensure it behaves as expected under different conditions.

## Integration with Base Framework

The Base framework automatically configures middleware during application bootstrap:

```go
// In core/app/bootstrap.go
func configureMiddleware(router *gin.Engine, log logger.Logger) {
    // Add standard middleware
    router.Use(
        middleware.HeaderMiddleware(),
        middleware.Logger(log),
    )
    
    // Configure rate limiting
    limiter := middleware.NewIPRateLimiter(10, 20)
    router.Use(middleware.RateLimitMiddleware(limiter))
    
    // API Key validation is applied selectively
    apiRoutes := router.Group("/api")
    apiRoutes.Use(middleware.APIKeyMiddleware())
    
    // Authentication is applied to protected routes
    protected := router.Group("/protected")
    protected.Use(middleware.AuthMiddleware())
}
```
