"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import dayjs from 'dayjs';
import getReservations from '@/libs/getReservations';
import deleteReservation from '@/libs/deleteReservation'; 

interface Book {
    _id: string;
    id: string;
    title: string;
    author: string;
}

interface Reservation {
    _id: string;
    id: string;
    borrowDate: string;
    pickupDate: string;
    book: Book;
}

export default function ReservationList() {
    // State for storing reservations, loading status, and errors
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Get the user's session for the auth token
    const { data: session } = useSession();

    // Fetch reservations when the component mounts or session changes
    useEffect(() => {
        const fetchReservations = async () => {
            if (!session) return; // Wait until session is loaded

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
    }, [session]);

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
            alert(err instanceof Error ? err.message : 'Could not delete reservation');
        }
    };

    if (loading) {
        return <div className="text-center text-gray-500 m-10">Loading reservations...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 m-10">Error: {error}</div>;
    }

    return (
        <div className="space-y-6 p-4 max-w-4xl mx-auto">
            {reservations.length === 0 ? (
                <div className="text-xl text-center text-gray-400 m-5 p-10 bg-white rounded-lg shadow">
                    You have no book reservations.
                </div>
            ) : (
                reservations.map((reservation) => (
                    <div
                        className="bg-white shadow-lg rounded-lg p-5"
                        key={reservation.id}
                    >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                            {/* Reservation Details */}
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-yellow-900">{reservation.book.title}</h2>
                                <p className="text-md text-gray-600 mb-3">by {reservation.book.author}</p>
                                
                                <div className="space-y-1 text-sm text-gray-700">
                                    <p>
                                        <strong>Borrow Date: </strong>
                                        {dayjs(reservation.borrowDate).format('ddd, D MMMM YYYY')}
                                    </p>
                                    <p>
                                        <strong>Pickup Date: </strong>
                                        {dayjs(reservation.pickupDate).format('ddd, D MMMM YYYY')}
                                    </p>
                                </div>
                            </div>
                            
                            {/* Action Button */}
                            <div className="mt-4 md:mt-0 md:ml-6">
                                <button
                                    name="Remove Reservation"
                                    className="block rounded-md bg-red-600 hover:bg-red-700 px-4 py-2 shadow-sm text-white transition-colors duration-200"
                                    onClick={() => handleDelete(reservation)}
                                >
                                    Cancel Reservation
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}