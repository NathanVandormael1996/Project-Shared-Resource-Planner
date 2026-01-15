<script setup>
import { useReservationStore } from '~/stores/reservations'
import { useResourceStore } from '~/stores/resources'
import { ref, computed } from 'vue'

const store = useReservationStore()
const resourceStore = useResourceStore()

// --- State ---
const searchTerm = ref('')
const resourceFilter = ref('') // Stores the selected ID or empty string
const isEditModalOpen = ref(false)
const selectedReservation = ref(null)

useHead({
  bodyAttrs: {
    class: 'min-h-screen bg-[#1a1c23] text-gray-200 font-sans'
  }
})

// Data fetcher
await useAsyncData('app-data', async () => {
  await Promise.all([
    store.fetchReservations(),
    resourceStore.fetchResources()
  ])
  return {
    reservations: store.reservations,
    resources: resourceStore.resources
  }
})

// Helpers
const getResourceName = (id) => {
  const res = resourceStore.resources.find(r => r.id === id)
  return res ? res.title : 'Onbekende Resource'
}

// Logic for the filter
const filteredReservations = computed(() => {
  return store.reservations.filter(res => {
    // Search term check
    const term = searchTerm.value.toLowerCase()
    const matchesSearch = term === '' ||
        (res.name && res.name.toLowerCase().includes(term)) ||
        (res.title && res.title.toLowerCase().includes(term))

    // Resource filter check
    const matchesResource = resourceFilter.value === '' ||
        res.resource_id === resourceFilter.value

    return matchesSearch && matchesResource
  })
})

const handleDelete = async (id) => {
  if (confirm('Ben je zeker dat je deze reservatie wilt verwijderen?')) {
    const result = await store.deleteReservation(id);
    if (!result.success && store.error) {
      alert('Fout bij verwijderen: ' + store.error);
    }
  }
}

// --- Modal Logic ---
const openAddModal = () => {
  selectedReservation.value = {
    resource_id: resourceFilter.value || '', // Pre-fill if filter is active
    title: '',
    name: '',
    date: new Date().toISOString().split('T')[0],
    start_time: '09:00',
    end_time: '10:00'
  }
  isEditModalOpen.value = true
}

const openEditModal = (reservation) => {
  selectedReservation.value = { ...reservation }
  isEditModalOpen.value = true
}

const handleSave = async () => {
  try {
    if (!selectedReservation.value.resource_id) {
      alert("Selecteer aub een resource!")
      return
    }

    let result;
    if (selectedReservation.value.id) {
      result = await store.updateReservation(selectedReservation.value)
    } else {
      result = await store.addReservation(selectedReservation.value)
    }

    if (result.success) {
      isEditModalOpen.value = false
      selectedReservation.value = null
    } else {
      alert(store.error)
    }
  } catch (err) {
    alert("Onverwachte fout: " + err.message)
  }
}
</script>

<template>
  <main class="p-8">
    <NavButton />

    <div class="p-6 max-w-5xl mx-auto">

      <div class="mb-8 flex justify-between items-end">
        <div>
          <h1 class="text-3xl font-bold text-white tracking-tight">Reservations</h1>
          <p class="text-slate-400 mt-1">Beheer alle boekingen en tijdsblokken.</p>
        </div>

        <button
            @click="openAddModal"
            class="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg font-bold transition-all shadow-lg shadow-indigo-500/20"
        >
          Nieuwe Reservatie
        </button>
      </div>

      <div class="bg-[#24262d] p-4 rounded-xl border border-gray-700 mb-6 flex flex-wrap gap-4 items-center">

        <div class="relative flex-1 min-w-[200px]">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
          <input
              v-model="searchTerm"
              type="text"
              placeholder="Zoek op naam of titel..."
              class="w-full bg-[#1a1c23] border border-gray-600 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div class="relative w-full md:w-64">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>
          </div>
          <select
              v-model="resourceFilter"
              class="w-full bg-[#1a1c23] border border-gray-600 rounded-lg py-2 pl-10 pr-8 text-sm text-white appearance-none cursor-pointer focus:outline-none focus:border-indigo-500"
          >
            <option value="">Alle Resources</option>
            <option v-for="r in resourceStore.resources" :key="r.id" :value="r.id">
              {{ r.title }}
            </option>
          </select>
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>

        <button
            v-if="searchTerm || resourceFilter"
            @click="searchTerm = ''; resourceFilter = ''"
            class="text-xs font-bold text-red-400 hover:text-red-300 uppercase tracking-wider"
        >
          Reset
        </button>
      </div>

      <div v-if="store.loading" class="animate-pulse text-indigo-400">Loading data...</div>

      <div v-else-if="store.error" class="bg-red-900/50 p-4 border border-red-500 text-red-200 rounded-lg mb-6">
        <p class="font-bold">Er is iets misgegaan:</p>
        <p class="text-sm">{{ store.error }}</p>
      </div>

      <div v-else class="flex flex-col gap-4">

        <div v-if="filteredReservations.length === 0" class="text-center py-12 bg-[#24262d] rounded-xl border border-dashed border-gray-700">
          <p class="text-gray-400 font-medium">Geen reservaties gevonden.</p>
          <p class="text-sm text-gray-500 mt-1" v-if="searchTerm || resourceFilter">Probeer je filters aan te passen.</p>
        </div>

        <ReservationCard
            v-for="res in filteredReservations"
            :key="res.id"
            :reservation="{ ...res, resourceName: getResourceName(res.resource_id) }"
            @edit="openEditModal"
            @delete="handleDelete"
        />
      </div>
    </div>

    <Teleport to="body">
      <div v-if="isEditModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="isEditModalOpen = false"></div>
        <div class="relative bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
          <div class="p-6 border-b border-slate-700 flex justify-between items-center text-white">
            <h2 class="text-xl font-bold">{{ selectedReservation.id ? 'Boeking Aanpassen' : 'Nieuwe Boeking' }}</h2>
            <button @click="isEditModalOpen = false" class="text-2xl hover:text-slate-400 transition-colors">&times;</button>
          </div>

          <div class="p-6 space-y-4">
            <div>
              <label class="block text-xs text-slate-400 mb-1 uppercase font-bold">Kies Resource</label>
              <div class="relative">
                <select
                    v-model="selectedReservation.resource_id"
                    class="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white outline-none focus:border-indigo-500 appearance-none cursor-pointer"
                >
                  <option value="" disabled>Selecteer een optie...</option>
                  <option v-for="r in resourceStore.resources" :key="r.id" :value="r.id">
                    {{ r.title }} ({{ r.type }})
                  </option>
                </select>
                <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
            </div>

            <input v-model="selectedReservation.title" type="text" placeholder="Titel van meeting" class="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white outline-none focus:border-indigo-500" />
            <input v-model="selectedReservation.name" type="text" placeholder="Naam reserveerder" class="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white outline-none focus:border-indigo-500" />

            <div>
              <label class="block text-xs text-slate-400 mb-1 uppercase font-bold">Datum</label>
              <input v-model="selectedReservation.date" type="date" class="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white outline-none focus:border-indigo-500 [color-scheme:dark]" />
            </div>

            <div class="flex gap-4">
              <div class="flex-1">
                <label class="block text-xs text-slate-400 mb-1 uppercase font-bold">Start Tijd</label>
                <input v-model="selectedReservation.start_time" type="time" class="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white outline-none focus:border-indigo-500 [color-scheme:dark]" />
              </div>
              <div class="flex-1">
                <label class="block text-xs text-slate-400 mb-1 uppercase font-bold">Eind Tijd</label>
                <input v-model="selectedReservation.end_time" type="time" class="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white outline-none focus:border-indigo-500 [color-scheme:dark]" />
              </div>
            </div>
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