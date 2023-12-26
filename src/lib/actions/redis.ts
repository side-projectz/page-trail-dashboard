'use server';

// import { Redis } from "ioredis";

import { Redis } from '@upstash/redis'
import { customDeepMerger } from '../utils';

// const $REDIS_CLIENT = new Redis(process.env.REDIS_URL as string);

const $REDIS_CLIENT = new Redis({
  url: 'https://apn1-crisp-collie-33322.upstash.io',
  token: 'AYIqACQgODk0ZjRkNGItNjU5OS00NTk3LWI4NTgtMzJjNjY4Y2FiNTEzZmE2MmM2ZmMxZWQ2NDY0MWEzZmZiMmJhMGMxOWRmOWU=',
})


export async function createUser(email: string): Promise<APIResponse<Domain[]>> {

  try {
    const userDetail = await checkUserExists(email);

    return {
      message: "User Already Exists",
      data: userDetail,
      status: 409
    };

  } catch (error: any) {

    if (error.message === "User not found") {
      await $REDIS_CLIENT.set(email, []);
      return {
        message: "User created",
        data: [],
        status: 200
      };
    }

    throw new Error(error.message);
  }

}

export async function getUserRecords(email: string) {

  try {
    const userDetail = await checkUserExists(email);

    return {
      message: "User Records",
      data: userDetail,
      status: 200
    };

  } catch (error: any) {
    throw new Error(error.message);
  }

}

export async function addUserRecord(email: string, newRecords: Domain[]) {
  let userDetails: Domain[] | null = null;
  try {
    userDetails = await checkUserExists(email);
  } catch (error:any) {
    if (error.message === "User not found") {
      await $REDIS_CLIENT.set(email, []);
      userDetails = [];
    }
  }

  try {
    const updatedUserRecords = customDeepMerger(userDetails ?? [], newRecords);

    const res = await $REDIS_CLIENT.set(email, updatedUserRecords);

    return {
      message: "User Records Updated",
      data: res,
      status: 200
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

// Shared ================================

async function checkUserExists(email: string) {
  const userExists: Domain[] | null = await $REDIS_CLIENT.get(email);
  if (!!userExists === false) {
    throw new Error("User not found");
  }

  if (typeof userExists === 'string') {
    await $REDIS_CLIENT.set(email, JSON.parse(userExists));
  }

  return userExists;
}
