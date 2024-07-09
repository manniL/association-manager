<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'


const schema = memberFormSchema
export type Schema = z.output<typeof schema>

const props = defineProps<{
  initialState?: Schema
}>()

// stripe / ... / TODO in the future if someone needs other payment providers
const paymentTypes = computed(() => [
  { value: 'CASH', label: t('payment.type.cash') },
  { value: 'SEPA', label: t('payment.type.sepa') },
])

const { data: rawPaymentRoles } = await useFetch('/api/finances/roles')
const paymentRoles = computed(() => rawPaymentRoles.value?.map((role) => ({ value: role.id, label: role.name})))


const state = reactive<Schema>({
  // Personal info
  firstName: '',
  lastName: '',
  company: undefined,
  gender: 'no-answer',
  address: {
    street: '',
    city: '',
    zip: '',
    state: '',
    country: '',
  },
  birthDate: undefined,
  phone: undefined,
  email: undefined,
  membershipId: '', // TODO FOR THE FUTURE: auto generate that somehow?
  joinDate: undefined,
  leaveDate: undefined,
  notes: undefined,
  payment: {
    type: 'CASH',
    data: {}
  },
  paymentRole: '',
  paymentSchedule: 'yearly',
})

const formattedBirthDate = computed(() => {
  return formatDate(state.birthDate)
})

const formattedJoinDate = computed(() => {
  return formatDate(state.joinDate)
})

const formattedLeaveDate = computed(() => {
  return formatDate(state.leaveDate)
})

const formattedMandateDate = computed(() => {
  return 'mandateDate' in state.payment.data && formatDate(state.payment.data.mandateDate)
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

const { t } = useI18n()

const genderOptions = computed(() => genderValues.map(value => ({
  value,
  label: t(`basic.genderOptions.${value}`)
})))

const paymentScheduleOptions = computed(() => paymentScheduleIds.map(value => ({
  value,
  label: t(`payment.schedule.options.${value}`)
})))
</script>

<template>
  <UForm :schema="schema" :state="state" @submit="onSubmit">

    <div class="space-y-4">
      <UFormGroup required :label="$t('basic.firstName')" name="firstName">
        <UInput v-model="state.firstName" />
      </UFormGroup>

      <UFormGroup required :label="$t('basic.lastName')" name="lastName">
        <UInput v-model="state.lastName" />
      </UFormGroup>

      <UFormGroup required :label="$t('basic.gender')" name="gender">
        <USelect v-model="state.gender" :options="genderOptions" />
      </UFormGroup>

      <UFormGroup :label="$t('basic.company')" name="company" :hint="`(${$t('basic.optional')})`">
        <UInput v-model="state.company" />
      </UFormGroup>

      <UFormGroup :label="$t('basic.birthDate')" name="birthDate" :hint="`(${$t('basic.optional')})`" :ui="{ container: '' }">
        <UPopover :popper="{ placement: 'bottom-start' }">
          <UInput icon="i-heroicons-calendar-days-20-solid" :value="formattedBirthDate" type="date-local" size="md"
            class="w-full" />
          <template #panel>
            <AppDatePicker mode="date" v-model="state.birthDate" />
          </template>
        </UPopover>
      </UFormGroup>

      <UFormGroup :label="$t('basic.phone')" name="phone" :hint="`(${$t('basic.optional')})`">
        <UInput v-model="state.phone" />
      </UFormGroup>

      <UFormGroup :label="$t('basic.email')" name="email" :hint="`(${$t('basic.optional')})`">
        <UInput v-model="state.email" />
      </UFormGroup>
    </div>

    <UDivider class="my-8" :label="$t('address.address')" />

    <!-- Mark this as "address sub group" -->
    <div class="space-y-4">
      <UFormGroup required :label="$t('address.streetAndHouseNumber')" name="street">
        <UInput v-model="state.address.street" />
      </UFormGroup>
      <UFormGroup required :label="$t('address.city')" name="city">
        <UInput v-model="state.address.city" />
      </UFormGroup>
      <UFormGroup required :label="$t('address.zip')" name="zip">
        <UInput v-model="state.address.zip" />
      </UFormGroup>
      <UFormGroup :label="$t('address.state')" name="state" :hint="`(${$t('basic.optional')})`">
        <UInput v-model="state.address.state" />
      </UFormGroup>
      <UFormGroup required :label="$t('address.country')" name="country">
        <!-- TODO: Set default value, maybe optional -->
        <UInput v-model="state.address.country" />
      </UFormGroup>
    </div>

    <UDivider class="my-8" :label="$t('membership.membership')" />

    <div class="space-y-4">
      <UFormGroup required :label="$t('membership.id')" name="membershipId">
        <UInput v-model="state.membershipId" />
      </UFormGroup>

      <UFormGroup :label="$t('membership.joinDate')" name="joinDate" :hint="`(${$t('basic.optional')})`" :ui="{ container: '' }">
        <UPopover :popper="{ placement: 'bottom-start' }">
          <UInput icon="i-heroicons-calendar-days-20-solid" :value="formattedJoinDate" type="date-local" size="md"
            class="w-full" />
          <template #panel>
            <AppDatePicker mode="date" v-model="state.joinDate" />
          </template>
        </UPopover>
      </UFormGroup>

      <UFormGroup :label="$t('membership.leaveDate')" name="leaveDate" :hint="`(${$t('basic.optional')})`" :ui="{ container: '' }">
        <UPopover :popper="{ placement: 'bottom-start' }">
          <UInput icon="i-heroicons-calendar-days-20-solid" :value="formattedLeaveDate" type="date-local" size="md"
            class="w-full" />
          <template #panel>
            <AppDatePicker mode="date" v-model="state.leaveDate" />
          </template>
        </UPopover>
      </UFormGroup>
    </div>

    <UDivider class="my-8" :label="$t('payment.payment')" />

    <div class="space-y-4">
      <UFormGroup required :label="$t('payment.role.role')" name="paymentRole">
        <USelect v-model="state.paymentRole" :options="paymentRoles" />
      </UFormGroup>

      <UFormGroup required :label="$t('payment.type.type')" name="paymentType">
        <USelect v-model="state.payment.type" :options="paymentTypes" />
      </UFormGroup>

      <div v-if="state.payment.type === 'SEPA'">
        <UFormGroup :label="$t('payment.type.accountHolder')" name="accountHolder">
          <UInput v-model="state.payment.data.accountHolder" />
        </UFormGroup>
        <UFormGroup required :label="$t('payment.type.iban')" name="iban">
          <UInput v-model="state.payment.data.iban" />
        </UFormGroup>
        <UFormGroup :label="$t('payment.type.bic')" name="bic" required>
          <UInput v-model="state.payment.data.bic" />
        </UFormGroup>
        <UFormGroup :label="$t('payment.type.mandateId')" name="mandate-id" required>
          <UInput v-model="state.payment.data.mandateId" />
        </UFormGroup>
        <UFormGroup :label="$t('payment.type.mandateDate')" name="mandateDate" required :ui="{ container: '' }">
        <UPopover :popper="{ placement: 'bottom-start' }">
          <UInput icon="i-heroicons-calendar-days-20-solid" :value="formattedMandateDate" type="date-local" size="md"
            class="w-full" />
          <template #panel>
            <AppDatePicker mode="date" v-model="state.payment.data.mandateDate" />
          </template>
        </UPopover>
      </UFormGroup>
      </div>


      <UFormGroup required :label="$t('payment.schedule.schedule')" name="paymentSchedule">
        <USelect v-model="state.paymentSchedule" :options="paymentScheduleOptions" />
      </UFormGroup>
    </div>

    <UDivider :label="$t('basic.notes')" class="my-8" />

    <UFormGroup :label="$t('basic.notes')" name="notes" :hint="`(${$t('basic.optional')})`">
      <UTextarea v-model="state.notes" />
    </UFormGroup>

    <UButton class="mt-8" type="submit">
      {{ $t('basic.submit') }}
    </UButton>
  </UForm>
</template>
