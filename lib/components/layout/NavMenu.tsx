"use client"

import { useState } from "react";
import React from "react";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import Link from "next/link";

type NavMenuProps = {
  caption?: string;
  children: React.ReactNode;
  icon?: React.ReactElement;
  activeIcon?: React.ReactElement;
  position: "left" | "right";
}

type NavMenuItemProps = {
  caption: string;
  icon?: React.ReactElement;
  href?: string;
  onClick?: () => void;
}

const NavMenuItemWrapper = ({ children, href }: { children: React.ReactNode, href?: string }) => {
  return href ? (
    <div className="border-b border-b-gray-300 last:border-0">
      <Link href={href}>{children}</Link>
    </div>) : <></>
}

export const NavMenuItem = ({ caption, icon, href, onClick }: NavMenuItemProps) => (
  <NavMenuItemWrapper href={href}>
    <div 
      className="
        flex 
        gap-5
        p-5 
        items-center 
        justify-start 
        cursor-pointer 
        bg-black bg-opacity-0
        dark:bg-white dark:bg-opacity-0
        dark:hover:bg-opacity-10
        hover:bg-opacity-5
        hover:text-blue-500
        hover:fill-blue-500
        dark:hover:text-white
        dark:hover:fill-white
        text-gray-700 dark:text-gray-200
        font-bold
      "
      onClick={onClick}
    >
      {icon && React.cloneElement(icon, { 
        className: `${icon.props.classes} hover:fill-blue-500 dark:hover:fill-gray-400`
      })}
      <div>{caption}</div>
    </div>
  </NavMenuItemWrapper>
);

export const NavMenu = ({ caption, children, icon, activeIcon }: NavMenuProps) => {

  const [active, setActive] = useState(false);
  const ref = React.createRef<HTMLDivElement>();

  useOnClickOutside(ref, () => setActive(false));

  const toggle = () => {
    setActive(prev => !prev);
  }

  return (
    <div className="h-full w-full relative z-[90000]" ref={ref}>
      <div className="w-14 h-14 absolute -left-4 -top-4 cursor-pointer" onClick={toggle} >
        <div className="absolute top-0 left-3">
          {!activeIcon && icon && React.cloneElement(icon, { 
            className: `${icon.props.classes} fill-gray-700 dark:fill-gray-200 hover:fill-blue-500 dark:hover:fill-gray-500`
          })}
          {activeIcon && !active && icon && React.cloneElement(icon, { 
            className: `${icon.props.classes} fill-gray-700 dark:fill-gray-200 hover:fill-blue-500 dark:hover:fill-gray-500`
          })}
          {activeIcon && active && activeIcon && React.cloneElement(activeIcon, { 
            className: `${activeIcon.props.classes} fill-gray-700 dark:fill-gray-200 hover:fill-blue-500 dark:hover:fill-gray-500`
          })}
          {caption && caption}
        </div>
        <div 
          className={`
            ${!active ? "hidden": "visible"}
            border dark:border-gray-300 bg-white dark:bg-slate-800
            transition-opacity ease-in-out delay-150 
            h-fit w-72
            absolute md:relative top-9 -left-60 
            rounded-lg shadow-lg 
            overflow-hidden
            z-[60000]
          `}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
