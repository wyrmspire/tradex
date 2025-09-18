'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { notFound, useParams } from 'next/navigation';
import { Wand2, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { generateJournalSummary } from '@/ai/flows/generate-journal-summary';

export default function DailyJournalPage() {
  const params = useParams<{ date: string }>();
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [journal, setJournal] = useState<{ body_md: string, rendered_html: string, links: string[] } | null>(null);
  const [loadingJournal, setLoadingJournal] = useState(true);

  useEffect(() => {
    if (!params.date) return;
    setLoadingJournal(true);
    fetch(`/api/journal/d/${params.date}`)
      .then(res => {
        if (!res.ok) throw new Error('not found');
        return res.json();
      })
      .then(data => {
        setJournal(data);
      })
      .catch(() => setJournal(null))
      .finally(() => setLoadingJournal(false));
  }, [params.date]);

  if (loadingJournal) {
    return <Skeleton className="h-96 w-full" />;
  }

  if (!journal) {
    notFound();
  }

  const handleGenerateSummary = async () => {
    if (!journal) return;
    setIsSummaryOpen(true);
    setIsLoading(true);
    setSummary('');
    try {
      const result = await generateJournalSummary({ journalEntry: journal.body_md });
      setSummary(result.summary);
    } catch (error) {
      console.error('Failed to generate summary:', error);
      setSummary('Could not generate a summary at this time.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Daily Journal: {params.date}</h1>
        <p className="text-muted-foreground">Date: {params.date}</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Journal Content</CardTitle>
          <CardDescription>
            Market observations and trade analysis for the day.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="prose prose-invert max-w-none font-body"
            dangerouslySetInnerHTML={{ __html: journal.rendered_html }}
          />
        </CardContent>
        <CardFooter className='flex-col items-start gap-4'>
          <Button onClick={handleGenerateSummary}>
            <Wand2 className="mr-2 h-4 w-4" />
            Generate AI Summary
          </Button>
          {journal.links.length > 0 && (
            <div>
              <h4 className='font-semibold mb-2'>Chart Links:</h4>
              <div className='flex flex-col gap-2'>
              {journal.links.map((link, i) => (
                <Button asChild variant="link" className="p-0 h-auto justify-start" key={i}>
                  <Link href={link} target="_blank">
                    <LinkIcon className="mr-2 h-4 w-4" />
                    {link}
                  </Link>
                </Button>
              ))}
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
      <Dialog open={isSummaryOpen} onOpenChange={setIsSummaryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AI-Generated Summary</DialogTitle>
            <DialogDescription>
              A concise overview of the key points from this journal entry.
            </DialogDescription>
          </DialogHeader>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <p>{summary}</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
