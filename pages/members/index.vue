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

const { data: members, pending } = await useFetch<Member[]>('/api/members', { query, default: () => [] })

function onSelect(row: Member) {
  return navigateTo(`/members/${row.id}/edit`)
}

defineShortcuts({
  '/': () => {
    input.value?.input?.focus()
  }
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
        <template #name-data="{ row }">
          <div class="flex items-center gap-3">
            <UAvatar v-bind="row.avatar" :alt="row.name" size="xs" />

            <span class="text-gray-900 dark:text-white font-medium">{{ row.name }}</span>
          </div>
        </template>

        <template #status-data="{ row }">
          <UBadge :label="row.status"
            :color="row.status === 'subscribed' ? 'green' : row.status === 'bounced' ? 'orange' : 'red'"
            variant="subtle" class="capitalize" />
        </template>
      </UTable>
    </UDashboardPanel>
  </UDashboardPage>
</template>