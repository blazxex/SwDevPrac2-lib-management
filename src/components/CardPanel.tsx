"use client";
import { useReducer } from "react";
import Card from "@/components/Card"
import Link from "next/link";

export default function CardPanel() {
    const ratingReducer = (ratingMap:Map<string, number>, action:{type:string, venueName:string, rating:number})=> {
        switch(action.type) {
            case 'add': {
                return new Map(ratingMap.set(action.venueName, action.rating))
            }
            case 'remove': {
                ratingMap.delete(action.venueName)
                return new Map(ratingMap)
            }
            default: return ratingMap
        }
    }

    const initialRatings = new Map<string, number>([
        ["The Bloom Pavilion", 0],
        ["Spark Space", 0],
        ["The Grand Table", 0],
    ]);

    const mockVenueRepo = [
        {vid:"001", name:"The Bloom Pavilion", image:"/img/bloom.jpg"},
        {vid:"002", name:"Spark Space", image:"/img/sparkspace.jpg"},
        {vid:"003", name:"The Grand Table", image:"/img/grandtable.jpg"},
    ]

    const [ratingMap, dispatchRating] = useReducer(ratingReducer, initialRatings)

    return (
        <div>
            <div className="m-10 gap-5 flex flex-row flex-wrap content-around justify-around">
                {
                    mockVenueRepo.map((venueItem)=>(
                        <Link href={`/venue/${venueItem.vid}`} className="w-1/4" key={venueItem.vid}>
                            <Card venueName={venueItem.name} imgSrc={venueItem.image}
                            onRating={(venue:string, rating:number)=>dispatchRating({type:'add',venueName:venue, rating:rating})} />
                        </Link>
                    ))
                }
            </div>
            <div className="m-5">
                <div className="w-full text-xl font-bold">Venue List with Ratings : {ratingMap.size}</div>
                {Array.from(ratingMap).map((venue)=><div key={venue[0]} data-testid={venue[0]}
                onClick={()=>dispatchRating({type:'remove', venueName:venue[0], rating:0})}>{venue[0]} : {venue[1]}</div>)}
            </div>
        </div>
    );
}
