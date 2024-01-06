import { NextRequest, NextResponse } from "next/server";
import { getAllSites } from "@/lib/actions/database/site";

export async function GET(req: Request) {
  try {
    const sites = await getAllSites();
    return NextResponse.json(sites);
  }
  catch (error: any) {
    return NextResponse.json({
      message: "Error getting sites records: " + error.message,
      data: null,
      status: 500
    });
  }

}