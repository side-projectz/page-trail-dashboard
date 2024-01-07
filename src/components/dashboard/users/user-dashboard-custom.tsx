import { DollarSign, Globe, User } from "lucide-react";
import DashboardCard, { DashboardCardProps } from "../card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardBarChart } from "../chart";
import { DashboardList } from "../list";
import prisma from "@/lib/prisma";
import { formatTime } from "@/lib/utils";
import moment from "moment";
import { lte } from "lodash";

export default async function UsersDetailsDashboardCustom(props: { userId: string }) {

  const thisWeek = {
    start: moment().startOf('week').toDate(),
    end: moment().endOf('week').toDate()
  }


  const domainsVisited = (await prisma.domain.findMany({
    where: {
      Site: {
        some: {
          userId: props.userId,
          startDateTime: {
            gte: thisWeek.start,
            lte: thisWeek.end
          }
        }
      }
    },
    include: {
      _count: true,
      Site: true // Optional: if you want to include site details
    }
  })).map(_d => ({
    ..._d,
    visits: _d._count.Site,
    pageCount: _d._count.Page,
    timeSpent: _d.Site.reduce((acc, curr) => acc + (new Date(curr.endDateTime).getTime() - new Date(curr.startDateTime).getTime()), 0),
    formattedTimeSpent: (formatTime(_d.Site.reduce((acc, curr) => acc + (new Date(curr.endDateTime).getTime() - new Date(curr.startDateTime).getTime()), 0))),
    LastVisitedAt: moment(new Date(Math.max(..._d.Site.map(site => new Date(site.endDateTime).getTime()))).toISOString()).fromNow()
  })).sort((a, b) => b._count.Site - a._count.Site)


  const cardDetails = {
    totalDomainVisited: domainsVisited.length,
    totalPageVisited: domainsVisited.reduce((acc, curr) => acc + curr._count.Page, 0),
    totalTimeSpent: formatTime(domainsVisited.reduce((acc, curr) => acc + curr.timeSpent, 0)),
  }

  const cards: DashboardCardProps[] = [
    {
      title: 'Total Domains Visited',
      content: cardDetails.totalDomainVisited,
      icon: <Globe size={24} />,
    },
    {
      title: 'Total Pages Visited',
      content: cardDetails.totalPageVisited,
      icon: <DollarSign size={24} />
    },
    {
      title: 'Total Time Spent',
      content: cardDetails.totalTimeSpent,
      icon: <User size={24} />,
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Weekly - {moment(thisWeek.start).format('DD MMM')} to {moment(thisWeek.end).format('DD MMM')}
        </h2>
        <small className="flex-1 text-gray-600">
          <span className="font-bold">Last 7 days</span>
        </small>
      </div>


      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <DashboardCard  {...cards[0]} />
          <DashboardCard  {...cards[1]} />
          <DashboardCard  {...cards[2]} />
        </div>

        <div className="grid gap-4 grid-cols-2 md:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Frequently Visited Domains</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <DashboardBarChart data={domainsVisited.slice(0, 15)} xAxisKey="name" yAxisKey="visits" valueKey={"visits"} />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Time Spent</CardTitle>
              <CardDescription>
                Top total time spent based on you activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DashboardList data={domainsVisited.slice(0, 6)} titleKey="name" descriptionKey="LastVisitedAt" valueKey="formattedTimeSpent" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}