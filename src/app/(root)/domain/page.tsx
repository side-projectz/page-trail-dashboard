import DashboardCard, { DashboardCardProps } from "@/components/dashboard/card";
import { DashboardDataTable } from "@/components/dashboard/data-table";
import { DashboardTable } from "@/components/dashboard/table";
import DevLog from "@/components/dev-log";
import { getAllDomains } from "@/lib/actions/database/domain";
import { getAllPages } from "@/lib/actions/database/page";
import { getAllSites } from "@/lib/actions/database/site";
import prisma from "@/lib/prisma";
import { DollarSign, Globe, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardBarChart } from "@/components/dashboard/chart";
import DashboardDemoChart from "@/components/dashboard/chart";
import { formatTime } from "@/lib/utils";


export default async function Domain() {

  const domains = await getAllDomains();
  const pages = await getAllPages();
  const sites = await getAllSites();

  const _domains = (await prisma.domain.findMany({
    include: {
      Page: true,
      Site: true,
      _count: true,
    }
  })).map(_d => ({ ..._d, siteCount: _d._count.Site, pageCount: _d._count.Page }));


  const topVisitedDomains = _domains
    .sort((a, b) => b._count.Page - a._count.Page)
    .slice(0, 10)

  const topTimeSpentDomain = _domains
    .map(_d => {
      const timeSpent = _d.Site.reduce((acc, curr) => acc + (new Date(curr.endDateTime).getTime() - new Date(curr.startDateTime).getTime()), 0);
      return { ..._d, timeSpent, formatedTimeSpent: formatTime(timeSpent) };
    })
    .sort((a, b) => b.timeSpent - a.timeSpent)
    .slice(0, 10)


  const cards: DashboardCardProps[] = [
    {
      title: 'Top Domains',
      content: domains.length,
      icon: <User size={24} />,
    },
    {
      title: 'Pages',
      content: pages.length,
      icon: <Globe size={24} />,
    },
    {
      title: 'Visits',
      content: sites.length,
      icon: <DollarSign size={24} />,
    }
  ];


  return (
    <>
      <div className="flex-1 space-y-4 p-8 pt-6">

        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Domain</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <DashboardCard  {...cards[0]} />
          <DashboardCard  {...cards[1]} />
          <DashboardCard  {...cards[2]} />
        </div>

        <div className="grid gap-4 grid-cols-2 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Top Domains Visits</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <DashboardBarChart data={topVisitedDomains} xAxisKey="name" valueKey="pageCount" />
            </CardContent>
          </Card>
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Top Domains Time Spent</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <DashboardBarChart data={topTimeSpentDomain} xAxisKey="name" valueKey="timeSpent" />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-1">
          <DashboardTable data={_domains.slice(0, 10)} list={['id', 'name', 'pageCount', 'siteCount']} />
        </div>

      </div>

      <DevLog title="Domain Dashboard" data={topTimeSpentDomain} />
    </>
  )

}