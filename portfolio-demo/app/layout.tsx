// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Демо-портфолио Full-Stack разработчика',
  description: 'Интерактивное демо возможностей: Full-Stack, Telegram боты, OSINT',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
          {children}
        </main>
      </body>
    </html>
  )
}