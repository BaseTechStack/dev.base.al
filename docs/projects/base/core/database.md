---
title: Core Database System
---

# Database System

The Base framework includes a flexible database system built on top of GORM, supporting multiple database backends including SQLite, MySQL, and PostgreSQL. This system provides a consistent interface for database operations while allowing you to leverage the full power of GORM.

## Features

- Multiple database backend support (SQLite, MySQL, PostgreSQL)
- Connection pooling and management
- Environment-based configuration
- Integration with GORM for powerful ORM capabilities
- Migration support

## Configuration

The database system can be configured through environment variables:

```bash
# Database configuration
DB_DRIVER=sqlite       # Options: sqlite, mysql, postgres
DB_PATH=database.db    # Path for SQLite database

# For MySQL/PostgreSQL
DB_HOST=localhost      # Database host
DB_PORT=3306           # Database port (3306 for MySQL, 5432 for PostgreSQL)
DB_USER=root           # Database username
DB_PASSWORD=password   # Database password
DB_NAME=base           # Database name

# Optional: complete database URL (overrides individual settings)
DB_URL=                # Complete database connection string
```

## Basic Usage

### Initializing the Database

The database is typically initialized during application startup:

```go
import (
    "base/core/config"
    "base/core/database"
)

// Load configuration
cfg, err := config.LoadConfig()
if err != nil {
    panic("Failed to load configuration: " + err.Error())
}

// Initialize database
db, err := database.InitDB(cfg)
if err != nil {
    panic("Failed to initialize database: " + err.Error())
}
```

### Defining Models

Models in Base are standard GORM models:

```go
type User struct {
    gorm.Model         // Includes ID, CreatedAt, UpdatedAt, DeletedAt
    Email      string  `gorm:"size:255;not null;unique" json:"email"`
    Name       string  `gorm:"size:255" json:"name"`
    Password   string  `gorm:"size:255;not null" json:"-"`
    Role       string  `gorm:"size:50;default:'user'" json:"role"`
}
```

### Auto Migrations

You can use GORM's auto migration to create tables:

```go
// Auto migrate models
err := db.AutoMigrate(&User{}, &Product{}, &Order{})
if err != nil {
    panic("Failed to migrate database: " + err.Error())
}
```

## Database Operations

### Create

```go
// Create a new user
user := User{
    Email:    "user@example.com",
    Name:     "John Doe",
    Password: hashedPassword,
    Role:     "user",
}

result := db.Create(&user)
if result.Error != nil {
    return fmt.Errorf("failed to create user: %w", result.Error)
}
```

### Read

```go
// Find user by ID
var user User
result := db.First(&user, id)
if result.Error != nil {
    return nil, fmt.Errorf("failed to find user: %w", result.Error)
}

// Find user by email
result := db.Where("email = ?", email).First(&user)
if result.Error != nil {
    return nil, fmt.Errorf("failed to find user: %w", result.Error)
}

// Find all users
var users []User
result := db.Find(&users)
if result.Error != nil {
    return nil, fmt.Errorf("failed to find users: %w", result.Error)
}
```

### Update

```go
// Update user
user.Name = "Jane Doe"
result := db.Save(&user)
if result.Error != nil {
    return fmt.Errorf("failed to update user: %w", result.Error)
}

// Update specific fields
result := db.Model(&user).Updates(map[string]interface{}{
    "name": "Jane Doe",
    "role": "admin",
})
if result.Error != nil {
    return fmt.Errorf("failed to update user: %w", result.Error)
}
```

### Delete

```go
// Delete user
result := db.Delete(&user)
if result.Error != nil {
    return fmt.Errorf("failed to delete user: %w", result.Error)
}

// Soft delete (since User embeds gorm.Model which includes DeletedAt)
// This marks the record as deleted but doesn't remove it from the database
result := db.Delete(&user)

// Hard delete (permanently removes the record)
result := db.Unscoped().Delete(&user)
```

## Advanced Queries

### Joins

```go
type Order struct {
    gorm.Model
    UserID    uint
    User      User
    Products  []Product `gorm:"many2many:order_products;"`
    Total     float64
}

// Get orders with their users and products
var orders []Order
result := db.Preload("User").Preload("Products").Find(&orders)
```

### Transactions

```go
// Start a transaction
tx := db.Begin()

// Perform multiple operations
user := User{Email: "user@example.com", Name: "John Doe"}
if err := tx.Create(&user).Error; err != nil {
    tx.Rollback()
    return err
}

order := Order{UserID: user.ID, Total: 99.99}
if err := tx.Create(&order).Error; err != nil {
    tx.Rollback()
    return err
}

// Commit the transaction
tx.Commit()
```

## Database Providers

### SQLite

SQLite is ideal for development, testing, or small applications. It stores the database in a single file.

```bash
DB_DRIVER=sqlite
DB_PATH=database.db
```

### MySQL

MySQL is a popular open-source relational database management system.

```bash
DB_DRIVER=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=base
```

Or using a connection string:

```bash
DB_DRIVER=mysql
DB_URL=root:password@tcp(localhost:3306)/base?charset=utf8mb4&parseTime=True&loc=Local
```

### PostgreSQL

PostgreSQL is a powerful, open-source object-relational database system.

```bash
DB_DRIVER=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=base
```

Or using a connection string:

```bash
DB_DRIVER=postgres
DB_URL=host=localhost port=5432 user=postgres dbname=base password=password sslmode=disable
```

## Implementation Details

The database system is implemented using GORM with support for multiple database drivers:

```go
// InitDB initializes the database connection based on the provided configuration.
func InitDB(cfg *config.Config) (*Database, error) {
    var err error
    switch cfg.DBDriver {
    case "sqlite":
        DB, err = gorm.Open(sqlite.Open(cfg.DBPath), &gorm.Config{})
    case "mysql":
        if cfg.DBURL == "" {
            cfg.DBURL = fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
                cfg.DBUser, cfg.DBPassword, cfg.DBHost, cfg.DBPort, cfg.DBName)
        }
        DB, err = gorm.Open(mysql.Open(cfg.DBURL), &gorm.Config{})
    case "postgres":
        if cfg.DBURL == "" {
            cfg.DBURL = fmt.Sprintf("host=%s port=%s user=%s dbname=%s password=%s sslmode=disable",
                cfg.DBHost, cfg.DBPort, cfg.DBUser, cfg.DBName, cfg.DBPassword)
        }
        DB, err = gorm.Open(postgres.Open(cfg.DBURL), &gorm.Config{})
    default:
        return nil, fmt.Errorf("unsupported database driver: %s", cfg.DBDriver)
    }

    if err != nil {
        return nil, fmt.Errorf("failed to connect to the database: %v", err)
    }

    return &Database{DB: DB}, nil
}
```

## Best Practices

1. **Use Migrations**: Always use migrations to manage your database schema changes.

2. **Parameterized Queries**: Always use parameterized queries to prevent SQL injection.

3. **Transactions**: Use transactions for operations that require multiple database changes to maintain data integrity.

4. **Connection Pooling**: Configure connection pooling appropriately for your application's needs.

5. **Error Handling**: Always check and handle database errors properly.

6. **Indexes**: Add indexes to columns that are frequently used in WHERE, ORDER BY, and JOIN clauses.

7. **Soft Deletes**: Use GORM's soft delete feature (DeletedAt) for data that shouldn't be permanently deleted.

8. **Database Abstraction**: Use repository patterns to abstract database operations from your business logic.

## Integration with Models

In the Base framework, models typically integrate with the database system as follows:

```go
package models

import (
    "base/core/database"
    "gorm.io/gorm"
)

type User struct {
    gorm.Model
    Email    string `gorm:"size:255;not null;unique" json:"email"`
    Name     string `gorm:"size:255" json:"name"`
    Password string `gorm:"size:255;not null" json:"-"`
    Role     string `gorm:"size:50;default:'user'" json:"role"`
}

func (u *User) Create() error {
    return database.DB.Create(u).Error
}

func (u *User) Update() error {
    return database.DB.Save(u).Error
}

func (u *User) Delete() error {
    return database.DB.Delete(u).Error
}

func GetUserByID(id uint) (*User, error) {
    var user User
    if err := database.DB.First(&user, id).Error; err != nil {
        return nil, err
    }
    return &user, nil
}

func GetUserByEmail(email string) (*User, error) {
    var user User
    if err := database.DB.Where("email = ?", email).First(&user).Error; err != nil {
        return nil, err
    }
    return &user, nil
}
```
