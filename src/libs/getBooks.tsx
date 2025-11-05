export default async function getBooks () {

    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/books`)
    if(!response.ok) {
        throw new Error("Failed to fetch books")
    }

    return await response.json()
}