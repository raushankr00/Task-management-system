import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/hooks/useAuth';
import './globals.css';

export const metadata: Metadata = {
  title: 'TaskFlow — Task Management',
  description: 'Manage your tasks efficiently with TaskFlow',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'hsl(0 0% 100%)',
                color: 'hsl(224 28% 12%)',
                border: '1px solid hsl(220 14% 88%)',
                borderRadius: '0.75rem',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.9rem',
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              },
              success: { iconTheme: { primary: 'hsl(142 71% 45%)', secondary: 'white' } },
              error: { iconTheme: { primary: 'hsl(0 84% 60%)', secondary: 'white' } },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
