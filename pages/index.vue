<script setup lang="ts">
  const { data: countData } = await useFetch('/api/members/count')
</script>

<template>
  <div>
    Index Page
  <UDashboardCard
    title="Total Members"
    :description="`A total of ${countData!.count} members are in the system`"
    icon="i-heroicons-user-group"
  >
    <UButton to="/members">View Members</UButton>
  </UDashboardCard>
  </div>
</template>