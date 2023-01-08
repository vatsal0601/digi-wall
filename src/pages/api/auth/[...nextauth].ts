import NextAuth, { type NextAuthOptions, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";

const addUserIfNotExist: (user: User) => Promise<boolean> = async (user) => {
  const { email } = user;

  if (!email) return false;

  try {
    let prismaUser;
    prismaUser = await prisma.user.findFirst({
      where: { email: { equals: email } },
    });

    if (!prismaUser) {
      prismaUser = await prisma.user.create({ data: { email: email } });
    }
    user.id = prismaUser.id;
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_ID,
      clientSecret: env.GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      return await addUserIfNotExist(user);
    },
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.id = user?.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      if (session.user) session.user.id = token.id;
      return session;
    },
  },
  secret: env.JWT_SECRET,
};

export default NextAuth(authOptions);
