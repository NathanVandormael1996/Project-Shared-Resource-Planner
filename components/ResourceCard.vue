<script setup>
// Props komen in Sprint 2
</script>

<template>
  <article class="group relative flex flex-col overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 transition-all hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10">
    <div class="aspect-video w-full bg-slate-800 flex items-center justify-center text-slate-600">
      <span class="text-sm">Geen afbeelding</span>
    </div>
    <div class="p-5">
      <h3 class="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors">
        Resource Naam
      </h3>
      <p class="mt-2 text-sm text-slate-400 line-clamp-2">
        Dit is een placeholder beschrijving van het item. In Sprint 2 wordt dit dynamisch.
      </p>
      <div class="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center">
        <span class="text-xs font-medium px-2 py-1 rounded bg-slate-800 text-slate-300">
          TYPE
        </span>
        <button class="text-sm font-medium text-indigo-400 hover:text-indigo-300">
          Reserveren &rarr;
        </button>
      </div>
    </div>
  </article>
</template>