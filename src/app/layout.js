import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "./redux-provider"; // Import Redux separately
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Learning Management System",
  description: "Look , see, learn and grow",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <ReduxProvider> {/* Wrap Redux & Toast here */}
        <Navbar />
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          {children}
        </body>
      </ReduxProvider>
    </html >
  );
}
