import { syncUserRecords } from "@/lib/actions/database/common";
import { getUserDetails } from "@/lib/actions/database/user";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 200;
export const dynamic = "force-dynamic";

function createResponse(data: APIResponse<string | object>) {
  return new Response(JSON.stringify(data), {
    headers: {
      "content-type": "application/json",
    },
    status: data.status,
  });
}

export async function GET() {
  try {
    await prisma.domain.findFirst();

    return createResponse({
      message: "API is working fine",
      data: null,
      status: 200,
    });
  } catch (e: any) {
    console.error(e);
    return createResponse({
      message: "API is NOT working fine. " + e.message,
      data: null,
      status: 200,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = body?.email;
    const newRecords = body?.data;
    let timeZone = body?.timeZone || "Asia/Calcutta";
    const version = body?.version.replace(".", "");

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

    if (Number(version) >= 280) {
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

    return createResponse({
      message: "User Records Updated",
      data: null,
      status: 200,
    });
  } catch (error: any) {
    console.log("Error updating user records, " + error.message);

    return createResponse({
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
