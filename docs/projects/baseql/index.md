---
title: BaseQL Overview
---

# BaseQL

BaseQL is a Go framework for rapidly building powerful GraphQL servers, designed to simplify the process of creating GraphQL APIs with minimal boilerplate code.

## Features

### Rapid Development

BaseQL allows you to:
- Define your schema using a simple, declarative syntax
- Generate resolvers automatically based on your schema
- Focus on business logic rather than boilerplate code

### Type Safety

- Strong typing throughout the entire stack
- Compile-time checks for GraphQL schema
- Automatic validation of input data

### Performance

- Optimized for high-performance GraphQL operations
- Efficient query resolution
- Support for dataloader pattern to avoid N+1 query problems

### Extensibility

- Easy to extend with custom resolvers
- Middleware support for authentication, logging, etc.
- Plugin system for adding functionality

## Getting Started

```go
package main

import (
    "github.com/BaseTechStack/baseql"
)

func main() {
    // Initialize BaseQL
    ql := baseql.New()
    
    // Define your schema
    ql.Schema(`
        type User {
            id: ID!
            name: String!
            email: String!
        }
        
        type Query {
            user(id: ID!): User
            users: [User!]!
        }
    `)
    
    // Start the server
    ql.Serve(":8080")
}
```

## Installation

```bash
go get -u github.com/BaseTechStack/baseql
```

## License

BaseQL is available under the MIT License.

## Links

- [GitHub Repository](https://github.com/BaseTechStack/baseql)
- [Schema Definition](./schema)
- [Resolvers](./resolvers)
