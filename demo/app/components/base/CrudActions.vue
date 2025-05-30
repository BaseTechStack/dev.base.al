<template>
  <UDropdownMenu :items="actionItems" arrow>
    <UButton color="neutral" variant="ghost" icon="i-heroicons-ellipsis-horizontal" />
  </UDropdownMenu>
</template>

<script setup lang="ts">
 
interface Props {
  /**
   * Comma-separated list of actions to include (e.g., 'view,edit,delete')
   */
  actions?: string;
  
  /**
   * The item/record to perform actions on
   */
  item: any;
  
  /**
   * The structure/module name (e.g., 'clients', 'products')
   * This is used to identify which modal to open
   */
  structure?: string;
  
  /**
   * Custom icons for actions (optional)
   * Format: { view: 'icon-name', edit: 'icon-name', delete: 'icon-name' }
   */
  icons?: Record<string, string>;
  
  /**
   * Custom labels for actions (optional)
   * Format: { view: 'Custom View Label', edit: 'Custom Edit Label', delete: 'Custom Delete Label' }
   */
  labels?: Record<string, string>;
}

const props = withDefaults(defineProps<Props>(), {
  actions: 'view,edit,delete',
  structure: '',
  icons: () => ({}),
  labels: () => ({})
});

type ActionType = 'view' | 'edit' | 'delete' | 'custom';

const emit = defineEmits<{
  view: [item: any];
  edit: [item: any];
  delete: [item: any];
  custom: [action: string, item: any];
}>();

// Default icons for standard actions
const defaultIcons = {
  view: 'i-heroicons-eye',
  edit: 'i-heroicons-pencil-square',
  delete: 'i-heroicons-trash'
};

// Default labels for standard actions
const defaultLabels = {
  view: 'View',
  edit: 'Edit',
  delete: 'Delete'
};

// Parse the actions string into an array
const enabledActions = computed(() => {
  return props.actions.split(',').map(action => action.trim()).filter(Boolean);
});

// Generate the dropdown menu items based on enabled actions
const actionItems = computed(() => {
  const items = enabledActions.value.map(action => {
    const isStandardAction = ['view', 'edit', 'delete'].includes(action);
    
    // Create the base item configuration
    const item: any = {
      label: props.labels[action] || defaultLabels[action as keyof typeof defaultLabels] || action,
      icon: props.icons[action] || defaultIcons[action as keyof typeof defaultIcons] || '',
      onSelect: () => {
        if (isStandardAction) {
          if (action === 'delete') {
            emit('delete', props.item);
          } else if (action === 'view') {
            // Always emit the event
            emit('view', props.item);
          } else if (action === 'edit') {
            // Always emit the event
            emit('edit', props.item);
          }
        } else {
          emit('custom', action, props.item);
        }
      }
    };
    
    // Add red color for delete action
    if (action === 'delete') {
      item.color = 'error';
    }
    
    return item;
  });
  
  return [items];
});
</script>
