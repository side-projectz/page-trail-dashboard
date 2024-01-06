import { syncUserRecords } from "@/lib/actions/database/common";
import { addUserRecord, getUserRecords } from "@/lib/actions/redis";
import prisma from "@/lib/prisma";
import { Page, Domain } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) throw new Error("Email is required");
    if (Array.isArray(email)) throw new Error("Email should be a string");

    const userDetail = await getUserRecords(email);
    return NextResponse.json(userDetail);
  }
  catch (error: any) {
    return NextResponse.json({
      message: "Error getting user records: " + error.message,
      data: null,
      status: 500
    });
  }

}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = body?.email;
    const newRecords = body?.data;

    if (!email) throw new Error("Email is required");
    if (Array.isArray(email)) throw new Error("Email should be a string");
    if (typeof email !== "string") throw new Error("Email should be a string");

    if (!newRecords) throw new Error("New Records is required");

    const pages = newRecords.map((record: any) => record.pages).flat();

    for (const site of pages) {
      const res = await syncUserRecords(email, {
        url: site.page,
        meta_title: site.meta.title,
        meta_description: site.meta.description,
        meta_image: '',
        domain_name: site.domain,
        userId: email,
        startDateTime: site.openedAt + '',
        endDateTime: site.lastVisited + ''
      })
    }

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