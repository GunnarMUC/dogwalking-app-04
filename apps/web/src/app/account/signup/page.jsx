import { useState } from "react";
import useAuth from "@/utils/useAuth";

function MainComponent() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");

  const { signUpWithCredentials } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password || !userType) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      // Store user type for onboarding
      localStorage.setItem("pendingUserType", userType);

      await signUpWithCredentials({
        email,
        password,
        callbackUrl: "/onboarding",
        redirect: true,
      });
    } catch (err) {
      const errorMessages = {
        OAuthSignin:
          "Couldn't start sign-up. Please try again or use a different method.",
        OAuthCallback: "Sign-up failed after redirecting. Please try again.",
        OAuthCreateAccount:
          "Couldn't create an account with this sign-up option. Try another one.",
        EmailCreateAccount:
          "This email can't be used. It may already be registered.",
        Callback: "Something went wrong during sign-up. Please try again.",
        OAuthAccountNotLinked:
          "This account is linked to a different sign-in method. Try using that instead.",
        CredentialsSignin:
          "Invalid email or password. If you already have an account, try signing in instead.",
        AccessDenied: "You don't have permission to sign up.",
        Configuration:
          "Sign-up isn't working right now. Please try again later.",
        Verification: "Your sign-up link has expired. Request a new one.",
      };

      setError(
        errorMessages[err.message] || "Something went wrong. Please try again.",
      );
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <form
        noValidate
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Join DogWalking
          </h1>
          <p className="text-gray-600">Create your account to get started</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              I am a...
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

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white px-4 py-3 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <input
                required
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-transparent text-lg outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white px-4 py-3 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <input
                required
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg bg-transparent text-lg outline-none"
                placeholder="Create a password"
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
            {loading ? "Creating account..." : "Sign Up"}
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href={`/account/signin${
                typeof window !== "undefined" ? window.location.search : ""
              }`}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign in
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default MainComponent;
