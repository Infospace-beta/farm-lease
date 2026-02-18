/**
 * Dealer layout — passes children through directly.
 * Dealer pages manage their own DealerSidebar + DealerHeader internally.
 */
export default function DealerLayout({ children }) {
  return <>{children}</>;
}
