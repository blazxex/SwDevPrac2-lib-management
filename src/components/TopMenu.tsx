import Image from "next/image";
import TopMenuItem from "./TopMenuItem";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import Link from "next/link";
import UserProfileDropdown from "./UserProfileDropdown";

export default async function TopMenu() {
  const session = await getServerSession(authOptions);

  return (
    <div className="h-[50px] bg-gray-100 fixed top-0 left-0 right-0 z-30 flex flex-row justify-end">
      <div className="flex flex-row absolute left-0 h-full">
        <div className="flex h-full items-center ml-5 mr-2">
          <Link
            href="/"
            className="relative h-[80%] aspect-square rounded-full overflow-hidden 
                      group transition-transform duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-r opacity-80
                        from-blue-400 via-purple-500 to-blue-400" ></div>
            <div className="absolute inset-[3px] bg-blue-400 rounded-full z-0 opacity-10" ></div>

            <Image
              src="/img/logo.png"
              alt="App Icon"
              fill
              className="relative z-10 p-2 object-contain transition-all duration-300 
                        group-hover:drop-shadow-[0_0_6px_rgba(59,130,246,0.5)] 
                        invert dark:invert-0"
            />
          </Link>
        </div>
        <TopMenuItem title="Browse Books" pageRef="/books" />
      </div>

      {session ? (<>
        <TopMenuItem title="Reserve Book" pageRef="/reserve" />
        <TopMenuItem title="My Reservations" pageRef="/reservations" />
        <UserProfileDropdown userName={session.user?.name || "User"} />
      </>
      ) : (
        <Link href="/api/auth/signin"
            className="relative w-[140px] flex justify-center items-center
                        transition-all duration-300 group
                      hover:bg-gray-200"
          >
            <div className="text-black font-bold font-sans">Sign In</div>
            <span
              className="absolute bottom-0 left-0 w-0 h-[2px] bg-black
                        transition-all duration-300 group-hover:w-full"
            ></span>
        </Link>
      )}
      <div></div>
    </div>
  );
}
