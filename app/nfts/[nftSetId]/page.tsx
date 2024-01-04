import NftSetDetail from "./components/NftSetDetail";
// import { useEffect, useState } from "react";
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




  // useEffect(() => {
  //   setNft(nftSet);
  // }, [nftSet]);

  // const likeMutation = trpc.nftSet.like.useMutation({
  //   onSuccess(nft: NFTSetWithMeta) {
  //     setNft(nft);
  //   }
  // });

  // const unLikeMutation = trpc.nftSet.unLike.useMutation({
  //   onSuccess(nft: NFTSetWithMeta) {
  //     setNft(nft);
  //   }
  // });

  const handleLikeNft = async () => {
    // await likeMutation.mutateAsync({
    //   id: nftSet.id,
    // });
  }

  const handleUnLikeNft = async () => {
    // await unLikeMutation.mutateAsync({
    //   id: nftSet.id,
    // });
  }

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[calc(100vh-310px)]">
      <NftSetDetail nftSets={nftSets} nftSet={nftSet} onLike={handleLikeNft} onUnLike={handleUnLikeNft} collection={collection} collectionProperties={collectionProperties}/>
    </div>
  );
};
