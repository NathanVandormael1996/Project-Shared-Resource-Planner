<script setup>
// Importeer de store
import { useResourceStore } from '~/stores/resources'

// Activeer de store
const store = useResourceStore()

await useAsyncData('resources', async () => {
  await store.fetchResources()
  return store.resources
})
</script>

<template>
  <body class="bg-[#1a1c23] text-gray-200 font-sans p-8">
  <NavButton />

  <div class="p-6 max-w-7xl mx-auto">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white tracking-tight">Beschikbare Resources</h1>
      <p class="text-slate-400 mt-2">Kies een item om te reserveren.</p>
    </div>

    <div v-if="store.loading" class="flex items-center space-x-2 text-indigo-400 animate-pulse">
      <div class="w-4 h-4 bg-indigo-400 rounded-full"></div>
      <span>Resources laden...</span>
    </div>

    <div v-else-if="store.error" class="bg-red-900/50 p-4 border border-red-500 text-red-200 rounded-lg">
      <p class="font-bold">Er is iets misgegaan:</p>
      <p class="text-sm">{{ store.error }}</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
      <NuxtLink
          v-for="item in store.resources"
          :key="item.id"
          :to="`/resources/${item.id}`"
      >
        <ResourceCard :resource="item" />
      </NuxtLink>
    </div>

    <div v-if="!store.loading && !store.error && store.resources.length === 0" class="text-slate-500 italic">
      Geen resources gevonden.
    </div>
  </div>
  </body>
</template>