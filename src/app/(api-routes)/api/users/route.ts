import { NextRequest, NextResponse } from "next/server";
import { getAllUsers } from "@/lib/actions/database/user";
export async function GET(req: Request) {
  try {
    const users = await getAllUsers();
    return NextResponse.json(users);
  }
  catch (error: any) {
    return NextResponse.json({
      message: "Error getting user records: " + error.message,
      data: null,
      status: 500
    });
  }

}