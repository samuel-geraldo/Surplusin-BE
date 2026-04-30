import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('user', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }),
  role: varchar({ length: 50 }).default('user').notNull(),
});
