export default async function getBooks () {

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/books`)
    if(!response.ok) {
        throw new Error("Failed to fetch books")
    }

    return await response.json()
}