import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from "@/components/providers/theme-provider"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'KAOS CRM - Territory Management & Lead Tracking',
  description: 'Professional CRM solution for territory management, lead tracking, and sales analytics. Streamline your sales process with powerful tools.',
  keywords: 'CRM, territory management, lead tracking, sales, analytics, KAOS',
  authors: [{ name: 'KAOS CRM Team' }],
  openGraph: {
    title: 'KAOS CRM - Territory Management & Lead Tracking',
    description: 'Professional CRM solution for territory management, lead tracking, and sales analytics.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}
