<script setup lang="ts">
import type { Schema } from '~/components/MemberForm.vue'
async function onSubmit (validateData: Schema) {
  await $fetch('/api/members', {
    method: 'POST',
    body: validateData
  })
  navigateTo('/members/')
}

useHead({
  title: 'Add new member'
})
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Add a new member" />
      <UDashboardPanelContent>
        <MemberForm class="mt-8" @submit="onSubmit" />
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>