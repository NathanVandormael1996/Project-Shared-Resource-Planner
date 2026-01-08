<script>
</script>

<template>
  <nav class="flex space-x-8 border-b border-gray-700 mb-8">
    <NuxtLink
        to="/"
        class="pb-2 text-gray-400 hover:text-white transition"
        active-class="border-b-2 border-blue-500 text-white font-medium"
        exact-active-class="border-b-2 border-blue-500 text-white font-medium"
    >
      Home
    </NuxtLink>

    <NuxtLink
        to="/resources"
        class="pb-2 text-gray-400 hover:text-white transition"
        active-class="border-b-2 border-blue-500 text-white font-medium"
    >
      Resources
    </NuxtLink>

    <NuxtLink
        to="/reservations"
        class="pb-2 text-gray-400 hover:text-white transition"
        active-class="border-b-2 border-blue-500 text-white font-medium"
    >
      Reservations
    </NuxtLink>
  </nav>
</template>