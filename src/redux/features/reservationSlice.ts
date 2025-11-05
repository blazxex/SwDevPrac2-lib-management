import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import { ReservationItem } from "../../../interface";

type ReservationState = {
    reservationItems: ReservationItem[]
}

const initialState:ReservationState = { reservationItems: [] }

export const reservationSlice = createSlice({
    name: "book",
    initialState,
    reducers: {
        addReservation: (state, action:PayloadAction<ReservationItem>)=>{
            const now = dayjs()
            const borrowTime = dayjs(action.payload.borrowDate)
            const pickupTime = dayjs(action.payload.pickupDate)
            if ( borrowTime.diff(now) < 0 || pickupTime.diff(borrowTime) < 0) {
                return
            }
            state.reservationItems.push(action.payload)
        },
        removeReservation: (state, action:PayloadAction<ReservationItem>)=>{
            const remainingItems = state.reservationItems.filter(obj => {
                return ((obj.borrowDate !== action.payload.borrowDate)
                ||(obj.pickupDate !== action.payload.pickupDate)
                ||(obj.book !== action.payload.book));
            })
            state.reservationItems = remainingItems
        }
    }
})

export const {addReservation, removeReservation} = reservationSlice.actions
export default reservationSlice.reducer