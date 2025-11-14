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

  if (!profileData) {
    return (
      <main className="min-h-screen bg-white p-6 mt-[50px]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-black mb-4">
              Profile Error
            </h1>
            <p className="text-red-600">
              {error || "Failed to load profile data"}
            </p>
          </div>
        </div>
      </main>
    );
  }

  const user = profileData.data;
  const memberSince = new Date(user.createdAt);
  const daysSinceMember = Math.floor(
    (new Date().getTime() - memberSince.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <main className="h-full bg-white p-6 mt-[50px]">
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
                    Email Address
                  </label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 group-hover:border-blue-300 transition-colors">
                    <p className="text-gray-900 font-medium">{user.email}</p>
                  </div>
                </div>

                <div className="group">
                  <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
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
