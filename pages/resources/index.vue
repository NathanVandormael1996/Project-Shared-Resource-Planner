<script setup>
// Importeer de store
import { useResourceStore } from '~/stores/resources'

// Activeer de store
const store = useResourceStore()

// Roep de actie aan (server-side vriendelijk)
await useAsyncData('resources', async () => {
  await store.fetchResources()
})
</script>

<template>
  <div class="p-6 max-w-7xl mx-auto">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white tracking-tight">Beschikbare Resources</h1>
      <p class="text-slate-400 mt-2">Kies een item om te reserveren.</p>
    </div>

    <div v-if="store.loading" class="text-white animate-pulse">
      Resources ophalen...
    </div>

    <div v-else-if="store.error" class="bg-red-900/50 p-4 border border-red-500 text-red-200 rounded">
      Fout: {{ store.error }}
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ResourceCard
          v-for="item in store.resources"
          :key="item.id"
          :resource="item"
      />
    </div>
  </div>
</template>