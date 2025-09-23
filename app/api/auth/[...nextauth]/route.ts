// NextAuth.js configuration for WeddingLK project
// Learning: NextAuth.js is really powerful for authentication
// Challenge: Setting up different user types and their permissions
// TODO: Add more OAuth providers later

import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import { User } from "@/lib/models/user"

const handler = NextAuth({
  ...authOptions,
  callbacks: {
    ...authOptions.callbacks,
    async signIn({ user, account, profile, email, credentials }) {
      await connectDB()
      const dbUser = await (User as any).findOne({ email: user.email })
      if (dbUser && dbUser.twoFactorEnabled) {
        // Mark session/token as 2FA pending
        (user as any).twoFactorPending = true
      }
      return true
    },
    async session({ session, token }) {
      session.user = session.user || { id: '', name: '', email: '', image: '', role: '', twoFactorPending: false }
      if (token.twoFactorPending) {
        session.user.twoFactorPending = true
      }
      return session
    },
    async jwt({ token, user, account }) {
      if (user && (user as any).twoFactorPending) {
        token.twoFactorPending = true
      }
      return token
    },
  },
})

export { handler as GET, handler as POST }
