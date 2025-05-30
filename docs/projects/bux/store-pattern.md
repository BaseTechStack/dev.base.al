---
title: Store Pattern
---

# Store Pattern in BaseUX

This page documents the store pattern implementation in BaseUX, highlighting the integration between the base store and entity-specific stores.

## Overview

The BaseUX store system uses composition with Pinia's `defineStore` for state management. This approach provides better type safety, improved developer experience, and more maintainable code.

## Implementation Details

The store pattern has been updated with the following improvements:

- Changed from standalone helper functions to composition with Pinia's `defineStore`
- Integrated specialized entity methods directly into the store object
- Updated entity store templates to follow this pattern for all new entities
- Fixed update method parameter structure to use `(id, data)` instead of an object with id

## Code Example

```js
// Example of an entity store using the updated pattern
import { defineStore } from 'pinia'
import { useBaseStore } from '@/stores/base'

export const useUsersStore = defineStore('users', () => {
  const baseStore = useBaseStore()
  
  // Entity-specific methods
  const fetchUsers = () => {
    return baseStore.fetch('users')
  }
  
  const createUser = (userData) => {
    return baseStore.create('users', userData)
  }
  
  const updateUser = (id, userData) => {
    return baseStore.update('users', id, userData)
  }
  
  const deleteUser = (id) => {
    return baseStore.delete('users', id)
  }
  
  return {
    // Expose base methods
    ...baseStore,
    
    // Expose entity-specific methods
    fetchUsers,
    createUser,
    updateUser,
    deleteUser
  }
})
```

## Usage in Components

Components can use either generic methods or entity-specific methods:

```vue
<script setup>
import { useUsersStore } from '@/stores/users'

const usersStore = useUsersStore()

// Using entity-specific method
const users = await usersStore.fetchUsers()

// Using generic method
const user = await usersStore.fetch('users', userId)

// Using the correct update parameter structure
await usersStore.updateUser(userId, { name: 'New Name' })
</script>
```

This pattern ensures consistent API usage across the application while providing specific methods for each entity type.
