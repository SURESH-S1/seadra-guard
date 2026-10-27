import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="en" className="dark">
      <body className="bg-[#0B0F19] text-slate-100 min-h-screen antialiased selection:bg-teal-500/30 selection:text-teal-200">
        {children}
      </body>
    </html>
  );
}

