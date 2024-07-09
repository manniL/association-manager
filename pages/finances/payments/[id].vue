<script lang="ts" setup>
const route = useRoute()
const isExistingPayment = computed(() => !!route.params.id)
const { data, refresh: refreshPaymentInfo } = await useFetch(`/api/finances/payments/${route.params.id}`)

const payees = computed(() => data.value?.payees ?? [])
const date = computed(() => data.value?.collectionDate ? new Date(data.value.collectionDate) : new Date())
const formattedDate = computed(() => date.value.toISOString().split('T')[0])
const sepaLink = computed(() => `/finances/payments/${route.params.id}/${formattedDate.value}.xml`)

const { t } = useI18n()

const defaultColumns = computed(() => [
  {
    key: 'firstName',
    label: t('basic.firstName'),
    sortable: true
  },
  {
    key: 'lastName',
    label: t('basic.lastName'),
    sortable: true
  },
  {
    key: 'paymentAmount',
    label: t('payment.role.amountForThisPayment'),
    sortable: true
  },
  {
    key: 'paymentSchedule',
    label: 'Payment Schedule',
    sortable: true
  },
  {
    key: 'paymentRoleName',
    label: t('payment.role.role'),
    sortable: true
  },
  {
    key: 'paymentType',
    label: t('payment.type.type'),
    sortable: true
  }].concat(isExistingPayment.value ? [
    {
      key: 'hasPaid',
      label: t('payment.misc.hasPaid'),
      sortable: true
    },
    {
      key: '_actions',
      label: t('payment.misc.actions')
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
  title: () => route.params.id ? `${t('payment.payment')} #${route.params.id}` : `${t('payment.payment')} ${t('basic.preview')}`
})
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar :title="`${t('payment.payment')} ${data?.id} - ${t('payment.misc.collectionAt')} ${data?.collectionDate}` " :badge="`${payees.length} ${t('membership.member', payees.length)}`" />

      <!-- TODO: Bring back loading -->
      <UTable v-model:sort="sort" :rows="payees" :columns="columns" sort-mode="manual" class="w-full"
        :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }">
        <template #paymentAmount-data="{ row }">
          {{ `${Number(row.paymentAmount / 100).toFixed(2)} €` }}
        </template>
        <template #hasPaid-data="{ row }">
          {{ row.hasPaid ? $t('basic.yes') : $t('basic.no') }}
        </template>
        <template #_actions-data="{ row }">
          <UButton @click="onTogglePaymentState(row.memberId)" :color="row.hasPaid ? 'white' : undefined" :variant="row.hasPaid ? 'outline' : 'soft'"
            :trailing-icon="row.hasPaid ? 'i-heroicons-face-frown-20-solid' : 'i-heroicons-check-20-solid'">{{
              row.hasPaid ? $t('payment.state.mark.unpaid') : $t('payment.state.mark.paid') }}</UButton>
          <!-- if user has sepa available
          <UButton>Generate Single SEPA File</UButton>
          -->
        </template>
      </UTable>
      <div class="mx-2 mt-8">
        <UButton class="mr-8" v-if="sepaLink" external :to="sepaLink" target="_blank" download>Download SEPA File</UButton>
        <UButton variant="soft" v-if="sepaLink" :loading="isTogglingSepaPayeesLoading" @click="changeSepaPayeeState">Set SEPA Payees to Paid</UButton>
      </div>
    </UDashboardPanel>
  </UDashboardPage>
</template>