import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/header";


export const metadata: Metadata = {
    title: "gpt-note",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <div className='flex min-h-screen w-full flex-col'>
                    <Header />
                    <main className="flex flex-1 flex-col px-4 pt-10 xl:px-8">
                        {/* 渲染当前路由页面的内容 */}
                        {children}
                    </main>
                </div>
                <Toaster />
            </ThemeProvider>
        </html>
    );
}