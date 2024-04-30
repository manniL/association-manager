<script setup lang="ts">
const route = useRoute()
const id = route.params.id

const { data: user } = await useFetch(`/api/members/${id}`)
</script>

<template>
  <pre>
    {{ user }}
  </pre>
</template>