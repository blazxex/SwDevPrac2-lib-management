export async function createBook(bookData: any, token: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/books`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bookData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create book");
  }

  return await response.json();
}

export async function updateBook(bookId: string, bookData: any, token: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/books/${bookId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bookData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update book");
  }

  return await response.json();
}

export async function deleteBook(bookId: string, token: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/books/${bookId}`,
    {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete book");
  }

  return await response.json();
}
