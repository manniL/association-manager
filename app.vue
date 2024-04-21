<script setup lang="ts">
</script>

<template>
  <AppHeader />

  <UMain>
    <NuxtLayout>
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl gap-16 sm:gap-y-16 flex flex-col">
        <NuxtPage />
      </div>
    </NuxtLayout>
  </UMain>

  <AppFooter />
  <UNotifications />
</template>