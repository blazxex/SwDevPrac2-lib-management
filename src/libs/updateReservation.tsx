export default async function updateReservation(token:string, id:string, borrowDate:string, pickupDate: string, book:string) {

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reservations/${id}`, {
        method: "PUT",
        headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            borrowDate: borrowDate,
            pickupDate: pickupDate,
            book: book,
        }),
    })
    if(!response.ok) {
        throw new Error("Failed to update reservation")
    }

    return await response.json()
}