import NftSetDetail from "./components/NftSetDetail";
import { fetchNftSet, fetchNftSets } from "./actions";
import { fetchCollection } from "@/app/collections/_actions/fetch";

export default async function NftSetDetailPage({ params }: { params: { nftSetId: string } }) {

  const nftSet = await fetchNftSet(params?.nftSetId as string || '');

  if (!nftSet) {
    throw new Error("No nft found");
  }
  
  const nftSets = await fetchNftSets(10, nftSet.collectionId || '', undefined, undefined);

  if (!nftSets) {
    throw new Error("No nft sets found");
  }

  const { collection, collectionProperties } = await fetchCollection(nftSet?.collectionId as string);

  if (!collection) {
    throw new Error("No collection found");
  }

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[calc(100vh-310px)]">
      <NftSetDetail nftSets={nftSets} nftSet={nftSet} collection={collection} collectionProperties={collectionProperties}/>
    </div>
  );
};
