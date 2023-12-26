import { addUserRecord, getUserRecords } from "@/lib/actions/redis";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const {searchParams} = new URL(req.url);
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
    const body   = await req.json();
    const email = body?.email;
    const newRecords = body?.data;

    if (!email) throw new Error("Email is required");
    if (Array.isArray(email)) throw new Error("Email should be a string");

    if (!newRecords) throw new Error("New Records is required");

    const userDetails = await addUserRecord(email, newRecords);
    return NextResponse.json(userDetails);
    
  } catch (error: any) {
    return NextResponse.json({
      message: "Error updating user records, " + error.message,
      data: error,
      status: 500
    });
  }
}