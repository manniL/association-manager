<script setup lang="ts">
import type { SchemaOutput } from '~/components/PaymentRoleForm.vue'
async function onSubmit(validateData: SchemaOutput) {
  await $fetch('/api/finances/roles', {
    method: 'POST',
    body: validateData
  })
  navigateTo('/finances/roles')
}
</script>

<template>
  <div>
    <h1 class="text-4xl">Add a new payment role</h1>
    <PaymentRoleForm class="mt-8" @submit="onSubmit" />
  </div>
</template>