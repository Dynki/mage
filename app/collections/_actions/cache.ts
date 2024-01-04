import { revalidateTag } from "next/cache";

interface RevalidateProps {
  collectionId?: string;
  userId?: string;
}

export const collectionCache = {
  tag: {
    byCollectionId(collectionId: string) {
      return `collection-${collectionId}`;
    },
    byUserId(userId: string) {
      return `collections-user-${userId}`;
    },
  },
  revalidate({ collectionId, userId }: RevalidateProps): void {
    if (collectionId) {
      revalidateTag(this.tag.byCollectionId(collectionId));
    }

    if (userId) {
      revalidateTag(this.tag.byUserId(userId));
    }
  },
};
