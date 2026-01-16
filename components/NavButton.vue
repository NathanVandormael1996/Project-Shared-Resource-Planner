<script>
</script>

<template>
  <nav class="flex space-x-8 pb-5">
    <NuxtLink
        to="/"
        class="pb-2 text-blue-400 hover:text-blue-200 transition"
        active-class="text-blue-600 text-blue font-medium"
        exact-active-class="text-blue-600 text-blue font-medium"
    >
      Home
    </NuxtLink>

    <NuxtLink
        to="/resources"
        class="pb-2 text-blue-400 hover:text-blue-200 transition"
        active-class="text-blue-600 text-blue font-medium"
    >
      Resources
    </NuxtLink>

    <NuxtLink
        to="/reservations"
        class="pb-2 text-blue-400 hover:text-blue-200 transition"
        active-class="text-blue-600 text-blue font-medium"
    >
      Reservations
    </NuxtLink>
  </nav>
</template>