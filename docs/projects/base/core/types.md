---
title: Core Types System
---

# Types System

The Base framework includes a comprehensive types system that provides common data structures, error handling utilities, and time handling tools. These types are used throughout the application to ensure consistency and simplify common operations.

## Features

- Standard response structures
- Common error types and predefined errors
- JWT token generation and validation
- Flexible DateTime handling
- Pagination utilities

## Response Types

The types package provides standard response structures for consistent API responses.

### Error Response

```go
// Standard error response format
type ErrorResponse struct {
    Error string `json:"error"`
}
```

Usage example:

```go
func handleError(c *gin.Context, err error) {
    c.JSON(http.StatusBadRequest, types.ErrorResponse{
        Error: err.Error(),
    })
}
```

### Success Response

```go
// Standard success response format
type SuccessResponse struct {
    Message string `json:"message"`
}
```

Usage example:

```go
func handleSuccess(c *gin.Context) {
    c.JSON(http.StatusOK, types.SuccessResponse{
        Message: "Operation completed successfully",
    })
}
```

### Validation Errors

The types package also includes structures for handling validation errors:

```go
// For a single validation error
type ValidationError struct {
    Field   string `json:"field"`
    Message string `json:"message"`
}

// For multiple validation errors
type ValidationErrorResponse struct {
    Errors []ValidationError `json:"errors"`
}
```

Usage example:

```go
func validateUser(c *gin.Context, user User) (bool, []types.ValidationError) {
    var errors []types.ValidationError
    
    if user.Email == "" {
        errors = append(errors, types.ValidationError{
            Field:   "email",
            Message: "Email is required",
        })
    }
    
    if user.Password == "" {
        errors = append(errors, types.ValidationError{
            Field:   "password",
            Message: "Password is required",
        })
    }
    
    return len(errors) == 0, errors
}
```

## Common Errors

The types package defines common error instances for consistent error handling:

```go
var (
    ErrInvalidToken    = errors.New("invalid token")
    ErrUserNotFound    = errors.New("user not found")
    ErrTokenExpired    = errors.New("token expired")
    ErrInvalidPassword = errors.New("invalid password")
    ErrEmailExists     = errors.New("email already exists")
    ErrInvalidEmail    = errors.New("invalid email")
)
```

Usage example:

```go
func Login(email, password string) (*User, error) {
    user, err := FindUserByEmail(email)
    if err != nil {
        return nil, types.ErrUserNotFound
    }
    
    if !ValidatePassword(password, user.Password) {
        return nil, types.ErrInvalidPassword
    }
    
    return user, nil
}
```

## JWT Functions

The types package includes functions for JWT token generation and validation:

### Generate JWT

```go
// GenerateJWT creates a new JWT token for the given user ID
func GenerateJWT(userID uint, extend interface{}) (string, error)
```

Usage example:

```go
token, err := types.GenerateJWT(user.ID, map[string]interface{}{
    "role": user.Role,
    "email": user.Email,
})

if err != nil {
    return err
}

// Return the token to the client
```

### Validate JWT

```go
// ValidateJWT validates a JWT token and returns the user ID
func ValidateJWT(tokenString string) (uint, error)
```

Usage example:

```go
userID, err := types.ValidateJWT(tokenString)
if err != nil {
    return nil, err
}

user, err := FindUserByID(userID)
if err != nil {
    return nil, err
}
```

## DateTime Type

The types package includes a custom DateTime type for flexible date/time handling:

```go
// DateTime is a custom type for handling time values with flexible parsing
type DateTime struct {
    time.Time
}
```

### Features

- JSON marshaling/unmarshaling with flexible format support
- Database value scanning with format detection
- Convenience methods for time operations
- Null time handling

### Usage Examples

#### Creating DateTime Values

```go
// Current time
now := types.Now()

// From time.Time
t := time.Now()
dt := types.DateTime{Time: t}

// Zero value
var zero types.DateTime
```

#### JSON Handling

```go
// The DateTime type can parse multiple time formats from JSON
type Event struct {
    ID        uint          `json:"id"`
    Title     string        `json:"title"`
    StartDate types.DateTime `json:"start_date"`
    EndDate   types.DateTime `json:"end_date"`
}

// It handles various formats automatically:
// "2023-05-30T15:04:05Z07:00" (RFC3339)
// "2023-05-30T15:04:05-0700"
// "2023-05-30T15:04:05Z"
// "2023-05-30T15:04:05"
// "2023-05-30 15:04:05"
// "2023-05-30"
```

#### Database Operations

```go
// Works seamlessly with database operations
type User struct {
    ID        uint          `gorm:"primaryKey"`
    Name      string        `gorm:"size:255"`
    CreatedAt types.DateTime `gorm:"type:datetime"`
    UpdatedAt types.DateTime `gorm:"type:datetime"`
}

// Handles null values
func (dt DateTime) Value() (driver.Value, error) {
    if dt.Time.IsZero() {
        return nil, nil
    }
    return dt.Time, nil
}
```

#### Time Operations

```go
// Add duration
tomorrow := now.Add(24 * time.Hour)

// Compare times
if event.StartDate.Before(now) {
    // Event has already started
}

// Format time
formattedDate := event.StartDate.Format("2006-01-02")
```

## Pagination

The types package includes structures for handling pagination:

```go
// Pagination information
type Pagination struct {
    Total      int `json:"total"`
    Page       int `json:"page"`
    PageSize   int `json:"page_size"`
    TotalPages int `json:"total_pages"`
}

// Paginated response
type PaginatedResponse struct {
    Data       interface{} `json:"data"`
    Pagination Pagination  `json:"pagination"`
}
```

Usage example:

```go
func GetUsers(c *gin.Context) {
    page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
    pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "10"))
    
    var users []User
    var total int64
    
    // Get total count
    db.Model(&User{}).Count(&total)
    
    // Get paginated data
    db.Offset((page - 1) * pageSize).Limit(pageSize).Find(&users)
    
    // Calculate total pages
    totalPages := int(math.Ceil(float64(total) / float64(pageSize)))
    
    // Create paginated response
    response := types.PaginatedResponse{
        Data: users,
        Pagination: types.Pagination{
            Total:      int(total),
            Page:       page,
            PageSize:   pageSize,
            TotalPages: totalPages,
        },
    }
    
    c.JSON(http.StatusOK, response)
}
```

## User Data

The types package includes a UserData structure for consistent user information:

```go
type UserData struct {
    Id       uint   `json:"id"`
    Name     string `json:"name"`
    Email    string `json:"email"`
    Username string `json:"username"`
    // Additional fields as needed
}
```

Usage example:

```go
func GetUserProfile(c *gin.Context) {
    userID := helper.GetContextUint(c, "user_id")
    
    user, err := userService.GetByID(userID)
    if err != nil {
        c.JSON(http.StatusNotFound, types.ErrorResponse{Error: "User not found"})
        return
    }
    
    userData := types.UserData{
        Id:       user.ID,
        Name:     user.Name,
        Email:    user.Email,
        Username: user.Username,
    }
    
    c.JSON(http.StatusOK, userData)
}
```

## Best Practices

1. **Consistent Responses**: Use the standard response types for all API endpoints to ensure consistency.

2. **Error Handling**: Use the predefined error types for common error scenarios to provide consistent error messages.

3. **DateTime Handling**: Use the DateTime type for all date/time fields to ensure consistent parsing and formatting.

4. **Pagination**: Use the pagination structures for all paginated endpoints to provide consistent pagination information.

5. **JWT Tokens**: Use the provided JWT functions for token generation and validation to ensure security and consistency.

6. **Validation**: Use the validation error structures to provide detailed validation feedback to clients.

## Integration with Other Components

The types system integrates well with other Base framework components:

```go
// Integration with middleware
func AuthMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        // Extract token
        token := extractToken(c)
        
        // Validate token
        userID, err := types.ValidateJWT(token)
        if err != nil {
            c.JSON(http.StatusUnauthorized, types.ErrorResponse{
                Error: "Invalid or expired token",
            })
            c.Abort()
            return
        }
        
        // Set user ID in context
        c.Set("user_id", userID)
        c.Next()
    }
}

// Integration with database models
type Post struct {
    gorm.Model
    Title      string        `json:"title"`
    Content    string        `json:"content"`
    PublishedAt types.DateTime `json:"published_at"`
}
```
