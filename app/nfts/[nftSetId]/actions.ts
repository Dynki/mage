"use server";

import { nftSetCache } from "./cache";
import { SERVICES_REVALIDATION_INTERVAL } from "../../../lib/constants";
import { NFTSetWithMeta } from "@/lib/utils/computed-properties";

import { revalidatePath, unstable_cache } from "next/cache";
import { fetchNftSetById, fetchPagedNftSets } from "../_actions/fetch";
import { like } from "../_actions/like";

export async function likeNFT(id: string) {
  console.log('Like nft', id)
  await like(id, true)
  revalidatePath(`/nfts/${id}`)
}

export async function unlikeNFT(id: string) {
  await like(id, false)
  revalidatePath(`/nfts/${id}`)
}

export const fetchNftSet = async(nftSetId: string): Promise<NFTSetWithMeta | null> =>
  unstable_cache(
    async () => {
      return await fetchNftSetById(nftSetId)
    },
    [`getNftSetById-${nftSetId}`],
    {
      tags: [nftSetCache.tag.byNftSetId(nftSetId)],
      revalidate: SERVICES_REVALIDATION_INTERVAL,
    }
  )()


export const fetchNftSets = async(limit = 50, collectionId: string, filters?: { [key: string]: string[] }, names?: string[]) => 
  unstable_cache(
    async () => {
      const items = await fetchPagedNftSets(limit, collectionId, filters, names)

     return JSON.parse(JSON.stringify(items))
    },
      [`getNftSetsByCollectionId-${collectionId}-${limit}-${JSON.stringify(filters)}-${JSON.stringify(names)}`],
      {
        tags: [nftSetCache.tag.byCollectionId(collectionId, limit, filters, names)],
        revalidate: SERVICES_REVALIDATION_INTERVAL,
      }
  )()
