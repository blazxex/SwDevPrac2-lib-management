import Image from "next/image";
import InteractiveCard from "./InteractiveCard";
import { Rating } from "@mui/material";

export default function Card({ venueName, imgSrc, onRating }: { venueName: string; imgSrc: string; onRating?: Function }) {
    const testid = venueName + " Rating"

    return (
        <InteractiveCard>
            <div className="w-full h-[60%] relative rounded-t-lg">
                <Image src={imgSrc} alt="Venue Picture" fill={true} className="object-cover rounded-t-lg" />
            </div>
            <div className="p-2">
                <h3 className="text-yellow-600 text-xl font-semibold">{venueName}</h3>
                <p>Perfect for Incoming Events</p>
            </div>
            {
                onRating ?
                <Rating id={testid} name={testid} data-testid={testid} 
                defaultValue={0} precision={0.5} className="p-2"
                onClick={(e)=>{e.stopPropagation()}}
                onChange={(e, value)=>{onRating(venueName, value ?? 0)}} />
                :''
            }
        </InteractiveCard>
    );
}
