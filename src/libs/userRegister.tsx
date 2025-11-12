export default async function userRegister(name: string, email: string, tel: string, role: string, password: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "accept": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      tel,
      role,
      password,
      createdAt: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to register");
  }

  return await response.json();
}
