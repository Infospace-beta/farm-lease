/**
 * Auth layout – minimal, centred layout for login/signup pages.
 * No navbar or sidebar.
 */
export default function AuthLayout({ children }) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      {children}
    </main>
  );
}
