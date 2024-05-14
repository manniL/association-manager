<script setup lang="ts">
import type { SchemaOutput } from '~/components/PaymentRoleForm.vue'
async function onSubmit(validateData: SchemaOutput) {
  await $fetch('/api/finances/roles', {
    method: 'POST',
    body: validateData
  })
  navigateTo('/finances/roles')
}

useHead({
  title: 'Add new payment role'
})
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Add a new payment role" />
      <UDashboardPanelContent>
        <PaymentRoleForm class="mt-8" @submit="onSubmit" />
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>