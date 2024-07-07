<script setup lang="ts">
import type { SchemaOutput } from '~/components/PaymentRoleForm.vue'

const id = useRoute().params.id

const { data } = await useFetch(`/api/finances/roles/${id}`, {
  transform (data) {
    return {
      ...data,
      amount: String(data.amount / 100)
    }
  }
})


const editTitle = `${data.value?.name} Payment Role`

useHead({
  title: editTitle
})

async function onSubmit (validateData: SchemaOutput) {
  await $fetch<any>(`/api/finances/roles/${id}`, {
    method: 'PUT',
    body: validateData
  })
  navigateTo('/finances/roles/')
}
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar :title="editTitle" />
      <UDashboardPanelContent>
        <PaymentRoleForm :initial-state="data!" class="mt-8" @submit="onSubmit" />
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>