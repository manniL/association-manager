<script lang="ts" setup>
import type { TransformedMemberWithId as Member } from '~/types'

const defaultColumns = [
  {
    key: 'membershipId',
    label: '#',
    sortable: true,
  },
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
    key: 'birthDate',
    label: 'Birth Date',
    sortable: true
  },
  {
    key: 'paymentRole',
    label: 'Payment Role',
    sortable: true
  },
  {
    key: 'joinDate',
    label: 'Join Date',
    sortable: true
  },
  {
    key: 'leaveDate',
    label: 'Leave Date',
    sortable: true
  },
]

const q = ref('')
const selectedColumns = ref(defaultColumns)
const selectedStatuses = ref([])
const selectedLocations = ref([])
const sort = ref({ column: 'membershipId', direction: 'asc' as const })
const input = ref<{ input: HTMLInputElement }>()

const columns = computed(() => defaultColumns.filter(column => selectedColumns.value.includes(column)))

const query = computed(() => ({
  q: q.value,
  statuses: selectedStatuses.value,
  locations: selectedLocations.value,
  sort: sort.value.column,
  order: sort.value.direction
}))

const { data: members, pending } = await useFetch('/api/members', { query, default: () => [] })
const { data: paymentRoles } = await useFetch('/api/finances/roles')

function onSelect(row: Member) {
  return navigateTo(`/members/${row.id}/edit`)
}

defineShortcuts({
  '/': () => {
    input.value?.input?.focus()
  }
})

useHead({
  title: 'Member'
})
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Members" :badge="members.length">
        <template #right>
          <UInput ref="input" v-model="q" icon="i-heroicons-funnel" autocomplete="off" placeholder="Filter members..."
            class="hidden lg:block" @keydown.esc="$event.target.blur()">
            <template #trailing>
              <UKbd value="/" />
            </template>
          </UInput>

          <UButton to="/members/create" label="New member" trailing-icon="i-heroicons-plus" color="gray" />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <!--
          <USelectMenu v-model="selectedStatuses" icon="i-heroicons-check-circle" placeholder="Status" multiple
            :options="defaultStatuses" :ui-menu="{ option: { base: 'capitalize' } }" />
          <USelectMenu v-model="selectedLocations" icon="i-heroicons-map-pin" placeholder="Location"
            :options="defaultLocations" multiple />
        -->
        </template>

        <template #right>
          <USelectMenu v-model="selectedColumns" icon="i-heroicons-adjustments-horizontal-solid"
            :options="defaultColumns" multiple class="hidden lg:block">
            <template #label>
              Display
            </template>
          </USelectMenu>
        </template>
      </UDashboardToolbar>

      <UTable v-model:sort="sort" :rows="members" :columns="columns" :loading="pending" @select="onSelect"
        sort-mode="manual" class="w-full" :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }">
        <template #birthDate-data="{ row }">
          {{ formatDate(row.birthDate) }}
        </template>
        <template #paymentRole-data="{ row }">
          {{ paymentRoles?.find(role => role.id === row.paymentRole)?.name }}
        </template>
        <template #joinDate-data="{ row }">
          {{ formatDate(row.joinDate) }}
        </template>
        <template #leaveDate-data="{ row }">
          {{ formatDate(row.leaveDate) }}
        </template>
      </UTable>
    </UDashboardPanel>
  </UDashboardPage>
</template>