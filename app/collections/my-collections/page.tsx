import { getServerSession } from "next-auth";
import { fetchCollectionsForUser } from "@/app/collections/_actions/fetch";
import { authOptions } from "@/lib/utils/authOptions";
import { CollectionPanel } from "../[collectionId]/components/CollectionPanel";
import Link from "next/link";

export default async function CollectionsPage() {
  
  const session = await getServerSession(authOptions)

  const collections = await fetchCollectionsForUser((session?.user as { id: string })?.id);
  
  return (
    <div className="p-4 md:p-5 mb-10 flex items-center justify-center h-full overflow-y-scroll overflow-x-hidden">
      <div className="md:p-4 text-2xl flex flex-col w-full h-screen text-gray-700 font-medium dark:text-gray-200 md:w-4/5">
        <h1 className="text-3xl md:text-5xl my-5">My Collections</h1>
        <h2 className="md:text-md font-light">
          Create, curate, and manage collections of unique NFTs to share and
          sell.
        </h2>
        <Link href="/collections/my-collections/create">
          <div
            className="
            md:max-w-fit my-10 
            flex items-center justify-center 
            dark:text-gray-200 py-4 px-10 hover:bg-blue-400 bg-blue-500 disabled:bg-blue-200 text-white
            dark:border
            dark:border-gray-300
            dark:bg-white dark:bg-opacity-0
            dark:hover:bg-opacity-10
            rounded
            font-semibold 
          "
          >
            Create a collection
          </div>
        </Link>
        {collections && collections.length && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {collections.map((collection) => (
              <CollectionPanel key={collection.id} collection={collection} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}