<script setup>
import { useReservationStore } from '~/stores/reservations'

const props = defineProps({
  resourceId: {
    type: Number,
    required: true
  }
})

const store = useReservationStore()
const loading = computed(() => store.loading)

// Reactieve data
const form = reactive({
  name: '',
  title: '',
  date: '',
  start_time: '',
  end_time: ''
})

const handleSubmit = async () => {
  // 1. Simpele Validatie
  if (!form.name || !form.date || !form.start_time || !form.end_time) {
    alert("Vul alle verplichte velden in!")
    return
  }

  // 2. Stuur naar de Store
  const result = await store.addReservation({
    resource_id: props.resourceId,
    ...form
  })

  // 3. Feedback
  if (result.success) {
    alert("✅ Reservatie succesvol!")
    // Formulier resetten
    form.name = ''
    form.title = ''
    form.date = ''
    form.start_time = ''
    form.end_time = ''
  } else {
    alert("❌ Fout: " + (store.error || "Er ging iets mis."))
  }
}
</script>

<template>
  <div class="bg-[#24262d] border border-gray-700 rounded-xl p-6 shadow-lg font-sans">
    <h3 class="text-xl font-bold text-white mb-6 border-b border-gray-700 pb-2">
      Nieuwe Reservatie
    </h3>

    <form @submit.prevent="handleSubmit" class="space-y-4">

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-gray-400 text-sm mb-1">Jouw Naam *</label>
          <input
              v-model="form.name"
              type="text"
              required
              class="w-full bg-[#1a1c23] border border-gray-700 rounded p-2.5 text-white focus:border-blue-500 outline-none transition-colors"
              placeholder="Naam"
          />
        </div>
        <div>
          <label class="block text-gray-400 text-sm mb-1">Omschrijving</label>
          <input
              v-model="form.title"
              type="text"
              class="w-full bg-[#1a1c23] border border-gray-700 rounded p-2.5 text-white focus:border-blue-500 outline-none transition-colors"
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
          class="w-full mt-4 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded transition-colors flex justify-center items-center"
      >
        <span v-if="loading">Bezig...</span>
        <span v-else>Reserveren</span>
      </button>

      <div v-if="store.error" class="text-red-400 text-sm mt-2">
        {{ store.error }}
      </div>
    </form>
  </div>
</template>