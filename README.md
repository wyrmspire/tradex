# MarketViz Journal

Welcome to MarketViz Journal, a local-first trading journal and charting application built with Next.js and Firebase. This application is designed for traders who need robust data analysis tools without the risk of cloud-based trading execution.

This project focuses on:
- **Data Integrity**: A robust downloader for MES and Micro Gold (MGC) 1-minute bars.
- **Advanced Charting**: A dark-mode chart viewer with shareable links and custom overlays.
- **Insightful Journaling**: Daily, weekly, and monthly journals in Markdown.
- **AI-Ready Data**: Read-only "data packs" for safe consumption by external language models.

**Note:** This application strictly adheres to a no-trading policy in the cloud. All trading-related functionalities are disabled on the server side.

## Core Features

- **Historical Data**: Downloader for 1-minute bars for MES and MGC, going back 6 weeks.
- **Chart Viewer**: An interactive chart viewer powered by Lightweight Charts.
- **Journals**: Maintain daily, weekly, and monthly trading journals.
- **Data Packs API**: Specialized endpoints to serve market data for analysis.
- **Admin Tools**: Protected endpoints for data management and instrument configuration.

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- Firebase Account and a configured Firebase project

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

3.  **Firebase Setup:**
    - Initialize your Firebase project and connect it to this codebase.
    - Set up the required Firebase services: Authentication, Firestore, Cloud Storage, and Cloud Functions.

4.  **Environment Variables:**
    This project uses Firebase's Secret Manager for handling secrets. You will need to configure the following secrets in your Google Cloud project:
    - `TOPSTEPX_API_KEY`: Your API key for TopstepX.
    - `TOPSTEPX_USERNAME`: Your TopstepX username.
    - `READ_TOKEN`: A long, random string for bypassing API rate limits on read-only endpoints.

    For local development, you can create a `.env.local` file in the root of the project:
    ```
    TOPSTEPX_API_URL=https://api.topstepx.com
    TOPSTEPX_MARKET_HUB=https://rtc.topstepx.com/hubs/market
    TOPSTEPX_USERNAME=<your-username>
    TOPSTEPX_API_KEY=<your-api-key>
    ALLOWED_ORIGINS=http://localhost:9002
    READ_TOKEN=<your-random-read-token>
    ```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Usage Guide

### Instrument Management

Instrument contract details are stored in Firestore in the `instruments` collection. To handle contract rolls, an admin needs to update the `contractId` for the relevant symbol (`MES` or `MGC`).

Example `instruments/MES` document:
```json
{
  "symbol": "MES",
  "contractId": "CON.F.US.MES.U25",
  "tickSize": 0.25,
  "pointValue": 5
}
```

### Data Backfill

- The historical data backfill runs automatically via a scheduled Cloud Function.
- To trigger a backfill manually for the last 7 days, an admin can use the designated Cloud Task.

### API Examples

**Fetch Bar Data:**
```bash
curl "https://<your-hosting-domain>/api/bars?symbol=MES&tf=1m&from=2025-08-01T00:00:00Z&to=2025-09-17T23:59:59Z"
```

**Fetch Data Pack:**
```bash
curl "https://<your-hosting-domain>/api/packs/weekly_window?symbol=MES"
```

### Journaling

- Journal entries are stored as Markdown files in Cloud Storage.
- To add a new daily journal, upload a file to `journals/daily/<YYYY>/<MM>/<YYYY-MM-DD>.md`.
- You can embed chart links in your journals to reference specific market conditions.
