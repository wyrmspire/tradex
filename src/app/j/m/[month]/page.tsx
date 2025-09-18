'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { notFound, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function MonthlyJournalPage() {
  const params = useParams<{ month: string }>();
  const [journal, setJournal] = useState<{ rendered_html: string } | null>(null);
  const [loadingJournal, setLoadingJournal] = useState(true);

  useEffect(() => {
    if (!params.month) return;
    setLoadingJournal(true);
    fetch(`/api/journal/m/${params.month}`)
      .then(res => {
        if (!res.ok) throw new Error('not found');
        return res.json();
      })
      .then(data => setJournal(data))
      .catch(() => setJournal(null))
      .finally(() => setLoadingJournal(false));
  }, [params.month]);

  if (loadingJournal) {
    return <Skeleton className="h-96 w-full" />;
  }

  if (!journal) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Monthly Journal: {params.month}</h1>
        <p className="text-muted-foreground">Month: {params.month}</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Journal Content</CardTitle>
          <CardDescription>
            High-level market review and strategic outlook for the month.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="prose prose-invert max-w-none font-body"
            dangerouslySetInnerHTML={{ __html: journal.rendered_html }}
           />
        </CardContent>
      </Card>
    </div>
  );
}
