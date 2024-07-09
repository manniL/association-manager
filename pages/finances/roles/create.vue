<script setup lang="ts">
import type { SchemaOutput } from '~/components/PaymentRoleForm.vue'
async function onSubmit(validateData: SchemaOutput) {
  await $fetch('/api/finances/roles', {
    method: 'POST',
    body: validateData
  })
  navigateTo('/finances/roles')
}

const { t } = useI18n()

const title = `${t('payment.role.create')}`

useHead({
  title
})
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar :title="title" />
      <UDashboardPanelContent>
        <PaymentRoleForm class="mt-8" @submit="onSubmit" />
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>