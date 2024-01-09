"use client"

import Link from "next/link";
import {
  FaCat,
  FaCircleNotch,
  FaImage,
  FaRegUserCircle,
  FaSignOutAlt,
  FaTh,
  FaTimes,
  FaRegHeart,
  FaWallet,
} from "react-icons/fa";
import React from "react";
import { NavMenu, NavMenuItem } from "./NavMenu";
import dynamic from "next/dynamic";
// import ConnectButton from "../auth/ConnectButton";
import { signOut, useSession } from "next-auth/react";
// import { NavBarSpinner } from "./NavBarSpinner";

const SetTheme = dynamic(() => import("./SetTheme"), { ssr: false });

const MobileNav = () => {
  const { data: session, status } = useSession()

  return (
    <div className="mr-7 mt-2">
      <NavMenu
        position="left"
        icon={
          <FaRegUserCircle
            size={30}
            className="fill-gray-700 dark:fill-gray-400"
          />
        }
        activeIcon={
          <FaTimes size={30} className="fill-gray-700 dark:fill-gray-400" />
        }
      >
        {/* <NavMenuItem
          icon={<FaDollarSign size={20} className="fill-gray-700 dark:fill-gray-200"/>}
          caption="Trade"
          href="/trade"
        /> */}
        <NavMenuItem
          icon={
            <FaCat size={20} className="fill-gray-700 dark:fill-gray-200" />
          }
          caption="Trade"
          href="/trade"
        />
        <NavMenuItem
          icon={
            <FaCat size={20} className="fill-gray-700 dark:fill-gray-200" />
          }
          caption="Explore"
          href="/collections/explore"
        />
        <NavMenuItem
          icon={
            <FaImage size={20} className="fill-gray-700 dark:fill-gray-200" />
          }
          caption="Create"
          href="/nfts/create"
        />
        <NavMenuItem
          icon={
            <FaRegHeart
              size={20}
              className="fill-gray-700 dark:fill-gray-200"
            />
          }
          caption="Favorites"
          href="/favorites"
        />
        <NavMenuItem
          icon={<FaTh size={20} className="fill-gray-700 dark:fill-gray-200" />}
          caption="My Collections"
          href="/collections"
        />
        <SetTheme />
        {/* <ConnectButton /> */}
        {session &&
          <>
            <NavMenuItem 
              icon={<FaSignOutAlt size={20} className="fill-gray-700 dark:fill-gray-200"/>}
              caption="Sign Out" 
              onClick={() => signOut()}
            />
          </>
        }
        {!session && 
          <>
            <NavMenuItem 
              icon={<FaWallet size={20} className="fill-gray-700 dark:fill-gray-200 "/>}
              caption="Log In"
              href="/login"
            />
          </>
        }
      </NavMenu>
    </div>
  );
};

const MenuItems = () => {
  const { data: session, status } = useSession()

  return (
    <>
      <div
        className="
      text-md 
      flex gap-y-8 flex-row items-center 
      w-full h-full
      dark:text-gray-200 text-gray-700 font-bold
    "
      >
        {/* <MageNavigationMenu /> */}
        <div className="flex gap-x-7 w-full items-center justify-center ml-auto mt-2">
          {/* <Link href="/trade" >
          <a className="outline-none dark:hover:text-gray-500 hover:text-blue-500 ">
            Trade
          </a>
        </Link> */}
          <Link href="/trade">
            <div className="text-2xl outline-none dark:hover:text-gray-500 hover:text-blue-500">
              Trade
            </div>
          </Link>
          <Link href="/earn">
            <div className="text-2xl outline-none dark:hover:text-gray-500 hover:text-blue-500">
              Earn
            </div>
          </Link>
        </div>
        <div className="ml-auto">
          {/* <ConnectButton /> */}
        </div>
        <div className="flex justify-end md:flex-row md:ml-auto md:pl-5 md:mt-0 min-w-fit h-full mr-9 mt-2">
          <NavMenu icon={<FaRegUserCircle size={30} />} position="left">
            <NavMenuItem
              icon={
                <FaRegHeart
                  size={20}
                  className="fill-gray-700 dark:fill-gray-200"
                />
              }
              caption="Favorites"
              href="/favorites"
            />
            <NavMenuItem
              icon={
                <FaTh size={20} className="fill-gray-700 dark:fill-gray-200" />
              }
              caption="My Collections"
              href="/collections/my-collections"
            />
            <SetTheme />
            <div className="md:hidden">
              {/* <ConnectButton /> */}
            </div>

          {session && (
            <>
              <NavMenuItem 
                icon={<FaSignOutAlt size={20} className="fill-gray-700 dark:fill-gray-200"/>}
                caption="Sign Out" 
                onClick={() => signOut()}
              />
            </>
          )}
          {!session && 
            <>
              <SetTheme/>
              <NavMenuItem 
                icon={<FaWallet size={20} className="fill-gray-700 dark:fill-gray-200 "/>}
                caption="Log In"
                href="/login" 
              />
            </>
          }
          </NavMenu>
        </div>
      </div>
    </>
  );
};

const NavBar = () => {
  return (
    <div className="top-0 left-0 w-full fixed z-[20000] bg-white dark:bg-slate-800">
      <nav className="relative container mx-auto px-6 py-2 md:p-0 md:py-3 pl-0 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <Link href="/" passHref>
            <div className="flex items-center">
              {/* <NavBarSpinner /> */}
              <span
                className={`
                ml-4 md:ml-0
                text-5xl text-gray-700 font-medium 
                dark:text-gray-200
                cursor-pointer
                font-silkscreen
                `}
              >
                Mage
              </span>
            </div>
          </Link>
          <div className="w-full hidden md:flex">
            <MenuItems />
          </div>
          <div className="md:hidden">
            <MobileNav />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
