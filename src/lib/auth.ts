import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        otp: { label: "OTP", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials?.otp) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) return null;

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) return null;

        // Verify OTP
        if (user.otp !== credentials.otp) return null;
        if (!user.otpExpiry || user.otpExpiry < new Date()) return null; // Expired

        // Clear OTP upon successful login
        await prisma.user.update({
          where: { email: user.email },
          data: { otp: null, otpExpiry: null }
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login-rushi",
  },
  secret: process.env.NEXTAUTH_SECRET || "ditiss-notes-super-secret-key-12345",
};
