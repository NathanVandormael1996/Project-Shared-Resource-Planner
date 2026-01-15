<script setup>
// Importeer de store voor reservaties
import { useReservationStore } from '~/stores/reservations'

// Activeer de store
const store = useReservationStore()

// Haal de data op tijdens Server Side Rendering (of navigatie)
await useAsyncData('reservations', async () => {
  await store.fetchReservations()
  return store.reservations
})
</script>

<template>
  <div class="bg-[#1a1c23] text-gray-200 font-sans p-8 min-h-screen">
    <NavButton />

    <div class="max-w-4xl mx-auto">
      <h1 class="text-slate-50 font-bold tracking-widest text-2xl uppercase mb-6">Reservations</h1>

      <div v-if="store.loading" class="flex items-center space-x-2 text-blue-400 animate-pulse">
        <div class="w-4 h-4 bg-blue-400 rounded-full"></div>
        <span>Reservaties laden...</span>
      </div>

      <div v-else-if="store.error" class="bg-red-900/50 p-4 border border-red-500 text-red-200 rounded-lg mb-6">
        <p class="font-bold">Er is iets misgegaan:</p>
        <p class="text-sm">{{ store.error }}</p>
      </div>

      <div v-else class="space-y-4">

        <div v-if="store.reservations.length === 0" class="text-gray-500 italic">
          Nog geen reservaties gevonden.
        </div>

        <div v-else class="grid grid-cols-1 gap-4">
          <ReservationCard
              v-for="res in store.reservations"
              :key="res.id"
              :reservation="res"
          />
        </div>
      </div>
    </div>
  </div>
</template>