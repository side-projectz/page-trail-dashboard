import { IUser } from "@/lib/interface";
import prisma from "@/lib/prisma";

async function getAllUsers(): Promise<IUser[]> {
  try {
    const users = await prisma.user.findMany({
      where: {
        isActive: true
      }
    })

    return users as IUser[];
  } catch (error: any) {
    console.log(error)
    throw new Error(error.message);
  }
}


async function getUserDetails(email: string): Promise<IUser> {
  try {
    if (typeof email !== "string") throw new Error("Email should be a string");
    if (!email || email.trim() === '') throw new Error("Email is required");

    const user = await prisma.user.findUnique({
      where: {
        email
      }
    })

    if (!user) throw new Error("User not found")

    return user as IUser;
  } catch (error: any) {
    throw new Error(error.message);
  }
}