<script setup lang="ts">
useHead({
  title: 'Finances'
})
</script>

<template>
  <div class="mt-16 grid grid-cols-2 gap-16">
    <UDashboardCard title="Payments" description="Create a new payment or view previous payments"
      icon="i-heroicons-currency-euro">
      <UButton to="/finances/payments">To the payments</UButton>
    </UDashboardCard>
    <UDashboardCard title="Payment roles" description="Create or edit the payment roles used for members"
      icon="i-heroicons-credit-card">
      <UButton to="/finances/roles">To the payment roles</UButton>
    </UDashboardCard>
  </div>
</template>