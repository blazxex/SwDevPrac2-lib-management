import Card from "./Card";
import Link from "next/link";

export default async function VenueCatalog({venuesJson}:{venuesJson:Promise<VenueJson>}) {
    const venuesJsonReady = await venuesJson
    return (
        <div className="m-10 gap-5 flex flex-row flex-wrap content-around justify-around">
            {
                venuesJsonReady.data.map((venueItem:VenueItem)=>(
                    <Link href={`/venue/${venueItem.id}`} className="w-1/4" key={venueItem.id}>
                        <Card venueName={venueItem.name} imgSrc={venueItem.picture} />
                    </Link>
                ))
            }
        </div>
    );
}
