<script setup lang="ts">
  const links = [{
  label: 'Home',
  icon: 'heroicons:home',
  to: '/'
}]
</script>

<template>
  <UHeader :links="links">
    <template #logo>
      Association Manager
    </template>
  </UHeader>
</template>