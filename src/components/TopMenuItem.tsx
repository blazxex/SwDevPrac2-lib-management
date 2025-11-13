import Link from "next/link";

export default function TopMenuItem({
  title,
  pageRef,
}: {
  title: string;
  pageRef: string;
}) {
  return (
    <Link
      href={pageRef}
      className="relative h-[50px] w-[140px] flex justify-center items-center
                  transition-all duration-300 group hover:bg-gray-200"
    >
      <div className="text-blue-900 font-bold font-sans">{title}</div>
      <span
        className="absolute bottom-0 left-0 w-0 h-[2px] bg-blue-900
                   transition-all duration-300 group-hover:w-full"
      ></span>
    </Link>
  );
}
