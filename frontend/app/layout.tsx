import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Foodie - Food Delivery Platform",
  description: "Order delicious food from your favorite restaurants",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
        <CartProvider>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
            <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 mt-20">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                  <div>
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><span className="text-2xl">🍔</span> Foodie</h3>
                    <p className="text-gray-400 text-sm">Premium food delivery from top-rated restaurants near you.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-4">Quick Links</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li><a href="/" className="hover:text-orange-500 transition-colors">Home</a></li>
                      <li><a href="/orders" className="hover:text-orange-500 transition-colors">Orders</a></li>
                      <li><a href="/admin" className="hover:text-orange-500 transition-colors">Admin</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-4">Support</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li><a href="#" className="hover:text-orange-500 transition-colors">Help Center</a></li>
                      <li><a href="#" className="hover:text-orange-500 transition-colors">Contact Us</a></li>
                      <li><a href="#" className="hover:text-orange-500 transition-colors">FAQs</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-4">Legal</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li><a href="#" className="hover:text-orange-500 transition-colors">Privacy Policy</a></li>
                      <li><a href="#" className="hover:text-orange-500 transition-colors">Terms of Service</a></li>
                      <li><a href="#" className="hover:text-orange-500 transition-colors">Cookie Policy</a></li>
                    </ul>
                  </div>
                </div>
                <div className="border-t border-gray-700 pt-8 text-center">
                  <p className="text-gray-500 text-sm">© 2024 Foodie. All rights reserved. Built with ❤️</p>
                </div>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
