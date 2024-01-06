import { authOptions } from "@/lib/utils/authOptions";
import { prisma } from "@/lib/server/db/client";
import { computeViewLikeCount, DetailedNFTSet } from "@/lib/utils/computed-properties";
import { getServerSession } from "next-auth";

export const like = async (id: string, like: boolean) => {

  const session = await getServerSession(authOptions)
  if (!session?.user) {
      console.log('No session')
      throw Error("oops");
  }

  const { user: authenticatedUser } = session as any;

  if (!authenticatedUser) {
    console.log('User not authenticated')

    return ({
      message: "Must be authenticated to like an NFT.",
    });
  }

  let nftSet = await prisma.nFTSet.findFirst({ where: { id }});

  if (!nftSet) {
    console.log('Could not locate NFT')
    throw Error("Could not locate NFT")
  }

  const currentlyLiked = nftSet?.likes.some(userId => session.user?.id === userId)
  const needToUpdate = like !== currentlyLiked

  if (!needToUpdate) {
    console.log('No need to update NFT with like')
    const nftSetWithViewCount = computeViewLikeCount(
      nftSet as DetailedNFTSet, 
      session.user.id
    );
  
    return nftSetWithViewCount;
  }

  let data = {}

  if (like) {
    data = {
      likes: {
        push: session.user.id
      }
    }
  } else {
    const updatedLikes = nftSet.likes.filter(userId => session.user?.id !== userId) 
    data = {
      likes: updatedLikes
    }
  }

  console.log('Data to update with', data)

  nftSet = await prisma.nFTSet.update({
    where: { id },
    data,
    include: {
      collection: true,
      nftEditions: {
        include: {
          owner: {
            include: {
              user: true
            }
          }
        }
      },
      properties: true,
      history: {
        orderBy: {
          createdAt: 'desc'
        }
      } 
    },
  });

  const nftSetId = nftSet.id;

  const user = await prisma.user.findFirst({
    where: {
      id: session.user.id
    }
  });

  if (user) {
    const currentlyLiked = user?.liked.some(nftId =>  nftId === nftSetId)
    const needToUpdate = like !== currentlyLiked
  
    if (needToUpdate) {
      let userLikes = user.liked
      if (like) {
        userLikes.push(nftSetId)
      } else {
        userLikes = user?.liked.filter(nftId =>  nftId !== nftSetId)
      }

      await prisma.user.update({
        where: {
          id: session.user.id
        },
        data: {
          liked: userLikes
        }
      })

      await prisma.user.update({
        where: {
          id: session.user.id
        },
        data: {
          liked: userLikes
        }
      });
    }
  }
  
  const nftSetWithViewCount = computeViewLikeCount(
    nftSet as DetailedNFTSet, 
    session.user.id
  );

  return nftSetWithViewCount;
}
