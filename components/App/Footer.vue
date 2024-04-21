<script setup lang="ts">

</script>

<template>
  <UFooter>
    <template #left>
      <p class="text-gray-500 dark:text-gray-400 text-sm">
        Copyright © 2024-{{ new Date().getFullYear() }} Let's see - <NuxtLink class="hover:underline"
          to="https://github.com/nuxt/nuxt/blob/main/LICENSE" target="_blank">
          MIT License
        </NuxtLink>
      </p>
    </template>

    <template #right>
      <UButton to="https://github.com/manniL/association-manager" target="_blank" icon="i-simple-icons-github"
        color="gray" variant="ghost" />
    </template>
  </UFooter>
</template>