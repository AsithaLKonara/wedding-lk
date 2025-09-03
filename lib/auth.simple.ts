// import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string
      twoFactorPending?: boolean
    }
  }
  
  interface User {
    id: string
    email: string
    name?: string
    role?: string
    twoFactorPending?: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string
    twoFactorPending?: boolean
  }
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // For development, allow any email/password
        if (credentials?.email && credentials?.password) {
          return {
            id: "1",
            email: credentials.email as string,
            name: "Demo User",
            role: "user",
          }
        }
        return null
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, account }: { token: any; user: any; account: any }) {
      if (user && "role" in user) {
        token.role = (user as any).role
      }
      if (user && "twoFactorPending" in user) {
        token.twoFactorPending = (user as any).twoFactorPending
      }
      return token
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token && session.user) {
        session.user.id = token.sub!
        if (token.role) session.user.role = token.role as string
        if (token.twoFactorPending) session.user.twoFactorPending = token.twoFactorPending
      }
      return session
    },
  },
} 