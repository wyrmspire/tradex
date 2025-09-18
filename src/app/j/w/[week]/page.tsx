import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { journalEntries } from '@/lib/mock-data';
import { notFound } from 'next/navigation';

export default function WeeklyJournalPage({ params }: { params: { week: string } }) {
  const entry = journalEntries.find(
    (e) => e.type === 'weekly' && e.path.endsWith(params.week)
  );

  if (!entry) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold font-headline tracking-tight">{entry.title}</h1>
        <p className="text-muted-foreground">Week: {params.week}</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Journal Content</CardTitle>
          <CardDescription>
            Market summary and key takeaways for the week.
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
              if (line.startsWith('- ')) return <ul key={i}><li>{line.substring(2)}</li></ul>;
              if (line.trim() === '') return <br key={i} />;
              return <p key={i}>{line}</p>;
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
