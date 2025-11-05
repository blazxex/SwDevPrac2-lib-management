import Image from "next/image";
import TopMenuItem from "./TopMenuItem";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import Link from "next/link";

export default async function TopMenu() {
  const session = await getServerSession(authOptions);

  return (
    <div className="h-[50px] bg-gray-100 fixed top-0 left-0 right-0 z-30 flex flex-row justify-end">
      <div className="flex flex-row absolute left-0 h-full">
        {session ? (
          <Link href="/api/auth/signout">
            <div className="flex items-center h-full px-5 text-yellow-900 font-bold font-sans underline">
              Sign-Out of {session.user?.name}
            </div>
          </Link>
        ) : (
          <Link href="/api/auth/signin">
            <div className="flex items-center h-full px-5 text-yellow-900 font-bold font-sans underline">
              Sign-In
            </div>
          </Link>
        )}
        <TopMenuItem title="Reservations" pageRef="/reservations" />
      </div>
      <TopMenuItem title="Reserve Book" pageRef="/reserve" />
      <Link href="/">
        <div className="flex h-full items-center">
            <div className="relative h-[90%] aspect-square rounded-full overflow-hidden mx-2">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600"></div>
                <img src="/img/logo.png" alt="App Icon" className="relative z-10 p-2 object-contain filter invert" />
            </div>
        </div>
        {/* <Image
          src={"/img/logo.png"}
          className="h-full w-auto"
          alt="logo"
          width={0}
          height={0}
          sizes="100vh"
        /> */}
      </Link>
    </div>
  );
}
