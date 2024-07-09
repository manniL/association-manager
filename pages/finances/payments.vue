<script setup lang="ts">
// TODO: Fetch payments here later on
const links = [[{
  label: 'Payment #1',
  to: '/finances/payments/1',
}, {
  label: 'Preview next payment',
  to: '/finances/payments/',
}]]

const route = useRoute()
const isCreatePage = computed(() => route.path.endsWith('create'))

useHead({
  title: 'Payments'
})
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Payments">
        <template #right>
          <UButton v-if="!isCreatePage" to="/finances/payments/create" label="New payment" trailing-icon="i-heroicons-plus" color="gray" />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar v-if="!isCreatePage" class="py-0 px-1.5 overflow-x-auto">
        <UHorizontalNavigation :links="links" />
      </UDashboardToolbar>

      <NuxtPage />

    </UDashboardPanel>
  </UDashboardPage>
</template>