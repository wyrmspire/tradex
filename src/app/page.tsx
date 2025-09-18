import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart2, BookOpen } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function DashboardPage() {
  const chartImage = PlaceHolderImages.find((img) => img.id === 'dashboard-chart');
  const journalImage = PlaceHolderImages.find((img) => img.id === 'dashboard-journal');

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tighter font-headline">Welcome to MarketViz Journal</h1>
        <p className="text-muted-foreground max-w-2xl">
          Your personal, data-driven hub for market analysis and trade journaling. Track instruments, visualize market data, and record your insights with precision.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="w-6 h-6 text-primary" />
              <span>Interactive Charts</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow space-y-4">
            {chartImage && (
               <div className="aspect-video overflow-hidden rounded-lg border">
                 <Image
                    src={chartImage.imageUrl}
                    alt={chartImage.description}
                    width={600}
                    height={400}
                    className="object-cover w-full h-full"
                    data-ai-hint={chartImage.imageHint}
                  />
               </div>
            )}
            <p className="text-muted-foreground">
              Dive deep into market data with our high-performance chart viewer. Analyze MES and MGC with customizable timeframes and overlays.
            </p>
            <div className="flex gap-2">
              <Button asChild>
                <Link href="/c/MES?tf=5m">View MES Chart <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/c/MGC?tf=5m">View MGC Chart</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary" />
              <span>Trading Journals</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow space-y-4">
             {journalImage && (
               <div className="aspect-video overflow-hidden rounded-lg border">
                 <Image
                    src={journalImage.imageUrl}
                    alt={journalImage.description}
                    width={600}
                    height={400}
                    className="object-cover w-full h-full"
                    data-ai-hint={journalImage.imageHint}
                  />
               </div>
            )}
            <p className="text-muted-foreground">
              Document your trading journey. Create daily, weekly, and monthly journals using Markdown and link them to specific chart views.
            </p>
            <Button asChild>
              <Link href="/j">Browse Journals <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 border-dashed">
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold mt-1">1.</span>
                <div>
                  <strong>Explore Charts:</strong> Use the sidebar to navigate to the chart viewer for MES or MGC.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold mt-1">2.</span>
                <div>
                  <strong>Read Journals:</strong> Visit the journals section to see example entries and analysis.
                </div>
              </li>
               <li className="flex items-start gap-3">
                <span className="text-primary font-bold mt-1">3.</span>
                <div>
                  <strong>Shareable Links:</strong> Chart configurations are stored in the URL, making it easy to share your analysis.
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
