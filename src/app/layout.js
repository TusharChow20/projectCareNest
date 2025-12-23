import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import ThemeProvider from "@/prooviders/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CareNest - Trusted Caregiving Services",
  description:
    "Professional baby sitting, elderly care, and sick people care services. Book trusted caregivers for your loved ones.",
  keywords:
    "baby sitting, elderly care, sick care, caregiver, home care, nursing, Bangladesh care services",
  authors: [{ name: "CareNest" }],
  openGraph: {
    title: "CareNest - Trusted Caregiving Services",
    description: "Professional caregiving services at your doorstep",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
