import { revalidateTag } from "next/cache";

interface RevalidateProps {
  nftSetId?: string;
  collectionId?: string;
  limit?: number;
  filters?: { [key: string]: string[]};
  names?: string[];
}

export const nftSetCache = {
  tag: {
    byNftSetId(nftSetId: string) {
      return `nft-set-${nftSetId}`;
    },
    byCollectionId(collectionId: string, limit: number, filters?: { [key: string]: string[] }, names?: string[]) {
      return `nft-sets-collectionId-${collectionId}-limit-${limit}-filters-${JSON.stringify(filters)}-names-${JSON.stringify(names)}`;
    },
  },
  revalidate({ nftSetId, collectionId, limit, filters, names }: RevalidateProps): void {
    if (nftSetId) {
      revalidateTag(this.tag.byNftSetId(nftSetId));
    }

    if (collectionId) {
      revalidateTag(this.tag.byCollectionId(collectionId, limit || 50, filters, names));
    }

  },
};
