<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'


const schema = paymentFormSchema
export type Schema = z.input<typeof schema>
export type SchemaOutput = z.output<typeof schema>

const props = defineProps<{
  initialState?: Schema
}>()


const state = reactive<Schema>({
  date: new Date()
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

const formattedBirthDate = computed(() => {
  return formatDate(state.date)
})
</script>

<template>
  <UForm :schema="schema" :state="state" @submit="onSubmit">

    <UFormGroup label="Date of Next Payment" name="date" :ui="{ container: '' }">
        <UPopover :popper="{ placement: 'bottom-start' }">
          <UInput icon="i-heroicons-calendar-days-20-solid" :value="formattedBirthDate" type="date-local" size="md"
            class="w-full" />
          <template #panel>
            <AppDatePicker mode="date" v-model="state.date" />
          </template>
        </UPopover>
      </UFormGroup>

    <UButton class="mt-8" type="submit">
      Submit
    </UButton>
  </UForm>
</template>
