import { getUserById } from "@/lib/actions/database/user";
import { redirect } from "next/navigation";

import UsersDetailsDashboardAll from "@/components/dashboard/users/user-dashboard-all";
import UsersDetailsDashboardToday from "@/components/dashboard/users/user-dashboard-today";
import UsersDetailsDashboardCustom from "@/components/dashboard/users/user-dashboard-custom";


export default async function UsersDetailsDashboard(props: { params: { userId: string } }) {

  const { userId } = props.params;

  const userDetails = await getUserById(userId);
  if (userDetails === null) {
    redirect('/users');
  }


  return (
    <>
      <div className="flex-1 space-y-8 p-8 pt-6">

        <UsersDetailsDashboardAll userId={userId} />
        <UsersDetailsDashboardToday userId={userId} />
        <UsersDetailsDashboardCustom userId={userId} />

      </div>

      {/* <DevLog data={domainsVisited} title="users" /> */}
    </>
  );

}