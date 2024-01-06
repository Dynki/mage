"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/utils/authOptions";
import { prisma } from "@/lib/server/db/client";
import { uploadBase64ToIpfs } from "@/lib/utils/image";

interface UpdateCollectionData {
  id: string;
  logoImageFile?: string;
  bannerImageFile?: string;
  featuredImageFile?: string;
}

export const UpdateCollection = async (input: UpdateCollectionData) => {
  const session = await getServerSession(authOptions)
  if (!session) {
      throw Error("oops");
  }
  const { userId: authenticatedUserId } = session as any;

  if (!authenticatedUserId) {
    return ({
      message: "Must be authenticated to update a Collection.",
    });
  }

  const validCollectionCheck = await prisma.collection.findFirst({
    where: {
      id: input.id,
      userId: authenticatedUserId
    }
  })

  if (!validCollectionCheck) {
    return {
      message: "Invalid collection.",
    };
  }

  const logoImageCid = await uploadBase64ToIpfs(input.logoImageFile);
  const bannerImageCid = await uploadBase64ToIpfs(input.bannerImageFile);
  const featuredImageCid = await uploadBase64ToIpfs(input.featuredImageFile);
  let data;

  if (input.logoImageFile) {
    data = { logoImageUrl: logoImageCid }
  }

  if (input.featuredImageFile) {
    data = {...data, featureImageUrl: featuredImageCid }
  }

  if (input.bannerImageFile) {
    data = {...data, bannerImageUrl: bannerImageCid }
  }

  if (data) {
    const nftSet = await prisma.collection.update({
      where: {
        id: input.id
      },
      data,
    });
    return nftSet;
  } else {
    return {
      message: 'Please supply at least one image.',
    };

  }
}
