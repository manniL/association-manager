<script lang="ts" setup>
const route = useRoute()
const isExistingPayment = computed(() => !!route.params.id)
const { data, refresh: refreshPaymentInfo } = await useFetch(`/api/finances/payments/${route.params.id}`)

const payees = computed(() => data.value?.payees ?? [])
const date = computed(() => new Date()) // TODO: Fix collection date
const formattedDate = computed(() => date.value.toISOString().split('T')[0])
const sepaLink = computed(() => `/finances/payments/${route.params.id}/${formattedDate.value}.xml`)

const defaultColumns = computed(() => [
  {
    key: 'firstName',
    label: 'First Name',
    sortable: true
  },
  {
    key: 'lastName',
    label: 'Last Name',
    sortable: true
  },
  {
    key: 'paymentAmount',
    label: 'Amount to pay (for this payment)',
    sortable: true
  },
  {
    key: 'paymentSchedule',
    label: 'Payment Schedule',
    sortable: true
  },
  {
    key: 'paymentRoleName',
    label: 'Payment Role',
    sortable: true
  },
  {
    key: 'paymentType',
    label: 'Payment Type',
    sortable: true
  }].concat(isExistingPayment.value ? [
    {
      key: 'hasPaid',
      label: 'Has Paid?',
      sortable: true
    },
    {
      key: '_actions',
      label: 'Actions'
    }
  ] : [] as any)
)

const selectedColumns = ref(defaultColumns)
const sort = ref({ column: 'name', direction: 'asc' as const })

const columns = computed(() => defaultColumns.value.filter(column => selectedColumns.value.includes(column)))

const onTogglePaymentState = async (memberId: number) => {
  await $fetch(`/api/finances/payments/${route.params.id}/${memberId}/state`, {
    method: 'PUT'
  }),
  refreshPaymentInfo()
}

const isTogglingSepaPayeesLoading = ref(false)
const changeSepaPayeeState = async () => {
  isTogglingSepaPayeesLoading.value = true
  await $fetch(`/api/finances/payments/${route.params.id}/sepa-state`, {
    method: 'PUT'
  }),
  await refreshPaymentInfo()
  isTogglingSepaPayeesLoading.value = false
}

useHead({
  title: () => route.params.id ? `Payment #${route.params.id}` : 'Payment Preview'
})
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar :title="`Payment ${data?.id} - Collection at ${data?.collectionDate}` " :badge="`${payees.length} members`" />

      <!-- TODO: Bring back loading -->
      <UTable v-model:sort="sort" :rows="payees" :columns="columns" sort-mode="manual" class="w-full"
        :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }">
        <template #paymentAmount-data="{ row }">
          {{ `${Number(row.paymentAmount / 100).toFixed(2)} €` }}
        </template>
        <template #_actions-data="{ row }">
          <UButton @click="onTogglePaymentState(row.id)" :color="row.hasPaid ? 'white' : undefined" :variant="row.hasPaid ? 'outline' : 'soft'"
            :trailing-icon="row.hasPaid ? 'i-heroicons-face-frown-20-solid' : 'i-heroicons-check-20-solid'">{{
              row.hasPaid ? 'Mark as unpaid' : 'Mark as paid' }}</UButton>
          <!-- if user has sepa available
          <UButton>Generate Single SEPA File</UButton>
          -->
        </template>
      </UTable>
      <div>
        <UButton v-if="sepaLink" :to="sepaLink" download>Download SEPA File</UButton>
        <UButton variant="soft" v-if="sepaLink" :loading="isTogglingSepaPayeesLoading" @click="changeSepaPayeeState">Set SEPA Payees to Paid</UButton>
      </div>
    </UDashboardPanel>
  </UDashboardPage>
</template>