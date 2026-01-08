<script setup>
defineProps({
  reservation: {
    type: Object,
    required: true
  }
})

// Helper om 24u tijd om te zetten naar AM/PM
const formatTime = (time) => {
  if (!time) return '--:--'
  const [hours, minutes] = time.split(':')
  const h = parseInt(hours)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const displayHours = h % 12 || 12
  return `${displayHours.toString().padStart(2, '0')}:${minutes} ${ampm}`
}
</script>

<template>
  <div class="relative mb-6 group font-sans">
    <div class="bg-[#24262d] border border-gray-700 rounded-2xl p-6 shadow-[0_0_20px_rgba(59,130,246,0.12)] hover:shadow-[0_0_30px_rgba(59,130,246,0.22)] transition-all duration-300">

      <div class="relative pl-10">
        <div class="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-800"></div>

        <div
            class="absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-slate-950 flex items-center justify-center z-10"
            :class="reservation.error ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)]' : 'bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.5)]'"
        ></div>

        <div class="flex justify-between items-start">
          <div class="flex flex-col gap-1">
            <div class="flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-slate-500 uppercase">
              <span>{{ formatTime(reservation.start_time) }}</span>
              <span class="text-slate-700">—</span>
              <span>{{ formatTime(reservation.end_time) }}</span>
            </div>

            <h3 class="text-xl font-black text-white tracking-tight uppercase py-1">
              {{ reservation.title || 'Reservering' }}
            </h3>

            <div class="flex flex-wrap items-center gap-3 mt-1">
              <span class="text-sm font-semibold text-gray-400 bg-[#1a1c23] px-3 py-1 rounded-full border border-slate-400">
                {{ reservation.name }}
              </span>
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-widest bg-[#1a1c23] px-2 py-1 rounded">
                {{ reservation.date }}
              </span>
            </div>

            <div v-if="reservation.error" class="flex items-center gap-2 mt-4 text-red-400 bg-red-500/5 border border-red-500/20 p-2 rounded-lg">
              <span class="text-sm">⚠️</span>
              <p class="text-[11px] italic font-medium tracking-wide text-gray-400">
                Conflict: {{ reservation.error }}
              </p>
            </div>
          </div>

          <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button class="bg-slate-800 hover:bg-slate-700 p-2.5 rounded-xl text-slate-400 hover:text-white border border-slate-700 transition-all shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </button>
            <button class="bg-red-900/10 hover:bg-red-900/40 p-2.5 rounded-xl text-red-500/70 hover:text-red-400 border border-red-500/20 transition-all shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>