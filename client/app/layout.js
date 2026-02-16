import "./globals.css";
import { UserProvider } from "../context/UserContext";

export const metadata = {
  title: "Client App",
  description: "Sample Next.js 16 app"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <div className="min-h-screen">
            <main className="min-h-screen">{children}</main>
          </div>
        </UserProvider>
      </body>
    </html>
  );
}
