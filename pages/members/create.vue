<script setup lang="ts">
import type { Schema } from '~/components/MemberForm.vue'
async function onSubmit (validateData: Schema) {
  await $fetch('/api/members', {
    method: 'POST',
    body: validateData
  })
  navigateTo('/members/')
}

const { t } = useI18n()

const title = t('membership.create')

useHead({
  title,
})
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar :title="title" />
      <UDashboardPanelContent>
        <MemberForm class="mt-8" @submit="onSubmit" />
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>