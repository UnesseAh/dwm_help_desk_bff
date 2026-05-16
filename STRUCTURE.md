# Folder Structure & Architecture Guidelines

To maintain a clean, scalable, and standardized codebase for the **Help Desk System (BFF)** throughout our development weeks, all developers must strictly follow this folder structure inside the `src` directory. We use a **Layered Architecture** (Routes -> Controllers -> Services -> Data Access).

```text
src/
├── config/           # Global configuration files (e.g., environment variables, constants)
├── controllers/      # Route handlers - extracts request data, calls services, sends HTTP responses
├── middlewares/      # Express middlewares (e.g., JWT Authentication, Role Guards, Error Handlers)
├── routes/           # Express routes definitions - maps endpoints (URLs) to Controllers
├── services/         # Business Logic Layer - where all the heavy lifting and DB interactions happen
├── utils/            # Shared helper functions, constants, formatting tools
├── validators/       # Input validation logic (using express-validator rules)
└── index.ts          # Main application entry point (Express setup, server initialization)

prisma/
├── schema.prisma     # Prisma database schema (Models: User, Ticket, Message, etc.)
└── seed.ts           # Database seeder logic (Populates Departments, Services, Admin users)
```

## How to build a feature (e.g., Creating a Ticket - Week 1)

Whenever you add a new feature, follow this flow to separate concerns:

1. **Route (`src/routes/ticket.routes.ts`)**: 
   - Define the endpoint (e.g., `POST /tickets`).
   - Attach authentication/role middlewares.
   - Attach input validators.
   - Forward the request to the Controller.

2. **Validator (`src/validators/ticket.validators.ts`)**:
   - Define `express-validator` chains to ensure `title`, `description`, `priority`, and `categoryId` are valid before hitting the controller.

3. **Controller (`src/controllers/ticket.controller.ts`)**:
   - Extract `req.body` and `req.user` (from JWT).
   - Call `TicketService.createTicket(...)`.
   - Send back the success response (`res.status(201).json(...)`) or catch errors.
   - **Rule:** Do NOT write database queries (`prisma.ticket.create`) inside the controller!

4. **Service (`src/services/ticket.service.ts`)**:
   - Contains the core business logic.
   - Executes the Prisma queries: `prisma.ticket.create({ data: ... })`.
   - Applies any conditions (e.g., assigning a default status `Open`).
   - Returns the created record to the controller.

## Important Rules for Developers

- **Separation of Concerns:** Controllers handle HTTP, Services handle Business Logic, Prisma handles the Database.
- **Fat Services, Skinny Controllers:** Keep controllers as short as possible. All complex logic goes into the `services/` folder.
- **Error Handling:** Use the global error handler middleware. Do not leak database errors directly to the client.
- **Types:** Use TypeScript properly. If you need custom DTOs or interfaces, you can create a `types/` folder or declare them at the top of your service files. 
