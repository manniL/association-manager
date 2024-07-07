import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { genderValues, paymentScheduleIds } from '../../utils/constants';

export const members = sqliteTable('members_2', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  // Personal
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  company: text('company'),
  gender: text('gender', { enum: genderValues }).notNull(),
  birthDate: integer('birth_date', { mode: 'timestamp' }),
  phone: text('phone'),
  email: text('email').unique(),

  // Address
  street: text('street').notNull(),
  city: text('city').notNull(),
  zip: text('zip').notNull(),
  state: text('state'),
  country: text('country'),

  // Membership
  membershipId: text('membership_id').unique().notNull(),
  joinDate: integer('join_date', { mode: 'timestamp' }),
  leaveDate: integer('leave_date', { mode: 'timestamp' }),
  notes: text('notes'),

  // Payment
  sepaAccountHolder: text('sepa_account_holder'),
  sepaIban: text('sepa_iban'),
  sepaBic: text('sepa_bic'),
  paymentRole: integer('payment_role').notNull(), // TODO: Foreign key to payment_roles
  paymentSchedule: text('payment_schedule', { enum: paymentScheduleIds }).notNull(),
  paymentType: text('payment_type', { enum: ['cash', 'sepa'] }).notNull(),

  // Meta
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull()
})

// Schema for inserting a user - can be used to validate API requests
export const insertMemberSchema = createInsertSchema(members);

// Schema for selecting a Member - can be used to validate API responses
export const selectMemberSchema = createSelectSchema(members);

export const paymentRoles = sqliteTable('payment_roles', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  name: text('name').notNull(),
  amount: integer('amount').notNull(),
  notes: text('notes'),
  
  // Meta
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull()
})

export const selectPaymentRoleSchema = createSelectSchema(paymentRoles);