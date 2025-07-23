"use client";

import { useSession, signOut } from "next-auth/react";
import { BellIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { motion } from "framer-motion";

export default function AdminHeader() {
  const { data: session } = useSession();

  return (
    <motion.header
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      className=" sticky top-0 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700"
    >
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ModernShop Management
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />

            {/* Notifications */}
            <button className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600">
              <BellIcon className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </button>

            {/* User Menu */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-600">
                <UserCircleIcon className="h-8 w-8" />
                <span className="text-sm font-medium">
                  {session?.user?.name}
                </span>
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? "bg-gray-100 dark:bg-gray-800" : ""
                          } block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 w-full text-left`}
                        >
                          Profile Settings
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => signOut()}
                          className={`${
                            active ? "bg-gray-100 dark:bg-gray-800" : ""
                          } block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 w-full text-left`}
                        >
                          Sign Out
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
