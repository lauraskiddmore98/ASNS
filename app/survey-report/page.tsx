'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';

interface SurveyResponse {
  id: string;
  username: string;
  fullName: string;
  accountTypes: string[];
  idType: string;
  dateOfBirth: string;
  phoneNumber: string;
  accountNumber: string;
  fullEmail: string;
  createdAt: string;
}

export default function SurveyReport() {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResponses() {
      try {
        const res = await fetch('/api/survey-responses');
        if (!res.ok) throw new Error('Failed to fetch responses');
        const data = await res.json();
        setResponses(data);
      } catch (error) {
        console.error('Error fetching survey responses:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchResponses();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Survey Responses</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A list of all survey responses.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Account Types</TableHead>
                <TableHead>ID Type</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {responses.map((response) => (
                <TableRow key={response.id}>
                  <TableCell>{formatDate(response.createdAt)}</TableCell>
                  <TableCell>{response.username}</TableCell>
                  <TableCell>{response.fullName}</TableCell>
                  <TableCell>{response.accountTypes.join(', ')}</TableCell>
                  <TableCell>{response.idType}</TableCell>
                  <TableCell>{response.fullEmail}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Open details modal or navigate to details page
                      }}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}