<script setup lang="ts">
import type { SchemaOutput } from '~/components/PaymentForm.vue'

// TODO: Add next payment date and "who is impacted"

async function onSubmit(validateData: SchemaOutput) {
  alert('this is not implemented yet')
  navigateTo('/finances/payment')
}
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Create next payment" />
      <UDashboardPanelContent>
        <PaymentForm class="mt-8" @submit="onSubmit" />
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>