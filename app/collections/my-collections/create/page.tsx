"use client"

import { determineResult } from "@/lib/utils/determineResult";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { readFiles } from "@/lib/utils/files";
import CreateCollectionForm from "@/lib/components/forms/CreateCollectionForm"
import { FaCheck, FaRedo } from "react-icons/fa";
import { CreateCollection } from "../../_actions/create";
import { UpdateCollection } from "../../_actions/update";

export default function CollectionsPage() {
  
  const router = useRouter();
  const [isPending, setTransition] = useTransition()
  const [collectionCreated, setCollectionCreated] = useState(false);
  const [logoImageUploaded, setLogoImageUploaded] = useState(false);
  const [bannerImageUploaded, setBannerImageUploaded] = useState(false);
  const [featuredImageUploaded, setFeaturedImageUploaded] = useState(false);
  const [hasBannerImage, setHasBannerImage] = useState(false);
  const [hasFeaturedImage, setHasFearturedImage] = useState(false);

  const handleOnSumbit = (data: CreateCollectionFormValues) => {
    
    setTransition(async () => {
      const fileReaderResults = await readFiles([
        data.logoImageFile,
        data.featuredImageFile,
        data.bannerImageFile,
      ]);

      setHasBannerImage(data.bannerImageFile ? true : false);
      setHasFearturedImage(data.featuredImageFile ? true : false);

      let { collection } = await CreateCollection({
        description: data.description || "",
        logoImageFile: determineResult<ArrayBuffer | string | null | undefined>(fileReaderResults[0])?.toString() || '',
        name: data.name,
      })

      setLogoImageUploaded(true)

      if (!collection) return

      if (data.bannerImageFile) {
        await UpdateCollection({
          id: collection.id,
          bannerImageFile: determineResult<ArrayBuffer | string | null | undefined>(fileReaderResults[2])?.toString() || '',
        });

        setBannerImageUploaded(true);
      }

      if (data.featuredImageFile) {
        await UpdateCollection({
          id: collection.id,
          featuredImageFile: determineResult<ArrayBuffer | string | null | undefined>(fileReaderResults[1])?.toString() || '',
        });

        setFeaturedImageUploaded(true);
      }

      setCollectionCreated(true);

      router.push(`/collections/${collection.id}`);
    })
  };
  
  return (
    <div className="p-5 mb-14 md:mt-14 flex items-center justify-center w-full h-full overflow-y-scroll">
      {isPending ? (
        <div className="w-full md:w-1/2 md:p-4 text-2xl flex flex-col h-[calc(100vh-490px)] text-gray-700 font-medium dark:text-gray-200 items-start justify-center">
          <div className="flex flex-col text-xl md:text-2xl gap-5 h-full w-full justify-start">
            <div className="text-2xl md:text-4xl">Creating your collection</div>
            <div className="flex items-center gap-5 w-full h-16 border-2 rounded-lg p-5 md:p-10">
              {!logoImageUploaded && (
                <FaRedo className="animate-spin fill-red-500" />
              )}
              {logoImageUploaded && <FaCheck className="fill-green-500" />}
              <div>Uploading logo image</div>
            </div>
            {hasBannerImage && (
              <div className="flex items-center gap-5 w-full h-16 border-2 rounded-lg p-5 md:p-10">
                {!bannerImageUploaded && (
                  <FaRedo className="animate-spin fill-red-500" />
                )}
                {bannerImageUploaded && <FaCheck className="fill-green-500" />}
                <div>Uploading banner image</div>
              </div>
            )}
            {hasFeaturedImage && (
              <div className="flex items-center gap-5 w-full h-16 border-2 rounded-lg p-5 md:p-10">
                {!featuredImageUploaded && (
                  <FaRedo className="animate-spin fill-red-500" />
                )}
                {featuredImageUploaded && (
                  <FaCheck className="fill-green-500" />
                )}
                <div>Uploading featured image</div>
              </div>
            )}
            <div className="flex items-center gap-5 w-full h-16 border-2 rounded-lg p-5 md:p-10">
              {!collectionCreated && (
                <FaRedo className="animate-spin fill-red-500" />
              )}
              {collectionCreated && <FaCheck className="fill-green-500" />}
              <div>Collection created</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full md:w-1/2 md:p-4 text-2xl flex flex-col h-full text-gray-700 font-medium dark:text-gray-200 items-start justify-center">
          <h1 className="text-3xl md:text-5xl my-14">Create a Collection</h1>
          <CreateCollectionForm onSubmit={handleOnSumbit} />
        </div>
      )}
    </div>
  );
}