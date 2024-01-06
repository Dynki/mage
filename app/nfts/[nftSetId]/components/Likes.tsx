"use client"

import { ToolTip } from "@/lib/components/controls/ToolTip"
import { FaRegHeart, FaHeart } from "react-icons/fa"
import { likeNFT, unlikeNFT } from "../actions"
import { useOptimistic } from 'react'

export const LikeNFT = ({ liked, nftId, likeCount }: {liked: boolean; nftId: string; likeCount: number}) => {
  const [optimisticLike, setOptimisticLike] = useOptimistic(
    { liked, likeCount, sending: false },
    (state, newLikedState) => ({
      ...state,
      liked: newLikedState as boolean,
      likeCount: newLikedState ? state.likeCount + 1 : state.likeCount -1,
      sending: true
    })
  )

  return (
    <>
      <div className="dark:text-gray-400">{optimisticLike.likeCount}</div>
      <button 
      onClick={async () => {
        setOptimisticLike(!optimisticLike.liked)
        optimisticLike.liked ? await unlikeNFT(nftId) : await likeNFT(nftId) 
      }}
    >
      <ToolTip
        label="Favorite"
        position="top"
      >
        <>
          {!optimisticLike.liked && <FaRegHeart size={20} className="fill-gray-400 mr-2 hover:fill-red-500" />} 
          {optimisticLike.liked && <FaHeart size={20} className="fill-red-500 mr-2" />}
        </>
      </ToolTip>
    </button>
    </>

  )
}