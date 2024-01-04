import { Collection, NFTEdition, NFTSet, NFTSetHistory, NFTSetProperties, User, Wallet } from "prisma/prisma-client";

export type CollectionWithNftSetCount = Collection & {
  _count: {
    nftSets: number;
  }
}


export type DetailedNFTSet = NFTSet & {
  nftEditions: (NFTEdition & {
      owner: Wallet & {
          user: User;
      };
  })[];
  collection: CollectionWithNftSetCount | null;
  properties: NFTSetProperties[];
  history: NFTSetHistory[];
  liked: boolean;
}

export type NFTSetWithMeta = DetailedNFTSet & NftSetWithViewLikeCount<Omit<NFTSet, "views" | "likes">>;


export type NFTSetDetailed = NFTSet & {
  nftEditions: (NFTEdition & {
      owner: Wallet & {
          user: User;
      };
  })[];
  properties: NFTSetProperties[];
  history: NFTSetHistory[];
}


export const computeViewLikeCount = (
  nftSet: DetailedNFTSet,
  userId: string
): NFTSetWithMeta => {
  const { views, likes, ...rest } = nftSet;

  const liked = likes.includes(userId)

  return {
    ...rest,
    viewCount: views.length,
    likeCount: likes.length,
    views,
    likes,
    liked,
  };
}

export type MageCollection = {
  collection: CollectionWithNftSetCount | null;
  collectionProperties: CollectionNftSetProperties | null;
  nftSets: NFTSet[]
}
