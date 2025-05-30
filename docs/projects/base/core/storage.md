---
title: Core Storage System
---

# Storage System

The Base framework provides a powerful storage system for handling file uploads and attachments. The storage system is built around the concept of Active Storage, which allows for easy file management with support for multiple storage providers.

## Features

- Multiple storage providers (Local, S3, Cloudflare R2)
- File validation
- Attachment management for models
- Easy API for uploading and retrieving files
- Configurable through environment variables

## Configuration

Storage configuration is handled through environment variables:

```env
# Storage configuration
STORAGE_DRIVER=local  # Options: local, s3, r2
STORAGE_PATH=storage  # Local storage path

# For S3/R2 configuration
STORAGE_ACCOUNT_ID=your-access-key
STORAGE_API_KEY=your-secret-key
STORAGE_REGION=us-east-1
STORAGE_BUCKET=your-bucket
STORAGE_ENDPOINT=https://your-endpoint.com  # For R2
```

## Storage Providers

### Local Storage

The default storage provider that stores files on the local filesystem.

```go
provider, err = NewLocalProvider(LocalConfig{
	Path: storagePath,
})
```

### S3 Storage

Stores files on Amazon S3.

```go
provider, err = NewS3Provider(S3Config{
	AccessKey: config.AccessKey,
	SecretKey: config.SecretKey,
	Region:    config.Region,
	Bucket:    config.Bucket,
})
```

### R2 Storage

Stores files on Cloudflare R2 (S3-compatible).

```go
provider, err = NewR2Provider(R2Config{
	AccessKey: config.AccessKey,
	SecretKey: config.SecretKey,
	Bucket:    config.Bucket,
	Endpoint:  config.Endpoint,
})
```

## Usage

### Basic File Upload

```go
// In your controller
func (c *MyController) UploadFile(ctx *gin.Context) {
    file, err := ctx.FormFile("file")
    if err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": "No file provided"})
        return
    }
    
    // Store the file using the storage system
    attachment, err := c.Storage.Attach(model, "field_name", file)
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    
    ctx.JSON(http.StatusOK, gin.H{"url": attachment.URL})
}
```

### Attachment Configuration

You can configure how attachments are handled for different models and fields:

```go
// In your module initialization
func (m *MyModule) Initialize() {
    // Register attachment configuration
    m.Storage.RegisterAttachment("User", storage.AttachmentConfig{
        Field:       "avatar",
        MaxSize:     5 * 1024 * 1024, // 5MB
        AllowedTypes: []string{"image/jpeg", "image/png"},
    })
}
```

### Deleting Files

```go
// Delete an attachment
if err := storage.Delete(attachment); err != nil {
    log.Error("Failed to delete attachment", err)
}
```

## Active Storage Pattern

The Active Storage pattern in Base allows you to easily associate files with your models:

```go
// Implement the Attachable interface for your model
type User struct {
    gorm.Model
    Name       string
    AvatarID   uint
    Avatar     *storage.Attachment `json:"avatar"`
}

// Implement the Attachable interface
func (u *User) GetID() uint {
    return u.ID
}

func (u *User) GetModelName() string {
    return "User"
}
```

## File Validation

The storage system includes built-in validation for:

- File size limits
- Allowed MIME types
- File extension validation

```go
// Example validation configuration
storage.RegisterAttachment("Document", storage.AttachmentConfig{
    Field:        "file",
    MaxSize:      10 * 1024 * 1024, // 10MB
    AllowedTypes: []string{"application/pdf", "application/msword"},
    ValidateFunc: func(file *multipart.FileHeader) error {
        // Custom validation logic
        return nil
    },
})
```

## Working with URLs

Attachments automatically generate URLs for accessing files:

```go
// Get the URL of an attachment
url := attachment.URL

// In your templates
<img src="{{ .User.Avatar.URL }}" alt="User avatar">
```

## Events

The storage system emits events when files are uploaded or deleted:

- `{model}.{field}.uploaded`: Emitted when a file is uploaded
- `{model}.{field}.deleted`: Emitted when a file is deleted

You can listen for these events using the emitter system:

```go
emitter.On("user.avatar.uploaded", func(data interface{}) {
    if attachment, ok := data.(*storage.Attachment); ok {
        // Process the uploaded avatar
        log.Info("Avatar uploaded", attachment.URL)
    }
})
```