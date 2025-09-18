import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { marked } from 'marked';

export async function GET(
  request: Request,
  { params }: { params: { date: string } }
) {
  const { date } = params; // YYYY-MM-DD
  const filePath = path.join(process.cwd(), 'public', 'journals', 'daily', `${date}.md`);

  try {
    const body_md = await fs.readFile(filePath, 'utf-8');
    const rendered_html = await marked(body_md);
    
    // basic link extractor
    const links = (body_md.match(/(\/c\/[a-zA-Z0-9?=&-.]*)/g) || []);

    return NextResponse.json({ body_md, rendered_html, links });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return NextResponse.json({ error: 'Journal not found' }, { status: 404 });
    }
    console.error('Failed to read journal:', error);
    return NextResponse.json({ error: 'Failed to read journal' }, { status: 500 });
  }
}
