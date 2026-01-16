<script setup>
import { useResourceStore } from '~/stores/resources'
import { ref, computed } from 'vue'

const store = useResourceStore()

// Data ophalen uit DB
await useAsyncData('resources', async () => {
  await store.fetchResources()
  return store.resources
})

// Searh en filter
const searchQuery = ref('')
const selectedFilter = ref('')

const uniqueTypes = computed(() => {
  if (!store.resources) return []
  const types = store.resources.map(r => r.type).filter(Boolean)
  return [...new Set(types)].sort()
})

const filteredResources = computed(() => {
  if (!store.resources) return []
  return store.resources.filter(resource => {
    const term = searchQuery.value.toLowerCase()
    const matchesSearch = resource.title.toLowerCase().includes(term) ||
        (resource.description && resource.description.toLowerCase().includes(term))
    const matchesType = selectedFilter.value === '' || resource.type === selectedFilter.value
    return matchesSearch && matchesType
  })
})

const handleReserveNavigation = (id) => navigateTo(`/resources/${id}`)

const removeResourceFromDatabase = async (id) => {
  if (confirm("Weet je zeker dat je deze resource wilt verwijderen?")) {
    try {
      await store.deleteResource(id)
    } catch (err) {
      alert("Kon niet verwijderen: " + err.message)
    }
  }
}

// Modals
const isEditModalOpen = ref(false)
const selectedResource = ref(null)

const openAddModal = () => {
  // Reset of selectedResource
  selectedResource.value = {
    id: null,
    title: '',
    type: '',
    description: '',
    image_url: ''
  }
  isEditModalOpen.value = true
}

const openEditModal = (resource) => {
  // Create a copy for safety
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
    alert("Opslaan mislukt: " + err.message)
  }
}
</script>

<template>
  <main class="min-h-screen transition-colors duration-300 bg-gray-50 dark:bg-[#1a1c23] text-gray-900 dark:text-gray-200 font-sans p-8">

    <div class="flex justify-between items-center mb-6">
      <NavButton />
      <ThemeToggle />
    </div>

    <div class="p-6 max-w-5xl mx-auto">
      <div class="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Resources</h1>
          <p class="text-slate-500 dark:text-slate-400 mt-1">Beheer de beschikbare hardware en ruimtes.</p>
        </div>

        <button
            @click="openAddModal"
            class="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg font-bold transition-all shadow-lg shadow-indigo-500/20 whitespace-nowrap"
        >
          Resource Toevoegen
        </button>
      </div>

      <div class="bg-white dark:bg-[#24262d] p-4 rounded-xl border border-gray-200 dark:border-gray-700 mb-6 flex flex-wrap gap-4 items-center shadow-sm">
        <div class="relative flex-1 min-w-[200px]">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
          <input
              v-model="searchQuery"
              type="text"
              placeholder="Zoek op naam..."
              class="w-full bg-gray-50 dark:bg-[#1a1c23] border border-gray-300 dark:border-gray-600 rounded-lg py-2 pl-10 pr-4 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div class="relative w-full md:w-64">
          <select
              v-model="selectedFilter"
              class="w-full bg-gray-50 dark:bg-[#1a1c23] border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-4 text-sm text-gray-900 dark:text-white appearance-none cursor-pointer focus:outline-none focus:border-indigo-500"
          >
            <option value="">Alle Types</option>
            <option v-for="type in uniqueTypes" :key="type" :value="type">{{ type }}</option>
          </select>
        </div>

        <button
            v-if="searchQuery || selectedFilter"
            @click="searchQuery = ''; selectedFilter = ''"
            class="text-xs font-bold text-red-500 hover:text-red-400 uppercase tracking-wider"
        >
          Reset
        </button>
      </div>

      <div v-if="store.loading" class="animate-pulse text-indigo-400 py-4">Loading resources...</div>

      <div v-else-if="filteredResources.length === 0" class="text-center py-12 bg-white dark:bg-[#24262d] rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
        <p class="text-gray-500 dark:text-gray-400 font-medium">Geen resources gevonden.</p>
      </div>

      <div v-else class="flex flex-col gap-4">
        <ResourceCard
            v-for="res in filteredResources"
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
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="isEditModalOpen = false"></div>
        <div class="relative bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">

          <div class="p-6 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
              {{ selectedResource.id ? 'Resource Aanpassen' : 'Nieuwe Resource' }}
            </h2>
            <button @click="isEditModalOpen = false" class="text-gray-500 dark:text-white text-2xl hover:text-gray-700">&times;</button>
          </div>

          <div class="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div>
              <label class="block text-xs font-bold uppercase text-gray-400 mb-1">Titel</label>
              <input v-model="selectedResource.title" type="text" placeholder="Naam van de resource" class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded p-3 text-gray-900 dark:text-white outline-none focus:border-indigo-500" />
            </div>

            <div>
              <label class="block text-xs font-bold uppercase text-gray-400 mb-1">Type</label>
              <input
                  v-model="selectedResource.type"
                  list="modal-types"
                  type="text"
                  placeholder="bijv. Hardware, Ruimte..."
                  class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded p-3 text-gray-900 dark:text-white outline-none focus:border-indigo-500"
              />
              <datalist id="modal-types">
                <option v-for="type in uniqueTypes" :key="type" :value="type" />
              </datalist>
            </div>

            <div>
              <label class="block text-xs font-bold uppercase text-gray-400 mb-1">Afbeelding URL</label>
              <input v-model="selectedResource.image_url" type="text" placeholder="https://..." class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded p-3 text-gray-900 dark:text-white outline-none focus:border-indigo-500" />
            </div>

            <div>
              <label class="block text-xs font-bold uppercase text-gray-400 mb-1">Beschrijving</label>
              <textarea v-model="selectedResource.description" placeholder="Korte beschrijving..." rows="3" class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded p-3 text-gray-900 dark:text-white outline-none focus:border-indigo-500"></textarea>
            </div>
          </div>

          <div class="p-6 bg-gray-50 dark:bg-slate-900/50 flex justify-end gap-3">
            <button @click="isEditModalOpen = false" class="px-4 py-2 text-gray-600 dark:text-slate-300 hover:underline">Annuleren</button>
            <button @click="handleSave" class="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-bold transition-colors">
              {{ selectedResource.id ? 'Bijwerken' : 'Opslaan' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </main>
</template>