Capstone Brief 1 — FinTrack Foundations: Database & NestJS Bootstrap
Design the FinTrack database, write it in raw SQL, and bootstrap the NestJS project that will serve it.

🗓 Due end of Week 19 (Sat 18 Jul 2026, 23:59)
📊 15% of the capstone grade

Deliverables

1. Entity-relationship diagram
   Draw an ERD for the schema above (pen & paper, dbdiagram.io, draw.io, or similar). Export it as an image and include it in your README. Show all four tables, their columns, primary keys, and foreign key relationships.

2. db/schema.sql — the DDL
   CREATE TABLE for all four tables using correct PostgreSQL types (SERIAL/BIGSERIAL for IDs, NUMERIC(12,2) for money, TIMESTAMP/DATE where appropriate, VARCHAR/TEXT for strings).
   Primary keys on every table; foreign keys with REFERENCES on accounts.user_id, transactions.account_id, transactions.category_id.
   Use CHECK constraints (or a Postgres ENUM type) to restrict accounts.type, categories.type, and transactions.type to their allowed values.
   NOT NULL on every column that must always have a value.
3. db/seed.sql — sample data
   Realistic seed data: at least 3 users, 2 accounts per user, 6 categories (mix of income/expense), and 20+ transactions spread across accounts and categories with varied dates.

4. db/queries.sql — at least 8 queries
   Cover, at minimum:

A filtered SELECT (e.g. all expense transactions for one account, ordered by date).
A JOIN across at least 3 tables (e.g. transaction + account + category, showing the user, account name, category name, and amount).
A GROUP BY aggregation (e.g. total expense per category per month).
One advanced query — a subquery, CTE, or window function (e.g. “accounts whose balance is below the average balance of that user”, or “the top spending category per user”).
A LEFT JOIN that surfaces categories with zero transactions.
Comment each query with one line explaining what it answers.

5. NestJS project bootstrap
   Run nest new fintrack-api and set up:

One module, controller, and service each for users, accounts, categories, and transactions.
One working GET endpoint per module (e.g. GET /accounts) returning a static/mock array shaped like your schema (no DB connection yet — that’s Week 21).
Basic .env/config setup (even if unused this week) so the project is ready to hold a database connection string later. 6. README
One paragraph explaining the FinTrack domain in your own words.
The ERD image.
How to run the NestJS project locally (npm install, npm run start:dev).
How to run the SQL files against a local Postgres instance.
