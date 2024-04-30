<script setup lang="ts">
const links = [
{
    label: 'Home',
    icon: 'heroicons:home',
    to: '/'
  },
  {
    label: 'Members',
    icon: 'heroicons:user-group',
    to: '/members'
  }
]
</script>

<template>
  <UHeader :links="links">
    <template #logo>
      Association Manager
    </template>
  </UHeader>
</template>