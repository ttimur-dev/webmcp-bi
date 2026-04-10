# WebMCP BI

Browser-native Business Intelligence tool. Import CSV files, build interactive dashboards with charts — all running locally in your browser with no backend required.

## Key Features

- **CSV Import** — drag-and-drop CSV files; data is stored in DuckDB-WASM with persistent OPFS storage
- **SQL Analytics** — automatic aggregation queries (SUM, COUNT, AVG, MIN, MAX) with date bucketing
- **Interactive Charts** — bar, line, and pie charts powered by ECharts with data zoom
- **Draggable Dashboards** — responsive grid layout (react-grid-layout) with 5 breakpoints (lg/md/sm/xs/xxs)
- **Projects & Dashboards** — organize work into projects, each containing multiple dashboards
- **Fully Offline** — no server, no API calls; all data stays in the browser via OPFS

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19, TypeScript, Vite |
| Data Engine | DuckDB-WASM + Apache Arrow |
| State | Zustand + Immer (localStorage persist) |
| Charts | ECharts 6 |
| Layout | react-grid-layout |
| UI | shadcn/ui, Radix UI, Tailwind CSS 4 |
| Runtime | Bun |

## Architecture

The project follows **Feature-Sliced Design (FSD)**:

```
src/
├── app/            # Root component, DuckDB provider
├── pages/          # Full page views (Main)
├── widgets/        # Composite UI (DashboardCanvas, Header)
├── features/       # Business features (dataset-management, panel-configuration, project-management)
├── entities/       # Domain stores (dashboard, dataset, panel, project)
└── shared/         # DuckDB service, types, constants, shadcn/ui components
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 18+
- Chrome/Edge (SharedArrayBuffer requires cross-origin isolation)

### Install & Run

```bash
bun install
bun dev
```

Open http://localhost:5173 in Chrome.

### Build

```bash
bun run build
```

## Usage

1. Click **Projects** to create a project and a dashboard
2. Click **Data** to import a CSV file
3. Click the **+** button on the canvas to add a chart panel
4. Configure the panel: choose a dataset, dimension, measure, aggregation, and chart type
5. Drag and resize panels to arrange your dashboard

## Technical Notes

- **Cross-Origin Isolation** — Vite dev server sets `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp` headers for SharedArrayBuffer (DuckDB multithreading)
- **OPFS Persistence** — DuckDB database is stored in the Origin Private File System (`webmcpbi.db`), surviving page reloads
- **CSV Handling** — uses `ignore_errors=true` in `read_csv_auto()` to handle non-UTF-8 encoded files

## Scripts

```bash
bun dev                                     # Dev server
bun run build                               # Type check + Vite build
bunx prettier --write "src/**/*.{ts,tsx}"    # Format code
bunx tsc --noEmit                           # Type check only
```

## Roadmap

⭐ AI agents support (WebMCP) for power users and automation

⭐ Built-in AI chat (WebLLM) for regular users
