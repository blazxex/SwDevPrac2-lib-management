import BookCatalog from "@/components/BookCatalog";
import getVenues from "@/libs/getVenues";

export default function Venue() {
  const venues = getVenues();
  return (
    <main>
      <h1 className="text-xl text-center font-medium p-5">Select your book</h1>
      <BookCatalog venuesJson={venues} />
    </main>
  );
}
