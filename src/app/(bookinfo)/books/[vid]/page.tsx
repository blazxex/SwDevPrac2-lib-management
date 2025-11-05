import getBook from "@/libs/getBook";
import Image from "next/image";

export default async function VenueDetailPage({
  params,
}: {
  params: Promise<{ vid: string }>;
}) {
  const { vid } = await params;
  const bookDetail = await getBook(vid);

  return (
    <main className="text-center p-5">
      <h1 className="text-2xl font-medium">Book ID: {vid}</h1>
      <div className="flex flex-row my-5">
        <Image
          src={bookDetail.data.picture}
          alt="Product Picture"
          width={0}
          height={0}
          sizes="100vw"
          className="rounded-lg w-[30%] bg-black"
        />
      </div>
    </main>
  );
}

// export async function generateStaticParams() {
//   return [{vid:"001"},{vid:"002"},{vid:"003"}]
// }
