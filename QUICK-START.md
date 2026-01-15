# Quick Start Guide

Get up and running (after foundation setup)!

**⚠️ Note**: Foundation (database schema, project structure, dependencies, test infrastructure) needs to be set up first. All features are currently stubs.

## 1. Set Up Foundation First

**Before anything else, you need to:**
1. Design and create the database schema (`prisma/schema.prisma`)
2. Set up project structure (folders and files)
3. Configure dependencies (`package.json`)
4. Set up test infrastructure (`vitest.config.ts`)

## 2. Install Dependencies

```bash
pnpm install
```

## 3. Set Up Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your values:
# DATABASE_URL="postgresql://user:password@localhost:5432/blog_db"
# NEXTAUTH_SECRET="your-secret-here"
# JWT_SECRET="your-jwt-secret-here"
```

## 4. Set Up Database

```bash
# Generate Prisma Client (after schema is created)
pnpm db:generate

# Push schema to database (creates tables)
pnpm db:push

# Seed with sample data (after schema is ready)
pnpm db:seed
```

## 4. Start Development Server

```bash
pnpm dev
```

Visit: http://localhost:3000

**Note**: Most API endpoints will return 501 (Not Implemented) since they're stubs.

## 5. Run Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

## ✅ You're Ready!

- Frontend: http://localhost:3000
- API: http://localhost:3000/api (Note: Most endpoints return 501 - not implemented yet)
- Database Studio: `pnpm db:studio`

## ⚠️ Next Steps

**Important**: All API routes are currently stubs. 

1. **Read** [`TEAM-HANDOFF.md`](./TEAM-HANDOFF.md) to find your assigned tasks
2. **Open** your assigned file(s) - they have TODO comments with instructions
3. **Implement** following the TODO comments
4. **Test** your implementation

## 📝 Sample Test Users

After running `pnpm db:seed`:

- **Admin**: `admin@example.com` / `Admin123!@#`
- **Editor**: `editor@example.com` / `Editor123!@#`
- **Reader**: `reader@example.com` / `Reader123!@#`

## 🐛 Troubleshooting

**Database connection issues?**
- Check your `DATABASE_URL` in `.env`
- Make sure PostgreSQL is running
- Try `pnpm db:push` again

**Tests failing?**
- Make sure database is set up: `pnpm db:push`
- Check test database connection
- Run `pnpm db:generate` again

**TypeScript errors?**
- Run `pnpm db:generate` to regenerate Prisma client
- Restart your IDE/editor
- Check `tsconfig.json` paths are correct
