<script setup>
import { useReservationStore } from '~/stores/reservations'
import { reactive, computed, watch } from 'vue'

// 1. We accepteren nu ook de datum vanuit de Kalender (index.vue)
const props = defineProps({
  resourceId: {
    type: [Number, String], // Kan nummer of string zijn
    required: true
  },
  selectedDate: {
    type: String,
    default: () => new Date().toISOString().split('T')[0]
  }
})

const store = useReservationStore()
const loading = computed(() => store.loading)

// Reactieve data
const form = reactive({
  name: '',
  title: '',
  date: props.selectedDate, // Start met de datum die de kalender geeft
  start_time: '',
  end_time: ''
})

// 2. DE OPLOSSING: Luister naar veranderingen in de kalender
// Als props.selectedDate verandert (jij klikt links), updaten we form.date
watch(() => props.selectedDate, (newDate) => {
  form.date = newDate
})

const handleSubmit = async () => {
  // Simpele Validatie
  if (!form.name || !form.date || !form.start_time || !form.end_time) {
    alert("Vul alle verplichte velden in!")
    return
  }

  // Stuur naar de Store
  const result = await store.addReservation({
    resource_id: props.resourceId,
    ...form
  })

  // Feedback
  if (result.success) {
    alert("✅ Reservatie succesvol!")

    // Formulier resetten, MAAR behoud de geselecteerde datum (gebruiksvriendelijk)
    form.name = ''
    form.title = ''
    form.start_time = ''
    form.end_time = ''
    form.date = props.selectedDate
  } else {
    alert("❌ Fout: " + (store.error || "Er ging iets mis."))
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
          <input
              v-model="form.name"
              type="text"
              required
              class="w-full bg-[#1a1c23] border border-gray-700 rounded p-2.5 text-white focus:border-blue-500 outline-none transition-colors placeholder-gray-600"
              placeholder="Naam"
          />
        </div>
        <div>
          <label class="block text-gray-400 text-sm mb-1">Omschrijving</label>
          <input
              v-model="form.title"
              type="text"
              class="w-full bg-[#1a1c23] border border-gray-700 rounded p-2.5 text-white focus:border-blue-500 outline-none transition-colors placeholder-gray-600"
              placeholder="Bijv. Meeting"
          />
        </div>
      </div>

      <div>
        <label class="block text-gray-400 text-sm mb-1">Datum *</label>
        <input
            v-model="form.date"
            type="date"
            required
            class="w-full bg-[#1a1c23] border border-gray-700 rounded p-2.5 text-white focus:border-blue-500 outline-none transition-colors"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-gray-400 text-sm mb-1">Van *</label>
          <input
              v-model="form.start_time"
              type="time"
              required
              class="w-full bg-[#1a1c23] border border-gray-700 rounded p-2.5 text-white focus:border-blue-500 outline-none transition-colors"
          />
        </div>
        <div>
          <label class="block text-gray-400 text-sm mb-1">Tot *</label>
          <input
              v-model="form.end_time"
              type="time"
              required
              class="w-full bg-[#1a1c23] border border-gray-700 rounded p-2.5 text-white focus:border-blue-500 outline-none transition-colors"
          />
        </div>
      </div>

      <button
          type="submit"
          :disabled="loading"
          class="w-full mt-4 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded transition-colors flex justify-center items-center shadow-lg"
      >
        <span v-if="loading">Bezig...</span>
        <span v-else>Bevestig Reservatie</span>
      </button>

      <div v-if="store.error" class="text-red-400 text-sm mt-2 text-center">
        {{ store.error }}
      </div>
    </form>
  </div>
</template>