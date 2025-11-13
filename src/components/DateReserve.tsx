"use client"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import 'dayjs/locale/en-gb';

export default function DateReserve({onDateChange, value }:{onDateChange:Function, value?:(Dayjs | null)}) {
    return(
        <div className="w-full">
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
                <DatePicker
                value={value} 
                onChange={(value) => onDateChange(value)}
                slotProps={{
                    textField: {
                    fullWidth: true,
                    required: true,
                    },
                }}
                />
            </LocalizationProvider>
        </div>
    )
}