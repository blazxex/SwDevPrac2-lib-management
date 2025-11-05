import Link from "next/link";

export default function TopMenuItem({ title, pageRef }: { title: string; pageRef: string }) {
    return (
        <Link className="w-[120px] bg-white flex justify-center items-center" href={pageRef}>
            <div className="text-yellow-900 font-bold font-sans">
                {title}
            </div>
        </Link>
    );
}
