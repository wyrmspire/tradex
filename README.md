# MarketViz Journal

Welcome to MarketViz Journal, a local-first trading journal and charting application built with Next.js and Firebase. This application is designed for traders who need robust data analysis tools without the risk of cloud-based trading execution.

This project focuses on:
- **Data Integrity**: A robust downloader for MES and Micro Gold (MGC) 1-minute bars.
- **Advanced Charting**: A dark-mode chart viewer with shareable links and custom overlays.
- **Insightful Journaling**: Daily, weekly, and monthly journals in Markdown.
- **AI-Ready Data**: Read-only "data packs" for safe consumption by external language models.

**Note:** This application strictly adheres to a no-trading policy in the cloud. All trading-related functionalities are disabled on the server side. All data is sample data stored locally in the repository.

## Core Features

- **Historical Data**: Sample 1-minute bars for MES and MGC.
- **Chart Viewer**: An interactive chart viewer powered by Lightweight Charts with a position overlay tool.
- **Journals**: Maintain daily, weekly, and monthly trading journals from local Markdown files.
- **Data Packs API**: Specialized endpoints to serve market data for analysis.
- **Admin Tools**: Protected endpoints for data management and instrument configuration.

## Getting Started

### Prerequisites

- Node.js (v18 or later)

### Setup & Configuration

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd marketviz-journal
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Usage Guide

### Instrument Management

Instrument metadata is stored in `public/sample/instruments.json`.

Example `instruments.json` entry:
```json
{
  "symbol": "MES",
  "tickSize": 0.25,
  "pointValue": 5,
  "display": "Micro E-mini S&P 500"
}
```

### API Examples

**Fetch Bar Data:**
```bash
curl "http://localhost:9002/api/bars?symbol=MES&tf=1m&from=2025-09-16T13:30:00Z&to=2025-09-16T14:30:00Z"
```

**Fetch Data Pack:**
```bash
curl "http://localhost:9002/api/packs/weekly_window?symbol=MES"
```

**Chart URL:**
A chart can be shared via URL. The `ov` parameter is a base64 encoded JSON object for overlays.
`/c/MES?tf=5m&from=2025-09-17T13:30:00Z&to=2025-09-17T20:00:00Z&ov=eyJvdmVybGF5cyI6W3sidHlwZSI6InBvc2l0aW9uIiwiZW50cnkiOjU3MDIsInN0b3AiOjU3MDAsInRhcmdldCI6NTcwNn1dfQo=`

### Journaling

- Journal entries are stored as Markdown files in `public/journals/`.
- To view a daily journal, navigate to `/j/d/YYYY-MM-DD`.
- You can embed chart links in your journals to reference specific market conditions.
