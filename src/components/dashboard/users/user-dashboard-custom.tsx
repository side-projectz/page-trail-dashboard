import { DollarSign, Globe, User } from "lucide-react";
import DashboardCard, { DashboardCardProps } from "../card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardBarChart } from "../chart";
import prisma from "@/lib/prisma";
import { formatTime } from "@/lib/utils";
import moment from "moment-timezone";
import { DashboardList } from "../list";



export type UserDetailsDashboardCustomProps = {
  userId: string,
  start: string,
  end: string,
  title: string,
  description: string,
}


const fetchDomainData = async (userId: string, start: string, end: string) => {

  const startTime = new Date(start);
  const endTime = new Date(end);

  const sites = await prisma.site.groupBy({
    by: ['domainId'],
    where: {
      userId: userId,
      startDateTime: {
        gte: startTime,
        lte: endTime
      },
      endDateTime: {
        gte: startTime,
        lte: endTime
      }
    },
    _count: {
      domainId: true,
    }
  })

  const domainIds = Object.entries(sites).map(([key, value]) => value.domainId);

  return await prisma.domain.findMany({
    where: {
      id: {
        in: (domainIds as string[]),
      }
    },
    include: {
      _count: true,
      Site: true // Include site details if needed
    }
  });
}

const processDomainData = (domains: any[]) => {
  return domains.map((domain: any) => ({
    ...domain,
    visits: domain._count.Site,
    pageCount: domain._count.Page,
    timeSpent: domain.Site.reduce((acc: number, site: any) => acc + (new Date(site.endDateTime).getTime() - new Date(site.startDateTime).getTime()), 0),
    formattedTimeSpent: formatTime(domain.Site.reduce((acc: number, site: any) => acc + (new Date(site.endDateTime).getTime() - new Date(site.startDateTime).getTime()), 0)),
    LastVisitedAt: moment(new Date(Math.max(...domain.Site.map((site: any) => new Date(site.endDateTime).getTime()))).toISOString()).fromNow()
  })).sort((a, b) => b._count.Site - a._count.Site);
}

export default async function UsersDetailsDashboardCustom(props: UserDetailsDashboardCustomProps) {

  // console.log('props.dates', new Date(props.start), new Date(props.end));

  const domainsVisited = await fetchDomainData(props.userId, props.start, props.end);
  const processedDomains = processDomainData(domainsVisited);

  const graphData = {
    timeSpent: processedDomains.sort((a, b) => b.timeSpent - a.timeSpent)
  }

  const cardDetails = {
    totalDomainVisited: processedDomains.length,
    totalPageVisited: processedDomains.reduce((acc, domain) => acc + domain.pageCount, 0),
    totalTimeSpent: formatTime(processedDomains.reduce((acc, domain) => acc + domain.timeSpent, 0)),
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
          {props.title}
        </h2>
        <small className="flex-1 text-gray-600">
          <span className="font-bold">{props.description}</span>
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
              <DashboardBarChart data={graphData.timeSpent.slice(0, 15)} xAxisKey="name" yAxisKey="timeSpent" valueKey={"timeSpent"} />
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
              <DashboardList data={graphData.timeSpent.slice(0, 6)} titleKey="name" descriptionKey="LastVisitedAt" valueKey="formattedTimeSpent" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}