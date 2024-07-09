

const LOCALE_EN = {
  app: {
    title: 'Association Manager',
  },
  basic: {
    name: 'Name',
    firstName: 'First Name',
    lastName: 'Last Name',
    gender: 'Gender',
    company: 'Company',
    birthDate: 'Birth Date',
    phone: 'Phone',
    email: 'Email',
    optional: 'optional',
    notes: 'Notes',
    submit: 'Submit',
    display: 'Display',
    preview: 'Preview',
    home: 'Home',
    finances: 'Finances',
    yes: 'Ja',
    no: 'Nein',
    genderOptions: {
      'no-answer': 'Prefer not to say',
      male: 'male',
      female: 'female',
      other: 'other',
    }
  },
  address: {
    address: 'Address',
    streetAndHouseNumber: 'Street and House Number',
    zip: 'ZIP',
    city: 'City',
    country: 'Country',
    state: 'State'
  },
  membership: {
    member: 'Member | Members',
    membership: 'Membership',
    id: 'Membership ID',
    joinDate: 'Join Date',
    leaveDate: 'Leave Date',
    view: 'View @:membership.member',
    total: {
      heading: 'Total Members',
      description: 'A total of {n} members are in the system.',
    },
    create: 'Add New @:membership.member',
  },
  payment: {
    role: {
      role: '@:payment.payment Role | @:payment.payment Roles',
      create: 'Add new @:payment.role.role',
      amount: 'Amount',
      amountForThisPayment: '@:payment.role.amount for this Payment',
      perMonth: '(per month)',
    },
    type: {
      type: '@:payment.payment Type',
      cash: 'Cash/Other',
      sepa: 'SEPA (German Batch Payment)',
      accountHolder: 'Account Holder',
      iban: 'IBAN',
      bic: 'BIC',
      mandateId: 'Mandate Reference',
      mandateDate: 'Date of Mandate Signature',
    },
    payment: 'Payment | Payments',
    schedule: {
      schedule: '@:payment.payment Schedule',
      options: {
        monthly: 'Monthly',
        quarterly: 'Quarterly',
        'half-yearly': 'Bi-Anually',
        yearly: 'Annually',
      }
    },
    misc: {
      collectionAt: 'Collection At',
      hasPaid: 'Has Paid?',
      actions: 'Actions',
    },
    state: {
      mark: {
        paid: 'Mark as Paid',
        unpaid: 'Mark as Unpaid',
      },
      sepaPayees: 'Mark all SEPA Payees as Paid',
    },
    sepa: {
      download: 'Download SEPA File',
    },
    create: 'Create New @:payment.payment',
    firstStartDate: 'First Payment Date',
    collectionDate: 'Collection Date',
    page: {
      finances: {
        about: {
          payments: 'Here you can manage all payments of your members. You can create new payments, mark them as paid or unpaid and download a SEPA file for all SEPA payees.',
          roles: 'Here you can manage all payment roles. A payment role is a group of members that pay the same amount of money. You can create new roles, edit or delete them.',
        },
        to: {
          payments: 'To the @:payment.payment',
          roles: 'To the @:payment.role',
        }
      }
    }
  }
} as const

type PartialDeepKeyOf<T> = {
  [P in keyof T]: T[P] extends string
  ? string
  : PartialDeepKeyOf<T[P]>
};

export type LOCALE = PartialDeepKeyOf<typeof LOCALE_EN>

export default defineI18nLocale<LOCALE>(async locale => LOCALE_EN)