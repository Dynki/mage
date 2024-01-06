"use client";

import { forwardRef, use, useEffect } from 'react';
import { MdFilterList } from "react-icons/md";
import { useCallback, useState } from "react";
import { CollectionHeader } from "./CollectionHeader";
import { CollectionMenu } from "./CollectionMenu";
import { OverlayPanel } from "@/lib/components/controls/OverlayPanel";
import { Button } from "@/lib/components/controls/Button";
import { SlidePanel } from "@/lib/components/controls/SlidePanel";
import { useIsInViewport } from "@/lib/hooks/useIsInViewport";
import { useCollectionStore } from "@/lib/hooks/useCollectionProperties";
import { Radio, RadioButton } from "@/lib/components/controls/Radio";
import { MdGridOn, MdGridView } from "react-icons/md";
import { Search } from "@/lib/components/controls/Search";
import { CollectionFilterTags } from "./CollectionFilterTags";
import { CollectionNfts } from './CollectionNfts';
import { NFTSet } from '@prisma/client';
import { CollectionWithNftSetCount } from '@/lib/utils/computed-properties';

type ComponentProps = {
  collection: CollectionWithNftSetCount;
  collectionProperties: CollectionNftSetProperties;
  nftSets: NFTSet[];
};

const CollectionDetail = forwardRef<HTMLDivElement, ComponentProps>(
  ({ collection, collectionProperties, nftSets }: ComponentProps) => {

  const [menuHidden, setMenuHidden] = useState(false);
  const [mobileMenuHidden, setMobileMenuHidden] = useState(true);
  const [gridCols, setGridCols] = useState<string | number>(4);

  const selectedProperties = useCollectionStore(useCallback((state) => state.selectedProperties, []));
  const setSearchValue = useCollectionStore(useCallback((state) => state.setSearchValue, []));
  const setCollection = useCollectionStore(useCallback((state) => state.setCollection, []));
  const setCollectionProperties = useCollectionStore(useCallback((state) => state.setCollectionProperties, []));

  const {
    isInViewport,
    observerRef
  } = useIsInViewport({ defaultState: true });
  
  const handleSearchSubmitted = useCallback((value: string) => {
    setSearchValue(value);
  }, [setSearchValue]);

  useEffect(() => {
    setCollection(collection);
    setCollectionProperties(collectionProperties);
  }, [collection, collectionProperties, setCollection, setCollectionProperties]);

  return (
    <div className="relative min-w-full">
      {!isInViewport &&
        <div className="md:hidden fixed bottom-1 left-[50%] translate-x-[-50%] z-[1000]">
          <Button 
            caption={`Filters ${Object.keys(selectedProperties).length ? Object.keys(selectedProperties).length : ''}`}
            icon={<MdFilterList size={30}/>}     
            onClick={() => setMobileMenuHidden(prev => !prev)}
          />
        </div>
      }
      <OverlayPanel 
        caption="Filters"
        visible={!mobileMenuHidden} 
        onClose={() => setMobileMenuHidden(true)}
      >
        <CollectionMenu/>
      </OverlayPanel>
      <section className="flex flex-col gap-y-5 w-full text-lg font-normal dark:text-gray-200 text-gray-700">
        <CollectionHeader
          collection={collection}
          floorPrice={0}
          isLoading={collection ? false : true}
        />
        <section className="flex flex-col w-full gap-1 px-4 py-5 pt-0 md:p-10 md:pt-0">
          <div className="flex flex-col w-full bg-white dark:bg-slate-800">
            <div className="w-fit border-b-2 border-gray-800 dark:border-gray-300 pb-3 font-medium">
              Items
            </div>
            <hr className="border dark:border-gray-700" />
          </div>
          <div className="hidden md:flex gap-5 w-full md:p-5 md:px-3 sticky top-[73px] z-[10000] bg-white dark:bg-slate-800">
            <div className="md:flex gap-5 w-full">
              <button onClick={() => setMenuHidden(prev => !prev)} className="rounded-full p-[1px] hover:bg-gray-300 dark:hover:bg-gray-500">
                <MdFilterList size={30} className="m-3 dark:fill-gray-200 fill-gray-500"/>
              </button>
              <Search onSubmit={handleSearchSubmitted}/>
            </div>
            <div className="ml-auto">
              <Radio onChange={(value) => setGridCols(value)} defaultValue={gridCols}>
                <RadioButton value={5} position="first">
                  <MdGridOn size={28} className="dark:fill-gray-300"/>
                </RadioButton>
                <RadioButton value={4} position="last">
                  <MdGridView size={28} className="dark:fill-gray-300"/>
                </RadioButton>
              </Radio>
            </div>
          </div>
          <section className="flex flex-col md:flex-row w-full">
            <div className="md:hidden" ref={observerRef}>
              <Button 
                caption={`Filters ${Object.keys(selectedProperties).length ? Object.keys(selectedProperties).length : ''}`}
                icon={<MdFilterList size={30}/>}     
                onClick={() => setMobileMenuHidden(prev => !prev)}
              />
            </div>
            <div className="hidden md:flex">
              <SlidePanel visible={menuHidden}>
                <CollectionMenu/>
              </SlidePanel>
            </div>
            <div className="flex flex-col h-full w-full">
              <CollectionFilterTags/>
              <CollectionNfts initialNftSets={nftSets} collection={collection} menuHidden={menuHidden} gridCols={gridCols} />
            </div>
          </section>
        </section>
      </section>
    </div>
  );
});

CollectionDetail.displayName = "CollectionDetail";

export default CollectionDetail;
