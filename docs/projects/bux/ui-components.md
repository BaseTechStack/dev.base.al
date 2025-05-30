---
title: UI Components
---

# BaseUX UI Components

BaseUX provides a comprehensive set of UI components built on top of Nuxt UI to accelerate your development workflow. This guide covers the core components, their usage, and customization options.

## Component Overview

BaseUX components are organized into several categories:

1. **Layout Components**: Page structure and organization
2. **Data Display Components**: Visualizing data in various formats
3. **Form Components**: Input collection and validation
4. **Action Components**: Buttons, modals, and interactive elements
5. **Feedback Components**: Notifications, alerts, and progress indicators

## Entity Components

Each generated entity comes with a complete set of pre-built components:

### Grid View Components

`EntityGrid.vue` and `EntityGridCard.vue` provide a responsive, card-based layout for displaying collections of entities.

```vue
<template>
  <PostGrid 
    @view="openViewModal" 
    @edit="openEditModal" 
    @delete="openDeleteModal" 
  />
</template>

<script setup>
const openViewModal = (post) => {
  // Implementation
}
</script>
```

The `EntityGridCard.vue` component supports customization via props and slots:

```vue
<PostGridCard 
  :item="post"
  title="title"
  subtitle="content"
  :fields="[
    { key: 'author', label: 'Author' },
    { key: 'publishedAt', label: 'Published', format: 'date' }
  ]"
  timestamp="createdAt"
  hover
>
  <template #actions>
    <BaseCrudActions 
      structure="posts"
      :item="post" 
      actions="view,edit,delete"
      @view="$emit('view', $event)"
      @edit="$emit('edit', $event)"
      @delete="$emit('delete', $event)"
    />
  </template>
  
  <template #footer-actions>
    <UButton
      size="xs"
      color="primary"
      variant="ghost"
      icon="i-heroicons-eye"
      @click="$emit('view', post)"
    >
      View Details
    </UButton>
  </template>
</PostGridCard>
```

### Table Components

`EntityTable.vue` provides a feature-rich table with sorting, filtering, and pagination:

```vue
<PostTable
  :actions="['view', 'edit', 'delete']"
  @view="openViewModal"
  @edit="openEditModal"
  @delete="openDeleteModal"
/>
```

### CRUD Modal Components

BaseUX generates modal components for Create, Read, Update, and Delete operations:

- `AddEntityModal.vue`: Form for creating new entities
- `ViewEntityModal.vue`: Detailed view of an entity
- `EditEntityModal.vue`: Form for updating entities
- `DeleteEntityModal.vue`: Confirmation dialog for deletion

```vue
<template>
  <AddPostModal
    v-model:open="showAddModal"
    @created="handleCreated"
  />
  
  <ViewPostModal
    v-model:open="showViewModal"
    :post-id="selectedPostId"
  />
  
  <EditPostModal
    v-model:open="showEditModal"
    :post-id="selectedPostId"
    @updated="handleUpdated"
  />
  
  <DeletePostModal
    v-model:open="showDeleteModal"
    :post-id="selectedPostId"
    @deleted="handleDeleted"
  />
</template>
```

## Prop Naming Consistency

BaseUX components support flexible prop naming to enhance reusability across entities:

- Components accept entity-specific props (`:post` for posts)
- Optional generic props (`:item`) for cross-entity usage
- This prevents "Missing required prop" warnings while maintaining the expected interface

For example, a component can be used in multiple contexts:

```vue
<!-- When used specifically with posts -->
<PostGrid :post="selectedPost" />

<!-- When used in a generic context -->
<PostGrid :item="selectedItem" />
```

## Core UI Components

### BaseCrudActions

A reusable component for rendering consistent CRUD action buttons:

```vue
<BaseCrudActions 
  structure="posts"
  :item="post" 
  actions="view,edit,delete"
  @view="$emit('view', $event)"
  @edit="$emit('edit', $event)"
  @delete="$emit('delete', $event)"
/>
```

Props:
- `structure`: The name of the entity structure
- `item`: The entity object
- `actions`: Comma-separated list of allowed actions

### BaseEntityForm

A dynamic form generator for entity CRUD operations:

```vue
<BaseEntityForm
  entity="posts"
  :schema="formSchema"
  :values="formValues"
  @submit="handleSubmit"
/>
```

Props:
- `entity`: The entity name
- `schema`: Form field definitions
- `values`: Initial form values
- `submitLabel`: Custom submit button label

### BaseModal

A consistent modal component used by all CRUD operations:

```vue
<BaseModal
  v-model:open="isOpen"
  :title="modalTitle"
  size="2xl"
>
  <div class="space-y-4">
    <!-- Modal content -->
  </div>
  
  <template #footer>
    <div class="flex justify-end space-x-2">
      <UButton
        color="gray"
        variant="ghost"
        @click="isOpen = false"
      >
        Cancel
      </UButton>
      <UButton
        color="primary"
        :loading="loading"
        @click="handleAction"
      >
        Confirm
      </UButton>
    </div>
  </template>
</BaseModal>
```

## Customizing Components

### Global Style Customization

You can customize the global style of components in your `app.config.ts` file:

```typescript
// app.config.ts
export default defineAppConfig({
  ui: {
    primary: 'indigo',
    gray: 'slate',
    button: {
      default: {
        size: 'sm',
        color: 'primary',
        variant: 'solid'
      }
    },
    card: {
      background: 'bg-white dark:bg-gray-900',
      ring: 'ring-1 ring-gray-200 dark:ring-gray-800',
      rounded: 'rounded-lg',
      shadow: 'shadow-sm'
    }
  }
})
```

### Component Override

You can override any BaseUX component by creating a component with the same name in your project:

1. Create a file in `app/components` with the same name as the component you want to override
2. Implement your custom version
3. BaseUX will automatically use your version instead of the default

### Extending Templates

For more comprehensive customization, you can create custom templates:

1. Create a `templates` directory in your project
2. Copy the default templates from BaseUX
3. Modify them to match your requirements
4. Use the `--template` flag when generating entities:

```bash
bux g entity products --template custom
```

## Best Practices

### Component Organization

- Place global components in `app/components`
- Place entity-specific components in `structures/[entity]/components`
- Use the appropriate naming conventions:
  - `EntityGrid.vue` for grid views
  - `EntityForm.vue` for reusable forms
  - `AddEntityModal.vue` for CRUD modals

### Responsive Design

BaseUX components are designed to be responsive by default:

```vue
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  <EntityGridCard v-for="item in items" :key="item.id" :item="item" />
</div>
```

### Form Validation

Use Nuxt UI's form validation:

```vue
<UForm :state="state" @submit="onSubmit">
  <UFormGroup label="Title" name="title">
    <UInput v-model="state.title" />
  </UFormGroup>
  <UFormGroup label="Content" name="content">
    <UTextarea v-model="state.content" />
  </UFormGroup>
  <UButton type="submit">Submit</UButton>
</UForm>
```

### Component Communication

Use events for communication between components:

```vue
<!-- Parent component -->
<EntityGrid @view="openViewModal" @edit="openEditModal" />

<!-- Child component -->
<template>
  <UButton @click="$emit('view', item)">View</UButton>
</template>
```
