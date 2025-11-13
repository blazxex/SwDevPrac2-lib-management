"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react"
import { TextField, Alert } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import DateReserve from "@/components/DateReserve";
import createReservation from "@/libs/createReservation";
import getBook from "@/libs/getBook";
import BookPreview from "@/components/BookPreview";

export default function ReservePage() {
    const {data:session} = useSession()

    const [bookID, setBookID] = useState<string>("");
    const [borrowDate, setBorrowDate] = useState<Dayjs | null>(null);
    const [pickupDate, setPickupDate] = useState<Dayjs | null>(null);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState<"success" | "error">("success");

    const [book, setBook] = useState<any | null>(null);
    const [loadingBook, setLoadingBook] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const searchParams = useSearchParams();

    useEffect(() => {
        const bookIdFromUrl = searchParams.get("bookId");
        if (bookIdFromUrl) {
            setBookID(bookIdFromUrl);
            fetchBook(bookIdFromUrl);
        }
    }, [searchParams]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        if (borrowDate && pickupDate && bookID && session?.user.token) {
            try {
                await createReservation(
                    session.user.token,
                    dayjs(borrowDate).toISOString(),
                    dayjs(pickupDate).toISOString(),
                    bookID
                );
                setMessage("Reservation successful!");
                setSeverity("success");
            } catch (err) {
                setMessage("" + err);
                setSeverity("error");
                setLoading(false);
            }
        }
        setLoading(false);
    };

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
        <main className="overflow-hidden min-h-[calc(100vh-50px)] flex items-center justify-center bg-gray-50">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-lg min-w-96 w-1/4 space-y-6 gap-5 flex flex-col"
            >
                <h1 className="text-2xl font-bold text-gray-900 text-center">Book Reservation</h1>

                {message ? <Alert severity={severity}>{message}</Alert>
                          :""}
                
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
                        <DateReserve onDateChange={(value: Dayjs) => setBorrowDate(value)} />
                    </div>

                    <div>
                        <div className="text-md text-gray-600">Pickup Date</div>
                        <DateReserve onDateChange={(value: Dayjs) => setPickupDate(value)} />
                    </div>

                    <button
                    type="submit" disabled={loading}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition-colors"
                    >
                    {loading ? "Reserving..." : "Reserve Book"}
                    </button>
                </div>
            </form>
        </main>
    );
}
