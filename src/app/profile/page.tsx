import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import getUserProfile from "@/libs/getUserProfile";
import { redirect } from "next/navigation";
import { UserProfile } from "../../../interface";

interface ProfileResponse {
  success: boolean;
  data: UserProfile;
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.token) {
    redirect("/api/auth/signin");
  }

  let profileData: ProfileResponse | null = null;
  let error: string | null = null;

  try {
    profileData = await getUserProfile(session.user.token);
  } catch (err) {
    error = "Failed to load profile data";
    console.error("Profile fetch error:", err);
  }

  const user = profileData.data;
  const memberSince = new Date(user.createdAt);
  const daysSinceMember = Math.floor(
    (new Date().getTime() - memberSince.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <main className="min-h-screen bg-white p-6 mt-[50px]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black bg-clip-text  mb-2">
            User Profile
          </h1>
        </div>

        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20 overflow-hidden">
          <div className="bg-gray-100 p-6 text-center">
            <div className="w-24 h-24 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
              <div className="w-16 h-16 bg-red-200 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-blakc mb-1">{user.name}</h2>
            <span
              className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${
                user.role === "admin"
                  ? "bg-yellow-400 text-yellow-900"
                  : "bg-white/20 text-black"
              }`}
            >
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </span>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="group">
                  <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    Email Address
                  </label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 group-hover:border-blue-300 transition-colors">
                    <p className="text-gray-900 font-medium">{user.email}</p>
                  </div>
                </div>

                <div className="group">
                  <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    Phone Number
                  </label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 group-hover:border-green-300 transition-colors">
                    <p className="text-gray-900 font-medium">{user.tel}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="group">
                  <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-purple-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Member Since
                  </label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 group-hover:border-purple-300 transition-colors">
                    <p className="text-gray-900 font-medium">
                      {memberSince.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="group">
                  <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                        clipRule="evenodd"
                      />
                    </svg>
                    You have been a member for
                  </label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 group-hover:border-blue-300 transition-colors">
                    <p className="text-sm text-gray-600 mt-1">
                      {daysSinceMember} day
                      {daysSinceMember !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
