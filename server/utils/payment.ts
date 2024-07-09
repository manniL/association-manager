import { addMonths, startOfMonth } from "date-fns"
import type { PaymentScheduleIds } from '~/utils/constants'

export type SimplifiedMember = {
  id: number
  firstName: string,
  lastName: string,
  joinDate?: Date
  leaveDate?: Date
  paymentSchedule: PaymentScheduleIds
  paymentRole: {
    amount: number,
    id: number,
    name: string
  }
}

export function getAllPayeeInformation(members: SimplifiedMember[], previousPaymentDate: Date, iterations = 0) {
  // Failsafe at 13 months after -> No payment because nobody there
  if (iterations > 12) {
    throw new Error('No payees found after 12 months.')
  }

  // Get all users that
  // Have a payment role which is not free of charge
  // Have a join date
  const membersWithFee = members.filter(member => member.paymentRole.amount > 0 && member.joinDate)
  const paymentDate = getNextPaymentDate(previousPaymentDate)

  const possiblePayees = membersWithFee.filter(member => {
    return member.joinDate! <= paymentDate && (!member.leaveDate || member.leaveDate > paymentDate)
  })

  if (!possiblePayees.length) {
    return getAllPayeeInformation(members, addMonths(previousPaymentDate, 1), iterations + 1)
  }

  return { payees: possiblePayees, paymentDate }
}

/**
 * @returns Date indicating the first day of the next month after the previous payment date
 */
function getNextPaymentDate(previousPaymentDate: Date) {
  // TODO: Double check UTC times
  const nextPaymentDate = startOfMonth(addMonths(previousPaymentDate, 1))
  return nextPaymentDate
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest
  it('covers the basic case', () => {
    const members: SimplifiedMember[] = [{
      id: 3,
      paymentRole: { amount: 500, id: 1, name: '' },
      firstName: '',
      lastName: '',
      paymentSchedule: 'monthly',
      joinDate: new Date('2000-01-01T00:00:00')
    }]
    const previousPaymentDate = new Date('2024-01-01T00:00:00')
    expect(getAllPayeeInformation(members, previousPaymentDate).payees.map(p => p.id)).toEqual([members[0].id])
    expect(getAllPayeeInformation(members, previousPaymentDate).paymentDate).toEqual(new Date('2024-02-01T00:00:00'))
  })

  it('removes members who did not join yet', () => {
    const members: SimplifiedMember[] = [
      {
        id: 3,
        paymentRole: { amount: 500, id: 1, name: '' },
        firstName: '',
        lastName: '',
        paymentSchedule: 'monthly',

        joinDate: new Date('2000-01-01T00:00:00')
      },
      {
        id: -1,
        paymentRole: { amount: 500, id: 1, name: '' },
        firstName: '',
        lastName: '',
        paymentSchedule: 'monthly',

      }
    ]
    const previousPaymentDate = new Date('2024-01-01T00:00:00')
    expect(getAllPayeeInformation(members, previousPaymentDate).payees.map(p => p.id)).toEqual([members[0].id])
    expect(getAllPayeeInformation(members, previousPaymentDate).paymentDate).toEqual(new Date('2024-02-01T00:00:00'))
  })

  it('removes members with no fee', () => {
    const members: SimplifiedMember[] = [
      {
        id: 3,
        paymentRole: { amount: 500, id: 1, name: '' },
        firstName: '',
        lastName: '',
        paymentSchedule: 'monthly',

        joinDate: new Date('2000-01-01T00:00:00')
      },
      {
        id: -1,
        paymentRole: { amount: 0 , id: 1, name: ''},
        firstName: '',
        lastName: '',
        paymentSchedule: 'monthly',
        joinDate: new Date('2000-01-01T00:00:00')
      }
    ]
    const previousPaymentDate = new Date('2024-01-01T00:00:00')
    expect(getAllPayeeInformation(members, previousPaymentDate).payees.map(p => p.id)).toEqual([members[0].id])
    expect(getAllPayeeInformation(members, previousPaymentDate).paymentDate).toEqual(new Date('2024-02-01T00:00:00'))
  }),

    it('removes members who left already', () => {
      const members: SimplifiedMember[] = [
        {
          id: 3,
          paymentRole: { amount: 500, id: 1, name: '' },
          firstName: '',
          lastName: '',
          paymentSchedule: 'monthly',

          joinDate: new Date('2000-01-01T00:00:00')
        },
        {
          id: -1,
          paymentRole: { amount: 0, id: 1, name: '' },
          firstName: '',
          lastName: '',
          paymentSchedule: 'monthly',
          joinDate: new Date('2000-01-01T00:00:00'),
          leaveDate: new Date('2000-02-01T00:00:00')
        }
      ]
      const previousPaymentDate = new Date('2024-01-01T00:00:00')
      expect(getAllPayeeInformation(members, previousPaymentDate).payees.map(p => p.id)).toEqual([members[0].id])
      expect(getAllPayeeInformation(members, previousPaymentDate).paymentDate).toEqual(new Date('2024-02-01T00:00:00'))
    })

  it('errors if no member fulfills criteria', () => {
    const members: SimplifiedMember[] = [
      {
        id: -1,
        paymentRole: { amount: 0, id: 1, name: '' },
        firstName: '',
        lastName: '',
        paymentSchedule: 'monthly',
        joinDate: new Date('2000-01-01T00:00:00'),
        leaveDate: new Date('2000-02-01T00:00:00')
      }
    ]
    const previousPaymentDate = new Date('2024-01-01T00:00:00')
    expect(() => getAllPayeeInformation(members, previousPaymentDate).payees.map(p => p.id)).to.throw()
  })
}