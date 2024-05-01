<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'


const schema = paymentRoleFormSchema
export type Schema = z.output<typeof schema>

const props = defineProps<{
  initialState?: Schema
}>()


const state = reactive<Schema>({
  name: '',
  amount: 0,
  notes: undefined
})

watch(() => props.initialState, (initialState) => {
  if (initialState) {
    // TODO: Maybe deep merge it later?
    Object.assign(state, initialState)
  }
}, { immediate: true })

const emit = defineEmits<{
  submit: [data: Schema]
}>()

function onSubmit (event: FormSubmitEvent<Schema>) {
  emit('submit', event.data)
}
</script>

<template>
  <UForm :schema="schema" :state="state" @submit="onSubmit">

    <UDivider class="my-8" label="Address" />

    <div class="space-y-4">
      <UFormGroup required label="Name" name="name">
        <UInput v-model="state.name" />
      </UFormGroup>
      <UFormGroup required label="Amount to pay" hint="(per month)" name="amount">
        <UInput v-model="state.amount" />
      </UFormGroup>
    </div>

    <UDivider label="Notes" class="my-8" />

    <UFormGroup label="Notes" name="notes" hint="(optional)">
      <UTextarea v-model="state.notes" />
    </UFormGroup>

    <UButton class="mt-8" type="submit">
      Submit
    </UButton>
  </UForm>
</template>
