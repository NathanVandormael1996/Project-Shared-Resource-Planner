<script setup>
import { useResourceStore } from '~/stores/resources'

const route = useRoute()
const id = parseInt(route.params.id)

const store = useResourceStore()

// Data ophalen
await useAsyncData('resource-check', async () => {
  if (store.resources.length === 0) {
    await store.fetchResources()
  }
})

const resource = computed(() => store.resources.find(r => r.id === id))
</script>

<template>
  <div class="min-h-screen bg-[#1a1c23] text-white p-6 font-sans">
    <div class="max-w-6xl mx-auto">

      <NuxtLink to="/resources" class="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6 transition-colors">
        &larr; Terug naar overzicht
      </NuxtLink>

      <div v-if="!resource" class="bg-red-900/50 border border-red-500 p-8 rounded text-center">
        <h1 class="text-3xl font-bold text-red-200">Niet gevonden</h1>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-10">

        <div>
          <div class="bg-[#24262d] rounded-xl overflow-hidden border border-gray-700 shadow-xl">
            <div class="aspect-video w-full bg-[#1a1c23] relative">
              <img v-if="resource.image_url" :src="resource.image_url" class="w-full h-full object-cover" />
              <div v-else class="flex items-center justify-center h-full text-gray-500">Geen afbeelding</div>
            </div>
            <div class="p-6">
              <div class="flex justify-between items-center mb-4">
                <h1 class="text-3xl font-bold text-white">{{ resource.title }}</h1>
                <span class="bg-blue-900/40 text-blue-300 border border-blue-900/40 text-xs px-2 py-1 rounded">
                  {{ resource.type }}
                </span>
              </div>
              <p class="text-gray-400 leading-relaxed">{{ resource.description }}</p>
            </div>
          </div>
        </div>

        <div>
          <ReservationForm :resource-id="resource.id" />
        </div>

      </div>
    </div>
  </div>
</template>