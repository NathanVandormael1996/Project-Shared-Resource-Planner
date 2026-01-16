<script setup>
import { useResourceStore } from '~/stores/resources'
import { useReservationStore } from '~/stores/reservations'
import { ref, computed, onMounted, watch } from 'vue'

const resourceStore = useResourceStore()
const reservationStore = useReservationStore()

await useAsyncData('dashboard-data', async () => {
  await Promise.all([
    resourceStore.fetchResources(),
    reservationStore.fetchReservations()
  ])
})

const selectedResourceId = ref(null)
const viewDate = ref(new Date().toISOString().split('T')[0])
const activeSelectedDate = ref(new Date().toISOString().split('T')[0])

onMounted(() => {
  if (resourceStore.resources.length > 0) {
    selectedResourceId.value = resourceStore.resources[0].id
  }
})

const todaysReservations = computed(() => {
  return reservationStore.reservations.filter(res => res.date === activeSelectedDate.value)
})

watch(activeSelectedDate, (newDate) => {
  const start = new Date(viewDate.value)
  const end = new Date(viewDate.value)
  end.setDate(start.getDate() + 6)

  const selected = new Date(newDate)

  if (selected < start || selected > end) {
    viewDate.value = newDate
  }
})

const handleCalendarSelect = ({ resourceId, date }) => {
  selectedResourceId.value = resourceId
  activeSelectedDate.value = date
}
</script>

<template>
  <div class="min-h-screen transition-colors duration-300 bg-white text-gray-900 dark:bg-[#1a1c23] dark:text-gray-200 p-8 font-sans">

    <div class="flex justify-between items-start">
      <NavButton />
      <ThemeToggle />
    </div>

    <div class="bg-gray-100 dark:bg-[#24262d] border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl">
    </div>


    <div v-if="resourceStore.resources.length > 0" class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">

      <div class="lg:col-span-2 space-y-4">
        <h2 class="text-xl font-semibold mb-4 text-gray-400">Reservation Calendar</h2>
        <div class="bg-[#24262d] border border-gray-700 rounded-xl overflow-hidden shadow-2xl">
          <CalendarReservations
              :resources="resourceStore.resources"
              :reservations="reservationStore.reservations"
              :start-date="viewDate"
              :active-date="activeSelectedDate"
              @select-slot="handleCalendarSelect"
          />
        </div>
      </div>

      <div class="space-y-6">
        <div class="bg-[#24262d] p-6 rounded-xl border border-gray-700 shadow-xl">
          <h3 class="text-white font-semibold mb-4 border-b border-gray-700 pb-2">New Reservation</h3>

          <div class="space-y-6">
            <div>
              <label class="block text-sm text-gray-400 mb-1">Kies Resource</label>
              <select v-model="selectedResourceId" class="w-full bg-[#1a1c23] border border-gray-600 text-white rounded p-2.5 outline-none focus:border-blue-500">
                <option v-for="r in resourceStore.resources" :key="r.id" :value="r.id">
                  {{ r.title }} ({{ r.type }})
                </option>
              </select>
            </div>

            Schedule for {{ activeSelectedDate }}

            <ReservationForm
                v-if="selectedResourceId"
                :resource-id="selectedResourceId"
                :selected-date="activeSelectedDate"
                @update-date="activeSelectedDate = $event"
            />
            <div v-else class="text-sm text-gray-500 text-center py-4">
              Selecteer een resource om te beginnen.
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <h3 class="text-gray-400 text-sm font-semibold uppercase tracking-widest">
            Schedule for {{ viewDate }}
          </h3>
          <div class="space-y-1">
            <div v-if="todaysReservations.length === 0" class="text-gray-500 italic text-sm">
              Geen planning voor deze datum.
            </div>
            <ReservationCard
                v-for="res in todaysReservations"
                :key="res.id"
                :reservation="res"
            />
          </div>
        </div>
      </div>
    </div>

    <div v-else class="flex justify-center items-center h-64">
      <p class="text-gray-500">Laden van gegevens...</p>
    </div>
  </div>
</template>