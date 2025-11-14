"use client";
import ReservationList from "@/components/ReservationList";

export default function ReservationsPage() {
    return (
        <main className="bg-gray-50 overflow-auto min-h-[calc(100vh-50px)]">
            <div className="container mx-auto px-4 py-8">
                <ReservationList />
            </div>
        </main>
    );
}
