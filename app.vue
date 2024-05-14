<script setup lang="ts">
import type { Group } from '#ui/types'
const colorMode = useColorMode()
const color = computed(() => colorMode.value === 'dark' ? '#111827' : 'white')

const links = [{
  id: 'home',
  label: 'Home',
  icon: 'i-heroicons-home',
  to: '/',
  tooltip: {
    text: 'Home',
    shortcuts: ['G', 'H']
  }
}, {
  id: 'members',
  label: 'Members',
  icon: 'i-heroicons-user-group',
  to: '/members',
  tooltip: {
    text: 'Members',
    shortcuts: ['G', 'M']
  }
}, {
  id: 'finances',
  label: 'Finances',
  to: '/finances',
  icon: 'i-heroicons-banknotes',
  children: [
    {
      id: 'payments',
      label: 'Payments',
      to: '/finances/payments/',
      tooltip: {
        text: 'Finances - Payments',
        shortcuts: ['G', 'F', 'P']
      }
    },
    {
      id: 'payment-roles',
      label: 'Payment roles',
      to: '/finances/roles/',
      tooltip: {
        text: 'Finances - Payment roles',
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
  titleTemplate: c => c ? `${c} - Association Manager` : 'Association Manager',
  htmlAttrs: {
    lang: 'en' // TODO: i18n
  }
})
</script>

<template>
  <div>
    <NuxtLoadingIndicator />
    <UDashboardLayout>
      <UDashboardPanel :width="250" :resizable="{ min: 200, max: 300 }" collapsible>
        <UDashboardNavbar class="!border-transparent" :ui="{ left: 'flex-1' }">
          <template #left>
            <p class="text-xl font-bold">Association Manager</p>
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