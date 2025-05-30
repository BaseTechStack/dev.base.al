---
title: Core App System
---

# Core App Initialization

The Core App system is the core architecture of the Base framework, responsible for initializing and managing the various modules that make up your application. It provides a structured way to organize code, handle dependencies, and set up routes.

## Features

- Modular architecture for organizing code
- Dependency injection for services
- Automatic module initialization and migration
- Route configuration management
- Support for authentication and protected routes

## Core Structure

The Core App system is built around the `Core` struct, which acts as a container for all core application dependencies:

```go
// Core represents the core application with all its dependencies
type Core struct {
    DB          *gorm.DB
    Router      *gin.RouterGroup // Protected routes requiring auth
    AuthRouter  *gin.RouterGroup // Auth routes (login, register)
    EmailSender email.Sender
    Logger      logger.Logger
    Storage     *storage.ActiveStorage
    Emitter     *emitter.Emitter
    Modules     map[string]module.Module
}
```

## Built-in Modules

The Base framework includes several built-in modules:

1. **Users Module** - Handles user management and profiles
2. **Auth Module** - Manages authentication, registration, and password resets
3. **Media Module** - Provides file upload and management capabilities

## Initializing the Core

The Core is initialized with its dependencies, which are then passed to the modules:

```go
// Example from start.go
func Start() {
    // Initialize dependencies
    db, err := database.InitDB(cfg)
    if err != nil {
        log.Fatal("Failed to initialize database:", err)
    }
    
    emailSender := email.NewSender(cfg)
    logger := logger.NewLogger(cfg)
    storage := storage.NewStorage(cfg)
    emitter := emitter.NewEmitter()
    
    // Create router groups
    router := gin.Default()
    authRouter := router.Group("/auth")
    protectedRouter := router.Group("/api")
    protectedRouter.Use(middleware.AuthMiddleware())
    
    // Initialize core with dependencies
    core := app.NewCore(
        db,
        protectedRouter,
        authRouter,
        emailSender,
        logger,
        storage,
        emitter,
    )
    
    // Core is now ready with all modules initialized
}
```

## Module System

The App system uses a module-based architecture, where each module implements the `module.Module` interface:

```go
// Module interface (defined in module/module.go)
type Module interface {
    // Each module may implement additional methods:
    // Init() error
    // Migrate() error
    // Routes(*gin.RouterGroup)
}
```

### Module Initialization

Modules are initialized automatically when the Core is created:

```go
// Inside Core.initializeModules()
moduleInitializers := map[string]func() module.Module{
    "users": func() module.Module {
        return users.NewUserModule(
            core.DB,
            core.Router,
            core.Logger,
            core.Storage,
        )
    },
    "media": func() module.Module {
        return media.NewMediaModule(
            core.DB,
            core.Router,
            core.Storage,
            core.Emitter,
            core.Logger,
        )
    },
    "auth": func() module.Module {
        return auth.NewAuthModule(
            core.DB,
            core.AuthRouter, // Use AuthRouter for auth routes
            core.EmailSender,
            core.Logger,
            core.Emitter,
        )
    },
}
```

The initialization process automatically handles:

1. Creating the module instance
2. Calling `Init()` if implemented
3. Running migrations via `Migrate()` if implemented
4. Setting up routes via `Routes()` if implemented

## Creating Custom Modules

You can create custom modules by implementing the Module interface:

```go
package mymodule

import (
    "github.com/gin-gonic/gin"
    "gorm.io/gorm"
)

type MyModule struct {
    db     *gorm.DB
    logger logger.Logger
}

func NewMyModule(db *gorm.DB, logger logger.Logger) *MyModule {
    return &MyModule{
        db:     db,
        logger: logger,
    }
}

// Init performs initialization tasks
func (m *MyModule) Init() error {
    m.logger.Info("Initializing my module")
    // Initialization logic
    return nil
}

// Migrate creates or updates database tables
func (m *MyModule) Migrate() error {
    m.logger.Info("Running migrations for my module")
    return m.db.AutoMigrate(&MyModel{})
}

// Routes sets up the API routes
func (m *MyModule) Routes(r *gin.RouterGroup) {
    group := r.Group("/my-module")
    {
        group.GET("/items", m.getItems)
        group.POST("/items", m.createItem)
        group.GET("/items/:id", m.getItem)
        group.PUT("/items/:id", m.updateItem)
        group.DELETE("/items/:id", m.deleteItem)
    }
}

// Handler methods
func (m *MyModule) getItems(c *gin.Context) {
    // Implementation
}

// Other handlers...
```

## Registering Custom Modules

To register a custom module with the Core, you can extend the `initializeModules` function:

```go
// In your application's startup code
import "myapp/mymodule"

// Create custom initializer function
coreInitializer := func(core *app.Core) {
    // Get the original modules
    modules := core.initializeModules()
    
    // Add your custom module
    myMod := mymodule.NewMyModule(core.DB, core.Logger)
    modules["mymodule"] = myMod
    
    // Initialize the custom module
    if err := myMod.Init(); err != nil {
        core.Logger.Error("Failed to initialize custom module", err)
    }
    
    // Run migrations
    if err := myMod.Migrate(); err != nil {
        core.Logger.Error("Failed to run migrations for custom module", err)
    }
    
    // Set up routes
    myMod.Routes(core.Router)
    
    return modules
}

// Pass the custom initializer to Core
```

## Module Communication

Modules can communicate with each other through the event system:

```go
// Module A: Publishing an event
func (m *ModuleA) createItem(c *gin.Context) {
    // Create item
    item := &Item{Name: "New Item"}
    m.db.Create(item)
    
    // Emit event
    m.emitter.Emit("item.created", item)
}

// Module B: Subscribing to events
func (m *ModuleB) Init() error {
    // Subscribe to events from Module A
    m.emitter.On("item.created", m.handleItemCreated)
    return nil
}

func (m *ModuleB) handleItemCreated(data interface{}) {
    item, ok := data.(*Item)
    if !ok {
        return
    }
    
    // Process the new item
    m.logger.Info("New item created", logger.String("name", item.Name))
}
```

## Accessing Modules

You can access modules through the Core:

```go
// Get a specific module
userModule, ok := core.Modules["users"].(*users.UserModule)
if ok {
    // Use the user module
}

// Get all module names
moduleNames := core.GetModuleNames()
```

## Best Practices

1. **Module Organization**: Keep related functionality within a single module for better code organization.

2. **Dependency Injection**: Pass required dependencies to modules rather than having modules create their own dependencies.

3. **Event-Driven Communication**: Use the event system for communication between modules to maintain loose coupling.

4. **Consistent Error Handling**: Use the logger provided by the Core for consistent error reporting.

5. **Router Grouping**: Organize routes within a router group named after your module for clear API paths.

6. **Module Interface**: Implement the Module interface consistently across all modules.

7. **Migrations**: Use the Migrate method to define database schema changes for your module.

## Example: Complete Module

Here's a complete example of a custom module:

```go
package products

import (
    "base/core/logger"
    "base/core/types"
    "net/http"
    "strconv"

    "github.com/gin-gonic/gin"
    "gorm.io/gorm"
)

// Product model
type Product struct {
    gorm.Model
    Name        string  `json:"name"`
    Description string  `json:"description"`
    Price       float64 `json:"price"`
    SKU         string  `json:"sku" gorm:"uniqueIndex"`
}

// ProductModule manages products
type ProductModule struct {
    db     *gorm.DB
    logger logger.Logger
}

// NewProductModule creates a new product module
func NewProductModule(db *gorm.DB, logger logger.Logger) *ProductModule {
    return &ProductModule{
        db:     db,
        logger: logger,
    }
}

// Init initializes the module
func (m *ProductModule) Init() error {
    m.logger.Info("Initializing product module")
    return nil
}

// Migrate creates or updates database tables
func (m *ProductModule) Migrate() error {
    m.logger.Info("Running migrations for product module")
    return m.db.AutoMigrate(&Product{})
}

// Routes sets up the API routes
func (m *ProductModule) Routes(r *gin.RouterGroup) {
    products := r.Group("/products")
    {
        products.GET("", m.listProducts)
        products.POST("", m.createProduct)
        products.GET("/:id", m.getProduct)
        products.PUT("/:id", m.updateProduct)
        products.DELETE("/:id", m.deleteProduct)
    }
}

// Handler implementations
func (m *ProductModule) listProducts(c *gin.Context) {
    var products []Product
    if err := m.db.Find(&products).Error; err != nil {
        c.JSON(http.StatusInternalServerError, types.ErrorResponse{
            Error: "Failed to fetch products",
        })
        return
    }
    
    c.JSON(http.StatusOK, products)
}

func (m *ProductModule) createProduct(c *gin.Context) {
    var product Product
    if err := c.ShouldBindJSON(&product); err != nil {
        c.JSON(http.StatusBadRequest, types.ErrorResponse{
            Error: "Invalid product data",
        })
        return
    }
    
    if err := m.db.Create(&product).Error; err != nil {
        c.JSON(http.StatusInternalServerError, types.ErrorResponse{
            Error: "Failed to create product",
        })
        return
    }
    
    c.JSON(http.StatusCreated, product)
}

// Additional handler methods...
```
