<script setup lang="ts">
const items = [
  [
    {
      label: 'New member',
      icon: 'i-heroicons-paper-airplane',
      to: '/members/create'
    },
    {
      label: 'New payment',
      icon: 'i-heroicons-currency-euro',
      to: '/finances/payments/create'
    },
    {
      label: 'New payment role',
      icon: 'i-heroicons-credit-card',
      to: '/finances/roles/create'
    }
  ]
]

useHead({
  title: 'Home'
})

const { data: countData } = await useFetch('/api/members/info/count')
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Home">
        <template #right>
          <UDropdown :items="items">
            <UButton icon="i-heroicons-plus" size="md" class="ml-1.5 rounded-full" />
          </UDropdown>
        </template>
      </UDashboardNavbar>

      <UDashboardPanelContent>
        <div class="grid lg:grid-cols-2 lg:items-start gap-8 mt-8">
          <UDashboardCard title="Total Members"
            :description="`A total of ${countData!.count} members are in the system`" icon="i-heroicons-user-group">
            <UButton to="/members">View Members</UButton>
          </UDashboardCard>
        </div>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>