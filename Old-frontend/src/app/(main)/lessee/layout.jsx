/**
 * Lessee layout — passes children through directly.
 * Lessee pages manage their own LesseeSidebar + LesseeHeader internally.
 */
export default function LesseeLayout({ children }) {
  return <>{children}</>;
}
