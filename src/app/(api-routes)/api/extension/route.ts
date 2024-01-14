import { syncUserRecords } from "@/lib/actions/database/common";
import { getUserDetails } from "@/lib/actions/database/user";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 200;
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
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
    const timeZone = body?.timeZone || 'Asia/Calcutta';

    if (!email) throw new Error("Email is required");
    if (typeof email !== "string") throw new Error("Email should be a string");

    if (!timeZone) throw new Error("Time Zone is required");
    if (typeof timeZone !== "string") throw new Error("Time Zone should be a string");
    if (!Intl.DateTimeFormat().resolvedOptions().timeZone.includes(timeZone)) throw new Error("Invalid Time Zone");

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

      const _startTime = formattedDate(site.openedAt, timeZone);
      const _endTime = formattedDate(site.lastVisited, timeZone);

      const res = await syncUserRecords(email, {
        url: site.page,
        meta_title: site.meta.title,
        meta_description: site.meta.description,
        meta_image: site.meta.image || '',
        domain_name: site.domain,
        userId: email,
        startDateTime: _startTime,
        endDateTime: _endTime,
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



const formattedDate = (date: number, timeZone: string) => new Date(new Intl.DateTimeFormat('en-US', {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  timeZone
}).format(date));