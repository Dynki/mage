import type { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { authOptions as nextAuthOptions } from "@/app/api/auth/[...nextauth]/route"

// Next API route example - /pages/api/restricted.ts
export const getServerAuthSession = async (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return await getServerSession(ctx.req, ctx.res, nextAuthOptions);
};
