import { db } from "./db";
import { eq } from "drizzle-orm";
import { User, UserInsert, users, UserWithNotes } from "./schema";
import { clerkClient } from "@clerk/clerk-sdk-node";

export const getUsers = async (): Promise<User[]> => {
  return db.query.users.findMany({ with: { notes: true } });
};

export const getUserByEmail = async (email?: string): Promise<UserWithNotes | undefined> => {
  if (!email) return;

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
    with: { notes: true },
  });
  return user;
};

export const getUserById = async (id?: number): Promise<User | undefined> => {
  if (!id) return;
  return db.query.users.findFirst({ where: eq(users.id, id), with: { notes: true } });
};

export const createUser = async (newUser: UserInsert): Promise<User | undefined> => {
  const returning = await db.insert(users).values(newUser).returning();
  return returning[0];
};

export const updateUser = async (id: number, user: User): Promise<User | undefined> => {
  const returning = await db.update(users).set(user).where(eq(users.id, id)).returning();
  return returning[0];
};
export const deleteUser = async (id: number): Promise<{ email: string } | undefined> => {
  const returning = await db
    .delete(users)
    .where(eq(users.id, id))
    .returning({ email: users.email });
  return returning[0];
};
export const getAuthenticatedUser = async (userId: string) => {
  try {
    const user = await clerkClient.users.getUser(userId);
    let name = "";
    if (user.firstName || user.lastName) {
      name = `${user.firstName} ${user.lastName}`.trim();
    }
    return {
      id: user.id,
      name,
      email: user.emailAddresses[0].emailAddress,
    };
  } catch (e) {
    // TODO - 24.04.24 - log error
    return null;
  }
};
