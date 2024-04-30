<script setup lang="ts">
const links = [[{
  label: 'Payment #1 (01.01.2024)',
  to: '/finances/payments/1',
}, {
  label: 'Latest Payment (01.04.2024)',
  to: '/finances/payments/',
}]]

</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Payments" />

      <UDashboardToolbar v-if="!$route.path.endsWith('create')" class="py-0 px-1.5 overflow-x-auto">
        <UHorizontalNavigation :links="links" />
        <UButton to="/finances/payments/create" label="New payment" trailing-icon="i-heroicons-plus" color="gray" />
      </UDashboardToolbar>

      <NuxtPage />

    </UDashboardPanel>
  </UDashboardPage>
</template>