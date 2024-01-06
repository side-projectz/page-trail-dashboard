import { NextRequest, NextResponse } from "next/server";
import { addDomain, getAllDomains } from "@/lib/actions/database/domain";
import { IDomain } from "@/lib/interface";
import { I } from "@upstash/redis/zmscore-a4ec4c2a";

export async function GET(req: Request) {
  try {
    const domains = await getAllDomains();
    return NextResponse.json(domains);
  }
  catch (error: any) {
    return NextResponse.json({
      message: "Error getting domain records: " + error.message,
      data: null,
      status: 500
    });
  }

}

export async function POST(req: Request) {
 
  try {
    const body   = await req.json();
    const domainName = body?.name;

    if (!domainName) throw new Error("Domain Name is required");
    if(typeof domainName !== "string") throw new Error("Domain Name should be a string");

    const domain:IDomain = {     
      name: domainName,createdAt : new Date(), updatedAt: new Date()
    };

    const domainRes = await addDomain(domain);
    return NextResponse.json(domainRes);
    
  } catch (error: any) {
    return NextResponse.json({
      message: "Error adding domain records, " + error.message,
      data: error,
      status: 500
    });
  }

}