"use client";

import { useCallback, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import NftSetSummary from '@/app/nfts/[nftSetId]/components/NftSetSummary';
import { fetchNftSets } from '@/app/nfts/[nftSetId]/actions';
import { CollectionWithNftSetCount } from '@/lib/utils/computed-properties';
import { useCollectionStore } from '@/lib/hooks/useCollectionProperties';
import { NFTSet } from '@prisma/client';

type ComponentProps = {
  collection: CollectionWithNftSetCount;
  initialNftSets: NFTSet[];
  menuHidden: boolean;
  gridCols: string | number;
};

export const CollectionNfts = ({ collection, initialNftSets, menuHidden, gridCols }: ComponentProps) => {

  const [items, setItems] = useState(initialNftSets || []);
  const [limit, setLimit] = useState(50);
  const [ref, inView] = useInView();  
  const searchValues = useCollectionStore(useCallback((state) => state.searchValues, []));
  const selectedCombinations = useCollectionStore(useCallback((state) => state.selectedCombinations, []));

  async function loadMoreNftSets() {
    const next = limit + 50

    const infiniteLoadNftSets = await fetchNftSets(limit, collection.id, selectedCombinations, Array.from(searchValues));

    if (infiniteLoadNftSets.length) {
      setItems(infiniteLoadNftSets);
      setLimit(next);
    } else {
      setItems([]);
      setLimit(50);
    }
  }

  useEffect(() => {
    if (inView && items.length) {
      loadMoreNftSets()
    }
  }, [inView])

  useEffect(() => {
    if (searchValues.size > 0 || selectedCombinations) {
      loadMoreNftSets()
    }
  }, [searchValues, selectedCombinations])

  return (
    <>
      {!items.length ? 
        <div className="flex items-center justify-center w-full border rounded-lg p-10 max-h-60">
            <div className="text-1xl md:text-5xl">No items to display</div>
        </div>
        :
        <div className={`pt-4 md:p-2 md:pt-0 grid grid-cols-2 ${menuHidden ? `md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-${Number(gridCols) +3}` : `md:grid-cols-2 lg:grid-cols-${gridCols} xl-grid-cols-5`} gap-2 md:gap-4 w-full md:h-fit md:overflow-auto`}>
          {items.map((nftSet) => (
            <div key={nftSet.id} >
              <NftSetSummary nftSet={nftSet} collectionName={collection.name} verified={collection.verified}/>
            </div>
            ))}
            <div ref={ref}></div>
        </div>
      }
    </>    
  )



}