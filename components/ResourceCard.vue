<script setup>
defineProps({
  resource: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete', 'reserve']);
</script>

<template>
  <div class="group bg-[#24262d] rounded-xl border border-gray-700 hover:border-slate-600 transition flex justify-between items-center overflow-hidden">

    <div class="flex items-center min-w-0">
      <div class="flex-shrink-0 w-28 h-24 bg-slate-900 overflow-hidden">
        <img
            v-if="resource.image_url"
            :src="resource.image_url"
            :alt="resource.title"
            class="w-full h-full object-cover"
        />
        <div v-else class="flex items-center justify-center h-full text-slate-600 text-xs">
          Geen beeld
        </div>
      </div>

      <div class="px-5 py-2 min-w-0">
        <div class="flex items-center gap-3">
          <h3 class="text-lg font-bold text-white truncate">{{ resource.title }}</h3>
          <span class="px-2 py-0.5 text-xs bg-blue-900/40 text-blue-300 rounded shrink-0">{{ resource.type }}</span>
        </div>
        <p class="text-sm text-gray-400 mt-1 line-clamp-1">{{ resource.description }}</p>

        <div class="flex gap-4 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button @click="emit('edit', resource)" class="text-xs font-bold text-amber-500 hover:underline uppercase">
            Bewerken
          </button>
          <button @click="emit('delete', resource.id)" class="text-xs font-bold text-red-500 hover:underline uppercase">
            Verwijderen
          </button>
        </div>
      </div>
    </div>

    <div class="pr-5 flex flex-col items-end gap-2">
      <span class="text-sm font-semibold text-blue-300 bg-[#1a1c23] px-3 py-1 rounded-full border border-blue-900/40">
        {{ resource.reservations?.length || 0 }} Reservations
      </span>

      <button
          @click="emit('reserve', resource.id)"
          class="px-4 py-1.5 rounded-lg font-bold text-xs transition-colors bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/10"
      >
        Reserveren
      </button>
    </div>
  </div>
</template>