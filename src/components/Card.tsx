import Image from "next/image";
import InteractiveCard from "./InteractiveCard";
import { Rating } from "@mui/material";
import { BookItem } from "../../interface";

export default function Card({
  bookItem,
  venueName,
  imgSrc,
  onRating,
}: {
  bookItem?: BookItem;
  venueName: string;
  imgSrc: string;
  onRating?: Function;
}) {
  const testid = venueName + " Rating";

  return (
    <InteractiveCard>
      <div className="w-full h-64 relative rounded-t-lg overflow-hidden">
        <Image
          src={imgSrc}
          alt={venueName}
          fill={true}
          className="object-cover transition-transform duration-300 hover:scale-110"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-gray-900 text-lg font-bold mb-2 line-clamp-2 leading-tight">
          {venueName}
        </h3>
        {bookItem && (
          <div className="space-y-1 mb-3">
            <p className="text-gray-600 text-sm">
              <span className="font-medium">Author:</span> {bookItem.author}
            </p>
            <p className="text-gray-600 text-sm">
              <span className="font-medium">Publisher:</span>{" "}
              {bookItem.publisher}
            </p>
            <div className="flex items-center justify-between">
              {/* <p className="text-gray-600 text-sm">
                        <span className="font-medium">Available:</span> {bookItem.availableAmount}
                      </p> */}
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  bookItem.availableAmount > 0
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {bookItem.availableAmount > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </div>
          </div>
        )}
      </div>
      {onRating && (
        <div className="p-4 pt-0">
          <Rating
            id={testid}
            name={testid}
            data-testid={testid}
            defaultValue={0}
            precision={0.5}
            className="text-yellow-500"
            onClick={(e) => {
              e.stopPropagation();
            }}
            onChange={(e, value) => {
              onRating(venueName, value ?? 0);
            }}
          />
        </div>
      )}
    </InteractiveCard>
  );
}
