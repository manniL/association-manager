<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'


const schema = memberFormSchema
export type Schema = z.output<typeof schema>

const props = defineProps<{
  initialState?: Schema
}>()

// stripe / ... / TODO in the future if someone needs other payment providers
const paymentTypes = ['SEPA', 'CASH'] as const

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
  paymentRole: 'Full',
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
</script>

<template>
  <UForm :schema="schema" :state="state" @submit="onSubmit">

    <div class="space-y-4">
      <UFormGroup required label="First name" name="firstName">
        <UInput v-model="state.firstName" />
      </UFormGroup>

      <UFormGroup required label="Last name" name="lastName">
        <UInput v-model="state.lastName" />
      </UFormGroup>

      <UFormGroup required label="Gender" name="gender">
        <USelect v-model="state.gender" :options="genderOptions" />
      </UFormGroup>

      <UFormGroup label="Company" name="company" hint="(optional)">
        <UInput v-model="state.company" />
      </UFormGroup>

      <UFormGroup label="Date of Birth" name="birthDate" hint="(optional)" :ui="{ container: '' }">
        <UPopover :popper="{ placement: 'bottom-start' }">
          <UInput icon="i-heroicons-calendar-days-20-solid" :value="formattedBirthDate" type="date-local" size="md"
            class="w-full" />
          <template #panel>
            <AppDatePicker mode="date" v-model="state.birthDate" />
          </template>
        </UPopover>
      </UFormGroup>

      <UFormGroup label="Phone" name="phone" hint="(optional)">
        <UInput v-model="state.phone" />
      </UFormGroup>

      <UFormGroup label="Email" name="email" hint="(optional)">
        <UInput v-model="state.email" />
      </UFormGroup>
    </div>

    <UDivider class="my-8" label="Address" />

    <!-- Mark this as "address sub group" -->
    <div class="space-y-4">
      <UFormGroup required label="Street and House Number" name="street">
        <UInput v-model="state.address.street" />
      </UFormGroup>
      <UFormGroup required label="City" name="city">
        <UInput v-model="state.address.city" />
      </UFormGroup>
      <UFormGroup required label="Zip" name="zip">
        <UInput v-model="state.address.zip" />
      </UFormGroup>
      <UFormGroup label="State" name="state" hint="(optional)">
        <UInput v-model="state.address.state" />
      </UFormGroup>
      <UFormGroup required label="Country" name="country">
        <!-- TODO: Set default value, maybe optional -->
        <UInput v-model="state.address.country" />
      </UFormGroup>
    </div>

    <UDivider class="my-8" label="Membership" />

    <div class="space-y-4">
      <UFormGroup required label="Membership ID" name="membershipId">
        <UInput v-model="state.membershipId" />
      </UFormGroup>

      <!-- TODO: Add date picker *please* -->

      <UFormGroup label="Join Date" name="joinDate" hint="(optional)" :ui="{ container: '' }">
        <UPopover :popper="{ placement: 'bottom-start' }">
          <UInput icon="i-heroicons-calendar-days-20-solid" :value="formattedJoinDate" type="date-local" size="md"
            class="w-full" />
          <template #panel>
            <AppDatePicker mode="date" v-model="state.joinDate" />
          </template>
        </UPopover>
      </UFormGroup>

      <UFormGroup label="Leave Date" name="leaveDate" hint="(optional)" :ui="{ container: '' }">
        <UPopover :popper="{ placement: 'bottom-start' }">
          <UInput icon="i-heroicons-calendar-days-20-solid" :value="formattedLeaveDate" type="date-local" size="md"
            class="w-full" />
          <template #panel>
            <AppDatePicker mode="date" v-model="state.leaveDate" />
          </template>
        </UPopover>
      </UFormGroup>
    </div>

    <UDivider class="my-8" label="Payment" />

    <div class="space-y-4">
      <UFormGroup required label="Payment Role" name="paymentRole">
        <USelect v-model="state.paymentRole" :options="paymentRoles" />
      </UFormGroup>

      <UFormGroup required label="Payment Type" name="paymentType">
        <USelect v-model="state.payment.type" :options="paymentTypes" />
      </UFormGroup>

      <div v-if="state.payment.type === 'SEPA'">
        <UFormGroup label="Account Holder" name="accountHolder">
          <UInput v-model="state.payment.data.accountHolder" />
        </UFormGroup>
        <UFormGroup required label="IBAN" name="iban">
          <UInput v-model="state.payment.data.iban" />
        </UFormGroup>
        <UFormGroup label="BIC" name="bic" required>
          <UInput v-model="state.payment.data.bic" />
        </UFormGroup>
        <UFormGroup label="Mandate ID" name="mandate-id" required>
          <UInput v-model="state.payment.data.mandateId" />
        </UFormGroup>
        <UFormGroup label="Date of Mandate Signature" name="mandateDate" required :ui="{ container: '' }">
        <UPopover :popper="{ placement: 'bottom-start' }">
          <UInput icon="i-heroicons-calendar-days-20-solid" :value="formattedMandateDate" type="date-local" size="md"
            class="w-full" />
          <template #panel>
            <AppDatePicker mode="date" v-model="state.payment.data.mandateDate" />
          </template>
        </UPopover>
      </UFormGroup>
      </div>


      <UFormGroup required label="Payment Schedule" name="paymentSchedule">
        <!-- TODO: Use names here later on -->
        <USelect v-model="state.paymentSchedule" :options="paymentScheduleIds" />
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
