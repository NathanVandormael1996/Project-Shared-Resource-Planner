<script setup>
import { useReservationStore } from '~/stores/reservations'
import { useResourceStore } from '~/stores/resources'
import { reactive, computed, watch } from 'vue'

const props = defineProps({
  resourceId: { type: Number, required: true },
  selectedDate: { type: String, required: true }
})

const emit = defineEmits(['update-date', 'reservation-success'])

const store = useReservationStore()
const resourceStore = useResourceStore()
const loading = computed(() => store.loading)

// Meldingen in de UI
const feedback = reactive({
  show: false,
  type: 'success',
  message: ''
})

// Filter resource lijst
const extras = computed(() => {
  if (!resourceStore.resources?.length) return []

  return resourceStore.resources.filter(r => {
    const type = (r.type || '').trim()
    return r.id !== props.resourceId && type !== 'Ruimte' && type !== 'Kamer'
  })
})

const form = reactive({
  name: '',
  title: '',
  date: props.selectedDate,
  start_time: '',
  end_time: '',
  selectedExtras: []
})

// Datum syncen
watch(() => form.date, (val) => emit('update-date', val))
watch(() => props.selectedDate, (val) => form.date = val)

const handleSubmit = async () => {
  feedback.show = false

  // 1. Basis validatie inputs
  if (!form.name || !form.date || !form.start_time || !form.end_time) {
    feedback.type = 'error'
    feedback.message = "Vul alle verplichte velden in (*)."
    feedback.show = true
    return
  }

  if (form.start_time >= form.end_time) {
    feedback.type = 'error'
    feedback.message = "Eindtijd moet later zijn dan starttijd."
    feedback.show = true
    return
  }

  // 2. Lijst opbouwen van alles wat geboekt moet worden
  const itemsToBook = []

  // Hoofd item
  itemsToBook.push({
    resource_id: props.resourceId,
    title: form.title,
    is_main: true
  })

  // Extra items
  for (const extraId of form.selectedExtras) {
    const item = resourceStore.resources.find(r => r.id === extraId)
    const name = item ? item.title : 'Extra'

    itemsToBook.push({
      resource_id: extraId,
      title: `${form.title} (+ ${name})`,
      is_main: false,
      original_name: name
    })
  }

  // 3. Check of het beschikbaar is
  for (const item of itemsToBook) {
    const isAvailable = store.checkAvailability(
        item.resource_id,
        form.date,
        form.start_time,
        form.end_time
    )

    if (!isAvailable) {
      feedback.type = 'error'
      const naam = item.is_main ? 'Het hoofditem' : `Extra: ${item.original_name}`
      feedback.message = `Mislukt: ${naam} is al bezet op dit moment.`
      feedback.show = true
      return
    }
  }

  // 4. Opslaan in DB
  let successCount = 0

  for (const item of itemsToBook) {
    const payload = {
      resource_id: item.resource_id,
      name: form.name,
      title: item.title,
      date: form.date,
      start_time: form.start_time,
      end_time: form.end_time
    }

    const res = await store.addReservation(payload)
    if (res.success) successCount++
  }

  // 5. Resultaat tonen
  feedback.show = true

  if (successCount === itemsToBook.length) {
    // Succes
    feedback.type = 'success'
    feedback.message = `Succes! ${successCount} item(s) gereserveerd.`

    // Formulier resetten
    form.name = ''
    form.title = ''
    form.start_time = ''
    form.end_time = ''
    form.selectedExtras = []

    // Data refreshen
    emit('reservation-success')
    await store.fetchReservations()

  } else {
    // Fallback voor onverwachte DB errors
    feedback.type = 'warning'
    feedback.message = "Er ging technisch iets mis bij het opslaan."
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
          <input v-model="form.name" type="text" class="w-full bg-[#1a1c23] border border-gray-700 rounded p-2.5 text-white focus:border-blue-500 outline-none transition-colors" placeholder="Naam" />
        </div>
        <div>
          <label class="block text-gray-400 text-sm mb-1">Omschrijving</label>
          <input v-model="form.title" type="text" class="w-full bg-[#1a1c23] border border-gray-700 rounded p-2.5 text-white focus:border-blue-500 outline-none transition-colors" placeholder="Bijv. Meeting" />
        </div>
      </div>

      <div>
        <label class="block text-gray-400 text-sm mb-1">Datum *</label>
        <input v-model="form.date" type="date" class="w-full bg-[#1a1c23] border border-gray-700 rounded p-2.5 text-white focus:border-blue-500 outline-none transition-colors" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-gray-400 text-sm mb-1">Van *</label>
          <input v-model="form.start_time" type="time" class="w-full bg-[#1a1c23] border border-gray-700 rounded p-2.5 text-white focus:border-blue-500 outline-none transition-colors" />
        </div>
        <div>
          <label class="block text-gray-400 text-sm mb-1">Tot *</label>
          <input v-model="form.end_time" type="time" class="w-full bg-[#1a1c23] border border-gray-700 rounded p-2.5 text-white focus:border-blue-500 outline-none transition-colors" />
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

      <div v-if="feedback.show" class="p-3 rounded text-sm font-medium border transition-all animate-fadeIn"
           :class="{
          'bg-green-900/20 text-green-400 border-green-500/30': feedback.type === 'success',
          'bg-red-900/20 text-red-400 border-red-500/30': feedback.type === 'error',
          'bg-orange-900/20 text-orange-400 border-orange-500/30': feedback.type === 'warning'
        }"
      >
        {{ feedback.message }}
      </div>

      <button type="submit" :disabled="loading" class="w-full mt-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded transition-colors flex justify-center items-center shadow-lg">
        <span v-if="loading">Bezig...</span>
        <span v-else>Bevestig Reservatie(s)</span>
      </button>

    </form>
  </div>
</template>