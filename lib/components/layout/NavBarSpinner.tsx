"use client"

import { Suspense } from "react";
import { FaCircleNotch } from "react-icons/fa"
import { NavigationEvents } from "./NextNavEvents";

export const NavBarSpinner = () => {
  return (
    <Suspense fallback={
       <div className="hidden md:block">
         <FaCircleNotch
           size={20}
           className={`
            mr-3
            mt-4
            animate-spin dark:fill-gray-200 fill-blue-500
          }`}/>
       </div>
     }>
      <div className="hidden md:block">
        <FaCircleNotch
          size={20}
          className={`
            mr-3
            mt-4
            "fill-white dark:fill-slate-800"
          }`}/>
      </div>
      <NavigationEvents />
    </Suspense>
  )
}
