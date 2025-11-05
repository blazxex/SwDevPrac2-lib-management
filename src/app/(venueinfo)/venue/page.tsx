import VenueCatalog from "@/components/VenueCatalog";
import getVenues from "@/libs/getVenues";

export default function Venue() {
  const venues = getVenues()
  return (
    <main>
        <h1 className="text-xl text-center font-medium p-5">Select The Best Venue For Your Event</h1>
        <VenueCatalog venuesJson={venues}/>
    </main>
  );
}
