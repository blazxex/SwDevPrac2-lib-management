"use client"
import { removeReservation } from "@/redux/features/reservationSlice"
import { AppDispatch, useAppSelector } from "@/redux/store"
import { useDispatch } from "react-redux"

export default function ReservationList() {
    const reservationItems = useAppSelector((state)=> state.reservationSlice.reservationItems)
    const dispatch = useDispatch<AppDispatch>()
    return (
        <>
        {
            reservationItems.length == 0 ? 
            <div className="text-xl text-center m-5">No Book Reservation</div>
            :reservationItems.map((reservationItems)=> (
                <div className="bg-slate-200 rounded px-5 mx-5 py-2 my-2" key={reservationItems.book}>
                    <div className="text-xl">Book ID: {reservationItems.book}</div>
                    <div className="text-md">Borrow Date: {reservationItems.borrowDate}</div>
                    <div className="text-md">Pickup Date: {reservationItems.pickupDate}</div>
                    <button name="Remove Reservation" className="block rounded-md bg-yellow-700 hover:bg-yellow-900 px-3 py-2 shadow-sm text-white"
                    onClick={()=>dispatch(removeReservation(reservationItems))}>
                        Remove from Reservations
                    </button>
                </div>
            ))
        }
        </>
    )
}