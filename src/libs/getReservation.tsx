export default async function getReservation(token:string, id:string) {

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reservations/${id}`, {
        method: "GET",
        headers: {
            authorization: `Bearer ${token}`,
        },
    })
    if(!response.ok) {
        throw new Error("Failed to fetch reservation with ID: " + id)
    }

    return await response.json()
}