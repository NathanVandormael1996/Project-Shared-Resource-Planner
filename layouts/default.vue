<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
    <nav class="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md fixed w-full z-50 top-0">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <div class="flex items-center gap-8">
            <NuxtLink to="/resources" class="text-xl font-bold tracking-tighter text-indigo-400 uppercase">
              Resource<span class="text-slate-100">Planner</span>
            </NuxtLink>
            <div class="hidden md:block">
              <div class="flex items-baseline space-x-4">
                <NuxtLink
                    to="/resources"
                    active-class="bg-slate-800 text-white"
                    class="rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
                >
                  Resources
                </NuxtLink>
                <NuxtLink
                    to="/reservations"
                    active-class="bg-slate-800 text-white"
                    class="rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
                >
                  Mijn Reservaties
                </NuxtLink>
              </div>
            </div>
          </div>
          <div class="text-xs text-slate-500">Sprint 1 • Setup</div>
        </div>
      </div>
    </nav>

    <main class="pt-24 pb-12 px-4 max-w-7xl mx-auto">
      <slot />
    </main>
  </div>
</template>