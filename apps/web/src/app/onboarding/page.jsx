import { useState, useCallback, useEffect } from "react";
import useUser from "@/utils/useUser";

export default function OnboardingPage() {
  const { data: user, loading: userLoading, refetch } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form data
  const [userType, setUserType] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    // Load pending profile data from localStorage
    if (typeof window !== "undefined") {
      const pendingUserType = localStorage.getItem("pendingUserType");
      if (pendingUserType && !userType) {
        setUserType(pendingUserType);
      }
    }
  }, [userType]);

  useEffect(() => {
    // Pre-fill form with existing user data
    if (user) {
      if (user.name && !name) setName(user.name);
      if (user.user_type && !userType) setUserType(user.user_type);
      if (user.phone_number && !phoneNumber) setPhoneNumber(user.phone_number);
      if (user.address && !address) setAddress(user.address);

      // If user already has completed profile, redirect to home
      if (user.user_type && user.name && user.phone_number) {
        if (typeof window !== "undefined") {
          window.location.href = "/";
        }
      }
    }
  }, [user, name, userType, phoneNumber, address]);

  const saveProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      if (!userType || !name || !phoneNumber) {
        setError("Please fill in all required fields");
        return;
      }

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_type: userType,
          name: name.trim(),
          phone_number: phoneNumber.trim(),
          address: address.trim() || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update profile");
      }

      // Clear localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("pendingUserType");
      }

      // Redirect based on user type
      if (userType === "walker") {
        window.location.href = "/walker-setup";
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userType, name, phoneNumber, address]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      await saveProfile();
    },
    [saveProfile],
  );

  if (userLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-r-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Complete Your Profile
          </h1>
          <p className="text-gray-600">
            Let's get your account set up properly
          </p>
        </div>

        <div className="space-y-6">
          {!user?.user_type && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                I am a... *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUserType("owner")}
                  className={`p-3 rounded-lg border-2 text-center transition-colors ${
                    userType === "owner"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-medium">Dog Owner</div>
                  <div className="text-xs text-gray-500">
                    Need walking services
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setUserType("walker")}
                  className={`p-3 rounded-lg border-2 text-center transition-colors ${
                    userType === "walker"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-medium">Dog Walker</div>
                  <div className="text-xs text-gray-500">
                    Provide walking services
                  </div>
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Full Name *
            </label>
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white px-4 py-3 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full bg-transparent text-lg outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Phone Number *
            </label>
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white px-4 py-3 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <input
                required
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="w-full bg-transparent text-lg outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white px-4 py-3 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your address"
                className="w-full bg-transparent text-lg outline-none"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-500">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-base font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Complete Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
