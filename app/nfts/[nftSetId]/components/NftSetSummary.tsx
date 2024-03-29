import React from "react";
import Link from "next/link";
import Image from "@/lib/components/controls/Image";
import { MdVerified } from "react-icons/md";

import { type NFTSet } from "@prisma/client";

const NftSetSummary = React.forwardRef<HTMLDivElement, { nftSet: NFTSet, collectionName: string | undefined, verified: boolean | undefined }>(
  (props: { nftSet: NFTSet, collectionName: string | undefined, verified: boolean | undefined }, ref) => {
    const { nftSet, collectionName, verified } = props;
    if (!nftSet) return <div>Loading...</div>;

    return (
      <Link href={`/nfts/${nftSet.id}`}>
        <div
          ref={ref}
          className="flex flex-col h-[256px] md:h-[457px] hover:shadow-lg shadow-md  hover:shadow-gray-500/50 dark:border dark:border-gray-600 cursor-pointer rounded-2xl"
        >
          <div className="relative flex items-center justify-center overflow-hidden rounded-t-2xl h-full">
            <Image
              src={nftSet.imageUrl}
              alt={nftSet.name}
              className="rounded-t-2xl transition transform-gpu hover:scale-125"
            />
          </div>
          <div className="p-2 md:p-4 rounded-b-2xl">
            <div className="text-sm md:text-lg text-ellipsis overflow-hidden whitespace-nowrap">{nftSet.name}</div>
            <div>
              {collectionName && 
                <div className="flex items-center gap-2">
                  <div className="text-xs md:text-lg font-light md:font-thin my-3 text-ellipsis overflow-hidden whitespace-nowrap">
                    {collectionName}
                  </div>
                  {verified && 
                    <span className="verified_icon">
                        <MdVerified size={20}/>
                        <div className="verified_icon_bg">
                          <MdVerified size={20} className=""/>
                        </div>
                    </span>
                  }
                </div>
              }
            </div>
          </div>
        </div>
      </Link>
    );
  }
);

NftSetSummary.displayName = "NftSetSummary";

export default NftSetSummary;
