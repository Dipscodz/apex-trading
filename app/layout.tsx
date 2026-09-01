import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Apex Quantum | Institutional Crypto Trading Terminal',
  description: 'High-performance real-time cryptocurrency trading, portfolio analytics, and institutional market execution.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0b0f19] text-slate-100 min-h-screen flex flex-col antialiased">
        <AppProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
              <span className="font-semibold text-slate-400">
                Apex Quantum Trading Terminal &copy; {new Date().getFullYear()}
              </span>
              <span className="text-[11px] text-slate-400">
                Real-Time Market Stream Engine • Low Latency Execution
              </span>
            </div>
          </footer>
        </AppProvider>
      </body>
    </html>
  );
}
