"use client";

import { useAuth } from "@/providers/AuthContext";
import { useRouter } from "next/navigation";

export default function DiagnosticPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="max-w-md rounded-lg border bg-white p-8 shadow-lg">
          <h1 className="mb-4 text-2xl font-bold text-red-600">Not Logged In</h1>
          <p className="mb-4">You are not logged in.</p>
          <button
            onClick={() => router.push("/login")}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const isAdmin = (user as any).is_staff === true;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="max-w-2xl w-full rounded-lg border bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-3xl font-bold">🔍 Account Diagnostic</h1>

        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <h2 className="mb-2 text-lg font-semibold">Current Account</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Email:</span>
                <span>{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Role:</span>
                <span className="rounded bg-gray-100 px-2 py-1">
                  {user.role}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Admin Status (is_staff):</span>
                <span
                  className={`rounded px-2 py-1 font-bold ${
                    isAdmin
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {isAdmin ? "✓ YES" : "✗ NO"}
                </span>
              </div>
            </div>
          </div>

          {!isAdmin && (
            <div className="rounded-lg border-2 border-red-500 bg-red-50 p-4">
              <h2 className="mb-2 text-lg font-semibold text-red-700">
                ⚠️ Problem Identified
              </h2>
              <p className="mb-4 text-sm text-red-800">
                You are logged in as <strong>{user.email}</strong> with role{" "}
                <strong>{user.role}</strong>. This account does NOT have admin
                permissions and cannot access the Admin Console.
              </p>
              <div className="rounded bg-white p-3">
                <h3 className="mb-2 font-semibold">Solution:</h3>
                <ol className="list-inside list-decimal space-y-1 text-sm">
                  <li>Logout from this account</li>
                  <li>Login with an admin account:
                    <ul className="ml-6 mt-1 list-disc">
                      <li><code className="bg-gray-100 px-1">admin@gmail.com</code></li>
                      <li><code className="bg-gray-100 px-1">test_admin@farmleasetest.com</code></li>
                    </ul>
                  </li>
                </ol>
              </div>
            </div>
          )}

          {isAdmin && (
            <div className="rounded-lg border-2 border-green-500 bg-green-50 p-4">
              <h2 className="mb-2 text-lg font-semibold text-green-700">
                ✓ Admin Access Confirmed
              </h2>
              <p className="text-sm text-green-800">
                Your account has admin permissions. You should be able to access
                the Admin Console.
              </p>
            </div>
          )}

          <div className="rounded-lg border bg-gray-50 p-4">
            <h3 className="mb-2 font-semibold">Available Admin Accounts</h3>
            <div className="space-y-2 text-sm">
              <div className="rounded bg-white p-2">
                <div className="font-medium">Super Admin</div>
                <div className="text-gray-600">Email: admin@gmail.com</div>
              </div>
              <div className="rounded bg-white p-2">
                <div className="font-medium">Test Admin</div>
                <div className="text-gray-600">Email: test_admin@farmleasetest.com</div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            {!isAdmin && (
              <button
                onClick={() => {
                  if (confirm("Logout and go to login page?")) {
                    router.push("/login");
                  }
                }}
                className="flex-1 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Logout & Login as Admin
              </button>
            )}
            {isAdmin && (
              <button
                onClick={() => router.push("/admin/land-verifications")}
                className="flex-1 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Go to Admin Console
              </button>
            )}
            <button
              onClick={() => router.back()}
              className="rounded border px-4 py-2 hover:bg-gray-100"
            >
              Go Back
            </button>
          </div>
        </div>

        <div className="mt-6 rounded border-t pt-4">
          <h3 className="mb-2 text-sm font-semibold">Debug Info</h3>
          <pre className="overflow-x-auto rounded bg-gray-100 p-2 text-xs">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
