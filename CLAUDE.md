# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun dev          # dev server
bun run build    # tsc + vite build
bun run lint     # eslint
bunx prettier --write "src/**/*.{ts,tsx}"  # format
bunx tsc --noEmit  # type check only
```

## Architecture

**Feature-Sliced Design (FSD):**
```
src/
  app/        — providers, root component
  entities/   — dataset, project, block (Zustand stores + types)
  features/   — upload-csv, manage-datasets, manage-projects, configure-block
  widgets/    — DashboardCanvas, Header
  shared/     — lib (duckdb), ui (EChart, shadcn components)
```

**Data flow:**
1. User uploads CSV → `features/upload-csv` → `shared/lib/duckdb/service.ts` registers file handle temporarily, runs `CREATE OR REPLACE TABLE AS SELECT * FROM read_csv_auto(..., ignore_errors=true)`, then drops the file handle
2. Table is persisted in DuckDB's own OPFS file (`opfs://mybi.db`) — no manual file management
3. Dataset metadata (name, columns, rowCount, tableName) stored in `localStorage` via Zustand `persist`
4. Chart queries run on demand via `shared/lib/duckdb` → results rendered by ECharts
5. Block positions on the canvas are managed by `react-grid-layout` and persisted in `useProjectStore`

**DuckDB initialization** (`src/app/DuckDBProvider.tsx`):
- Calls `init()` once on mount — selects bundle via `selectBundle`, instantiates, then opens `opfs://mybi.db` with READ_WRITE access
- Tables from previous sessions are automatically available (persisted in the .db file)
- No restoration logic needed

**State management:**
- `useProjectStore` — projects, dashboards, blocks (including layout positions), persisted to localStorage
- `useDatasetStore` — dataset metadata only (not the actual data), persisted to localStorage

**ECharts theme** is registered in `src/shared/ui/EChart.tsx` as `'paper-studio'` and applied to all charts globally.

## Key constraints

- Requires cross-origin isolation for SharedArrayBuffer (DuckDB multithreading). `vite.config.ts` sets `COOP: same-origin` + `COEP: require-corp` headers and excludes `@duckdb/duckdb-wasm` from `optimizeDeps`.
- `apache-arrow` is a direct dependency — DuckDB query results are Arrow Tables. Currently using `.toArray().map(r => r.toJSON())` for result extraction.
- CSV import uses `ignore_errors=true` to handle non-UTF-8 encoded files (e.g. Windows-1252).
- Prettier config: `printWidth: 120`, single quotes, trailing commas.
