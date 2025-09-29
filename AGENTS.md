# Repository Guidelines

## Project Structure & Module Organization
The Django backend lives in `backend/`. Settings and URL routing are under `backend/inspection_backend/`, while core inspection models, serializers, API views, fixtures, and migrations reside in `backend/inspections/`. Frontend code sits in `frontend/` with routed pages in `frontend/src/pages/`, shared UI in `frontend/src/components/`, reusable hooks in `frontend/src/hooks/`, and API contracts consolidated in `frontend/src/types.ts`. Use `inspection_app_spec.md` at the repo root to clarify workflows or domain rules before you make changes.

## Build, Test, and Development Commands
Create or activate the Python virtualenv, then run `cd backend && python manage.py migrate` to apply migrations and `python manage.py loaddata inspections/fixtures/*.json` to refresh sample data. Start the API with `python manage.py runserver 0.0.0.0:8000`. For the React client, install dependencies via `cd frontend && npm install`, run `npm run dev` during local development, and use `npm run build` for type-safe production bundles.

## Coding Style & Naming Conventions
Follow PEP 8 with 4-space indentation in Python; name Django models, serializers, and views in singular PascalCase (e.g., `TankSurvey`, `TankSurveySerializer`). Organize backend modules by workflow, keeping serializers, views, and URLs together. In TypeScript, create PascalCase component files, prefix hooks with `use`, and prefer inline Tailwind classes with their markup. Shared API types belong in `src/types.ts` and should mirror backend serializers.

## Testing Guidelines
Backend tests live in `backend/inspections/tests/` and extend `django.test.TestCase`. Mirror module names in test files (e.g., `test_goal_logic.py`) and use factory helpers instead of fixtures when feasible. Run `cd backend && python manage.py test` before publishing to catch migration or validation regressions. Frontend automated tests are optional; rely on `npm run build` for static checks unless you add Vitest suites under `frontend/src/__tests__/`.

## Commit & Pull Request Guidelines
Write imperative, ~50-character commit subjects (e.g., `Add UT result validation`) with wrapped body lines at 72 characters when needed. Group backend and frontend edits into logical commits and reference issues with `Refs #ID`. Pull requests should include a concise overview, affected areas (Backend, Frontend, Docs), explicit test commands, and UI screenshots or GIFs for visual changes. Link to `inspection_app_spec.md` when diverging from documented flows and flag follow-up tasks clearly.
