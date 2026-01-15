<script setup>
import { useResourceStore } from '~/stores/resources'
import { ref, computed } from 'vue'

const store = useResourceStore()

// Zorg voor de juiste achtergrondkleur op deze specifieke pagina
useHead({
  bodyAttrs: {
    class: 'min-h-screen bg-[#1a1c23] text-gray-200 font-sans'
  }
})

// Data ophalen (SSR compatible). We wachten tot de store gevuld is.
await useAsyncData('resources', async () => {
  await store.fetchResources()
  return store.resources
})

// --- Filter & Zoek Logica ---
const searchQuery = ref('')
const selectedFilter = ref('')

// We halen de types dynamisch uit de resources, zodat we ze niet hoeven te hardcoden.
// Set zorgt ervoor dat we geen dubbele waardes krijgen.
const uniqueTypes = computed(() => {
  if (!store.resources) return []
  const types = store.resources.map(r => r.type).filter(Boolean)
  return [...new Set(types)].sort()
})

// Dit is de hoofdlijst die we renderen. Hij filtert live op basis van input.
const filteredResources = computed(() => {
  if (!store.resources) return []
  return store.resources.filter(resource => {

    // 1. Zoeken: Case-insensitive check op titel én beschrijving
    const term = searchQuery.value.toLowerCase()
    const matchesSearch = resource.title.toLowerCase().includes(term) ||
        (resource.description && resource.description.toLowerCase().includes(term))

    // 2. Filteren: Als er niks geselecteerd is (''), laten we alles door
    const matchesType = selectedFilter.value === '' || resource.type === selectedFilter.value

    return matchesSearch && matchesType
  })
})

// --- Acties (Navigatie & DB) ---

const handleReserveNavigation = (id) => {
  navigateTo(`/resources/${id}`)
}

const removeResourceFromDatabase = async (id) => {
  if (confirm("Weet je zeker dat je deze resource wilt verwijderen?")) {
    try {
      await store.deleteResource(id)
    } catch (err) {
      alert("Kon niet verwijderen: " + err.message)
    }
  }
}

// --- Modal State (Toevoegen/Bewerken) ---
const isEditModalOpen = ref(false)
const selectedResource = ref(null)

const openAddModal = () => {
  // Leeg object initialiseren voor nieuwe items
  selectedResource.value = { title: '', type: '', description: '', image_url: '' }
  isEditModalOpen.value = true
}

const openEditModal = (resource) => {
  // Kopie maken om reactivity issues te voorkomen tijdens het typen
  selectedResource.value = { ...resource }
  isEditModalOpen.value = true
}

const handleSave = async () => {
  try {
    // Checken of we updaten (id bestaat) of nieuw aanmaken
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
  <main class="p-8">
    <NavButton />

    <div class="p-6 max-w-5xl mx-auto">

      <div class="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 class="text-3xl font-bold text-white tracking-tight">Resources</h1>
          <p class="text-slate-400 mt-1">Beheer de beschikbare hardware en ruimtes.</p>
        </div>

        <button
            @click="openAddModal"
            class="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg font-bold transition-all shadow-lg shadow-indigo-500/20 whitespace-nowrap"
        >
          Resource Toevoegen
        </button>
      </div>

      <div class="bg-[#24262d] p-4 rounded-xl border border-gray-700 mb-6 flex flex-wrap gap-4 items-center">

        <div class="relative flex-1 min-w-[200px]">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
          <input
              v-model="searchQuery"
              type="text"
              placeholder="Zoek op naam of beschrijving..."
              class="w-full bg-[#1a1c23] border border-gray-600 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div class="relative w-full md:w-64">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>
          </div>
          <select
              v-model="selectedFilter"
              class="w-full bg-[#1a1c23] border border-gray-600 rounded-lg py-2 pl-10 pr-8 text-sm text-white appearance-none cursor-pointer focus:outline-none focus:border-indigo-500"
          >
            <option value="">Alle Types</option>
            <option v-for="type in uniqueTypes" :key="type" :value="type">
              {{ type }}
            </option>
          </select>
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>

        <button
            v-if="searchQuery || selectedFilter"
            @click="searchQuery = ''; selectedFilter = ''"
            class="text-xs font-bold text-red-400 hover:text-red-300 uppercase tracking-wider"
        >
          Reset
        </button>
      </div>

      <div v-if="store.loading" class="animate-pulse text-indigo-400 py-4">Loading resources...</div>

      <div v-else-if="filteredResources.length === 0" class="text-center py-12 bg-[#24262d] rounded-xl border border-dashed border-gray-700">
        <p class="text-gray-400 font-medium">Geen resources gevonden.</p>
        <p class="text-sm text-gray-500 mt-1" v-if="searchQuery || selectedFilter">Probeer je filters aan te passen.</p>
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