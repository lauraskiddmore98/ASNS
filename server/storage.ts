import { type User, type InsertUser, type ReidentificationSubmission, type InsertReidentification } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createReidentificationSubmission(submission: InsertReidentification): Promise<ReidentificationSubmission>;
  getReidentificationSubmission(id: string): Promise<ReidentificationSubmission | undefined>;
  updateReidentificationEmailStatus(id: string, emailSent: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private reidentificationSubmissions: Map<string, ReidentificationSubmission>;

  constructor() {
    this.users = new Map();
    this.reidentificationSubmissions = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createReidentificationSubmission(insertSubmission: InsertReidentification): Promise<ReidentificationSubmission> {
    const id = randomUUID();
    const submission: ReidentificationSubmission = {
      id,
      submissionData: insertSubmission.submissionData,
      submittedAt: new Date(),
      emailSent: "false"
    };
    this.reidentificationSubmissions.set(id, submission);
    return submission;
  }

  async getReidentificationSubmission(id: string): Promise<ReidentificationSubmission | undefined> {
    return this.reidentificationSubmissions.get(id);
  }

  async updateReidentificationEmailStatus(id: string, emailSent: string): Promise<void> {
    const submission = this.reidentificationSubmissions.get(id);
    if (submission) {
      submission.emailSent = emailSent;
      this.reidentificationSubmissions.set(id, submission);
    }
  }
}

export const storage = new MemStorage();
