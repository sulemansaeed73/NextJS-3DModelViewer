"use client";
import React, { useState, useContext } from "react";
import { IoIosArrowDropdown } from "react-icons/io";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { IoMdMenu } from "react-icons/io";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoginContext } from "@/context/AuthContext";

function Header() {
  const router = useRouter();

  const { loggedIn } = useContext(LoginContext);
  const { logout } = useContext(LoginContext);

  const [menuClicked, setMenuClicked] = useState(false);

  const OpenMenu = () => {
    setMenuClicked(true);
  };

  const closeMenu = () => {
    setMenuClicked(false);
    router.push("/");
  };

  return (
    <div className="flex items-center justify-between px-6 md:px-16 py-4 bg-gray-900 text-white shadow-md">
      <div className="text-2xl font-semibold tracking-wide">
        <h1 className="text-white">AutoCAD Viewer</h1>
      </div>

      <div className="hidden md:flex space-x-8 text-lg">
        <Link href={"/"} className="hover:text-gray-400 transition py-1">
          Home
        </Link>
        <Link href={"/"} className="hover:text-gray-400 transition py-1">
          About
        </Link>
        <Link href={"/"} className="hover:text-gray-400 transition py-1">
          Contact
        </Link>

        {loggedIn ? (
          <Menu>
            <MenuButton className="px-4 py-1 bg-teal-600 text-white rounded-md shadow-md hover:bg-teal-700 transition">
              <span className="flex gap-1 items-center">
                Account <IoIosArrowDropdown />
              </span>
            </MenuButton>

            <MenuItems
              anchor="bottom"
              className="absolute w-40 bg-white border border-gray-200 shadow-lg rounded-md overflow-hidden"
            >
              <MenuItem>
                <a className="block px-4 py-2 hover:bg-gray-100">
                  Notifications
                </a>
              </MenuItem>
              <MenuItem>
                <a className="block px-4 py-2 hover:bg-gray-100">Profile</a>
              </MenuItem>
              <MenuItem>
                <a
                  onClick={logout}
                  className="block px-4 py-2 text-red-600 hover:bg-red-100 cursor-pointer"
                >
                  Logout
                </a>
              </MenuItem>
            </MenuItems>
          </Menu>
        ) : (
          <Link
            href={"/login"}
            className="bg-teal-600 px-5 py-1 rounded-md shadow-md hover:bg-teal-700 transition"
          >
            Sign In
          </Link>
        )}
      </div>

      <div className="md:hidden">
        <button onClick={OpenMenu} className="text-3xl text-white">
          <IoMdMenu />
        </button>
      </div>

      {menuClicked && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center space-y-6 text-white text-2xl">
          <button
            onClick={closeMenu}
            className="absolute top-6 right-6 text-4xl hover:text-red-500 transition"
          >
            ✕
          </button>

          <Link
            href={"/"}
            onClick={closeMenu}
            className="hover:text-gray-400 transition"
          >
            Home
          </Link>
          <Link
            href={"/about"}
            onClick={closeMenu}
            className="hover:text-gray-400 transition"
          >
            About
          </Link>
          <Link
            href={"/contact"}
            onClick={closeMenu}
            className="hover:text-gray-400 transition"
          >
            Contact
          </Link>

          {loggedIn ? (
            <span
              onClick={logout}
              className="cursor-pointer hover:text-red-500 transition"
            >
              Logout
            </span>
          ) : (
            <Link
              href={"/login"}
              className="bg-teal-600 px-6 py-1 rounded-lg shadow-md hover:bg-teal-700 transition"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default Header;
