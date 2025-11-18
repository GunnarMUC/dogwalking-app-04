import useAuth from "@/utils/useAuth";

function MainComponent() {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/",
      redirect: true,
    });
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Sign Out</h1>
          <p className="text-gray-600">Are you sure you want to sign out?</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleSignOut}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-base font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Sign Out
          </button>

          <a
            href="/"
            className="w-full block text-center rounded-lg border border-gray-200 px-4 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cancel
          </a>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;
