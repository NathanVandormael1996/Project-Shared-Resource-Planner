<script setup>
import { useResourceStore } from '~/stores/resources'
import { ref, computed } from 'vue'

const store = useResourceStore()
const resources = computed(() => store.resources)

// Set global body styles the "Nuxt Way"
useHead({
  bodyAttrs: {
    class: 'min-h-screen bg-[#1a1c23] text-gray-200 font-sans'
  }
})

// Fetch data for the store
await useAsyncData('resources', async () => {
  await store.fetchResources()
  return store.resources
})

// Navigation handler: Only called by the 'reserve' emit
const handleReserveNavigation = (id) => {
  navigateTo(`/resources/${id}`)
}

const removeResourceFromDatabase = async (id) => {
  if (confirm("Weet je zeker dat je deze resource wilt verwijderen?")) {
    try {
      await store.deleteResource(id)
    } catch (err) {
      alert("Fout: " + err.message)
    }
  }
}

const isEditModalOpen = ref(false)
const selectedResource = ref(null)

const openAddModal = () => {
  selectedResource.value = { title: '', type: '', description: '', image_url: '' }
  isEditModalOpen.value = true
}

const openEditModal = (resource) => {
  selectedResource.value = { ...resource }
  isEditModalOpen.value = true
}

const handleSave = async () => {
  try {
    if (selectedResource.value.id) {
      await store.updateResource(selectedResource.value.id, selectedResource.value)
    } else {
      await store.addResource(selectedResource.value)
    }
    isEditModalOpen.value = false
    selectedResource.value = null
  } catch (err) {
    alert("Fout bij opslaan: " + err.message)
  }
}
</script>

<template>
  <main class="p-8">
    <NavButton />

    <div class="p-6 max-w-5xl mx-auto">
      <div class="mb-8 flex justify-between items-end">
        <div>
          <h1 class="text-3xl font-bold text-white tracking-tight">Resources</h1>
          <p class="text-slate-400 mt-1">Beheer de beschikbare hardware en ruimtes.</p>
        </div>

        <button
            @click="openAddModal"
            class="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg font-bold transition-all shadow-lg shadow-indigo-500/20"
        >
          Resource Toevoegen
        </button>
      </div>

      <div v-if="store.loading" class="animate-pulse text-indigo-400">Loading resources...</div>

      <div v-else class="flex flex-col gap-4">
        <ResourceCard
            v-for="res in resources"
            :key="res.id"
            :resource="res"
            @edit="openEditModal"
            @delete="removeResourceFromDatabase"
            @reserve="handleReserveNavigation"
        />
      </div>
    </div>

    <Teleport to="body">
      <div v-if="isEditModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="isEditModalOpen = false"></div>
        <div class="relative bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
          <div class="p-6 border-b border-slate-700 flex justify-between items-center text-white">
            <h2 class="text-xl font-bold">{{ selectedResource.id ? 'Aanpassen' : 'Toevoegen' }}</h2>
            <button @click="isEditModalOpen = false" class="text-2xl hover:text-slate-400 transition-colors">&times;</button>
          </div>

          <div class="p-6 space-y-4">
            <input v-model="selectedResource.title" type="text" placeholder="Titel" class="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white outline-none focus:border-indigo-500" />
            <input v-model="selectedResource.type" type="text" placeholder="Type" class="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white outline-none focus:border-indigo-500" />
            <input v-model="selectedResource.image_url" type="text" placeholder="Afbeelding URL" class="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white outline-none focus:border-indigo-500" />
            <textarea v-model="selectedResource.description" placeholder="Beschrijving" rows="3" class="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white outline-none focus:border-indigo-500"></textarea>
          </div>

          <div class="p-6 bg-slate-900/50 flex justify-end gap-3">
            <button @click="isEditModalOpen = false" class="px-4 py-2 text-slate-300 hover:text-white transition-colors">Annuleren</button>
            <button @click="handleSave" class="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-bold transition-colors">Opslaan</button>
          </div>
        </div>
      </div>
    </Teleport>
  </main>
</template>