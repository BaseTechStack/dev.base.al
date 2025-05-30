export default defineAppConfig({
  ui: {
    notifications: {
      // Default position for notifications
      position: 'top-right'
    },
    colors: {
      primary: 'emerald',
      gray: 'slate'
    },
    button: {
      color: {
        gray: {
          solid: 'bg-gray-500 dark:bg-gray-400 hover:bg-gray-600 dark:hover:bg-gray-300 text-white dark:text-gray-900',
          ghost: 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
        }
      }
    }
  }
})
