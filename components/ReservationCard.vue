<script setup>
import { computed } from 'vue';

const props = defineProps({
  reservation: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete']);

// Helper to format 24h time to AM/PM
const formatTime = (time) => {
  if (!time) return '--:--'
  const [hours, minutes] = time.split(':')
  const h = parseInt(hours)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const displayHours = h % 12 || 12
  return `${displayHours.toString().padStart(2, '0')}:${minutes} ${ampm}`
}

// Extract visual date info
const dateDisplay = computed(() => {
  if (!props.reservation.date) return { day: '--', month: '---' };
  const d = new Date(props.reservation.date);
  return {
    day: d.getDate(),
    month: d.toLocaleString('default', { month: 'short' }).toUpperCase()
  }
})
</script>

<template>
  <div class="group bg-[#24262d] rounded-xl border border-gray-700 hover:border-slate-600 transition flex justify-between items-center overflow-hidden">

    <div class="flex items-center min-w-0">
      <div class="flex-shrink-0 w-28 h-24 bg-slate-900 flex flex-col items-center justify-center border-r border-gray-800/50">
        <span class="text-2xl font-bold text-white">{{ dateDisplay.day }}</span>
        <span class="text-xs font-bold text-slate-500 tracking-wider">{{ dateDisplay.month }}</span>
      </div>

      <div class="px-5 py-2 min-w-0 flex-1">

        <div class="flex items-center flex-wrap gap-2 mb-1">
          <h3 class="text-lg font-bold text-white truncate mr-1">
            {{ reservation.title || 'Untitled Reservation' }}
          </h3>

          <span class="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-purple-900/40 text-purple-300 rounded border border-purple-500/20 shrink-0 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            {{ reservation.resourceName || 'Unknown Resource' }}
          </span>

          <span class="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-900/40 text-blue-300 rounded border border-blue-500/20 shrink-0 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            {{ reservation.name }}
          </span>
        </div>

        <div class="flex items-center gap-2">
          <p class="text-sm text-gray-400 font-medium flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-500"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {{ formatTime(reservation.start_time) }} - {{ formatTime(reservation.end_time) }}
          </p>

          <span v-if="reservation.error" class="text-xs text-red-400 flex items-center gap-1 bg-red-900/20 px-2 rounded ml-2">
                ⚠ Conflict
            </span>
        </div>

        <div class="flex gap-4 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button @click="emit('edit', reservation)" class="text-xs font-bold text-amber-500 hover:underline uppercase">
            Bewerken
          </button>
          <button @click="emit('delete', reservation.id)" class="text-xs font-bold text-red-500 hover:underline uppercase">
            Verwijderen
          </button>
        </div>
      </div>
    </div>

    <div class="pr-5 flex flex-col items-end gap-2">
      <div v-if="reservation.error" class="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
      <div v-else class="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
    </div>

  </div>
</template>