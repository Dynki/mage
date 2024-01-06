"use server";

import { unstable_cache } from "next/cache";
import { Collection } from "@prisma/client";
import { prisma } from "@/lib/server/db/client";
import { MageCollection } from "@/lib/utils/computed-properties";
import { SERVICES_REVALIDATION_INTERVAL } from "@/lib/constants";
import { fetchNftSets } from "@/app/nfts/[nftSetId]/actions";
import { collectionCache } from "./cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/utils/authOptions";

export const fetchCollection = async(collectionId: string): Promise<MageCollection> =>
  unstable_cache(
    async () => {
      const nftSets = await prisma.nFTSet.findMany({
        where: {
          collectionId: collectionId,
        }
      });
    
      const nftSetsFirst50 = await fetchNftSets(50, collectionId);
    
      const collection = await prisma.collection.findFirst({
        where: {
          id: collectionId,
          visible: true
        },
        include: {
          _count: {
            select: {
              nftSets: true
            }
          },
        },
      });
    
      let collectionProperties: CollectionNftSetProperties | null = null;
    
      if (collection && nftSets) {
        const properties = await prisma.nFTSetProperties.groupBy({
          by: ['type', 'name', 'id'],
          where: {
             nftSetId: {
               in: nftSets.map(set => set.id)
             }
          },
          _count: {
            name: true,
          },
        });
    
        const resolveTypeValues = (
          typeValue: { _count: { name: number; }, name: string; type:string; id: string; }, 
          prevValue: { _count: number; variants: { [key: string]: string[] } }
        ) => {
          prevValue = prevValue || { _count: 0, variants: {} };
    
          return { 
            _count: prevValue._count + typeValue._count.name, 
            variants: {...prevValue.variants, [typeValue.name]: [...(prevValue.variants[typeValue.name] || []), typeValue.id] }
          }
        }
    
        collectionProperties = {
          nftSetsInCollection: nftSets.length,
          propertyCounts: properties.reduce((prev: { [key: string]: any }, current) => {
            return { ...prev, [current.type]: resolveTypeValues(current, prev[current.type]) };
          }, {}),
        };
      } else {
        return Promise.reject(`Failed to locate the collection for id ${collectionId}`);
      }
    
      return {
        collection,
        collectionProperties,
        nftSets: nftSetsFirst50
      }    
    },
    [`getCollectionById-${collectionId}`],
    {
      tags: [collectionCache.tag.byCollectionId(collectionId)],
      revalidate: SERVICES_REVALIDATION_INTERVAL,
    }
  )()
  
export const fetchCollectionsForUser = async(userId: string): Promise<Collection[]> =>
  unstable_cache(
    async () => {

      const session = await getServerSession(authOptions)
      if (!session) {
          throw Error("oops");
      }
      const { user: authenticatedUser } = session as any;
    
      if (!authenticatedUser) {
        throw Error("Must be authenticated to create Collection.");
      }
    
      const collections = await prisma.collection.findMany({
        where: {
          userId: authenticatedUser.id,
          visible: true
        },
      });

      return collections;
    },
    [`getCollectionByUserId-${userId}`],
    {
      tags: [collectionCache.tag.byUserId(userId)],
      revalidate: SERVICES_REVALIDATION_INTERVAL,
    }
  )()
