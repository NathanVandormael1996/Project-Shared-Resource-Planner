<script setup>
import { useReservationStore } from '~/stores/reservations'

const store = useReservationStore()

// Fetch
await useAsyncData('todays-reservations', async () => {
  await store.fetchReservations()
  return store.reservations
})

// Filter op vandaag
const todaysReservations = computed(() => {
  const today = new Date().toISOString().split('T')[0] // Formaat: YYYY-MM-DD
  return store.reservations.filter(res => res.date === today)
})
</script>

<template>
  <body class="bg-[#1a1c23] text-gray-200 font-sans p-8">
  <nav class="flex space-x-8 border-b border-gray-700 mb-8">
  </nav>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <div class="lg:col-span-2 space-y-4">
      <h2 class="text-xl font-semibold mb-4 text-gray-400">Select Resource</h2>
    </div>
    <div class="space-y-6">
      <div class="bg-[#24262d] p-6 rounded-xl border border-gray-700 shadow-xl">
        <h3 class="text-white font-semibold mb-4">New Reservation</h3>
      </div>
      <div class="space-y-3">
        <h3 class="text-gray-400 text-sm font-semibold uppercase tracking-widest">Today's Schedule</h3>
      </div>

      <div class="space-y-1">
        <ReservationCard
            v-for="res in todaysReservations"
            :key="res.id"
            :reservation="res"
        />
      </div>
    </div>
  </div>
  </body>
</template>