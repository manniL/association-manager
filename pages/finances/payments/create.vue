<script setup lang="ts">
import type { SchemaOutput } from '~/components/PaymentForm.vue'

async function onSubmit(validateData: SchemaOutput) {
  const payment = await $fetch('/api/finances/payments', {
    method: 'POST',
    body: validateData
  })
  navigateTo(`/finances/payments/${payment.id}`)
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