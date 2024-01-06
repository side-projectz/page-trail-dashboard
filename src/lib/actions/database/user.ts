import { IUser } from "@/lib/interface";
import prisma from "@/lib/prisma";

export async function getAllUsers(): Promise<IUser[]> {
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


export async function addUser(user: IUser): Promise<IUser> {
  try {
    const userRes = await prisma.user.create({
      data: user
    });

    return userRes as IUser;
  } catch (error: any) {
    console.log(error)
    throw new Error(error.message);
  }
}



export async function getUserDetails(email: string): Promise<IUser> {
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

export async function getUserById(id: string): Promise<IUser> { 
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id
      }
    });

    return user as IUser;
  } catch (error: any) {
    console.log(error)
    throw new Error(error.message);
  }
}

export async function updateUserById(id: string, user: IUser): Promise<IUser> { 
  try {
    const userRes = await prisma.user.update({
      where: {
        id: id
      },
      data: user
    });

    return userRes as IUser;
  } catch (error: any) {
    console.log(error)
    throw new Error(error.message);
  }
}


export async function deleteUserById(id: string): Promise<IUser> {
  try {
    const user = await prisma.user.delete({
      where: {
        id: id
      }
    });

    return user as IUser;
  } catch (error: any) {
    console.log(error)
    throw new Error(error.message);
  }
}
