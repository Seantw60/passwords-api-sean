## Blog App Project

## Timeline

**Start Date:** Friday, January 16th

**End Date:** Tuesday, January 20th at 3:00 PM

**Total Time:** 2 working days

## Team Overview

**Total Developers:** 17
**Team Structure:**
- Part A — Data Guardians: 5 developers
- Part B — Security Squad: 5 developers (including global search)
- Part C — Blog Builders: 4 developers
- Part D — Chat Champions: 3 developers
- Part E — Access Avengers: 2 developers

## Who Does What

### Part A — **Data Guardians** (Database Setup & Safety)

**Asma — Comments that Reply to Other Comments**

* Finished when: Comments can reply to other comments like a family tree. Tests make sure this works right.
* Use: Prisma Self-Referencing Relations, Database Indexes

**Syriana — Connecting Users, Posts, and Comments**

* Finished when: Users own their posts and comments. No lost data. Tests make sure everything stays connected.
* Use: Prisma Relations (FK, PK etc.)

**Zakai — User Types and Helper Tools**

* Finished when: Different user types work (like admin, editor). Helper tools do useful things like tracking changes and engagement metrics (reading time, likes etc.). Tests prove it works.
* Use: Prisma Enums, Prisma Middleware

**Alan — Tools for Changing Many Things at Once**

* Finished when: Tools that change many posts at once work safely. If something goes wrong, everything gets undone. Tests prove this works.
* Use: Prisma Transactions, Error Handling

**Niki — Database Setup Leader**

* Finished when: Prisma 7, Postgres, Schema.Prisma complete file. Database setup works perfectly. Sample data gets added. Helps team fix database problems when they happen.
* Use: Prisma Migrations, Seed Scripts

### Part B — **Security Squad** (Login & Safety)

**Sean — Password Safety Tools**

* Finished when: Tools to hide passwords and check if they're right. Tests make sure it works. Used when people sign up or log in. Enforces password rules in database like minimum length, password history, and expiration. Prevents users from reusing old passwords.
* Use: bcrypt for Password Hashing, Crypto Library, Database Constraints, Password History Tracking

**Jose — Help People Reset Passwords**

* Finished when: People can ask for new passwords and set them. Special codes work safely. Tests check what happens with bad or old codes.
* Use: JWT Tokens, Nodemailer + Ethereal Email (testing) or Gmail SMTP (demo)

**Chris — Password Rules and Help Messages**

* Finished when: System tells people how to make good passwords. Clear error messages help users fix problems. Tests check weak passwords get rejected.
* Use: Zod Validation Schemas, RegEx Patterns

**Danny — Test What Goes Wrong with Logins**

* Finished when: Tests check what happens when people try bad things like signing up twice, using weak passwords, or attempting unauthorized access. Tests cover edge cases like expired tokens, duplicate emails, and invalid login attempts. All tests pass every time.
* Use: Vitest for Testing, Mock Data, Edge Case Testing

**Sa'Nya — Search Everything Across the App**

* Finished when: Search works across posts, comments, and users with filters by date, author, and keywords. Search results are accurate and properly paginated. Tests ensure search handles special characters and empty results correctly.
* Use: Prisma Full-Text Search, Query Filtering, Pagination

---

### Part C — **Blog Builders** (Blog Posts - create, read, change, delete)

**Julien — Change Many Posts at Once**

* Finished when: Can update many blog posts safely at the same time. If some fail, the working ones still get updated. Tests check this works right.
* Use: Prisma Transactions, Zod Array Validation

**Yara — Delete Posts (Single and Bulk)**

* Finished when: Can delete one or many blog posts safely. Only the owner can delete their posts. Handles cascade deletion of comments properly. Tests check what happens with bad requests and unauthorized attempts.
* Use: Prisma Delete Operations, Prisma Cascade Delete, Prisma Transactions, RBAC Middleware

**William — Create and Update Blog Posts**

* Finished when: Users can create new blog posts and update their existing posts. Posts have proper validation for title, content, and metadata. Tests check authorization and data validation.
* Use: Prisma Create/Update Operations, Zod Validation, RBAC Middleware

**Nya — Test Blog Post Features**

* Finished when: Tests check viewing post lists, single posts, creating posts, updating posts, and deleting posts. Tests also check pagination, filtering, and what happens with bad data or missing information.
* Use: Vitest for API Testing, Mock Data, Integration Testing

---

### Part D — **Chat Champions** (Comments - getting replies and searching)

**Brayden — Get Comments and Their Replies**

* Finished when: Can get all comments for a blog post, including replies to replies. Comments show up in the same order every time. Tests check deep reply chains and posts with no comments.
* Use: Prisma Nested Queries, Recursive Relations

**Marshall — Create, Update, and Delete Comments**

* Finished when: Users can create new comments, update their own comments, and delete their own comments. Comments can be replies to other comments. Tests check authorization and proper handling of nested comment deletion.
* Use: Prisma Create/Update/Delete Operations, Self-Referencing Relations, RBAC Middleware

**Jay — Test Comment Features**

* Finished when: Tests check creating comments, updating comments, deleting comments, and viewing nested comment threads. Tests verify deep nesting works correctly and edge cases like orphaned replies are handled.
* Use: Vitest for API Testing, Mock Data, Recursive Data Testing

---

### Part E — **Access Avengers** (Permissions and Project Management)

**Quil — Permission System and Middleware**

* Finished when: RBAC middleware checks user permissions for all protected actions. Only the right people can do things in the app based on their role (admin, editor, reader). Permission rules are clearly documented. Tests verify that unauthorized actions are blocked.
* Use: RBAC Middleware, JWT Role Checking, Next.js API Middleware

**Sean — API Integration and Project Coordination**

* Finished when: All API routes are properly set up and connected to the database layer. Routes follow consistent patterns and error handling. Helps coordinate between teams to resolve integration issues. Documents API endpoints clearly.
* Use: Next.js API Routes, Error Handling, API Documentation, Team Coordination

