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
import { journalEntries } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import { Wand2 } from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { generateJournalSummary } from '@/ai/flows/generate-journal-summary';

export default function DailyJournalPage({ params }: { params: { date: string } }) {
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const entry = journalEntries.find(
    (e) => e.type === 'daily' && e.path.endsWith(params.date)
  );

  if (!entry) {
    notFound();
  }

  const handleGenerateSummary = async () => {
    setIsSummaryOpen(true);
    setIsLoading(true);
    setSummary('');
    try {
      const result = await generateJournalSummary({ journalEntry: entry.content });
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
        <h1 className="text-3xl font-bold font-headline tracking-tight">{entry.title}</h1>
        <p className="text-muted-foreground">Date: {entry.date}</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Journal Content</CardTitle>
          <CardDescription>
            Market observations and trade analysis for the day.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-invert max-w-none font-body">
            <style jsx global>{`
              .prose h2 { @apply text-2xl font-bold mt-8 mb-4 font-headline; }
              .prose h3 { @apply text-xl font-bold mt-6 mb-3 font-headline; }
              .prose p { @apply leading-relaxed mb-4; }
              .prose ul { @apply list-disc pl-5 mb-4; }
              .prose code { @apply bg-muted text-foreground px-1 py-0.5 rounded font-code; }
              .prose blockquote { @apply border-l-4 border-primary pl-4 italic text-muted-foreground; }
            `}</style>
            {entry.content.split('\n').map((line, i) => {
              if (line.startsWith('## ')) return <h2 key={i}>{line.substring(3)}</h2>;
              if (line.startsWith('### ')) return <h3 key={i}>{line.substring(4)}</h3>;
              if (line.startsWith('> ')) return <blockquote key={i}>{line.substring(2)}</blockquote>;
              if (line.startsWith('- ')) return <ul key={i}><li>{line.substring(2)}</li></ul>; // Simplified
              if (line.trim() === '') return <br key={i} />;
              return <p key={i}>{line}</p>;
            })}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleGenerateSummary}>
            <Wand2 className="mr-2 h-4 w-4" />
            Generate AI Summary
          </Button>
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
