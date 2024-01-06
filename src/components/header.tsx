import { getServerSession } from "next-auth";
import { MainNav } from "./main-nav";
import UserAvatar from "./user-nav";
import { IUser } from "@/lib/interface";


export default async function Header() {

  const session = await getServerSession();

  return (
    <>
      <header className="md:flex items-center justify-between px-4 py-2">

        <div className="text-lg font-medium">
          PageTrail
        </div>

        <MainNav />

        <div className="">
          {
            session ? (
              <UserAvatar user={session?.user as IUser} />
            ) : (<a
              href="#"
              className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
            >
              Log in
            </a>)
          }
        </div>


      </header>
    </>
  )

}