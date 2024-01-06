import { NextRequest, NextResponse } from "next/server";
import { getAllPages } from "@/lib/actions/database/page";

export async function GET(req: Request) {
  try {
    const pages = await getAllPages();
    return NextResponse.json(pages);
  }
  catch (error: any) {
    return NextResponse.json({
      message: "Error getting page records: " + error.message,
      data: null,
      status: 500
    });
  }

}