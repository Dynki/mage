import { fetchCollection } from "../_actions/fetch";
import CollectionDetail from "@/app/collections/[collectionId]/components/CollectionDetail";

export default async function CollectionPage({ params }: { params: { collectionId: string } }) {
  
  const { collection, collectionProperties, nftSets } = await fetchCollection(params?.collectionId as string || '');
  
  return (
    <div className="flex items-center justify-center w-full">
      {collection && collectionProperties && 
        <CollectionDetail nftSets={nftSets} collection={collection} collectionProperties={collectionProperties}/>
      }
    </div>
  );
}