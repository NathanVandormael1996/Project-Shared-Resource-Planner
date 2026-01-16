<script setup>
import { computed } from 'vue'

const props = defineProps({
  resources: Array,
  reservations: Array,
  startDate: String,
  activeDate: String
})

const emit = defineEmits(['select-slot'])

const calendarDays = computed(() => {
  const days = []
  const start = new Date(props.startDate)
  for (let i = 0; i < 7; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    days.push({
      full: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: d.getDate(),
      isWeekend: d.getDay() === 0 || d.getDay() === 6
    })
  }
  return days
})

const getCellData = (resourceId, dateString) => {
  const matches = props.reservations.filter(r =>
      String(r.resource_id) === String(resourceId) && r.date === dateString
  )

  if (matches.length === 0) return null

  const totalHours = matches.reduce((acc, curr) => {
    if (!curr.start_time || !curr.end_time) return acc + 0
    const [h1, m1] = curr.start_time.split(':').map(Number)
    const [h2, m2] = curr.end_time.split(':').map(Number)
    const diff = (h2 + m2/60) - (h1 + m1/60)
    return acc + diff
  }, 0)

  return {
    hours: totalHours > 0 ? totalHours.toFixed(1).replace('.0', '') : null,
    count: matches.length
  }
}

const handleCellClick = (resourceId, date) => {
  emit('select-slot', { resourceId, date })
}
</script>

<template>
  <div class="bg-[#24262d] rounded-xl border border-gray-700 overflow-hidden">
    <div class="grid grid-cols-[200px_repeat(7,1fr)] border-b border-gray-700 bg-[#1a1c23]">
      <div class="p-4 border-r border-gray-700 text-gray-500 font-bold text-[10px] uppercase tracking-wider flex items-center">
        Resources
      </div>
      <div
          v-for="day in calendarDays"
          :key="day.full"
          class="border-r border-gray-700 p-1 flex flex-col items-center justify-center min-h-[50px] transition-colors"
          :class="{
            'bg-blue-600/30': day.full === activeDate,
            'bg-black/5': day.isWeekend && day.full !== activeDate
          }"
      >
        <div class="text-[10px] text-gray-500 uppercase">{{ day.dayName }}</div>
        <div class="text-sm font-bold" :class="day.isWeekend ? 'text-gray-500' : 'text-white'">
          {{ day.dayNum }}
        </div>
      </div>
    </div>

    <div v-for="resource in resources" :key="resource.id" class="grid grid-cols-[200px_repeat(7,1fr)] border-b border-gray-700 last:border-b-0 hover:bg-[#2d3039]/50 transition-colors">
      <div class="p-3 border-r border-gray-700 flex items-center gap-3 min-w-0 bg-[#1a1c23]/30">
        <img
            v-if="resource.image_url"
            :src="resource.image_url"
            class="w-8 h-8 rounded-lg object-cover border border-gray-600 shadow-sm"
        />
        <div class="truncate">
          <div class="text-xs font-bold text-gray-200 truncate">{{ resource.title }}</div>
          <div class="text-[9px] text-gray-500 uppercase tracking-tighter">{{ resource.type }}</div>
        </div>
      </div>

      <div
          v-for="day in calendarDays"
          :key="day.full"
          @click="handleCellClick(resource.id, day.full)"
          class="border-r border-gray-700 last:border-r-0 p-1 flex items-center justify-center relative group min-h-[50px] cursor-pointer hover:bg-blue-500/10 transition-colors"
          :class="{
            'bg-blue-500/5': day.full === activeDate,
            'bg-black/5': day.isWeekend && day.full !== activeDate
          }"
      >
        <template v-if="getCellData(resource.id, day.full)">
          <div class="w-full h-8 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-[11px] font-bold">
            {{ getCellData(resource.id, day.full).hours }}h
          </div>
          <div class="absolute bottom-full mb-2 hidden group-hover:block z-30 bg-gray-950 text-white text-[10px] px-2 py-1 rounded border border-gray-600 shadow-2xl pointer-events-none">
            {{ getCellData(resource.id, day.full).count }} Booking(s)
          </div>
        </template>
      </div>
    </div>
  </div>
</template>