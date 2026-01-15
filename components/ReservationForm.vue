<script setup>
import { useReservationStore } from '~/stores/reservations'
import { useResourceStore } from '~/stores/resources'
import { reactive, computed, watch } from 'vue'

const props = defineProps({
  resourceId: {
    type: Number,
    required: true
  },
  selectedDate: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update-date', 'reservation-success'])

const store = useReservationStore()
const resourceStore = useResourceStore()
const loading = computed(() => store.loading)

// Filter: Toon alles BEHALVE Kamers/Ruimtes en het item zelf
const extras = computed(() => {
  if (!resourceStore.resources || resourceStore.resources.length === 0) {
    return []
  }
  return resourceStore.resources.filter(r =>
      r.id !== props.resourceId &&
      r.type !== 'Ruimte' &&
      r.type !== 'Kamer'
  )
})

const form = reactive({
  name: '',
  title: '',
  date: props.selectedDate,
  start_time: '',
  end_time: '',
  selectedExtras: []
})

// Sync datum
watch(() => form.date, (newDate) => { emit('update-date', newDate) })
watch(() => props.selectedDate, (newDate) => { form.date = newDate })

const handleSubmit = async () => {
  if (!form.name || !form.date || !form.start_time || !form.end_time) {
    alert("Vul alle verplichte velden in aub.")
    return
  }

  if (form.start_time >= form.end_time) {
    alert("De eindtijd moet later zijn dan de starttijd.")
    return
  }

  // 1. Hoofdboeking
  const mainBooking = {
    resource_id: props.resourceId,
    name: form.name,
    title: form.title,
    date: form.date,
    start_time: form.start_time,
    end_time: form.end_time
  }

  let successCount = 0
  let failCount = 0

  const mainResult = await store.addReservation(mainBooking)
  if (mainResult.success) successCount++
  else failCount++

  // 2. Extra's Boeken
  for (const extraId of form.selectedExtras) {
    const extraItem = resourceStore.resources.find(r => r.id === extraId)
    const extraTitle = extraItem ? extraItem.title : 'Extra item'

    const extraBooking = {
      ...mainBooking,
      resource_id: extraId,
      title: `${form.title} (+ ${extraTitle})`
    }

    const res = await store.addReservation(extraBooking)
    if (res.success) successCount++
    else failCount++
  }

  if (failCount === 0) {
    alert(`✅ Alles succesvol gereserveerd! (${successCount} items)`)
    // Reset velden
    form.name = ''
    form.title = ''
    form.start_time = ''
    form.end_time = ''
    form.selectedExtras = []

    emit('reservation-success')
    await store.fetchReservations()
  } else {
    alert(`⚠️ Let op: ${successCount} item(s) gelukt, maar ${failCount} item(s) waren al bezet of mislukt.`)
    emit('reservation-success')
    await store.fetchReservations()
  }
}
</script>

<template>
  <div class="bg-[#24262d] border border-gray-700 rounded-xl p-6 shadow-lg font-sans">
    <h3 class="text-xl font-bold text-white mb-6 border-b border-gray-700 pb-2">
      Vul gegevens in
    </h3>

    <form @submit.prevent="handleSubmit" class="space-y-4">

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-gray-400 text-sm mb-1">Jouw Naam *</label>
          <input v-model="form.name" type="text" required class="w-full bg-[#1a1c23] border border-gray-700 rounded p-2.5 text-white focus:border-blue-500 outline-none transition-colors" placeholder="Naam" />
        </div>
        <div>
          <label class="block text-gray-400 text-sm mb-1">Omschrijving</label>
          <input v-model="form.title" type="text" class="w-full bg-[#1a1c23] border border-gray-700 rounded p-2.5 text-white focus:border-blue-500 outline-none transition-colors" placeholder="Bijv. Meeting" />
        </div>
      </div>

      <div>
        <label class="block text-gray-400 text-sm mb-1">Datum *</label>
        <input v-model="form.date" type="date" required class="w-full bg-[#1a1c23] border border-gray-700 rounded p-2.5 text-white focus:border-blue-500 outline-none transition-colors" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-gray-400 text-sm mb-1">Van *</label>
          <input v-model="form.start_time" type="time" required class="w-full bg-[#1a1c23] border border-gray-700 rounded p-2.5 text-white focus:border-blue-500 outline-none transition-colors" />
        </div>
        <div>
          <label class="block text-gray-400 text-sm mb-1">Tot *</label>
          <input v-model="form.end_time" type="time" required class="w-full bg-[#1a1c23] border border-gray-700 rounded p-2.5 text-white focus:border-blue-500 outline-none transition-colors" />
        </div>
      </div>

      <div v-if="extras.length > 0" class="pt-4 border-t border-gray-700 mt-4">
        <label class="block text-blue-400 font-bold text-sm mb-3">Combineer met (Optioneel):</label>
        <div class="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
          <div v-for="item in extras" :key="item.id" class="flex items-center bg-[#1a1c23] p-2 rounded border border-gray-800 hover:border-gray-600 transition-colors">
            <input
                type="checkbox"
                :id="`extra-${item.id}`"
                :value="item.id"
                v-model="form.selectedExtras"
                class="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
            >
            <label :for="`extra-${item.id}`" class="ml-3 text-sm text-gray-300 w-full cursor-pointer select-none flex justify-between items-center">
              <span>{{ item.title }}</span>
              <span class="text-[10px] text-gray-500 border border-gray-700 px-1.5 py-0.5 rounded">{{ item.type }}</span>
            </label>
          </div>
        </div>
      </div>
      <div v-else class="text-xs text-gray-500 mt-2 italic">
        (Geen extra materiaal beschikbaar)
      </div>

      <button type="submit" :disabled="loading" class="w-full mt-4 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded transition-colors flex justify-center items-center shadow-lg">
        <span v-if="loading">Bezig...</span>
        <span v-else>Bevestig Reservatie(s)</span>
      </button>

      <div v-if="store.error" class="text-red-400 text-sm mt-2 text-center">
        {{ store.error }}
      </div>
    </form>
  </div>
</template>