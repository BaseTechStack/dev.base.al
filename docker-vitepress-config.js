// Custom VitePress config for Docker build
import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'

// Read the original config
const originalConfigPath = path.resolve('./docs/.vitepress/config.mjs')
const originalConfigContent = fs.readFileSync(originalConfigPath, 'utf8')

// Evaluate the original config (in a safe way)
// This is a simplified approach for demo purposes
let originalConfig = {}
try {
  // Extract the defineConfig part
  const configMatch = originalConfigContent.match(/defineConfig\(([\s\S]*)\)/m)
  if (configMatch && configMatch[1]) {
    // Convert to a string that can be parsed as JSON (very simplified)
    const configStr = configMatch[1]
      .replace(/\/\/.*/g, '') // Remove comments
      .replace(/(\w+):/g, '"$1":') // Add quotes to keys
      .replace(/'/g, '"') // Replace single quotes with double quotes
    
    // Try to parse it
    try {
      originalConfig = JSON.parse(`{${configStr}}`)
    } catch (e) {
      console.warn('Could not parse config as JSON, using empty config')
    }
  }
} catch (e) {
  console.warn('Error reading original config, using empty config')
}

// Create a new config with lastUpdated disabled
export default defineConfig({
  ...originalConfig,
  lastUpdated: false, // Disable lastUpdated feature
  themeConfig: {
    ...originalConfig.themeConfig,
    lastUpdated: false, // Also disable in theme config
  }
})
