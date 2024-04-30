<script setup lang="ts">
import type { Schema } from '~/components/MemberForm.vue'
async function onSubmit(validateData: Schema) {
  console.log(validateData)
  await $fetch('/api/members', {
    method: 'POST',
    body: validateData
  })
  navigateTo('/members/')
}
</script>

<template>
  <div>
    <h1 class="text-4xl">Add a new member</h1>
    <MemberForm class="mt-8" @submit="onSubmit" />
  </div>
</template>