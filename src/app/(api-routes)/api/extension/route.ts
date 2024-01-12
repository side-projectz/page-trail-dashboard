import { syncUserRecords } from "@/lib/actions/database/common";
import { getUserDetails } from "@/lib/actions/database/user";
import { getUserRecords } from "@/lib/actions/redis";
import prisma from "@/lib/prisma";
import { formatTime } from "@/lib/utils";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 200;
export const dynamic = 'force-dynamic';

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



// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const email = searchParams.get('email');
//     if (!email) throw new Error("Email is required");
//     if (Array.isArray(email)) throw new Error("Email should be a string");
//     const user = await getUserDetails(email);
//     const today = {
//       start: moment().startOf('day').toISOString(),
//       end: moment().endOf('day').toDate()
//     }
//     const userDetail = (await prisma.domain.findMany({
//       where: {
//         Site: {
//           every: {
//             userId: user.id,
//             startDateTime: {
//               gte: new Date(today.start)
//             }
//           }
//         }
//       },
//       include: {
//         _count: true,
//         Site: true // Optional: if you want to include site details
//       }
//     })).map(_d => ({
//       ..._d,
//       visits: _d._count.Site,
//       pageCount: _d._count.Page,
//       timeSpent: _d.Site.reduce((acc, curr) => acc + (new Date(curr.endDateTime).getTime() - new Date(curr.startDateTime).getTime()), 0),
//       formattedTimeSpent: (formatTime(_d.Site.reduce((acc, curr) => acc + (new Date(curr.endDateTime).getTime() - new Date(curr.startDateTime).getTime()), 0))),
//       LastVisitedAt: moment(new Date(Math.max(..._d.Site.map(site => new Date(site.endDateTime).getTime()))).toISOString()).fromNow()
//     })).sort((a, b) => b._count.Site - a._count.Site)
//     return NextResponse.json(userDetail);
//   }
//   catch (error: any) {
//     return NextResponse.json({
//       message: "Error getting user records: " + error.message,
//       data: null,
//       status: 500
//     });
//   }
// }
