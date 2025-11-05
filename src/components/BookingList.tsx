"use client"
import { removeBooking } from "@/redux/features/bookSlice"
import { AppDispatch, useAppSelector } from "@/redux/store"
import { useDispatch } from "react-redux"

export default function BookingList() {
    const bookItems = useAppSelector((state)=> state.bookSlice.bookItems)
    const dispatch = useDispatch<AppDispatch>()
    return (
        <>
        {
            bookItems.length == 0 ? 
            <div className="text-xl text-center m-5">No Venue Booking</div>
            :bookItems.map((bookItems)=> (
                <div className="bg-slate-200 rounded px-5 mx-5 py-2 my-2" key={bookItems.bookDate}>
                    <div className="text-xl">Booker: {bookItems.nameLastname}</div>
                    <div className="text-sm">Tel: {bookItems.tel}</div>
                    <div className="text-sm">Venue: {bookItems.venue}</div>
                    <div className="text-md">Booking Date: {bookItems.bookDate}</div>
                    <button name="Remove Booking" className="block rounded-md bg-yellow-700 hover:bg-yellow-900 px-3 py-2 shadow-sm text-white"
                    onClick={()=>dispatch(removeBooking(bookItems))}>
                        Remove from Booking
                    </button>
                </div>
            ))
        }
        </>
    )
}