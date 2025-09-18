# **App Name**: MarketViz Journal

## Core Features:

- Historical Data Download: Downloads historical 1-minute bar data for MES and MGC instruments from the TopstepX API, storing it in daily-partitioned JSONL files. Resumes interrupted downloads and performs daily data maintenance.
- Derived Timeframe Generation: Generates 5-minute bars from the downloaded 1-minute bars for each instrument, ensuring data continuity. Uses a tool to analyze existing data and backfill as needed, avoiding unnecessary processing and filling gaps with existing information.
- Public Chart Viewer: Displays interactive charts with selectable timeframes and customizable overlays (e.g., position markings). Shares chart state via URL parameters.
- Daily/Weekly/Monthly Journals: Allows users to create and store trading journals in Markdown format, automatically rendered as web pages.
- Data Packs API: Provides read-only API endpoints that expose pre-configured windows of market data, formatted for safe consumption by external Large Language Models.
- Admin Interface: Provides protected endpoints for administrators to reindex data and manage instrument contract mappings.
- Journal API: Exposes journal content (Markdown and rendered HTML) via API endpoints, including automatically-generated chart links for journal entries.

## Style Guidelines:

- Primary color: Deep violet (#673AB7), suggesting both sophistication and focus, mirroring the data-driven functionality.
- Background color: Dark grey (#303030), creating a dark mode experience that is easy on the eyes and highlights the data.
- Accent color: Electric purple (#9C27B0), providing contrast for key interactive elements and calls to action.
- Body and headline font: 'Inter', a sans-serif font, provides a clean, modern, objective feel suitable for data visualization.
- Code font: 'Source Code Pro' for displaying code snippets.
- Use minimalist, high-contrast icons to represent different data types and functions. Aim for clarity and easy recognition within the dark UI.
- Prioritize a clean, uncluttered layout with clear visual hierarchy. Use a grid-based system to align data elements and ensure readability.
- Incorporate subtle transitions and animations to provide feedback on user interactions and enhance the user experience without being distracting.