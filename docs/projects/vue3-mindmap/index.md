---
title: Vue3 Mindmap Component
---

# Vue3 Mindmap

A lightweight and customizable mindmap component for Vue 3 applications, perfect for visualizing hierarchical data, concept maps, and brainstorming sessions.

## Features

### Easy Integration

- Simple to add to any Vue 3 project
- TypeScript support out of the box
- Minimal dependencies

### Customizable

- Custom node styling and templates
- Flexible layout options
- Theme support

### Interactive

- Drag and drop functionality
- Zoom and pan capabilities
- Keyboard navigation

### Performance

- Optimized for large mindmaps
- Efficient rendering even with complex hierarchies
- Minimal memory footprint

## Basic Usage

```vue
<template>
  <Mindmap :data="mindmapData" />
</template>

<script setup>
import { Mindmap } from 'vue3-mindmap'
import { ref } from 'vue'

const mindmapData = ref({
  id: 'root',
  label: 'Main Concept',
  children: [
    {
      id: 'child1',
      label: 'Child Node 1',
      children: []
    },
    {
      id: 'child2',
      label: 'Child Node 2',
      children: []
    }
  ]
})
</script>
```

## Installation

```bash
npm install vue3-mindmap
```

## Links

- [GitHub Repository](https://github.com/BaseTechStack/vue3-mindmap)
- [Usage Guide](./usage)
