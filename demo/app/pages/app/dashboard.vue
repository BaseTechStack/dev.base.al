<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">Dashboard</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Quick Stats -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-lg font-semibold mb-4">Quick Stats</h2>
        <div class="space-y-4">
          <div>
            <span class="text-gray-600">Total Clients</span>
            <p class="text-2xl font-bold">0</p>
          </div>
          <div>
            <span class="text-gray-600">Active Projects</span>
            <p class="text-2xl font-bold">0</p>
          </div>
        </div>
      </div>
      <!-- Recent Activity -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-lg font-semibold mb-4">Recent Activity</h2>
        <div class="text-gray-600">
          No recent activity
        </div>
      </div>
      <UCarousel v-slot="{ item }" :items="items" class="w-full max-w-xs mx-auto">
    <img :src="item" width="320" height="320" class="rounded-lg">
  </UCarousel>

      <!-- Quick Actions -->
 
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-lg font-semibold mb-4">Quick Actions</h2>
        <div class="space-y-4">
          
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
const items = [
  'https://picsum.photos/640/640?random=1',
  'https://picsum.photos/640/640?random=2',
  'https://picsum.photos/640/640?random=3',
  'https://picsum.photos/640/640?random=4',
  'https://picsum.photos/640/640?random=5',
  'https://picsum.photos/640/640?random=6'
]</script>

 