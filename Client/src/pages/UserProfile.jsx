import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/Api.jsx";

const UserProfile = () => {
  const { teamId, userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await apiFetch(`/team/${teamId}/member/${userId}`);
        setUser(userData);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [teamId, userId]);

  if (loading) {
    return <div className="p-5">Loading...</div>;
  }

  if (error) {
    return <div className="p-5 text-red-600">Error: {error}</div>;
  }

  if (!user) {
    return <div className="p-5">User not found</div>;
  }

  // Convert profile_pic buffer to base64 image
  const getProfileImage = () => {
    if (user.profile_pic && user.profile_pic.data) {
      const uint8Array = new Uint8Array(user.profile_pic.data);
      let binaryString = "";
      for (let i = 0; i < uint8Array.length; i++) {
        binaryString += String.fromCharCode(uint8Array[i]);
      }
      const base64String = btoa(binaryString);
      return `data:image/jpeg;base64,${base64String}`;
    }
    return null;
  };

  return (
    <div className="p-5 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(`/team/${teamId}/members`)}
        className="mb-5 px-5 py-2.5 bg-green-500 text-white border-none rounded cursor-pointer text-sm hover:bg-green-600"
      >
        ← Back to Team
      </button>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Image */}
          <div className="shrink-0">
            {getProfileImage() ? (
              <img
                src={getProfileImage()}
                alt={user.name}
                className="w-48 h-48 rounded-full object-cover border-4 border-gray-200"
              />
            ) : (
              <div className="w-48 h-48 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-6xl font-bold border-4 border-gray-200">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* User Details */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2 text-gray-800">
              {user.name}
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              {user.role || "Member"}
            </p>

            <div className="space-y-4">
              <div className="border-b pb-3">
                <label className="text-sm font-semibold text-gray-500 uppercase">
                  Email
                </label>
                <p className="text-lg text-gray-800">{user.email}</p>
              </div>

              <div className="border-b pb-3">
                <label className="text-sm font-semibold text-gray-500 uppercase">
                  Phone
                </label>
                <p className="text-lg text-gray-800">{user.phone}</p>
              </div>

              <div className="border-b pb-3">
                <label className="text-sm font-semibold text-gray-500 uppercase">
                  Gender
                </label>
                <p className="text-lg text-gray-800">{user.gender}</p>
              </div>

              <div className="border-b pb-3">
                <label className="text-sm font-semibold text-gray-500 uppercase">
                  Team ID
                </label>
                <p className="text-lg text-gray-800">{user.team_Id}</p>
              </div>

              {user.createdAt && (
                <div className="border-b pb-3">
                  <label className="text-sm font-semibold text-gray-500 uppercase">
                    Member Since
                  </label>
                  <p className="text-lg text-gray-800">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
