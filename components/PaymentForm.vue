<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

const { data: isFirstPayment } = await useFetch('/api/finances/payments/info/is-first-payment')

const schema = paymentFormSchema
export type Schema = z.input<typeof schema>
export type SchemaOutput = z.output<typeof schema>

const props = defineProps<{
  initialState?: Schema
}>()


const state = reactive<Schema>({
  startDate: undefined, 
  collectionDate: new Date()
})

watch(() => props.initialState, (initialState) => {
  if (initialState) {
    // TODO: Maybe deep merge it later?
    Object.assign(state, initialState)
  }
}, { immediate: true })

const emit = defineEmits<{
  submit: [data: SchemaOutput]
}>()

function onSubmit (event: FormSubmitEvent<SchemaOutput>) {
  const result = schema.parse(event.data)
  emit('submit', result)
}

const formattedStartDate = computed(() => {
  return formatDate(state.startDate)
})

const formattedCollectionDate = computed(() => {
  return formatDate(state.collectionDate)
})
</script>

<template>
  <UForm :schema="schema" :state="state" @submit="onSubmit">
    <div class="mb-8" v-if="isFirstPayment">
      <h2 class="text-xl">This is your first payment! which start date do you want to choose?</h2>

      <UFormGroup class="mt-4" label="Start Date for the first payment" name="startDate" :ui="{ container: '' }">
        <UPopover :popper="{ placement: 'bottom-start' }">
          <UInput icon="i-heroicons-calendar-days-20-solid" :value="formattedStartDate" type="date-local" size="md"
            class="w-full" />
          <template #panel>
            <AppDatePicker mode="date" v-model="state.startDate" />
          </template>
        </UPopover>
      </UFormGroup>
    </div>

    <UFormGroup label="Collection Date of Next Payment" name="collectionDate" :ui="{ container: '' }">
        <UPopover :popper="{ placement: 'bottom-start' }">
          <UInput icon="i-heroicons-calendar-days-20-solid" :value="formattedCollectionDate" type="date-local" size="md"
            class="w-full" />
          <template #panel>
            <AppDatePicker mode="date" v-model="state.collectionDate" />
          </template>
        </UPopover>
      </UFormGroup>

    <UButton class="mt-8" type="submit">
      Submit
    </UButton>
  </UForm>
</template>
