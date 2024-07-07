<script lang="ts" setup>
import type { TransformedMemberWithId as Member } from '~/types'

const defaultColumns = [
  {
    key: 'name',
    label: 'Name',
    sortable: true
  },
  {
    key: 'amount',
    label: 'Amount to pay (per month)',
    sortable: true
  }
]

const selectedColumns = ref(defaultColumns)
const sort = ref({ column: 'name', direction: 'asc' as const })

const columns = computed(() => defaultColumns.filter(column => selectedColumns.value.includes(column)))

const { data: paymentRoles } = await useFetch<Member[]>('/api/finances/roles', { default: () => [] })

function onSelect(row: Member) {
  return navigateTo(`/finances/roles/${row.id}/edit`)
}

useHead({
  title: 'Payment Roles'
})
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Payment Roles" :badge="paymentRoles.length">
        <template #right>
          <UButton to="/finances/roles/create" label="New payment role" trailing-icon="i-heroicons-plus" color="gray" />
        </template>
      </UDashboardNavbar>

      <!-- TODO: Bring back loading -->
      <UTable v-model:sort="sort" :rows="paymentRoles" :columns="columns" @select="onSelect"
        sort-mode="manual" class="w-full" :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }">
        <template #amount-data="{ row }">
          {{ row.amount === 0 ? 'Gratis' : `${Number(row.amount / 100).toFixed(2)} €` }} 
        </template>
      </UTable>
    </UDashboardPanel>
  </UDashboardPage>
</template>