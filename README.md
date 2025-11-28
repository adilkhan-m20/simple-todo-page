# Welcome to this To Do List Web-App project

## Project info

*URL*: https://lovable.dev/projects/886ed680-5622-4a0b-a4fc-7889e1e2174f

## How can I edit this code?

There are several ways of editing your application.

*Use Lovable*

Simply visit the [Lovable Project](https://lovable.dev/projects/886ed680-5622-4a0b-a4fc-7889e1e2174f) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

*Use your preferred IDE*

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev


*Edit a file directly in GitHub*

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

*Use GitHub Codespaces*

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/886ed680-5622-4a0b-a4fc-7889e1e2174f) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

# Lovable Project — Backend (Supabase)

This document adds a clear backend reference for the project: table schema, Supabase setup guide, API routes, environment variables, and contribution notes. Drop this into your repository root as README_BACKEND.md or merge its sections into your main README.

---

## Table schema

The app uses a single todos table. Run this SQL in the Supabase SQL editor or via migrations:

sql
CREATE TABLE todos(
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);


*Notes:*

* id is an auto-incrementing primary key.
* title is required; description is optional.
* is_completed defaults to false.
* created_at defaults to the current timestamp.

---

## Supabase setup guide (quick)

1. *Create a Supabase project*
   * Visit the Supabase dashboard and create a new project.
   * Choose a name, password and a region close to your users.

2. **Create the todos table**
   * Open SQL Editor → New query and paste the CREATE TABLE statement above. Run it.

3. *API keys*
   * Go to Project Settings → API.
   * Copy the anon (public) key for client-side use and the service_role key for trusted server operations (keep this secret).

4. *Enable CORS (if needed)*
   * If you call Supabase directly from a front-end, add your site origin in the project settings or handle CORS at your platform.

5. *Row-level security (RLS)*
   * For simple apps, you can leave RLS off. For production, enable RLS and add policies for authenticated users.

6. *Storage / Auth (optional)*
   * If your app needs user authentication or file storage, enable Auth and Storage from the Supabase dashboard and follow Supabase docs to configure providers.

---

## Required environment variables

Create a .env file for local development and set these variables:

bash
SUPABASE_URL=https://<your-project-ref>.supabase.co
SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key> # keep secret


Only use the SERVICE_ROLE key on trusted servers (not in browser or client bundles).

---

## Supabase client initialization (example)

*Node / Next.js (server-side)*

ts
// lib/supabaseServer.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // server-only
export const supabaseServer = createClient(supabaseUrl, supabaseKey);


*Client-side (React)*

ts
// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);


Remember to expose only the anon key to the browser (e.g. NEXT_PUBLIC_SUPABASE_ANON_KEY).

---

## API routes (suggested)

Below are conventional REST routes for a simple todos backend. Adjust filenames and framework-specific wiring to fit your project (Next.js API routes, Express, Vite + server, etc.).

### Routes

* GET /api/todos — list todos
* GET /api/todos/:id — get a single todo
* POST /api/todos — create a todo
* PUT /api/todos/:id — replace a todo
* PATCH /api/todos/:id — update fields
* DELETE /api/todos/:id — delete a todo

### Example Next.js-like handlers (pseudo code)

*GET /api/todos*

ts
// pages/api/todos/index.ts
import { supabaseServer } from '../../../lib/supabaseServer';

export default async function handler(req, res) {
  const { data, error } = await supabaseServer
    .from('todos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
}


*POST /api/todos*

ts
// pages/api/todos/index.ts (same file — handle POST)
const { title, description } = req.body;
const { data, error } = await supabaseServer
  .from('todos')
  .insert([{ title, description }])
  .select();


*GET /api/todos/:id*

ts
// pages/api/todos/[id].ts
const { id } = req.query;
const { data, error } = await supabaseServer
  .from('todos')
  .select('*')
  .eq('id', id)
  .single();


*PATCH /api/todos/:id*

ts
const { id } = req.query;
const updates = req.body; // e.g. { is_completed: true }
await supabaseServer
  .from('todos')
  .update(updates)
  .eq('id', id);


*DELETE /api/todos/:id*

ts
await supabaseServer
  .from('todos')
  .delete()
  .eq('id', id);


---

## Example curl requests

Create:

sh
curl -X POST "http://localhost:3000/api/todos" \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy milk","description":"1 litre"}'


List:

sh
curl "http://localhost:3000/api/todos"


Update:

sh
curl -X PATCH "http://localhost:3000/api/todos/1" \
  -H "Content-Type: application/json" \
  -d '{"is_completed":true}'


Delete:

sh
curl -X DELETE "http://localhost:3000/api/todos/1"


---

## Testing locally

1. Copy .env.example → .env and fill values.
2. npm i
3. npm run dev
4. Use Postman / curl to exercise the API routes.

---

## Migrations

For production, use SQL migration files tracked in git. Put the CREATE TABLE SQL into a migrations folder and apply via Supabase CLI or through the dashboard.

---

## Contribution notes

Thanks for helping! A few simple guidelines so contributions are fast and consistent:

* *Branching:* Create a feature branch named feat/<short-desc> or fix/<short-desc>.
* *Commits:* Keep commits small and descriptive. Use present-tense: add todos API, fix: return 404 when missing.
* *PRs:* Link the issue / summary. Describe how to test locally.
* *Code style:* Follow the existing TypeScript setup and lint rules. Run npm run lint before PR.
* *Tests:* Add tests for new routes or important logic.
* *Secrets:* Never commit .env or service_role keys. If you accidentally commit, rotate the key immediately.

---

## Deployment notes

* Deploy the front-end and server to your hosting of choice. If using Lovable, use the project dashboard's Publish flow.
* Set environment variables in the hosting provider (Supabase keys, project URL).
* Use the service role key only on the server. The anon key is fine for client operations.

---

## License

Add your preferred license (MIT, Apache-2.0, etc.).