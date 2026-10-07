# TestQueens

Web app for SHSAT practice. Students take full-length mock tests, timed practice sets, and a
diagnostic exam. Tutors and admins manage the question bank, assign work, and review results.
Parents can see their own child's results.

Live at [testqueens.com](https://testqueens.com). Built by [Hamana Studio](https://hamana.studio).

Not affiliated with or endorsed by the New York City Department of Education. The score estimate
the app shows is calculated by our own formula and is not an official SHSAT score.

## Stack

- React 19 with React Router 7 (hash routing)
- Vite 8
- Tailwind CSS 4 through the Vite plugin
- Supabase for auth, Postgres, storage, and edge functions
- Recharts for the performance charts, jsPDF and html2canvas for PDF export

Source files are `.tsx` and `.ts`, but there is no `tsconfig.json` and TypeScript is not part of
the build. Vite strips the type annotations without checking them, so `npm run build` will not
catch a type error. ESLint does run over `.ts`/`.tsx` and will catch React hook mistakes.

## Setup

```bash
cd frontend
npm install
```

Create `frontend/.env` with the two values from your Supabase project under
**Project Settings → API**:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key_here
```

`.env` is gitignored and is not in the repo, so each machine needs its own copy.

Both are required. They get baked into the client bundle at build time, so only ever put the
publishable (anon) key here. Never the service role key.

Signup codes are not kept in `.env`. The `create-account` edge function checks them server side,
and they are set as Supabase secrets:

```bash
supabase secrets set STUDENT_CODE=your_student_code
supabase secrets set ADMIN_CODE=your_admin_code
```

## Commands

Run these from `frontend/`:

| Command           | What it does                       |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Dev server with hot reload         |
| `npm run build`   | Production build into `dist/`      |
| `npm run preview` | Serve the production build locally |
| `npm run lint`    | ESLint over the project            |

## Layout

```
src/
  pages/        One component per route
  components/   Shared UI and the question-type renderers
  hooks/        useELATools (highlighter, notepad, line mask), useModalBehavior
  utils/        Scoring, PDF export, passage text parsing, translations, test config
  assets/       Logo, inline SVG icons
  supabase-client.ts
```

### Question types

`components/questionRenderer.tsx` switches on a question's `type` and renders the matching
component. Supported: multiple choice, grid-in, multi-select, expression editor, linear graphing,
inline dropdown, drag-to-bin, drag-to-categorize, drag-fill, number-line click, table-row radio,
passage sentence select, and inline text span click.

To add one: write the component, add a `case` to `questionRenderer.tsx`, and add a branch to
`checkAnswer` in `pages/mocktest.tsx`. Miss that last step and the answer falls through to the
grid-in comparison, which will grade it wrong.

### Routes

`ProtectedRoute` in `App.tsx` gates access. Role checks happen in the browser, so row-level
security in Postgres is what actually protects the data.

| Route                                                   | Who can open it    |
| ------------------------------------------------------- | ------------------ |
| `/`, `/signUp`, `/reset-password`, `/privacy`, `/terms` | Anyone             |
| `/home`, `/performance`, `/mock/:testID`                | Students           |
| `/results/:testID`, `/performance/:studentId`           | Any signed-in user |
| `/admin`                                                | Admins             |
| `/tutor`                                                | Tutors             |
| `/parent`                                               | Parents            |

## Backend

Supabase lives at the repo root, not in `frontend/`:

- `supabase/functions/` has `create-account`, `generate-questions`, `classify-difficulty`,
  `analyze-performance`, `get-student-performance`, and `parent-api`. The last two are the ones
  the app calls at runtime.
- `supabase/migrations/` has the schema, the row-level security policies, and the RPCs.

Deploy from the repo root:

```bash
supabase functions deploy <function-name>
supabase db push
```

Heads up: several RPCs the frontend calls have no migration file, including
`get_diagnostic_question`, `get_english_passage_pool`, `get_math_question_pool`,
`get_question_by_uid`, `get_student_math_accuracy`, `get_student_rc_accuracy`,
`count_diagnostic_questions`, `create_topic_table`, and `get_correctly_answered_by_students`.
They exist in the live database but not in the repo, so `supabase db push` against a fresh
project produces an app that cannot load a test. Dump them and commit them before anyone tries
to stand up a second environment.

## Importing questions

`scripts/` converts source PDFs into database rows. Run in order:

1. `extract_tests.py` renders each page to PNG, pulls out question text, choices, type, and
   answer, and writes CSVs to `scripts/output/`.
2. `import_to_supabase.py` loads those CSVs into `all_questions` with `status = 'pending'`.
3. `set_difficulty.py` rates each question easy, medium, or hard.
4. `verify_answers.py` checks stored answers against the key and prints SQL `UPDATE` statements
   for mismatches.

Imported questions arrive as `pending`. Review them in **Admin → Questions** and approve them
before students see them.

Credentials come from the environment, never from a file:

| Variable | Used by |
|---|---|
| `ANTHROPIC_API_KEY` | `extract_tests.py`, `set_difficulty.py` |
| `SUPABASE_URL` | `import_to_supabase.py`, `set_difficulty.py` |
| `SUPABASE_SERVICE_ROLE_KEY` | `import_to_supabase.py`, `set_difficulty.py` |
| `SUPABASE_SERVICE_KEY` | `verify_answers.py` |

The service-role key goes by two names across the scripts. Same key. Worth unifying.

In PowerShell, quote the value so the dots in the JWT are not read as operators:

```powershell
$env:SUPABASE_SERVICE_KEY = "your-service-key"
python scripts/verify_answers.py
```

## Deploying

Netlify builds from `netlify.toml` at the repo root: base `frontend`, command `npm run build`,
publish `dist`.

`.env` is not committed, so set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` under
**Netlify → Site configuration → Environment variables** or the deployed build will have no
backend.

## Legal and privacy

`pages/privacyPage.tsx` and `pages/termsPage.tsx` describe what the app stores and under what
terms. They contain `[LEGAL ENTITY NAME]`, `[MAILING ADDRESS]`, `[CONTACT EMAIL]`, and `[STATE]`
placeholders that have to be filled in before launch.

If you change what data the app collects, update the privacy policy in the same commit.
