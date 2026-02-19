import "./globals.css";
import ReduxProvider from "../providers/ReduxProvider";

export const metadata = {
  title: "Client App",
  description: "Sample Next.js 16 app"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <div className="min-h-screen">
            <main className="min-h-screen">{children}</main>
          </div>
        </ReduxProvider>
      </body>
    </html>
  );
}
