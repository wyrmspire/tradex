import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { journalEntries } from '@/lib/mock-data';
import { ArrowRight, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function JournalsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Trading Journals</h1>
        <p className="text-muted-foreground">
          A collection of daily, weekly, and monthly market analyses and trade reviews.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>All Entries</CardTitle>
          <CardDescription>Click on an entry to view details.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {journalEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.title}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        entry.type === 'daily'
                          ? 'default'
                          : entry.type === 'weekly'
                          ? 'secondary'
                          : 'outline'
                      }
                      className="capitalize"
                    >
                      {entry.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{entry.date}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={entry.path}>
                        View <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
