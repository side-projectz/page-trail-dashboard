import { syncUserRecords } from "@/lib/actions/database/common";
import { getUserDetails } from "@/lib/actions/database/user";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 200;
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return NextResponse.json({
    status: 200,
    message: "API is working",
    data: null,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = body?.email;
    const newRecords = body?.data;
    let timeZone = body?.timeZone || "Asia/Calcutta";
    const version = body?.version;

    if (!email) throw new Error("Email is required");
    if (typeof email !== "string") throw new Error("Email should be a string");

    if (!timeZone) throw new Error("Time Zone is required");
    if (typeof timeZone !== "string")
      throw new Error("Time Zone should be a string");

    if (timeZone === "Asia/Kolkata") timeZone = "Asia/Calcutta";

    const tzIndex = Intl.supportedValuesOf("timeZone").findIndex(
      (tz) => tz === timeZone,
    );

    if (tzIndex === -1)
      throw new Error("Invalid Time Zone. Received " + timeZone);

    if (!newRecords) throw new Error("New Records is required");

    const userDetail = await getUserDetails(email);
    if (!userDetail) {
      await prisma.user.create({
        data: {
          email,
        },
      });
    }

    let pages;

    if (version === "2.8.0") {
      pages = newRecords;
    } else {
      pages = newRecords.map((record: any) => record.pages).flat();
    }

    for (const site of pages) {
      await syncUserRecords(email, {
        url: site.page,
        meta_title: site.meta.title,
        meta_description: site.meta.description,
        meta_image: site.meta.image || "",
        domain_name: site.domain,
        userId: email,
        startDateTime: site.startDateTime ?? new Date(site.openedAt),
        endDateTime: site.endDateTime ?? new Date(site.lastVisited),
        timeZone: timeZone,
      });
    }

    console.log("User Records Updated");

    return NextResponse.json({
      message: "User Records Updated",
      data: null,
      status: 200,
    });
  } catch (error: any) {
    return NextResponse.json({
      message: "Error updating user records, " + error.message,
      data: error,
      status: 500,
    });
  }
}

const formattedDate = (date: number, timeZone: string) =>
  new Date(
    new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZone,
    }).format(date),
  );
