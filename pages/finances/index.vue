<script setup lang="ts">
const { t } = useI18n()
useHead({
  title: t('basic.finances')
})
</script>

<template>
  <div class="mt-16 grid grid-cols-2 gap-16">
    <UDashboardCard :title="$t('payment.payment', 2)" :description="$t('page.finances.payments.description', 2)"
      icon="i-heroicons-currency-euro">
      <UButton to="/finances/payments">{{$t('page.finances.to.payments', 2)}}</UButton>
    </UDashboardCard>
    <UDashboardCard title="Payment roles" :description="$t('page.finances.roles.description', 2)"
      icon="i-heroicons-credit-card">
      <UButton to="/finances/roles">{{$t('page.finances.to.roles', 2)}}</UButton>
    </UDashboardCard>
  </div>
</template>