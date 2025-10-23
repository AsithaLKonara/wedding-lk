"use client"

import { ThemeProvider } from "next-themes"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/sonner"
import RoleRouter from "./role-router"
import { ServiceWorkerProvider } from "./service-worker-provider"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
})

export default function RootProviders({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ServiceWorkerProvider />
          <RoleRouter>
            {children}
            <Toaster />
          </RoleRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  )
} 