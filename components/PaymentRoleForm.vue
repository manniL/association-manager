<script setup lang="ts">
import { z } from 'zod'
import { vMaska, type MaskInputOptions } from 'maska'
import type { FormSubmitEvent } from '#ui/types'


const schema = paymentRoleFormSchema
export type Schema = z.input<typeof schema>
export type SchemaOutput = z.output<typeof schema>

const props = defineProps<{
  initialState?: Schema
}>()


const state = reactive<Schema>({
  name: '',
  amount: '0',
  notes: undefined
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

  // TODO: i18n this!
const SEPARATOR= '.'
const mask = `0${SEPARATOR}99`
const options: MaskInputOptions = {
  preProcess: val => val.replace(/[€]/g, ''),
  postProcess: val => {
    if (!val) return ''

    const sub = 3 - (val.includes(SEPARATOR) ? val.length - val.indexOf(SEPARATOR) : 0)

    return Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      currencyDisplay: "code",
      useGrouping: false
    }).format(Number(val))
      .slice(0, sub ? -sub : undefined)
      .replace('EUR', '')
      .trim()
  }
}

</script>

<template>
  <UForm :schema="schema" :state="state" @submit="onSubmit">

    <div class="space-y-4">
      <UFormGroup required label="Name" name="name">
        <UInput v-model="state.name" />
      </UFormGroup>
      <UFormGroup required label="Amount to pay" hint="(per month)" name="amount">
        <UInput placeholder="9.50" leading-icon="i-heroicons-currency-euro" type="text" inputmode="numeric" v-maska:[options] :data-maska="mask"
          data-maska-tokens="0:\d:multiple|9:\d:optional" v-model="state.amount" />
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
