<script setup>
import { useResourceStore } from '~/stores/resources'
import { useReservationStore } from '~/stores/reservations'
import { ref, computed, onMounted } from 'vue'
import ReservationForm from '~/components/ReservationForm.vue'

const resourceStore = useResourceStore()
const reservationStore = useReservationStore()

// Data ophalen
await useAsyncData('dashboard-data', async () => {
  await Promise.all([
    resourceStore.fetchResources(),
    reservationStore.fetchReservations()
  ])
})

const selectedResourceId = ref(null)

// BELANGRIJK: Dit moet een ref zijn die verandert, zodat de lijst update!
const viewDate = ref(new Date().toISOString().split('T')[0])

onMounted(() => {
  if (resourceStore.resources.length > 0) {
    selectedResourceId.value = resourceStore.resources[0].id
  }
})

// Filter op basis van viewDate (niet hardcoded vandaag)
const todaysReservations = computed(() => {
  return reservationStore.reservations.filter(res => res.date === viewDate.value)
})
</script>

<template>
  <div class="bg-[#1a1c23] text-gray-200 font-sans p-8 min-h-screen">
    <NavButton />

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">

      <div class="lg:col-span-2 space-y-4">
        <h2 class="text-xl font-semibold mb-4 text-gray-400">Select Resource</h2>
        <div class="bg-[#1a1c23] border-gray-700 rounded-xl h-64 flex items-center justify-center text-gray-500">
        </div>
      </div>

      <div class="space-y-6">
        <div class="bg-[#24262d] p-6 rounded-xl border border-gray-700 shadow-xl">
          <h3 class="text-white font-semibold mb-4 border-b border-gray-700 pb-2">New Reservation</h3>

          <div class="animate-fadeIn space-y-6">

            <div>
              <label class="block text-sm text-gray-400 mb-1">Kies Resource</label>
              <select v-model="selectedResourceId" class="w-full bg-[#1a1c23] border border-gray-600 text-white rounded p-2.5 outline-none focus:border-blue-500">
                <option v-for="r in resourceStore.resources" :key="r.id" :value="r.id">
                  {{ r.title }} ({{ r.type }})
                </option>
              </select>
            </div>

            <ReservationForm
                v-if="selectedResourceId"
                :resource-id="selectedResourceId"
                :selected-date="viewDate"
                @update-date="viewDate = $event"
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
  </div>
</template>

<style scoped>
.animate-fadeIn { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
</style>