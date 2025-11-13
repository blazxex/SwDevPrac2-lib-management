"use client"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import 'dayjs/locale/en-gb';

export default function DateReserve({onDateChange}:{onDateChange:Function}) {
    return(
        <div className="w-full">
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
                <DatePicker
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