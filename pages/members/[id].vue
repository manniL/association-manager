<script setup lang="ts">
const route = useRoute()
const id = route.params.id

const user = await useFetch(`/api/members/${id}`)
</script>

<template>
  <div>
    {{ user }}
  </div>
</template>