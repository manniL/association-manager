<script lang="ts" setup>
import type { TransformedMemberWithId as Member } from '~/types'

const defaultColumns = [
{
    key: 'firstName',
    label: 'First Name',
    sortable: true
  },
  {
    key: 'lastName',
    label: 'First Name',
    sortable: true
  },
  {
    key: 'amount',
    label: 'Amount to pay (for this payment)',
    sortable: true
  },
  {
    key: 'payment.type',
    label: 'Payment Type',
    sortable: true
  }
]

const selectedColumns = ref(defaultColumns)
const sort = ref({ column: 'name', direction: 'asc' as const })

const columns = computed(() => defaultColumns.filter(column => selectedColumns.value.includes(column)))

const payees = ref([
  {
    id: 1,
    firstName: 'Tester V.',
    lastName: 'Testington',
    paymentRole: 'Vollzahler',
    paymentSchedule: 'Monthly',
    payment: {
      type: 'CASH',
      data: {}
    },
    amount: 1000
  },
  {
    id: 2,
    firstName: 'Tester Erm.',
    lastName: 'Testington',
    paymentRole: 'Ermäßigt',
    paymentSchedule: 'Quarterly',
    payment: {
      type: 'SEPA',
      data: {}
    },
    amount: 30000
  },
  {
    id: 3,
    firstName: 'Tester Erm.',
    lastName: 'Testington',
    paymentRole: 'Ermäßigt',
    paymentSchedule: 'Half-yearly',
    payment: {
      type: 'SEPA',
      data: {}
    },
    amount: 1000
  },
])

</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Next Payment" :badge="payees.length" />

      <!-- TODO: Bring back loading -->
      <UTable v-model:sort="sort" :rows="payees" :columns="columns" sort-mode="manual" class="w-full"
        :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }">
        <template #amount-data="{ row }">
          {{ row.amount === 0 ? 'Gratis' : `${Number(row.amount / 100).toFixed(2)} €` }}
        </template>
      </UTable>
    </UDashboardPanel>
  </UDashboardPage>
</template>