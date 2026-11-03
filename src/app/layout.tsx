import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'Seadra Guard — Deterministic & Agentic Brand-Governance Platform',
  description:
    'Continuous brand governance, factual verification against the Approved Facts Ledger, and WCAG 2.1 AA multi-modal visual compliance scanner.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen antialiased selection:bg-indigo-500/30 selection:text-indigo-600 dark:selection:text-indigo-200">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

