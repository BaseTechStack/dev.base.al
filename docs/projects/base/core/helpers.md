---
title: Core Helper System
---

# Helper System

The Base framework includes a collection of helper utilities that provide common functionality used throughout the application. These helpers simplify common tasks such as context value retrieval, JWT token management, and slug generation.

## Features

- Context value helpers for Gin
- JWT token generation and validation
- Slug generation and normalization
- Consistent error handling

## Context Helpers

The context helpers make it easy to retrieve values from the Gin context with type conversion.

### Usage

```go
import (
    "base/core/helper"
    "github.com/gin-gonic/gin"
)

func Handler(c *gin.Context) {
    // Get values from context with automatic type conversion
    userID := helper.GetContextUint(c, "user_id")
    name := helper.GetContextString(c, "name")
    isActive := helper.GetContextBool(c, "is_active")
    score := helper.GetContextFloat(c, "score")
    count := helper.GetContextInt(c, "count")
    
    // Use the retrieved values
    // ...
}
```

### Available Context Helpers

```go
// String retrieval
value := helper.GetContextString(c, "key")

// Integer retrieval
intValue := helper.GetContextInt(c, "key")

// Unsigned integer retrieval
uintValue := helper.GetContextUint(c, "key")

// Boolean retrieval
boolValue := helper.GetContextBool(c, "key")

// Float retrieval
floatValue := helper.GetContextFloat(c, "key")
```

## JWT Helpers

JWT helpers provide convenient methods for JWT token generation and validation.

### Generating JWT Tokens

```go
import "base/core/helper"

// Generate a JWT token for a user
token, err := helper.GenerateJWT(user.ID, map[string]interface{}{
    "role": user.Role,
    "email": user.Email,
})

if err != nil {
    // Handle error
    return
}

// Return the token to the client
```

### Validating JWT Tokens

```go
import "base/core/helper"

// Validate a JWT token
extend, userID, err := helper.ValidateJWT(tokenString)
if err != nil {
    // Token is invalid
    return
}

// Use the extracted user ID and extension data
role := extend.(map[string]interface{})["role"].(string)
```

## Slug Helpers

Slug helpers provide functionality for generating and normalizing URL-friendly slugs.

### Creating a Slug Helper

```go
import "base/core/helper"

// Create a new slug helper
slugHelper := helper.NewSlugHelper()
```

### Normalizing Slugs

```go
// Generate a slug from a name
slug := slugHelper.Normalize("My Product Name", "")
// Result: "my-product-name"

// Normalize a custom slug
slug := slugHelper.Normalize("", "custom-slug-123")
// Result: "custom-slug-123"
```

### Generating Unique Slugs

```go
// Define a function to check if a slug already exists
slugExists := func(slug string) (bool, error) {
    var count int64
    err := db.Model(&Product{}).Where("slug = ?", slug).Count(&count).Error
    return count > 0, err
}

// Generate a unique slug
slug, err := slugHelper.GenerateUniqueSlug("my-product", slugExists)
if err != nil {
    // Handle error
    return
}

// If "my-product" exists, it will generate "my-product-2", "my-product-3", etc.
```

## Implementation Details

### Context Value Retrieval

The context helpers use a consistent approach to retrieve and convert values from the Gin context:

```go
// GetContextString retrieves a string value from the context with the given key
func GetContextString(c *gin.Context, key string) string {
    // If the key doesn't have the prefix, add it
    if !strings.HasPrefix(key, ContextKeyPrefix) {
        key = ContextKeyPrefix + strings.ToLower(key)
    }
    
    // Get the value from the context
    value, exists := c.Get(key)
    if !exists {
        return ""
    }
    
    // Convert to string
    strValue, ok := value.(string)
    if !ok {
        return ""
    }
    
    return strValue
}
```

### JWT Token Validation

JWT tokens are validated using the jwt-go library:

```go
func ValidateJWT(tokenString string) (interface{}, uint, error) {
    cfg := config.NewConfig()

    token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
        return []byte(cfg.JWTSecret), nil
    })

    if err != nil {
        return 0, 0, err
    }

    if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
        userID := uint(claims["user_id"].(float64))
        extend := claims["extend"]

        return extend, userID, nil
    }

    return 0, 0, jwt.ErrSignatureInvalid
}
```

### Slug Generation

The slug helper uses the gosimple/slug library for consistent slug generation:

```go
// Normalize ensures the slug is properly formatted
func (h *SlugHelper) Normalize(name string, customSlug string) string {
    if customSlug != "" {
        // If a custom slug is provided, use it but ensure it's properly formatted
        return slug.MakeLang(customSlug, "en")
    }

    // Generate slug from name
    return slug.MakeLang(name, "en")
}
```

## Best Practices

1. **Context Key Prefixing**: Always use the context helpers to retrieve values from the Gin context to ensure consistent key prefixing.

2. **Error Handling**: Always check for errors when using helpers that return errors, such as JWT validation and unique slug generation.

3. **Extend JWT Claims**: Use the extend parameter in GenerateJWT to include additional information in the JWT token, but avoid including sensitive information.

4. **Unique Slugs**: Always use the GenerateUniqueSlug method when creating slugs for database records to avoid collisions.

5. **Type Safety**: Use the appropriate context getter method for the expected type to avoid runtime type conversion errors.

## Integration Examples

### JWT Authentication Middleware

```go
func AuthMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        authHeader := c.GetHeader("Authorization")
        if authHeader == "" {
            c.AbortWithStatusJSON(http.StatusUnauthorized, types.ErrorResponse{
                Error: "Authorization header is required",
            })
            return
        }

        parts := strings.SplitN(authHeader, " ", 2)
        if !(len(parts) == 2 && parts[0] == "Bearer") {
            c.AbortWithStatusJSON(http.StatusUnauthorized, types.ErrorResponse{
                Error: "Invalid authorization format",
            })
            return
        }

        extend, userID, err := helper.ValidateJWT(parts[1])
        if err != nil {
            c.AbortWithStatusJSON(http.StatusUnauthorized, types.ErrorResponse{
                Error: "Invalid or expired token",
            })
            return
        }

        c.Set("user_id", userID)
        c.Set("extend", extend)
        c.Next()
    }
}
```

### Slug Generation in a Model

```go
func (p *Product) BeforeSave(tx *gorm.DB) error {
    // Initialize slug helper
    slugHelper := helper.NewSlugHelper()
    
    // Normalize the slug
    normalizedSlug := slugHelper.Normalize(p.Name, p.Slug)
    
    // Check if this is a new record or if the slug has changed
    var isNew bool
    if p.ID == 0 {
        isNew = true
    } else {
        var oldProduct Product
        if err := tx.First(&oldProduct, p.ID).Error; err == nil {
            if oldProduct.Slug != normalizedSlug {
                isNew = true
            }
        }
    }
    
    if isNew {
        // Define a function to check if a slug exists
        slugExists := func(slug string) (bool, error) {
            var count int64
            query := tx.Model(&Product{}).Where("slug = ?", slug)
            if p.ID != 0 {
                query = query.Where("id != ?", p.ID)
            }
            err := query.Count(&count).Error
            return count > 0, err
        }
        
        // Generate a unique slug
        uniqueSlug, err := slugHelper.GenerateUniqueSlug(normalizedSlug, slugExists)
        if err != nil {
            return err
        }
        
        p.Slug = uniqueSlug
    } else {
        p.Slug = normalizedSlug
    }
    
    return nil
}
```
