<script setup lang="ts">
import type { HorizontalNavigationLink } from '#ui/types'

const { data: paymentList } = useFetch('/api/finances/payments') 

const links = computed(() => paymentList.value?.map((payment) : HorizontalNavigationLink => ({
  label: `Payment #${payment.id} (${payment.collectionDate.split('T')[0]})`,
  to: `/finances/payments/${payment.id}`
}) ?? []))

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