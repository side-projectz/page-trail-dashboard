import DashboardCard, { DashboardCardProps } from "@/components/dashboard/card";
import DevLog from "@/components/dev-log";
import { User, Globe, DollarSign } from "lucide-react";

import { uniq, sortBy } from 'lodash'
import { getAllDomains } from "@/lib/actions/database/domain";
import { getAllSites } from "@/lib/actions/database/site";
import { getAllUsers } from "@/lib/actions/database/user";
import DashboardChart from "@/components/dashboard/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Dashboard() {

  const usersCount = await getAllUsers();
  const domainCount = await getAllDomains();
  const siteCount = await getAllSites();

  const cards: DashboardCardProps[] = [
    {
      title: 'Users',
      content: usersCount.length,
      icon: <User size={24} />,
    },
    {
      title: 'Domains',
      content: domainCount.length,
      icon: <Globe size={24} />,
    },
    {
      title: 'Sites',
      content: siteCount.length,
      icon: <DollarSign size={24} />
    }
  ];


  return (
    <>
      <div className="flex-1 space-y-4 p-8 pt-6">

        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <DashboardCard  {...cards[0]} />
          <DashboardCard  {...cards[1]} />
          <DashboardCard  {...cards[2]} />
        </div>

        <div className="grid gap-4 grid-cols-2 md:grid-cols-2">

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Users</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <DashboardChart />
            </CardContent>
          </Card>
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Domain</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <DashboardChart />
            </CardContent>
          </Card>

        </div>

      </div>
    </>
  );

}