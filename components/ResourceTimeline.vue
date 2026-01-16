<script setup>
import { computed } from 'vue'
import { useReservationStore } from '~/stores/reservations'

const props = defineProps({
  resourceId: {
    type: Number,
    required: true
  },
  date: {
    type: String,
    required: true
  }
})

const store = useReservationStore()

if (store.reservations.length === 0) {
  store.fetchReservations()
}

const selectedDateReservations = computed(() => {
  return store.reservations.filter(res =>
      res.resource_id === props.resourceId &&
      res.date === props.date
  )
})

const hours = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
]

const isOccupied = (hourStr) => {
  const slotStart = hourStr
  const hourInt = parseInt(hourStr.split(':')[0])
  const slotEnd = `${hourInt + 1}:00`.padStart(5, '0')

  return selectedDateReservations.value.some(res => {
    const resStart = res.start_time.slice(0, 5)
    const resEnd = res.end_time.slice(0, 5)
    return slotStart < resEnd && slotEnd > resStart
  })
}
</script>

<template>
  <div class="mb-8">
    <div class="flex justify-between items-end mb-2">
      <h3 class="text-sm font-bold text-slate-400">Beschikbaarheid op {{ date }}</h3>

      <div class="flex gap-4 text-xs text-slate-500">
        <div class="flex items-center gap-1">
          <div class="w-3 h-3 bg-emerald-900/20 border border-slate-700 rounded"></div> Vrij
        </div>
        <div class="flex items-center gap-1">
          <div class="w-3 h-3 bg-red-900/40 border border-slate-700 rounded"></div> Bezet
        </div>
      </div>
    </div>

    <div class="flex border border-slate-700 rounded-lg overflow-hidden bg-slate-800 shadow-inner">
      <div
          v-for="hour in hours"
          :key="hour"
          class="flex-1 border-r border-slate-700 last:border-r-0 relative group h-14 flex items-center justify-center transition-all"
          :class="isOccupied(hour)
          ? 'bg-red-900/40 cursor-not-allowed'
          : 'bg-emerald-900/20 text-emerald-500/50'"
      >
        <span v-if="isOccupied(hour)" class="text-red-300/50 font-bold text-xs">✖</span>
        <span class="absolute bottom-1 left-1 text-[10px] text-slate-500 font-mono select-none">
          {{ hour }}
        </span>
      </div>
    </div>
  </div>
</template>