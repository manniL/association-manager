<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

// stripe / ... / TODO in the future if someone needs other payment providers
const paymentTypes = ['SEPA', 'CASH'] as const
type PaymentType = typeof paymentTypes[number]

// TODO: Read from Database
const paymentRoles = ['Full', 'Free'] as const

// TODO: IDs for them, not only names
// Maybe add "months"
const paymentScheduleOptions = [
  {
    id: 'monthly',
    name: 'Monthly',
    monthInterval: 1,
  },
  {
    id: 'quarterly',
    name: 'Quarterly',
    monthInterval: 3,
  },
  {
    id: 'yearly',
    name: 'Yearly',
    monthInterval: 12,
  },
] as const

// TODO: Sync with above
const paymentScheduleIds = ['monthly', 'quarterly', 'yearly'] as const

const gender = ['Prefer not to say', 'Male', 'Female', 'Other'] as const

const schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  gender: z.enum(gender),
  membershipId: z.string().min(1),
  company: z.string().optional(),
  address: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    zip: z.string().min(1),
    state: z.string().optional(),
    country: z.string().optional(), // TODO: List
  }),
  joinDate: z.coerce.date().optional(), // TODO: pipe to avoid null/invalid
  leaveDate: z.coerce.date().optional(),
  birthDate: z.coerce.date().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  notes: z.string().optional(),
  sepaData: z.object({
    accountHolder: z.string().optional(),
    iban: z.string(), // Use ibantools
    bic: z.string().optional(), // To validate / infer "somehow"
  }).optional(), // Only optional if paymentType is not SEPA
  paymentRole: z.enum(paymentRoles), // TODO
  paymentSchedule: z.enum(paymentScheduleIds),
  payment: z.discriminatedUnion('type', [
    z.object({
      type: z.literal('SEPA'),
      data: z.object({
        accountHolder: z.string().optional(),
        iban: z.string(), // Use ibantools
        bic: z.string(), // To validate / infer "somehow"
      })
    }),
    z.object({
      type: z.literal('CASH'),
      data: z.object({})
    })]
  )
})

// joinDate: Date
type Schema = z.output<typeof schema>

const state = reactive<Schema>({
  // Personal info
  firstName: '',
  lastName: '',
  company: '',
  gender: 'Prefer not to say',
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
  membershipId: '', // auto generate that?
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

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // Do something with data
  console.log(event.data)
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
        <USelect v-model="state.gender" :options="gender" />
      </UFormGroup>

      <UFormGroup label="Company" name="company" hint="(optional)">
        <UInput v-model="state.company" />
      </UFormGroup>

      <UFormGroup label="Date of Birth" name="birthDate" hint="(optional)">
        <UInput v-model="state.birthDate" />
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

      <UFormGroup label="Join Date" name="joinDate" hint="(optional)">
        <UInput v-model="state.joinDate" />
      </UFormGroup>

      <UFormGroup label="Leave Date" name="leaveDate" hint="(optional)">
        <UInput v-model="state.leaveDate" />
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
        <UFormGroup required label="IBAN" name="IBAN">
          <UInput v-model="state.payment.data.iban" />
        </UFormGroup>
        <UFormGroup label="BIC" name="BIC">
          <UInput v-model="state.payment.data.bic" />
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
