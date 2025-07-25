import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

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
    <html lang="en" style={{ backgroundColor: '#000000' }}>
      <body 
        className={inter.className}
        style={{ 
          backgroundColor: '#000000',
          color: '#ffffff',
          minHeight: '100vh',
          margin: 0,
          padding: 0
        }}
      >
        <div style={{ minHeight: '100vh', backgroundColor: '#000000' }}>
          {children}
        </div>
      </body>
    </html>
  )
}
