"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/utils/authOptions";
import { prisma } from "@/lib/server/db/client";
import { uploadBase64ToIpfs } from "@/lib/utils/image";

interface CreateCollectionData {
  name: string;
  description: string;
  logoImageFile: string;
}

export const CreateCollection = async (input: CreateCollectionData) => {
  const session = await getServerSession(authOptions)
  if (!session) {
      throw Error("oops");
  }
  const { user: authenticatedUser } = session as any;

  if (!authenticatedUser) {
    return ({
      message: "Must be authenticated to create Collection.",
    });
  }

  if (input.logoImageFile) {
    const logoImageCid = await uploadBase64ToIpfs(input.logoImageFile);

    if (!logoImageCid) {
      return {
        message: 'Logo image could not be uploaded.',
      };
    }

    const collection = await prisma.collection.create({
      data: {
        description: input.description,
        name: input.name,
        logoImageUrl: logoImageCid,
        userId: authenticatedUser.id,
      }
    });

    return { collection };
  } else {
    return {
      message: 'No logo image supplied.',
    };
  }
}