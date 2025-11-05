"use client"
import { DatePicker } from "@mui/x-date-pickers"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"

export default function DateReserve({onDateChange}:{onDateChange:Function}) {
    return(
        <div className="rounded-lg w-fit">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker className="bg-white"
                onChange={(value)=>{onDateChange(value)}}/>
            </LocalizationProvider>
        </div>
    )
}