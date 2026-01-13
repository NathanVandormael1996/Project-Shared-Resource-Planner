<script setup>
defineProps({
  resource: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="bg-[#24262d] rounded-xl border border-gray-700 hover:border-blue-500 cursor-pointer transition flex justify-between items-center group overflow-hidden">

    <div class="flex-shrink-0 w-28 h-24">
      <img
          :src="resource.image_url"
          :alt="resource.title"
          class="w-full h-full object-cover"
      />
    </div>

    <div class="flex-1 px-5 py-2">
      <div class="flex items-center gap-3">
        <h3 class="text-lg font-bold text-white">{{ resource.title }}</h3>
        <span class="px-2 py-0.5 text-xs bg-blue-900/40 text-blue-300 rounded">{{ resource.type }}</span>
      </div>
      <p class="text-sm text-gray-400 mt-1">{{ resource.description }}</p>
    </div>

    <div class="pr-5 text-right">
      <span class="text-sm font-semibold text-blue-300 bg-[#1a1c23] px-3 py-1 rounded-full border border-blue-900/40">
        {{ resource.reservations?.length || 0 }} Reservations
        </span>
    </div>
  </div>
</template>