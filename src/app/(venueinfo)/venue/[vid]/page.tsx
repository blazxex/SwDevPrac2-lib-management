import getVenue from "@/libs/getVenue";
import Image from "next/image"

export default async function VenueDetailPage({params}: {params: Promise<{vid: string}>}) {
  const { vid } = await params
  const venueDetail = await getVenue(vid)

  return (
    <main className="text-center p-5">
        <h1 className="text-2xl font-medium">Venue ID: {vid}</h1>
        <div className="flex flex-row my-5">
          <Image src={venueDetail.data.picture}
          alt='Product Picture'
          width={0} height={0} sizes="100vw"
          className="rounded-lg w-[30%] bg-black" />
          <div className="flex flex-col text-left mx-5 text-md">
            <div className="text-xl">{venueDetail.data.name}</div>
            <div className="mx-5">Address: {venueDetail.data.address}
              {' '}{venueDetail.data.district} {venueDetail.data.province}
              {' '}{venueDetail.data.postalcode}
            </div>
            <div className="mx-5">Tel. {venueDetail.data.tel}</div>
            <div className="mx-5">Daily Rate:{venueDetail.data.dailyrate}</div>
            </div>
        </div>
    </main>
  );
}

// export async function generateStaticParams() {
//   return [{vid:"001"},{vid:"002"},{vid:"003"}]
// }