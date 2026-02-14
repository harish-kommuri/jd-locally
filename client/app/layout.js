import "./globals.css";

export const metadata = {
  title: "Client App",
  description: "Sample Next.js 16 app"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen">
          <main className="min-h-screen">{children}</main>
        </div>
      </body>
    </html>
  );
}
