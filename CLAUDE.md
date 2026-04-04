# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun dev          # dev server
bun run build    # tsc + vite build
bunx prettier --write "src/**/*.{ts,tsx}"  # format
bunx tsc --noEmit  # type check only
```

## Architecture

**Feature-Sliced Design (FSD):**

```
┌─────────────────┐
│      app        │  ← Can import from all layers below
├─────────────────┤
│     views       │  ← Can import: widgets, features, entities, shared
├─────────────────┤
│    widgets      │  ← Can import: features, entities, shared
├─────────────────┤
│    features     │  ← Can import: entities, shared
├─────────────────┤
│    entities     │  ← Can import: shared only
├─────────────────┤
│     shared      │  ← Cannot import from any FSD layer
└─────────────────┘
```

## Mandatory Skills

Before ANY task, read and apply the relevant skills below. This is NOT optional.
If you skip reading a skill file, your work is invalid and must be redone.
After reading, confirm which skills you loaded.

### Always load (every session):

1. `cat .claude/skills/feature-sliced-design/SKILL.md` — FSD architecture rules

### Load on code review / refactoring:

2. `cat .claude/skills/code-refactoring/SKILL.md` — review methodology and report format

### Load when working with UI components:

3. `cat .claude/skills/shadcn/SKILL.md` — component library rules

### UI Component Rules (CRITICAL):

- ALWAYS use shadcn/ui components first. Do NOT create components from scratch if shadcn has an equivalent.
- Before creating any UI component, check if shadcn already provides it: Button, Input, Select, Dialog, Sheet, Dropdown, Card, Table, Tabs, Toast, etc.
- If shadcn doesn't have the exact component, COMPOSE it from existing shadcn primitives.
- Only build from zero if there is absolutely no shadcn equivalent or composition possible.
- When in doubt, run: `ls src/shared/ui/` to see what's already available.

### What NOT to do:

- Do NOT add abstractions "for future use"
- Do NOT change import paths unless fixing a bug
- Do NOT create a component from scratch when shadcn has it

## Key constraints

- Requires cross-origin isolation for SharedArrayBuffer (DuckDB multithreading). `vite.config.ts` sets `COOP: same-origin` + `COEP: require-corp` headers and excludes `@duckdb/duckdb-wasm` from `optimizeDeps`.
- CSV import uses `ignore_errors=true` to handle non-UTF-8 encoded files (e.g. Windows-1252).
- Prettier config: `printWidth: 120`, single quotes, trailing commas.
