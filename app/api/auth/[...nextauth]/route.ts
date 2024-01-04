import { AuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";
import { SiweMessage } from "siwe";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import DiscordProvider from "next-auth/providers/discord";

const prisma = new PrismaClient()

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || '',
      clientSecret: process.env.DISCORD_CLIENT_SECRET || ''
    }),
    CredentialsProvider({
      id: "web3",
      name: "web3",
      credentials: {
        message: { label: "Message", type: "text" },
        signedMessage: { label: "Signed Message", type: "text" }, // aka signature
      },

      async authorize(credentials, req) {
        if (!credentials?.signedMessage || !credentials?.message) {
          console.log('Returning null')
          return null;
        }

        try {
          // On the Client side, the SiweMessage()
          // will be constructed like this:
          //
          // const siwe = new SiweMessage({
          //   address: address,
          //   statement: process.env.NEXT_PUBLIC_SIGNIN_MESSAGE,
          //   nonce: await getCsrfToken(),
          //   expirationTime: new Date(Date.now() + 2*60*60*1000).toString(),
          //   chainId: chain?.id
          // });

          const siwe = new SiweMessage(JSON.parse(credentials?.message));
          const result = await siwe.verify({
            signature: credentials.signedMessage,
            nonce: await getCsrfToken({ req: { headers: req.headers } }),
          });

          if (!result.success) throw new Error("Invalid Signature");

          if (result.data.statement !== process.env.NEXT_PUBLIC_SIGNIN_MESSAGE)
            throw new Error("Statement Mismatch");

          let user = await prisma.user.findFirst({ 
            where: {
              id: siwe.address,
            }
          })

          if (!user) {
            user = await prisma.user.create({
              data: {
                id: siwe.address,
              }
            })
          }

          // if (new Date(result.data.expirationTime as string) < new Date())
          //   throw new Error("Signature Already expired");
          console.log("Returning")
          return {
            id: siwe.address,
          };
        } catch (error) {
          console.log(error);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },

  debug: process.env.NODE_ENV === "development",

  secret: process.env.NEXTAUTH_SECRET,
  // Include user.id on session
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token, user }: { session: any; token: any, user: any }) {
      (session as { user: unknown }).user = token.user;
      
      // if (session.user && user) {
      //   session.user.id = user.id;
      // }

      // session.user.address = token.sub;
      // session.user.token = token;

      // if (session.user) {
      //   session.user.id = user.id; // Fix the issue here
      // }

      return session;
    },
  },
  pages: {
    signIn:"/auth",
    error: "/auth", 
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

 