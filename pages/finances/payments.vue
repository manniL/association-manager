<script setup lang="ts">
import type { HorizontalNavigationLink } from '#ui/types'

const { data: paymentList } = useFetch('/api/finances/payments') 

const { t } = useI18n()

const links = computed(() => paymentList.value?.map((payment) : HorizontalNavigationLink => ({
  label: `${t('payment.payment')} #${payment.id} (${payment.collectionDate.split('T')[0]})`,
  to: `/finances/payments/${payment.id}`
}) ?? []))

const route = useRoute()
const isCreatePage = computed(() => route.path.endsWith('create'))


const title = t('payment.payment', 2)

useHead({
  title
})
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar :title="title">
        <template #right>
          <UButton v-if="!isCreatePage" to="/finances/payments/create" :label="$t('payment.create')" trailing-icon="i-heroicons-plus" color="gray" />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar v-if="!isCreatePage" class="py-0 px-1.5 overflow-x-auto">
        <UHorizontalNavigation :links="links" />
      </UDashboardToolbar>

      <NuxtPage />

    </UDashboardPanel>
  </UDashboardPage>
</template>