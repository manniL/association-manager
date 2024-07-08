import { addMonths, startOfMonth } from "date-fns"
import type { PaymentScheduleIds } from '~/utils/constants'

type Member = {
  id: number,
  paymentRoleAmount: number,
  paymentSchedule: PaymentScheduleIds,
  joinDate?: Date,
  leaveDate?: Date
}

export function getAllPayeeInformation(members: Member[], previousPaymentDate: Date, iterations = 0) {
  // Failsafe at 13 months after -> No payment because nobody there
  if (iterations > 12) {
    throw new Error('No payees found after 12 months.')
  }

  // Get all users that
  // Have a payment role which is not free of charge
  // Have a join date
  const membersWithFee = members.filter(member => member.paymentRoleAmount > 0 && member.joinDate)
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
  const nextPaymentDate = startOfMonth(addMonths(previousPaymentDate, 1))
  return nextPaymentDate
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest
  it('covers the basic case', () => {
    const members: Member[] = [{
      id: 3,
      paymentRoleAmount: 500,
      paymentSchedule: 'monthly',
      joinDate: new Date('2000-01-01')
    }]
    const previousPaymentDate = new Date('2024-01-01')
    expect(getAllPayeeInformation(members, previousPaymentDate).payees.map(p => p.id)).toEqual([members[0].id])
    // TODO: Fix test to ensure paymentDate works expect(getAllPayeeInformation(members, previousPaymentDate).paymentDate.getTime()).toEqual(new Date('2024-02-01').getTime())
  })

  it('removes members who did not join yet', () => {
    const members: Member[] = [
      {
        id: 3,
        paymentRoleAmount: 500,
        paymentSchedule: 'monthly',

        joinDate: new Date('2000-01-01')
      },
      {
        id: -1,
        paymentRoleAmount: 500,
        paymentSchedule: 'monthly',

      }
    ]
    const previousPaymentDate = new Date('2024-01-01')
    expect(getAllPayeeInformation(members, previousPaymentDate).payees.map(p => p.id)).toEqual([members[0].id])
    // TODO: Fix test to ensure paymentDate works expect(getAllPayeeInformation(members, previousPaymentDate).paymentDate.getTime()).toEqual(new Date('2024-02-01').getTime())
  })

  it('removes members with no fee', () => {
    const members: Member[] = [
      {
        id: 3,
        paymentRoleAmount: 500,
        paymentSchedule: 'monthly',

        joinDate: new Date('2000-01-01')
      },
      {
        id: -1,
        paymentRoleAmount: 0,
        paymentSchedule: 'monthly',
        joinDate: new Date('2000-01-01')
      }
    ]
    const previousPaymentDate = new Date('2024-01-01')
    expect(getAllPayeeInformation(members, previousPaymentDate).payees.map(p => p.id)).toEqual([members[0].id])
    // TODO: Fix test to ensure paymentDate works expect(getAllPayeeInformation(members, previousPaymentDate).paymentDate.getTime()).toEqual(new Date('2024-02-01').getTime())
  }),

    it('removes members who left already', () => {
      const members: Member[] = [
        {
          id: 3,
          paymentRoleAmount: 500,
          paymentSchedule: 'monthly',

          joinDate: new Date('2000-01-01')
        },
        {
          id: -1,
          paymentRoleAmount: 0,
          paymentSchedule: 'monthly',
          joinDate: new Date('2000-01-01'),
          leaveDate: new Date('2000-02-01')
        }
      ]
      const previousPaymentDate = new Date('2024-01-01')
      expect(getAllPayeeInformation(members, previousPaymentDate).payees.map(p => p.id)).toEqual([members[0].id])
      // TODO: Fix test to ensure paymentDate works expect(getAllPayeeInformation(members, previousPaymentDate).paymentDate.getTime()).toEqual(new Date('2024-02-01').getTime())
    })

  it('errors if no member fulfills criteria', () => {
    const members: Member[] = [
      {
        id: -1,
        paymentRoleAmount: 0,
        paymentSchedule: 'monthly',
        joinDate: new Date('2000-01-01'),
        leaveDate: new Date('2000-02-01')
      }
    ]
    const previousPaymentDate = new Date('2024-01-01')
    expect(() => getAllPayeeInformation(members, previousPaymentDate).payees.map(p => p.id)).to.throw()
  })
}