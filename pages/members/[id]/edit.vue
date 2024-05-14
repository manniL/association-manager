<script setup lang="ts">
import type { Schema } from '~/components/MemberForm.vue'

const id = useRoute().params.id

const { data } = await useFetch(`/api/members/${id}`, {
  transform (data) {
    if (data && 'count' in data) {
      return data
    }
    return {
      ...data,
      birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
      joinDate: data.joinDate ? new Date(data.joinDate) : undefined,
      leaveDate: data.leaveDate ? new Date(data.leaveDate) : undefined,
    }
  }
})

// TODO: Better type narrowing please

const editTitle = `${data.value && 'count' in data.value ? '' : `${data.value?.firstName} ${data.value?.lastName}`}`

useHead({
  title: editTitle
})

async function onSubmit (validateData: Schema) {
  console.log(validateData)
  // TODO: https://github.com/unjs/nitro/issues/2389
  await $fetch<any>(`/api/members/${id}`, {
    method: 'PUT',
    body: validateData
  })
  navigateTo('/members/')
}
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar :title="editTitle" />
      <UDashboardPanelContent>
        <MemberForm v-if="!(data && 'count' in data)" :initial-state="data!" class="mt-8" @submit="onSubmit" />
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>