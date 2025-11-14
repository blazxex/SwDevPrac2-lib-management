"use client";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { CircularProgress } from "@mui/material";
import Link from "next/link";
import dayjs from 'dayjs';
import getUserProfile from "@/libs/getUserProfile";
import getReservations from '@/libs/getReservations';
import deleteReservation from '@/libs/deleteReservation'; 
import { BookItem } from '../../interface';
import EditReservationModal from "@/components/EditReservationModal";

interface Reservation {
    _id: string;
    id: string;
    borrowDate: string;
    pickupDate: string;
    book: BookItem;
    user: any;
}

export default function ReservationList() {
    const { data: session } = useSession();
    
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);

    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkAdminStatus = async () => {
            if (session?.user?.token) {
                try {
                    const profile = await getUserProfile(session.user.token);
                    setIsAdmin(profile.data?.role === "admin");
                } 
                catch (error) {
                    console.error("Error checking admin status:", error);
                    setIsAdmin(false);
                }
            }
        };

        checkAdminStatus();
    }, [session]);

    useEffect(() => {
        const fetchReservations = async () => {
            if (!session) return;
            
            try {
                setLoading(true);
                const reservations = await getReservations(session.user.token)
                console.log(reservations)
                setReservations(reservations.data); 
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, []);

    const handleDelete = async (reservation: Reservation) => {
        if (!session) return;

        try {
            await deleteReservation(
                session.user.token,
                reservation.id
            );

            setReservations(prevReservations =>
                prevReservations.filter(res => res.id !== reservation.id)
            );

        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return <div className="m-10 flex justify-center"><CircularProgress size={28} /></div>;
    }

    if (error) {
        return <div className="m-10 text-center font-bold text-red-500">Error: {error}</div>;
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    { isAdmin ? "Manage Reservations"
                        : "My Reservations"
                    }
                </h1>
                <p className="text-gray-600">
                    { isAdmin ? "View and manage user reservations here"
                        : "View and manage your reservations here"
                    }
                </p>
            </div>
            {reservations.length === 0 ? (
                <div className="bg-white text-gray-600 text-center shadow-lg rounded-lg p-5">
                    { isAdmin ? "No book reservations found."
                        : "You haven't reserved any books yet."
                    }
                </div>
            ) : (
                reservations.map((reservation) => (
                    <div
                        className="bg-white shadow-lg rounded-lg p-5"
                        key={reservation.id}
                    >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                            <div className="flex-1">
                            {reservation.book ? (
                                <div>
                                    <h2 className="text-2xl font-bold text-black">{reservation.book.title}</h2>
                                    <p className="text-md text-gray-600 mb-3">by {reservation.book.author}</p>
                                    
                                    <div className="space-y-1 text-sm text-gray-700">
                                        <p>
                                            <strong>Borrow Date: </strong>
                                            {dayjs(reservation.borrowDate).format('dddd, D MMMM YYYY')}
                                        </p>
                                        <p>
                                            <strong>Pickup Date: </strong>
                                            {dayjs(reservation.pickupDate).format('dddd, D MMMM YYYY')}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-md text-gray-600 mb-3">It seems like this book is unavailable</p>
                                    
                                    <div className="space-y-1 text-sm text-gray-700">
                                        <p>
                                            <strong>Borrow Date: </strong>
                                            {dayjs(reservation.borrowDate).format('dddd, D MMMM YYYY')}
                                        </p>
                                        <p>
                                            <strong>Pickup Date: </strong>
                                            {dayjs(reservation.pickupDate).format('dddd, D MMMM YYYY')}
                                        </p>
                                    </div>
                                </div>
                            )}
                            { isAdmin && (
                                <p className="text-md text-black mt-3">
                                    <span className="font-bold">Reserve by: </span>
                                    {reservation.user.name} ({reservation.user._id})
                                </p>
                            )}
                            </div>
                            
                            <div className="mt-4 md:mt-0 md:ml-6 flex flex-col gap-2">
                                { reservation.book && (
                                    <Link href={`/books/${reservation.book._id}`}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-center rounded-lg transition-colors">
                                    <span className="font-medium text-white">
                                        Book Information
                                    </span>
                                    </Link>
                                )
                                }
                                <button
                                    onClick={() => setEditingReservation(reservation)}
                                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                                >
                                    <span className="font-medium text-white">
                                        Edit Reservation
                                    </span>
                                </button>
                                <button
                                    onClick={() => handleDelete(reservation)}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
                                >
                                    <span className="font-medium text-white">
                                        Cancel Reservation
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        {editingReservation && (
            <EditReservationModal
                reservationId={editingReservation.id}
                initialBookId={editingReservation.book?._id || ""}
                initialBorrowDate={editingReservation.borrowDate}
                initialPickupDate={editingReservation.pickupDate}
                onClose={() => setEditingReservation(null)}
                onUpdated={() => {
                    setEditingReservation(null);
                    if (session?.user.token) {
                        getReservations(session.user.token).then(res => setReservations(res.data));
                    }
                }}
            />
        )}
        </div>
    );
}