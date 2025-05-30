---
title: Core Events System
---

# Events System

The Base framework includes a lightweight, thread-safe event system built around the Emitter pattern. This system enables different parts of your application to communicate without direct dependencies, promoting loose coupling and modular design.

## Features

- Thread-safe event emission and handling
- Asynchronous event processing
- Panic recovery for stability
- Simple API for publishing and subscribing to events

## Basic Usage

### Creating an Emitter

The emitter is typically created once and injected into your application components:

```go
import "base/core/emitter"

// Create a new emitter
emitter := emitter.New()
```

### Subscribing to Events

To listen for events, use the `On` method:

```go
// Listen for user creation events
emitter.On("user.created", func(data interface{}) {
    if user, ok := data.(*models.User); ok {
        // Handle the user creation event
        log.Info("User created", 
            logger.String("email", user.Email),
            logger.Int("id", int(user.ID)))
    }
})
```

### Emitting Events

To publish events, use the `Emit` method:

```go
// In your service
func (s *UserService) Create(user *models.User) error {
    if err := s.DB.Create(user).Error; err != nil {
        return err
    }
    
    // Emit an event after successful creation
    s.Emitter.Emit("user.created", user)
    return nil
}
```

## Common Event Patterns

Base follows consistent naming patterns for events:

| Event Pattern | Description | Example |
|---------------|-------------|--------|
| `{model}.created` | Emitted when a record is created | `user.created` |
| `{model}.updated` | Emitted when a record is updated | `post.updated` |
| `{model}.deleted` | Emitted when a record is deleted | `comment.deleted` |
| `{model}.{field}.uploaded` | Emitted when a file is uploaded | `user.avatar.uploaded` |
| `{model}.{field}.deleted` | Emitted when a file is deleted | `post.image.deleted` |

## Advanced Usage

### Multiple Listeners

You can register multiple listeners for the same event:

```go
// Log user creations
emitter.On("user.created", func(data interface{}) {
    if user, ok := data.(*models.User); ok {
        log.Info("User created", logger.String("email", user.Email))
    }
})

// Send welcome email
emitter.On("user.created", func(data interface{}) {
    if user, ok := data.(*models.User); ok {
        emailService.SendWelcomeEmail(user.Email)
    }
})
```

### Error Handling

The emitter includes built-in panic recovery to prevent crashes:

```go
// The emitter will recover from panics in listeners
emitter.On("risky.event", func(data interface{}) {
    // Even if this panics, it won't crash your application
    riskyOperation(data)
})
```

## Implementation Details

The emitter is implemented with the following characteristics:

- Uses a read-write mutex for thread safety
- Runs listeners in separate goroutines for concurrency
- Includes panic recovery for stability
- Uses a WaitGroup to wait for all listeners to complete

```go
type Emitter struct {
    listeners map[string][]func(interface{})
    mutex     sync.RWMutex
}

func (e *Emitter) Emit(event string, data interface{}) {
    e.mutex.RLock()
    defer e.mutex.RUnlock()

    // Use a WaitGroup to wait for all listeners to finish
    var wg sync.WaitGroup
    for _, listener := range e.listeners[event] {
        wg.Add(1)
        go func(listener func(interface{})) {
            defer wg.Done()
            defer func() {
                if r := recover(); r != nil {
                    fmt.Printf("Recovered from panic in listener for event %s: %v\n", event, r)
                }
            }()
            listener(data)
        }(listener)
    }
    wg.Wait() // Block until all listeners complete
}
```

## Best Practices

1. **Be Consistent with Event Names**: Follow the established naming patterns for clarity.

2. **Type Assertions**: Always check types with type assertions when handling events.

3. **Keep Listeners Light**: Event listeners should be lightweight and quick. For heavy processing, consider spawning separate goroutines.

4. **Documentation**: Document all events your module emits for other developers.

5. **Avoid Circular Events**: Be careful not to create circular event chains where event A triggers event B which triggers event A again.

## Use Cases

### Audit Logging

```go
// Log all user activities
emitter.On("user.*", func(data interface{}) {
    // Record the event in the audit log
    auditLogger.Log(data)
})
```

### Cache Invalidation

```go
// Invalidate cache when data changes
emitter.On("post.updated", func(data interface{}) {
    if post, ok := data.(*models.Post); ok {
        cache.Invalidate("post:"+strconv.Itoa(int(post.ID)))
    }
})
```

### WebSocket Notifications

```go
// Send real-time updates to connected clients
emitter.On("notification.created", func(data interface{}) {
    if notification, ok := data.(*models.Notification); ok {
        wsManager.SendToUser(notification.UserID, notification)
    }
})
```