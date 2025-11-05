export default async function getBook (id:string) {

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/books/${id}`)
    if(!response.ok) {
        throw new Error("Failed to fetch book with ID: " + id)
    }

    return await response.json()
}