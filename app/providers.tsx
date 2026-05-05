'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { errorHandler } from '@/lib/error-handler';

import dynamic from 'next/dynamic';

const AIChatbot = dynamic(() => import('@/components/organisms/ai-chatbot').then(mod => mod.AIChatbot), {
  ssr: false,
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <AIChatbot />
      <Toaster />
    </ThemeProvider>
  );
}
