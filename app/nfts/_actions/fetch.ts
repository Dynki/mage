import { prisma } from "@/lib/server/db/client";
import { computeViewLikeCount, DetailedNFTSet, NFTSetDetailed, NFTSetWithMeta } from "@/lib/utils/computed-properties";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/utils/authOptions";

export const fetchNftSetById = async(nftSetId: string): Promise<NFTSetWithMeta | null> => {
  const session = await getServerSession(authOptions)
  let authenticatedUserId = ''

  if (session?.user) {
    authenticatedUserId = session.user.id
  }

  let nftSet: NFTSetDetailed  | null = await prisma.nFTSet.findFirst({
    where: {
      id: nftSetId
    },
    include: {
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
      },
    },
  });

  let collectionProperties: NftSetDetailCollectionProperties | null = null;
  let nftSetsInCollection: string[] = [];

  if (nftSet?.collectionId) {
    nftSetsInCollection = await prisma.nFTSet.findMany({
      where: {
        collectionId: nftSet?.collectionId
      },
      select: {
        id: true
      }
    }).then((nftSets) => nftSets.map(n => n.id));

    const properties = await prisma.nFTSetProperties.groupBy({
      by: ['type', 'name'],
      where: {
        nftSetId: {
          in: nftSetsInCollection
        }
      },
      _count: {
        name: true,
      }
    });

    const resolveTypeValues = (typeValue: { _count: { name: number }, name: string; type: string }) => {
      return { _count: typeValue._count.name, name: typeValue.name, type: typeValue.type }
    }

    collectionProperties = {
      nftSetsInCollection: nftSetsInCollection.length,
      propertyCounts: properties.reduce((prev: { [key: string]: any }, current) => {
        return { ...prev, [current.type]: prev[current.type] ? [...prev[current.type], resolveTypeValues(current)] : [resolveTypeValues(current)] }
      }, {} as { [key: string]: any })
    }

  }

  const nftSetWithViewCount = computeViewLikeCount(
    nftSet as DetailedNFTSet, 
    authenticatedUserId   
  );

  return nftSetWithViewCount;
}

export const fetchPagedNftSets = async(limit = 50, collectionId: string, filters?: { [key: string]: string[] }, names?: string[]) => {
  let andClauses = Array(0);

  if (filters) {
    andClauses = Object.keys(filters).reduce((prev, groupKey) => {

      if (!filters[groupKey] || !filters[groupKey]?.length) {
        return [...prev]
      }          

      return [
        ...prev,
        { properties: { some: { OR: filters[groupKey]?.map(id => ({ id }))}}}
      ]
    }, Array());
  }

  if (names) {
    names.forEach((name, idx) => {
      andClauses.push({
        name: {
          contains: name
        }
      })
    });
  }

  const items = await prisma.nFTSet.findMany({
    take: limit + 1, // get an extra item at the end which we'll use as next cursor
    orderBy: {
      id: "asc",
    },
    where: {
      AND: andClauses,
      collectionId: collectionId
    },
  });

  return items    
}