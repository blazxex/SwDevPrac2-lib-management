"use client"
import DateReserve from "@/components/DateReserve";
import { TextField, Select, MenuItem, InputLabel } from "@mui/material"
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { addBooking } from "@/redux/features/bookSlice";

export default function Booking() {

  const dispatch = useDispatch<AppDispatch>()

  const makeBooking = () => {
      if(nameLastname && tel && venue && bookDate) {
          const item:BookingItem = {
            nameLastname: nameLastname,
            tel: tel,
            venue: venue,
            bookDate: dayjs(bookDate).format("YYYY/MM/DD"),
          }
          dispatch(addBooking(item))
      }
  }

  const [nameLastname, setNameLastname] = useState<string>("")
  const [tel, setTel] = useState<string>("")
  const [venue, setVenue] = useState<string>("")
  const [bookDate, setBookDate] = useState<Dayjs|null>(null)

  return (
    <main>
        <div>
            <h1 className="text-2xl text-yellow-900 font-bold font-sans text-center">
              Venue Booking
            </h1>
            <div className="m-3 gap-2 flex flex-col flex-wrap content-around justify-around">
              <TextField variant="standard" name="Name-Lastname" label="Name-Lastname"
              value={nameLastname} onChange={(event)=>setNameLastname(event.target.value)} />
              <TextField variant="standard" name="Contact-Number" label="Contact-Number"
              value={tel} onChange={(event)=>setTel(event.target.value)} />
              <div className="mt-2">
                <InputLabel id="venue">Venue</InputLabel>
                <Select variant="standard" id="venue" className="w-full"
                value={venue} onChange={(event)=>setVenue(event.target.value)} >
                    <MenuItem value="Bloom">The Bloom Pavilion</MenuItem>
                    <MenuItem value="Spark">Spark Space</MenuItem>
                    <MenuItem value="GrandTable">The Grand Table</MenuItem>
                </Select>
              </div>
              <DateReserve onDateChange={(value:Dayjs)=>{setBookDate(value)}}/>
              <button name="Book Venue" className="block rounded-md bg-yellow-700 hover:bg-yellow-900 px-3 py-2 shadow-sm text-white"
              onClick={makeBooking}>
                  Book Venue
              </button>
            </div>
        </div>
    </main>
  );
}
