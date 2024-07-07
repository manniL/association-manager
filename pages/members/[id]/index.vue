<script setup lang="ts">
const route = useRoute()
const id = route.params.id

const { data: user } = await useFetch(`/api/members/${id}`)

const title = `"${user.value && `${user.value.firstName} ${user.value.lastName}`}"`

useHead({
  title: title
})

</script>

<template>
  <pre>
    {{ user }}
  </pre>
</template>