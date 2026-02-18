import DashboardLayout from "../../components/shared/DashboardLayout";

/**
 * Main app layout – wraps all authenticated routes with the
 * shared DashboardLayout (sidebar + header).
 */
export default function MainLayout({ children }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
