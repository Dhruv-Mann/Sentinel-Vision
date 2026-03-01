import Navbar from "@/components/navbar";

/**
 * Layout for all /dashboard/* routes.
 * Wraps children with the authenticated navbar.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
