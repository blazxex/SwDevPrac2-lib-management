"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { TextField, Alert } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import DateReserve from "@/components/DateReserve";
import getBook from "@/libs/getBook";
import BookPreview from "@/components/BookPreview";
import updateReservation from "@/libs/updateReservation";

interface EditReservationModalProps {
    reservationId: string;
    initialBookId: string;
    initialBorrowDate: string;
    initialPickupDate: string;
    onClose: Function;
    onUpdated: Function;
}

export default function EditReservationModal({
    reservationId,
    initialBookId,
    initialBorrowDate,
    initialPickupDate,
    onClose,
    onUpdated,
}: EditReservationModalProps) {
    const { data: session } = useSession();

    const [bookID, setBookID] = useState<string>(initialBookId);
    const [borrowDate, setBorrowDate] = useState<Dayjs | null>(dayjs(initialBorrowDate));
    const [pickupDate, setPickupDate] = useState<Dayjs | null>(dayjs(initialPickupDate));

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState<"success" | "error">("success");

    const [book, setBook] = useState<any | null>(null);
    const [loadingBook, setLoadingBook] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        fetchBook(bookID);
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        if (borrowDate && pickupDate && bookID && session?.user.token) {
            try {
                await updateReservation(
                    session.user.token,
                    reservationId,
                    dayjs(borrowDate).toISOString(),
                    dayjs(pickupDate).toISOString(),
                    bookID
                );
                setMessage("Reservation updated successfully!");
                setSeverity("success");
                onUpdated();
            } catch (err) {
                setMessage("" + err);
                setSeverity("error");
            } finally {
                setLoading(false);
            }
        }
    }

    async function fetchBook(id: string) {
        if (!id.trim()) {
            setBook(null);
            return;
        }

        setLoadingBook(true);
        setBook(null);
        try {
            const res = await getBook(id.trim());
            if (res?.data) {
                setBook(res.data);
            } else {
                setBook(null);
            }
        } catch (error) {
            // console.error("Error fetching book:", error);
            setBook(null);
        } finally {
            setLoadingBook(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6 relative"
            >
                <h1 className="text-2xl font-bold text-gray-900 text-center">Edit Reservation</h1>

                {message && <Alert severity={severity}>{message}</Alert>}

                <div className="flex flex-col gap-5">
                    
                    <div>
                        <TextField name="Book-ID" label="Book ID" value={bookID}
                            onChange={(e) => setBookID(e.target.value)} 
                            onFocus={() => setIsTyping(true)}
                            onBlur={(e) => {setIsTyping(false); fetchBook(e.target.value)}}
                            fullWidth required/>
                        <BookPreview book={book} loadingBook={loadingBook} 
                            isTyping={isTyping} bookID={bookID}/>
                    </div>

                    <div>
                        <div className="text-md text-gray-600">Borrow Date</div>
                        <DateReserve onDateChange={(value: Dayjs) => setBorrowDate(value)} value={borrowDate} />
                    </div>

                    <div>
                        <div className="text-md text-gray-600">Pickup Date</div>
                        <DateReserve onDateChange={(value: Dayjs) => setPickupDate(value)} value={pickupDate} />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition-colors"
                        >
                            {loading ? "Updating..." : "Update Reservation"}
                        </button>
                        <button
                            type="button"
                            onClick={() => onClose()}
                            className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
