"use client"
import DateReserve from "@/components/DateReserve";
import { TextField } from "@mui/material"
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { addReservation } from "@/redux/features/reservationSlice";
import { ReservationItem } from "../../../interface";

export default function ReservePage() {

  const dispatch = useDispatch<AppDispatch>()

  const makeReservation = () => {
      if(borrowDate && pickupDate && bookID) {
          const item:ReservationItem = {
            borrowDate: dayjs(borrowDate).format("YYYY/MM/DD"),
            pickupDate: dayjs(pickupDate).format("YYYY/MM/DD"),
            book: bookID,
          }
          dispatch(addReservation(item))
      }
  }

  const [bookID, setBookID] = useState<string>("")
  const [borrowDate, setBorrowDate] = useState<Dayjs|null>(null)
  const [pickupDate, setPickupDate] = useState<Dayjs|null>(null)

  return (
    <main>
        <div>
            <h1 className="text-2xl text-yellow-900 font-bold font-sans text-center">
              Book Reservations
            </h1>
            <div className="m-3 gap-2 flex flex-col flex-wrap content-around justify-around">
              <TextField variant="standard" name="Book-ID" label="Book ID"
              value={bookID} onChange={(event)=>setBookID(event.target.value)} />
                <div className="text-md text-left text-gray-600">Borrow Date</div>
              <DateReserve onDateChange={(value:Dayjs)=>{setBorrowDate(value)}}/>
                <div className="text-md text-left text-gray-600">Pickup Date</div>
              <DateReserve onDateChange={(value:Dayjs)=>{setPickupDate(value)}}/>
              <button name="Book Venue" className="block rounded-md bg-yellow-700 hover:bg-yellow-900 px-3 py-2 shadow-sm text-white"
              onClick={makeReservation}>
                  Book Venue
              </button>
            </div>
        </div>
    </main>
  );
}
