import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma";

interface User {
  name: string;
  email: string;
  password: string;
}

export const createUser = async (userData: User) => {
  const { name, email, password } = userData;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User with this email already exists.");
  }

  // Hash password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user in the database
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // Omit password in response
  const { password: _, ...userWithoutPassword } = newUser;

  return userWithoutPassword;
};
