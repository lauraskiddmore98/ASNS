import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { desc, eq } from 'drizzle-orm';
import { surveyResponses } from '@/lib/db/schema';

export async function GET() {
  try {
    const responses = await db.select().from(surveyResponses).orderBy(desc(surveyResponses.createdAt));
    return NextResponse.json(responses);
  } catch (error) {
    console.error('Error fetching survey responses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch survey responses' },
      { status: 500 }
    );
  }
}