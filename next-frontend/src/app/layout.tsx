import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LayoutDashboard, TrendingUp, Key, MonitorPlay, BarChart3, Trophy, Bot } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YouTube Dashboard",
  description: "YouTube Analytics and Insights Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 flex h-screen`}
      >
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full hidden md:flex">
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-red-600 flex items-center gap-2">
              <MonitorPlay className="w-6 h-6" /> YT Dashboard
            </h1>
          </div>
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <a href="#" className="flex items-center gap-3 px-3 py-2 bg-red-50 text-red-600 rounded-lg">
              <LayoutDashboard className="w-5 h-5" />
              <span className="font-medium">대시보드</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <TrendingUp className="w-5 h-5" />
              <span className="font-medium">실시간 트랜드</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <Key className="w-5 h-5" />
              <span className="font-medium">키워드</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <MonitorPlay className="w-5 h-5" />
              <span className="font-medium">내 채널</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <MonitorPlay className="w-5 h-5" />
              <span className="font-medium">경쟁 채널</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <BarChart3 className="w-5 h-5" />
              <span className="font-medium">수익 분석</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <Trophy className="w-5 h-5" />
              <span className="font-medium">랭킹</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <Bot className="w-5 h-5" />
              <span className="font-medium">AI 인싸이트</span>
            </a>
          </nav>
        </aside>

        <main className="flex-1 flex flex-col h-full overflow-hidden">
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
            <h2 className="text-lg font-medium text-gray-800">대시보드</h2>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">U</span>
              </div>
            </div>
          </header>
          <div className="flex-1 overflow-y-auto p-6 text-gray-800">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
