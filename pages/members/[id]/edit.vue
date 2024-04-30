<script setup lang="ts">
import type { Schema } from '~/components/MemberForm.vue'

const id = useRoute().params.id

const { data } = await useFetch(`/api/members/${id}`, {
  transform(data) {
    if('count' in data) {
      return data
    }
    return {
      ...data,
      birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
      joinDate: data.joinDate ? new Date(data.joinDate) : undefined,
      leaveDate: data.leaveDate ? new Date(data.leaveDate) : undefined,
    }
  }
})

// Pre-populate the form data with `data`

async function onSubmit(validateData: Schema) {
  console.log(validateData)
  // TODO: https://github.com/unjs/nitro/issues/2389
  await $fetch<any>(`/api/members/${id}`, {
    method: 'PUT',
    body: validateData
  })
  navigateTo('/members/')  
}
</script>

<template>
  <div>
    <h1 class="text-4xl">Add a new member</h1>
    <!-- TODO: Find a way for better type narrowing here? -->
    <MemberForm v-if="!('count' in data!)" :initial-state="data!" class="mt-8" @submit="onSubmit" />
  </div>
</template>