import { db } from "./db";
import { eq } from "drizzle-orm";
import { UserInsert, users } from "./schema";

export const getUsers = async () => {
  return db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
    })
    .from(users);
};
export const getUserByEmail = async (email: string) => {
  return db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
    })
    .from(users)
    .where(eq(users.email, email));
};
export const getUser = async (id: number) => {
  return db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
    })
    .from(users)
    .where(eq(users.id, id));
};

export const createUser = async (newUser: UserInsert) => {
  return db
    .insert(users)
    .values(newUser)
    .returning({ id: users.id, name: users.name, email: users.email });
};

export const updateUser = async (id: number, user: UserInsert) => {
  return db
    .update(users)
    .set(user)
    .where(eq(users.id, id))
    .returning({ id: users.id, name: users.name, email: users.email });
};
