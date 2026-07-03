# IT Helpdesk Backend

Express, TypeScript, Prisma, and PostgreSQL backend API for the IT Helpdesk application.

## Prerequisites

Install these before starting:

- Node.js LTS
- npm
- PostgreSQL

Check that Node and npm are installed:

```bash
node -v
npm -v
```

## Setup From Scratch

### 1. Install Dependencies

From the backend folder:

```bash
cd dwm_help_desk_bff
npm install
```

### 2. Create the Database

Create a PostgreSQL database for the project.

Example database name:

```text
help_desk_bff
```

You can create it using pgAdmin, DBeaver, TablePlus, or the PostgreSQL command line.

### 3. Configure Environment Variables

Create a `.env` file in the `dwm_help_desk_bff` folder:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/help_desk_bff?schema=public"
JWT_SECRET="change_this_secret_for_local_development"
PORT=5000
```

Update the database URL if your PostgreSQL username, password, host, port, or database name is different.

### 4. Prepare Prisma and the Database

Generate the Prisma client:

```bash
npx prisma generate
```

Apply the database migrations:

```bash
npx prisma migrate dev
```

Seed the database with initial data:

```bash
npx prisma db seed
```

### 5. Start the Backend

```bash
npm run dev
```

The API will run at:

```text
http://localhost:5000/api
```

Health check:

```text
http://localhost:5000/
```

## Running the Full Project

Use two terminals.

Terminal 1, backend:

```bash
cd dwm_help_desk_bff
npm run dev
```

Terminal 2, frontend:

```bash
cd dwm_help_desk
npm run dev
```

The frontend `.env` should point to:

```env
VITE_APP_API_BASE_URL=http://localhost:5000/api
```

## Available Scripts

```bash
npm run dev
```

Starts the backend in development mode with auto-reload.

```bash
npm run build
```

Compiles TypeScript into the `dist` folder.

```bash
npm start
```

Runs the compiled backend from `dist`.

## Useful Prisma Commands

```bash
npx prisma generate
```

Generates the Prisma client.

```bash
npx prisma migrate dev
```

Applies migrations in development.

```bash
npx prisma db seed
```

Runs the database seed script.

```bash
npx prisma studio
```

Opens Prisma Studio to browse the database.

## Common Issues

### Backend Cannot Connect to Database

Check that:

- PostgreSQL is running.
- The database exists.
- `DATABASE_URL` has the correct username, password, port, and database name.

### Login or Protected Routes Fail

Make sure `JWT_SECRET` exists in `.env`, then restart the backend.

### Frontend Cannot Reach the API

Make sure:

- The backend is running on port `5000`.
- The frontend `.env` uses `VITE_APP_API_BASE_URL=http://localhost:5000/api`.
- The frontend was restarted after changing `.env`.
