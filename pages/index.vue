<script setup lang="ts">
const { t } = useI18n()

const items = [
  [
    {
      label: t('members.create'),
      icon: 'i-heroicons-paper-airplane',
      to: '/members/create'
    },
    {
      label: t('finances.payment.create'),
      icon: 'i-heroicons-currency-euro',
      to: '/finances/payments/create'
    },
    {
      label: t('finances.role.create'),
      icon: 'i-heroicons-credit-card',
      to: '/finances/roles/create'
    }
  ]
]

const title = t('basic.home')

useHead({
  title
})

const { data: countData } = await useFetch('/api/members/info/count')
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar :title="title">
        <template #right>
          <UDropdown :items="items">
            <UButton icon="i-heroicons-plus" size="md" class="ml-1.5 rounded-full" />
          </UDropdown>
        </template>
      </UDashboardNavbar>

      <UDashboardPanelContent>
        <div class="grid lg:grid-cols-2 lg:items-start gap-8 mt-8">
          <UDashboardCard :title="$t('membership.total.heading')"
            :description="$t('membership.total.description', countData.count)" icon="i-heroicons-user-group">
            <UButton to="/members">{{ $t('membership.view', 2) }}</UButton>
          </UDashboardCard>
        </div>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>