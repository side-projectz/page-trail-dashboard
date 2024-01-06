import DashboardCard, { DashboardCardProps } from "@/components/dashboard/card";
import DevLog from "@/components/dev-log";
import { getAllUsers } from "@/lib/actions/redis";
import { User, Globe, DollarSign } from "lucide-react"


export default async function Dashboard() {

  const cards: DashboardCardProps[] = [
    {
      title: 'Users',
      content: '100',
      icon: <User size={24} />,
    },
    {
      title: 'Domains',
      content: '100',
      icon: <Globe size={24} />,
    },
    {
      title: 'Subscriptions',
      content: '100',
      icon: <DollarSign size={24} />,
    }
  ];

  const redisUsers = await getAllUsers();

  return (
    <>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard  {...cards[0]} />
          <DashboardCard  {...cards[1]} />
          <DashboardCard  {...cards[2]} />
          <DashboardCard  {...cards[0]} />
        </div>
      </div>


      <DevLog title="Redis Users" data={(redisUsers)} />
    </>
  );

}