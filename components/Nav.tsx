"use client";

import Link from "next/link";
import { IoTicketOutline } from "react-icons/io5";

import { useState, useEffect, useCallback } from "react";

import { ConnectButton } from "@rainbow-me/rainbowkit";
// import { BsPalette2 } from "react-icons/bs";
// import { GiMisdirection } from "react-icons/gi";
import { BsSignpost2 } from "react-icons/bs";
import { BsLuggage } from "react-icons/bs";

import { usePathname } from "next/navigation";

const Nav = () => {
  const pathname = usePathname();

  const onScroll = useCallback((event: any) => {
    const { pageYOffset, scrollY } = window;
    let header = document.getElementById("ticket_nav");
    let navMask = document.getElementById("navMask");

    if (!header || !navMask) return;
    if (pageYOffset > 50) {
      header.style.background = "rgba(0, 0, 0, 0.8)";
      navMask.style.backdropFilter = "blur(6px)";
    } else {
      header.style.background = "none";
      navMask.style.backdropFilter = "none";
    }
  }, []);

  useEffect(() => {
    //add eventlistener to window
    window.addEventListener("scroll", onScroll, { passive: true });
    // remove event on unmount to prevent a memory leak with the cleanup
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className=" relative z-20">
      <div
        id="ticket_nav"
        className="fixed top-0 left-0 w-full z-20 items-center flex justify-between p-3"
      >
        <div className=" flex">
          <Link href={"/"} className=" cursor-pointer flex-none w-min-[232px] ">
            Ticket ✨
          </Link>
          <div className=" ml-[12vw] flex gap-8">
            <Link
              href={"/"}
              className={`flex gap-2 items-center font-bold ${
                pathname === "/" ? "text-gray-300" : "text-gray-400"
              }  hover:text-gray-200 transition-all`}
            >
              {" "}
              <BsSignpost2 />
              Explore{" "}
            </Link>
            <Link
              href={"/create"}
              className={`flex gap-2 items-center font-bold ${
                pathname === "/create" ? "text-gray-300" : "text-gray-400"
              }  hover:text-gray-200 transition-all`}
            >
              {" "}
              <IoTicketOutline />
              Create{" "}
            </Link>
          </div>
        </div>

        <div className="w-min-[232px]">
          <ConnectButton chainStatus="icon" showBalance={false} />
        </div>
      </div>
      <div
        id="navMask"
        className="fixed top-0 left-0 w-full h-[64px] z-10 pointer-events-none"
      ></div>
      {/* <div className=" absolute top-0 left-0 w-full  bg-gradient-to-b from-blue-900 to-base-1000 h-[15vh] pointer-events-none"></div> */}
      <div
        className=" fixed top-0 left-0 w-full h-[18vh] pointer-events-none"
        style={{
          background:
            "linear-gradient(rgba(82, 0, 255, 0.2) 0%, rgba(0, 102, 255, 0.1) 52.58%, rgba(6, 45, 103, 0) 100%)",
        }}
      ></div>
    </div>
  );
};

export default Nav;
