import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

import User from "@models/User";
import { connectToDB } from "@mongodb/database";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials, req) {
        if (!credentials.email || !credentials.password) {
          throw new Error("Invalid Email or Password");
        }

        await connectToDB();

        // Check if the user exists
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("Invalid Email or Password");
        }

        // Compare password
        const isMatch = await compare(credentials.password, user.password);

        if (!isMatch) {
          throw new Error("Invalid Email or Password");
        }

        return user;
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async session({ session }) {
      const sessionUser = await User.findOne({ email: session.user.email });
      session.user.id = sessionUser._id.toString();

      session.user = { ...session.user, ...sessionUser._doc };
      console.log("🚀 ~ session ~  session.user:", session.user);

      return session;
    },

    async signIn({ account, profile }) {
      if (account.provider === "google") {
        try {
          await connectToDB();

          // Check if the user exist
          let user = await User.findOne({ email: profile.email });

          if (!user) {
            user = await User.create({
              email: profile.email,
              username: profile.name,
              profileImagePath: profile.picture,
              wishlist: [],
              cart: [],
              order: [],
              work: [],
            });
          }

          console.log("user: ", user);

          return user;
        } catch (error) {
          console.log("Error checking if user exists: ", error.message);
        }
      }

      return true;
    },
  },
});

export { handler as GET, handler as POST };
