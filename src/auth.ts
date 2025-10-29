import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "./app/lib/dbConnect";
import UserModel from "./app/model/User";
import type { User as NextAuthUser } from "next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        identifier: {
          type: "text",
          label: "Email",
          placeholder: "johndoe@gmail.com",
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "*****",
        },
      },
      async authorize(
        credentials: Partial<Record<"identifier" | "password", unknown>>
      ): Promise<NextAuthUser | null> {
        await dbConnect();
        try {
          const identifier =
            typeof credentials?.identifier === "string"
              ? credentials.identifier
              : undefined;
          const password =
            typeof credentials?.password === "string"
              ? credentials.password
              : undefined;

          if (!identifier || !password) {
            throw new Error("Email and password are required");
          }

          const user = await UserModel.findOne({
            email: identifier,
          });

          if (!user) {
            throw new Error("No user found with this email");
          }
          if (!user.isVerified) {
            throw new Error("Please verify your account before login");
          }

          const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
          );
          if (isPasswordCorrect) {
            return {
              id: user._id?.toString() || "",
              email: user.email,
              name: user.username,
              _id: user._id?.toString(),
              isVerified: user.isVerified,
              isAcceptingMessages: user.isAcceptingMessages,
              username: user.username,
            };
          } else {
            throw new Error("Incorrect Password");
          }
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "An unknown error occurred";
          throw new Error(errorMessage);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/sign-in",
  },
});
