# IT Helpdesk BFF (Backend For Frontend)

This is a Node.js & Express API backend built with TypeScript and Prisma ORM for the IT Helpdesk application.

## Prerequisites

If you have a brand-new machine and haven't installed anything, you will need the following software installed:

1. **Node.js**: The JavaScript runtime environment. 
   - Download the **LTS (Long Term Support)** version from the [official Node.js website](https://nodejs.org/).
   - Verifying installation (run in terminal): `node -v` and `npm -v`

2. **PostgreSQL**: The relational database used by this project.
   - **Windows/Mac:** Download from the [PostgreSQL website](https://www.postgresql.org/download/). During installation, remember the password you set for the `postgres` user.
   - **Alternative (Docker):** If you prefer Docker, you can run `docker run --name helpdesk-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres`

## Getting Started

Follow these steps from scratch to get your development environment running:

### 1. Install Dependencies

Open your terminal, navigate to the root directory of this project (`dwm_help_desk_bff`), and run:

```bash
npm install
```

### 2. Configure Environment Variables

Create a new file named `.env` in the root of the project (if it doesn't already exist) and add the following contents:

```env
# Database connection string
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/help_desk_bff?schema=public"

# The port your server will run on (optional, defaults to 5000)
PORT=5000
```
> **Note:** If you set a different password during your PostgreSQL installation, replace the second `postgres` in the URL with your password (format: `postgresql://USER:PASSWORD@localhost:5432/DB_NAME`).

### 3. Setup the Database

Before running the application, make sure your PostgreSQL server is running. You will need to create an empty database named `help_desk_bff` (you can do this via pgAdmin or a database tool like DBeaver/TablePlus).

Once the database is created, run the following commands in your terminal to apply the schema and populate the database with initial data:

```bash
# Push the Prisma schema to your database
npx prisma db push

# Run the seeder to populate default departments and services
npx prisma db seed
```

### 4. Running the Application

Now you are ready to start the server!

**For Development (Auto-reloads on file changes):**
```bash
npm run dev
```
The server will start at `http://localhost:5000`.

**For Production:**
```bash
# Compile TypeScript to JavaScript
npm run build

# Start the compiled server
npm start
```

## Available Scripts

- `npm run dev` - Starts the development server using `tsx`.
- `npm run build` - Compiles the TypeScript source code to the `dist` folder.
- `npm start` - Runs the compiled application.
- `npx prisma studio` - Opens a visual database browser in your web browser.
- `npx prisma validate` - Validates the Prisma schema syntax.
