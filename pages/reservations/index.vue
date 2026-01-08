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
  <body class="bg-[#1a1c23] text-gray-200 font-sans p-8">
    <h1 class="text-slate-50 font-bold tracking-widest text-2xl uppercase mb-6">Reservations</h1>
    <div v-if="store.loading" class="flex items-center space-x-2 text-indigo-400 animate-pulse">
      <div class="w-4 h-4 bg-indigo-400 rounded-full"></div>
      <span>Reservaties laden...</span>
    </div>

    <div v-else-if="store.error" class="bg-red-900/50 p-4 border border-red-500 text-red-200 rounded-lg">
      <p class="font-bold">Er is iets misgegaan:</p>
      <p class="text-sm">{{ store.error }}</p>
    </div>

    <div class="mb-8">
      <div v-if="!store.loading" class="max-w-xl">
        <ReservationCard
            v-for="res in store.reservations"
            :key="res.id"
            :reservation="res"
        />
      </div>
    </div>

    <div v-if="!store.loading && !store.error && store.reservations.length === 0" class="text-slate-500 italic">
      Je hebt nog geen reservaties geplaatst.
    </div>
  </body>
</template>