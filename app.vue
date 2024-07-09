<script setup lang="ts">
import type { Group } from '#ui/types'
const colorMode = useColorMode()
const color = computed(() => colorMode.value === 'dark' ? '#111827' : 'white')

const { t } = useI18n()

const links = [{
  id: 'home',
  label: t('basic.home'),
  icon: 'i-heroicons-home',
  to: '/',
  tooltip: {
    text: t('basic.home'),
    shortcuts: ['G', 'H']
  }
}, {
  id: 'members',
  label: t('membership.member', 2),
  icon: 'i-heroicons-user-group',
  to: '/members',
  tooltip: {
    text: t('membership.member', 2),
    shortcuts: ['G', 'M']
  }
}, {
  id: 'finances',
  label: t('basic.finances'),
  to: '/finances',
  icon: 'i-heroicons-banknotes',
  children: [
    {
      id: 'payments',
      label: t('payment.payment', 2),
      to: '/finances/payments/',
      tooltip: {
        text: `${t('basic.finances')} - ${t('payment.payment', 2)}`,
        shortcuts: ['G', 'F', 'P']
      }
    },
    {
      id: 'payment-roles',
      label: t('payment.role.role', 2),
      to: '/finances/roles/',
      tooltip: {
        text: `${t('basic.finances')} - ${t('payment.role.role', 2)}`,
        shortcuts: ['G', 'F', 'R']
      }
    }
  ],
}]

const groups: Group[] = [{
  key: 'links',
  label: 'Go to',
  commands: links.flatMap(link => [{ ...link, shortcuts: link.tooltip?.shortcuts }, ...(link.children?.map(c => ({ ...c, shortcuts: c.tooltip?.shortcuts })) ?? [])]).filter(Boolean)
}]

useHead({
  meta: [
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  titleTemplate: c => c ? `${c} - ${t('app.title')}` : t('app.title'),
})
</script>

<template>
  <div>
    <NuxtLoadingIndicator />
    <UDashboardLayout>
      <UDashboardPanel :width="250" :resizable="{ min: 200, max: 300 }" collapsible>
        <UDashboardNavbar class="!border-transparent" :ui="{ left: 'flex-1' }">
          <template #left>
            <p class="text-xl font-bold">{{ t('app.title') }}</p>
          </template>
        </UDashboardNavbar>

        <UDashboardSidebar>
          <template #header>
            <UDashboardSearchButton />
          </template>

          <UDashboardSidebarLinks :links="links" />

        </UDashboardSidebar>
      </UDashboardPanel>

      <NuxtPage />

      <ClientOnly>
        <LazyUDashboardSearch :groups="groups" />
      </ClientOnly>
    </UDashboardLayout>
  </div>
</template>