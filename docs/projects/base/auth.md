---
title: Base Authentication System
---

# Base Authentication System

The Base framework includes a robust authentication system with several integrated modules right out of the box. This guide explains the authentication features, endpoints, and how to use them in your application.

## Auth Module Structure

The authentication system is implemented in the `core/app/auth` directory with the following components:

```
auth/
├── controller.go   # HTTP handlers for auth endpoints
├── errors.go       # Auth-specific error definitions
├── mod.go          # Module initialization and registration
├── model.go        # Data models and request/response structures
├── service.go      # Business logic and database operations
└── template.go     # Email templates for password reset, etc.
```

### Module Organization

The auth module follows a clean architecture pattern:

1. **Module Definition** (`mod.go`): Defines the `AuthModule` struct which implements the `module.Module` interface, handling initialization, route setup, and migrations.

2. **Controller** (`controller.go`): Implements HTTP handlers for authentication endpoints (register, login, logout, password reset) and handles request validation.

3. **Service** (`service.go`): Contains the business logic for authentication, user creation, password hashing, token generation, and email sending.

4. **Models** (`model.go`): Defines data structures including the `AuthUser` model, request/response types, and event types for the authentication flow.

5. **Templates** (`template.go`): Contains HTML email templates for password reset and account verification emails.

6. **Errors** (`errors.go`): Defines authentication-specific error types and responses.

### Authentication Flows

The auth module implements several key authentication flows:

#### Registration Flow

1. User submits registration data (name, email, password, username)
2. Controller validates the request format
3. Service validates that the email and username are unique
4. Password is hashed using bcrypt
5. User is created in the database
6. JWT token is generated for the new user
7. Welcome email is sent to the user
8. User data and token are returned in the response

#### Login Flow

1. User submits login credentials (email/password)
2. Service looks up the user by email
3. Password is verified against the stored hash
4. Last login timestamp is updated
5. JWT token is generated with user information
6. User data and token are returned in the response

#### Password Reset Flow

1. User requests password reset by submitting their email
2. System generates a random reset token
3. Token is stored in the user record with an expiration time
4. Password reset email with the token is sent to the user
5. User submits new password along with the reset token
6. System validates the token and its expiration
7. Password is updated with the new hashed value
8. Reset token is cleared from the user record

## Core Authentication Features

Base provides a complete authentication system with the following features:

- User registration and login
- JWT token-based authentication
- API key authentication
- Password reset functionality
- OAuth integration (Google, Facebook, Apple)
- User profile management
- Media/file management
- WebSocket connections

## JWT Authentication

Base uses JSON Web Tokens (JWT) for secure authentication. Here's how to work with JWT in your application:

### How JWT Works in Base

1. When a user logs in or registers, the server generates a JWT token containing the user's ID and any additional claims.
2. This token is signed using the server's secret key (configured in your environment variables).
3. The client stores this token (typically in local storage or secure cookies) and sends it with each request.
4. The server validates the token's signature and extracts the user information for authorization.

### Generating JWT Tokens

Tokens are automatically generated during login and registration. If you need to generate a token manually:

```go
// Generate a JWT token for a user
token, err := helper.GenerateJWT(userId, nil)
if err != nil {
    // Handle error
}
```

You can include additional claims in the second parameter:

```go
extendedData := map[string]interface{}{
    "role": "admin",
    "permissions": []string{"read", "write"},
}
token, err := helper.GenerateJWT(userId, extendedData)
```

### Validating JWT Tokens

To validate a token and extract the user ID:

```go
userID, err := helper.ValidateJWT(tokenString)
if err != nil {
    // Token is invalid or expired
}
// Use the userID for authorization
```

### Protecting Routes with JWT Middleware

Base provides middleware to protect routes that require authentication:

```go
// In your module's Routes function
func (m *YourModule) Routes(router *gin.RouterGroup) {
    // Public routes
    router.GET("/public", m.PublicHandler)
    
    // Protected routes
    protected := router.Group("/")
    protected.Use(middleware.JWTAuth())
    {
        protected.GET("/profile", m.ProfileHandler)
        protected.PUT("/settings", m.UpdateSettingsHandler)
    }
}
```

## API Key Authentication

In addition to JWT authentication, Base supports API key authentication for server-to-server communication and third-party integrations.

### Creating API Keys

API keys can be generated for users with the following steps:

1. Generate a secure random token (Base uses a cryptographically secure random generator)
2. Store the key in the database with the associated user ID
3. Apply an expiration date (optional)

### Using API Keys

To authenticate with an API key, include it in the `X-API-Key` header of your HTTP requests:

```http
GET /api/resource HTTP/1.1
Host: your-api.example.com
X-API-Key: your-api-key-here
```

### API Key Middleware

Base provides middleware to protect routes that require API key authentication:

```go
func (m *YourModule) Routes(router *gin.RouterGroup) {
    // API key protected routes
    apiProtected := router.Group("/")
    apiProtected.Use(middleware.APIKeyAuth())
    {
        apiProtected.GET("/data", m.GetDataHandler)
        apiProtected.POST("/webhook", m.WebhookHandler)
    }
}
```

## OAuth Integration

Base supports OAuth authentication with popular providers like Google, Facebook, and Apple.

### Configuring OAuth Providers

To enable OAuth authentication, configure your provider credentials in your environment variables:

```bash
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URL=https://your-app.com/oauth/google/callback

# Facebook OAuth
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret
FACEBOOK_REDIRECT_URL=https://your-app.com/oauth/facebook/callback

# Apple OAuth
APPLE_CLIENT_ID=your-apple-client-id
APPLE_TEAM_ID=your-apple-team-id
APPLE_KEY_ID=your-apple-key-id
APPLE_PRIVATE_KEY=path-to-your-private-key
APPLE_REDIRECT_URL=https://your-app.com/oauth/apple/callback
```

### OAuth Flow

1. Redirect users to the provider's authorization URL
2. User authenticates with the provider and grants permission
3. Provider redirects back to your application with an authorization code
4. Your application exchanges the code for an access token
5. Use the access token to fetch the user's profile information
6. Create or update the user in your database
7. Generate a JWT token for the user and complete the authentication

## Authentication Endpoints

### User Authentication

The `/auth` endpoints handle user registration, login, and password management:

| Method | Endpoint                | Description                                 | Request Body                                      | Response                             |
|--------|-------------------------|---------------------------------------------|---------------------------------------------------|--------------------------------------|
| POST   | `/auth/register`        | Register a new user                         | `{email, password, name}`                         | User object with JWT token           |
| POST   | `/auth/login`           | Log in an existing user                     | `{email, password}`                               | User object with JWT token           |
| POST   | `/auth/logout`          | Log out a user                              | `{}`                                              | Success message                      |
| POST   | `/auth/forgot-password` | Request a password reset link               | `{email}`                                         | Success message with instructions    |
| POST   | `/auth/reset-password`  | Reset password using token                  | `{token, password, password_confirmation}`        | Success message                      |

### OAuth Integration

Base supports authentication with popular OAuth providers:

| Method | Endpoint                     | Description                | Request Body                          | Response                       |
|--------|------------------------------|----------------------------|--------------------------------------|--------------------------------|
| POST   | `/oauth/google/callback`     | Google OAuth callback      | OAuth response data                   | User object with JWT token     |
| POST   | `/oauth/facebook/callback`   | Facebook OAuth callback    | OAuth response data                   | User object with JWT token     |
| POST   | `/oauth/apple/callback`      | Apple OAuth callback       | OAuth response data                   | User object with JWT token     |

## Security Best Practices

Base implements several security best practices for authentication:

### Password Security

1. **Password Hashing**: All passwords are hashed using bcrypt with appropriate cost factors before storage.
2. **Password Validation**: Enforces minimum password strength requirements (at least 8 characters).
3. **Secure Password Reset**: Uses time-limited, single-use tokens for password resets.
4. **Brute Force Protection**: Implements rate limiting on authentication endpoints.

### Token Security

1. **Token Expiration**: JWT tokens include an expiration time (24 hours by default).
2. **Secure Token Storage**: Tokens should be stored securely on the client side (HTTP-only cookies or secure storage).
3. **Token Validation**: Every protected request validates the token signature and expiration time.

### API Security

1. **HTTPS Only**: All authentication endpoints should be accessed via HTTPS.
2. **CORS Configuration**: Properly configured CORS headers to prevent unauthorized cross-origin requests.
3. **API Rate Limiting**: Implements rate limiting to prevent abuse.

### OAuth Security

1. **State Parameter**: Uses the state parameter to prevent CSRF attacks during OAuth flows.
2. **Secure Callback Handling**: Validates OAuth callbacks and properly handles error cases.
3. **Minimal Scope Requests**: Only requests the minimum required scopes from OAuth providers.

## Multi-Language Support

Base supports internationalization for authentication messages and emails. Here's how to implement multi-language support for authentication:

### Translation Files

Create translation files for each supported language (e.g., `en_us.json`, `es_es.json`, `sq_al.json`) with authentication-related keys:

```json
// en_us.json
{
  "auth": {
    "login": {
      "title": "Log In",
      "email_placeholder": "Email Address",
      "password_placeholder": "Password",
      "submit": "Log In",
      "forgot_password": "Forgot Password?",
      "no_account": "Don't have an account?",
      "register": "Register"
    },
    "register": {
      "title": "Create Account",
      "name_placeholder": "Full Name",
      "email_placeholder": "Email Address",
      "password_placeholder": "Password",
      "confirm_password": "Confirm Password",
      "submit": "Register",
      "have_account": "Already have an account?",
      "login": "Log In"
    },
    "errors": {
      "invalid_credentials": "Invalid email or password",
      "user_exists": "User with this email already exists",
      "password_mismatch": "Passwords do not match",
      "weak_password": "Password must be at least 8 characters long"
    }
  }
}
```

### Email Templates

Provide localized versions of authentication email templates for password reset and welcome emails:

```go
// Get localized email template based on user's language preference
func (c *AuthController) getPasswordResetEmailTemplate(lang string) *template.Template {
    // Default to English if language not supported
    templatePath := "templates/emails/en/password_reset.html"
    
    // Check for localized version
    if lang == "es" {
        templatePath = "templates/emails/es/password_reset.html"
    } else if lang == "sq" {
        templatePath = "templates/emails/sq/password_reset.html"
    }
    
    // Load and parse template
    tmpl, err := template.ParseFiles(templatePath)
    if err != nil {
        // Fall back to default English template
        tmpl, _ = template.ParseFiles("templates/emails/en/password_reset.html")
    }
    
    return tmpl
}
```

### Language Detection

Implement language detection based on HTTP headers or user preferences:

```go
// Get user's preferred language from request or profile
func getLanguagePreference(ctx *gin.Context, userID uint) string {
    // Check if user has a language preference in their profile
    if userID > 0 {
        var user User
        if db.Where("id = ?", userID).First(&user).Error == nil && user.LanguagePreference != "" {
            return user.LanguagePreference
        }
    }
    
    // Check Accept-Language header
    acceptLang := ctx.GetHeader("Accept-Language")
    if strings.HasPrefix(acceptLang, "es") {
        return "es"
    } else if strings.HasPrefix(acceptLang, "sq") {
        return "sq"
    }
    
    // Default to English
    return "en"
}
```

### User Profile Management

The `/users/me` endpoints allow authenticated users to manage their profiles:

| Method | Endpoint                | Description                            | Request Body                 | Response                       |
|--------|-------------------------|----------------------------------------|------------------------------|--------------------------------|
| GET    | `/users/me`             | Get current user profile               | -                            | User profile data              |
| PUT    | `/users/me`             | Update user profile                    | User profile fields          | Updated user profile           |
| PUT    | `/users/me/avatar`      | Update user avatar                     | Image file                   | Updated user with avatar URL   |
| PUT    | `/users/me/password`    | Change user password                   | `{current_password, password, password_confirmation}` | Success message |
 
## Authentication Implementation

### JWT Token Authentication

Base uses JWT tokens for authentication. Here's how to use them:

```go
// Generating a token
token, err := auth.GenerateToken(user)

// Token is returned on login/registration
// Store token on client side (localStorage, cookie, etc.)

// For authenticated requests, include in header:
// Authorization: Bearer <token>
```

### API Key Authentication

For service-to-service communication, API keys are supported:

```go
// API keys are configured in .env file:
// API_KEY=your_api_key

// For API key requests, include in header:
// X-Api-Key: your_api_key
```

### Middleware Protection

Routes can be protected using the authentication middleware:

```go
// Protect routes with middleware
protectedGroup := router.Group("/api")
protectedGroup.Use(auth.AuthMiddleware())

// Or apply to specific routes
router.GET("/protected", auth.AuthMiddleware(), myHandler)
```

## User Registration Flow

1. Client submits registration data to `/auth/register`
2. Server validates the data and creates a new user
3. Server generates and returns a JWT token
4. Client stores the token and includes it in subsequent requests

## Password Reset Flow

1. User requests password reset via `/auth/forgot-password`
2. System generates a reset token and sends email to user
3. User clicks link in email and submits new password to `/auth/reset-password` with token
4. System validates token and updates password

## OAuth Authentication Flow

1. Client initiates OAuth flow with provider (Google, Facebook, Apple)
2. After provider authentication, client receives OAuth response
3. Client sends OAuth data to respective callback endpoint (e.g., `/oauth/google/callback`)
4. Server validates OAuth data and either creates a new user or logs in existing user
5. Server returns JWT token for authenticated session

## Security Best Practices

- Always use HTTPS in production
- Store tokens securely on the client side
- Implement token expiration and refresh mechanisms
- Use secure password hashing (Base uses bcrypt by default)
- Validate and sanitize all user inputs
- Implement rate limiting for authentication endpoints

## Customizing Authentication

Base allows you to customize the authentication system:

- Extend user model with additional fields
- Add custom validation rules
- Implement additional authentication providers
- Create custom middleware for specific authorization needs
- Configure token expiration times

## Example: Custom User Registration

```go
// Extend user registration with additional fields
type RegisterRequest struct {
    Email     string `json:"email" binding:"required,email"`
    Password  string `json:"password" binding:"required,min=8"`
    Name      string `json:"name" binding:"required"`
    Phone     string `json:"phone"`
    CompanyID uint   `json:"company_id"`
}

// Implement custom validation in controller
func (c *AuthController) Register(ctx *gin.Context) {
    var req RegisterRequest
    if err := ctx.ShouldBindJSON(&req); err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    
    // Custom validation logic
    if req.CompanyID > 0 {
        // Validate company exists
    }
    
    // Create user with extended fields
    user := &models.User{
        Email:     req.Email,
        Name:      req.Name,
        Phone:     req.Phone,
        CompanyID: req.CompanyID,
    }
    
    // Set password (hashing handled by service)
    if err := c.Service.SetPassword(user, req.Password); err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to set password"})
        return
    }
    
    // Create user and generate token
    if err := c.Service.Create(user); err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to register user"})
        return
    }
    
    token, err := c.Service.GenerateToken(user)
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
        return
    }
    
    ctx.JSON(http.StatusCreated, gin.H{
        "user":  user,
        "token": token,
    })
}
```

## Conclusion

The Base authentication system provides a complete solution for user management, authentication, and authorization in your applications. By leveraging these built-in features, you can quickly implement secure user authentication without having to build everything from scratch.
