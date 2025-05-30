---
title: Core Email System
---

# Email System

The Base framework provides a flexible email system that supports multiple email providers through a unified interface. This allows you to easily send emails from your application and switch between providers as needed.

## Features

- Support for multiple email providers (SMTP, SendGrid, Postmark)
- Simple API for sending emails
- HTML and plain text email support
- Easy configuration through environment variables
- Fallback to default sender for development

## Configuration

Email configuration is handled through environment variables:

```bash
# Email configuration
MAIL_DRIVER=smtp     # Options: smtp, sendgrid, postmark, default
MAIL_FROM=no-reply@example.com

# SMTP Configuration
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=username
MAIL_PASSWORD=password

# SendGrid Configuration
SENDGRID_API_KEY=your_sendgrid_api_key

# Postmark Configuration
POSTMARK_API_KEY=your_postmark_api_key
```

## Basic Usage

### Initializing the Email System

The email system is typically initialized during application startup:

```go
import "base/core/email"

// Initialize email system with your application's configuration
if err := email.Initialize(cfg); err != nil {
    log.Fatalf("Failed to initialize email system: %v", err)
}
```

### Sending a Simple Email

```go
// Send a plain text email
msg := email.Message{
    To:      []string{"user@example.com"},
    Subject: "Welcome to Base",
    Body:    "Thank you for joining us!",
    IsHTML:  false,
}

if err := email.Send(msg); err != nil {
    log.Error("Failed to send email:", err)
}
```

### Sending an HTML Email

```go
// Send an HTML email
msg := email.Message{
    To:      []string{"user@example.com"},
    Subject: "Welcome to Base",
    Body:    "<h1>Welcome!</h1><p>Thank you for joining us!</p>",
    IsHTML:  true,
}

if err := email.Send(msg); err != nil {
    log.Error("Failed to send email:", err)
}
```

## Supported Providers

### SMTP

The SMTP provider allows you to send emails through any SMTP server:

```go
// SMTP configuration
type SMTPConfig struct {
    Host     string
    Port     int
    Username string
    Password string
    From     string
}

// Automatically created from environment variables
sender, err = NewSMTPSender(cfg)
```

### SendGrid

The SendGrid provider allows you to send emails through the SendGrid API:

```go
// SendGrid configuration
type SendGridConfig struct {
    APIKey string
    From   string
}

// Automatically created from environment variables
sender, err = NewSendGridSender(cfg)
```

### Postmark

The Postmark provider allows you to send emails through the Postmark API:

```go
// Postmark configuration
type PostmarkConfig struct {
    APIKey string
    From   string
}

// Automatically created from environment variables
sender, err = NewPostmarkSender(cfg)
```

### Default Sender

For development and testing, Base includes a default sender that logs emails instead of actually sending them:

```go
// For development environments
sender, err = NewDefaultSender(cfg)
```

## Advanced Usage

### Custom Email Templates

You can use Go's template system to create dynamic emails:

```go
import "text/template"

// Create a template
tmpl, err := template.New("welcome").Parse(`
<h1>Welcome, {{.Name}}!</h1>
<p>Thank you for joining us. Your account has been created successfully.</p>
<p>Click <a href="{{.ActivationLink}}">here</a> to activate your account.</p>
`)
if err != nil {
    log.Error("Failed to parse template:", err)
    return
}

// Render the template
data := struct {
    Name           string
    ActivationLink string
}{
    Name:           user.Name,
    ActivationLink: fmt.Sprintf("https://example.com/activate/%s", user.ActivationToken),
}

var body bytes.Buffer
if err := tmpl.Execute(&body, data); err != nil {
    log.Error("Failed to render template:", err)
    return
}

// Send the email
msg := email.Message{
    To:      []string{user.Email},
    Subject: "Welcome to Base",
    Body:    body.String(),
    IsHTML:  true,
}

if err := email.Send(msg); err != nil {
    log.Error("Failed to send email:", err)
}
```

### Integrating with Events

You can combine the email system with the event system to send emails in response to events:

```go
// Listen for user registration events
emitter.On("user.registered", func(data interface{}) {
    if user, ok := data.(*models.User); ok {
        // Send welcome email
        msg := email.Message{
            To:      []string{user.Email},
            Subject: "Welcome to Base",
            Body:    fmt.Sprintf("Welcome, %s! Thank you for registering.", user.Name),
            IsHTML:  false,
        }
        
        if err := email.Send(msg); err != nil {
            log.Error("Failed to send welcome email:", err)
        }
    }
})
```

## Implementation Details

The email system is implemented using a simple provider pattern:

```go
// Message represents an email message
type Message struct {
    To      []string
    From    string
    Subject string
    Body    string
    IsHTML  bool
}

// Sender interface for all email providers
type Sender interface {
    Send(msg Message) error
}

// Factory function to create the appropriate sender
func NewSender(cfg *config.Config) (Sender, error) {
    switch cfg.EmailProvider {
    case "smtp":
        return NewSMTPSender(cfg)
    case "sendgrid":
        return NewSendGridSender(cfg)
    case "postmark":
        return NewPostmarkSender(cfg)
    case "default":
        return NewDefaultSender(cfg)
    case "":
        logrus.Warnf("EMAIL_PROVIDER not set, using default sender")
        return NewDefaultSender(cfg)
    default:
        return nil, fmt.Errorf("unsupported email provider: %s", cfg.EmailProvider)
    }
}
```

## Best Practices

1. **Use Environment Variables**: Store email credentials in environment variables, never hardcode them.

2. **Implement Retries**: For production applications, consider implementing retry logic for failed email attempts.

3. **Async Email Sending**: For better performance, consider sending emails asynchronously using goroutines.

4. **Email Templates**: Use templates for all emails to maintain consistency and make updates easier.

5. **Testing**: Use the default sender during testing to avoid sending actual emails.

## Testing Emails

For testing, you can use the default sender which logs emails instead of sending them:

```go
// Configure for testing
os.Setenv("MAIL_DRIVER", "default")

// Initialize the email system
email.Initialize(cfg)

// Send test email - will be logged instead of sent
msg := email.Message{
    To:      []string{"test@example.com"},
    Subject: "Test Email",
    Body:    "This is a test email.",
    IsHTML:  false,
}

email.Send(msg)
```

Alternatively, you can use services like Mailtrap for testing SMTP emails in development environments.