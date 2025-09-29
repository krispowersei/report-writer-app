# Tank Inspection App

Full-stack implementation of the inspection workflows described in `inspection_app_spec.md`, featuring a Django REST API and a modern React/Tailwind frontend. The app covers all four workflows:

1. **Tank master data capture** with “N/A” toggles that persist nulls in the DB schema.
2. **Survey & NDE logging** for settlement, UT, plumbness, visual findings, and other NDE methods.
3. **Executive summary builder** with controlled methods, dynamic yes/no logic, and reusable custom Q&A templates per goal.
4. **Reporting view** that aggregates results in a print/PDF-friendly layout with JSON / CSV exports.

## Project structure

```
backend/
  manage.py                   # Django entrypoint
  inspection_backend/         # Project settings & routing
  inspections/                # App with models, serializers, API views, fixtures
frontend/
  src/                        # React + Vite + Tailwind implementation
inspection_app_spec.md        # Original specification (reference)
README.md                     # You are here
```

## Backend setup (Django + SQLite by default)

1. Create and activate a virtual environment (example using `venv`):
   ```bash
   cd backend
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```
2. Run migrations (default SQLite database is persisted at `backend/db.sqlite3`):
   ```bash
   python manage.py migrate
   ```
   The migration set seeds the default executive-summary questions automatically.
3. Start the dev server:
   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```

### API highlights

- `GET /api/tanks/` — list tanks (auto-generated UUID primary keys)
- `POST /api/tanks/` — create master data record (Workflow 1)
- Nested resources for Workflow 2: `shell-settlement-surveys`, `ut-results`, `edge-settlement-checks`, `column-plumbness-checks`, `visual-findings`, `other-nde`
- `goal-results/` & `goal-question-templates/` — Workflow 3 goal matrix + reusable custom questions
- `GET /api/metadata/` — choice lists for enums, inspection goals, and method catalog

## Frontend setup (React + Vite + Tailwind)

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start the Vite dev server (proxying `/api` to Django on port 8000):
   ```bash
   npm run dev
   ```
3. Build for production when ready:
   ```bash
   npm run build
   ```

### Frontend features per workflow

- **Workflow 1:** Multi-section tank form with context hints, N/A toggles (persisted as `null`), and auto-defaults for enums.
- **Workflow 2:**
  - Shell settlement: station auto-labelling grid (A, B, C…) with dynamic rows.
  - UT results: per-category entry, shell-course picker seeded from tank courses, inline deletion.
  - Edge settlement, column plumbness, visual findings, other NDE: dedicated quick-add forms with immediate list updates.
- **Workflow 3:** Goal cards show controlled method chips, conditional yes/no prompts, and reusable custom question bank (backed by `goal_question_templates`).
- **Workflow 4:** Reporting dashboard summarises every tank (goal × method × result) with CSV/JSON exports and a browser `print()` hook for PDF.

## Optional: Using Postgres / Supabase

- Set `DATABASE_URL` to a Postgres connection string (e.g., Supabase) and rerun `python manage.py migrate`.
- The settings file normalises `postgres://` URLs and honours `PGSSLMODE` for SSL connections.
- When you switch back to SQLite, unset `DATABASE_URL` and Django will fall back automatically.

## Testing checklist

- `python manage.py test` (add tests under `inspections/tests/` as you extend behaviour)
- `npm run build` (TypeScript + Vite compilation)
- Manual pass: create a tank → add settlement data → log UT / plumbness / findings → populate executive summary → export JSON/CSV.

## Next steps / deployment notes

- Add authentication/permissions (e.g., DRF auth) if multiple inspectors collaborate.
- Wire PDF export to a real generator (e.g., WeasyPrint) when needed.
- Containerise with Docker (multi-stage build) for reproducible deploys.
