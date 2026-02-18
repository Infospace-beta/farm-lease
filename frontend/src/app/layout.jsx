import "./globals.css";
import { AuthProvider } from "../providers/AuthProvider";

export const metadata = {
  title: "Farm Lease",
  description: "Connect farm owners, lessees, and agro-dealers seamlessly.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Round"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className="h-full m-0 p-0">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
