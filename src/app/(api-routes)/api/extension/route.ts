import { syncUserRecords } from "@/lib/actions/database/common";
import { getUserDetails } from "@/lib/actions/database/user";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 200;
export const dynamic = 'force-dynamic';

export async function GET(req:Request){
  return NextResponse.json({
    status: 200,
    message: 'API is working',
    data: null
  })
}



export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = body?.email;
    const newRecords = body?.data;
    const timeZone = body?.timeZone;

    if (!email) throw new Error("Email is required");
    if (Array.isArray(email)) throw new Error("Email should be a string");
    if (typeof email !== "string") throw new Error("Email should be a string");

    if (!newRecords) throw new Error("New Records is required");

    const userDetail = await getUserDetails(email);
    if (!userDetail) {
      await prisma.user.create({
        data: {
          email
        }
      })
    }

    const pages = newRecords.map((record: any) => record.pages).flat();

    for (const site of pages) {
      const res = await syncUserRecords(email, {
        url: site.page,
        meta_title: site.meta.title,
        meta_description: site.meta.description,
        meta_image: '',
        domain_name: site.domain,
        userId: email,
        startDateTime: new Date(site.openedAt).toISOString(),
        endDateTime: new Date(site.lastVisited).toISOString(),
        timeZone: timeZone
      })
    }

    console.log('User Records Updated')

    return NextResponse.json({
      message: "User Records Updated",
      data: null,
      status: 200
    });

  } catch (error: any) {
    return NextResponse.json({
      message: "Error updating user records, " + error.message,
      data: error,
      status: 500
    });
  }
}


