<script setup>
defineProps({
  resource: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 shadow-lg hover:border-indigo-500 transition-all">
    <div class="aspect-video w-full bg-slate-900 relative">
      <img
          v-if="resource.image_url"
          :src="resource.image_url"
          :alt="resource.title"
          class="w-full h-full object-cover"
      />
      <div v-else class="flex items-center justify-center h-full text-slate-600">
        Geen afbeelding
      </div>

      <div class="absolute top-2 right-2">
        <span
            v-if="resource.is_available"
            class="bg-green-500/10 text-green-400 text-xs font-bold px-2 py-1 rounded border border-green-500/20"
        >
          BESCHIKBAAR
        </span>
        <span
            v-else
            class="bg-red-500/10 text-red-400 text-xs font-bold px-2 py-1 rounded border border-red-500/20"
        >
          BEZET
        </span>
      </div>
    </div>

    <div class="p-4">
      <div class="flex justify-between items-start mb-2">
        <h3 class="font-bold text-white text-lg truncate">{{ resource.title }}</h3>
        <span class="text-xs text-slate-400 bg-slate-700 px-2 py-0.5 rounded">{{ resource.type }}</span>
      </div>

      <p class="text-slate-400 text-sm line-clamp-2 mb-4 h-10">
        {{ resource.description }}
      </p>

      <button
          class="w-full py-2 px-4 rounded font-medium text-sm transition-colors"
          :class="resource.is_available
          ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
          : 'bg-slate-700 text-slate-500 cursor-not-allowed'"
          :disabled="!resource.is_available"
      >
        {{ resource.is_available ? 'Reserveren' : 'Niet beschikbaar' }}
      </button>
    </div>
  </div>
</template>