"use client";
import { useState } from "react";
import Link from "next/link";
import { User } from "lucide-react";
import ClickOutside from "@/components/ClickOutside";
import LogoutModal from "../modals/logoutModal";
import useAuthStore from "@/store/authStore";

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
const {logout,isLoading} = useAuthStore();
  const handleLogout = () => {
    logout();

  };

  return (
    <>
      <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-4"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-dark-5 dark:bg-dark-3 dark:text-white">
            <User size={28} />
          </span>

          <span className="flex items-center gap-2 font-medium text-dark dark:text-dark-6">
            <span className="hidden lg:block">ADMIN</span>
            <svg
              className={`fill-current duration-200 ease-in ${dropdownOpen ? "rotate-180" : ""}`}
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.6921 7.09327C3.91674 6.83119 4.3113 6.80084 4.57338 7.02548L9.99997 11.6768L15.4266 7.02548C15.6886 6.80084 16.0832 6.83119 16.3078 7.09327C16.5325 7.35535 16.5021 7.74991 16.24 7.97455L10.4067 12.9745C10.1727 13.1752 9.82728 13.1752 9.59322 12.9745L3.75989 7.97455C3.49781 7.74991 3.46746 7.35535 3.6921 7.09327Z"
                fill=""
              />
            </svg>
          </span>
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-7.5 flex w-[280px] flex-col rounded-lg border border-stroke bg-white shadow-default dark:border-dark-3 dark:bg-gray-dark">
            <div className="flex items-center gap-2.5 px-5 pb-5.5 pt-3.5">
              <span className="block">
                <span className="block text-lg font-bold text-[#4caf50]">
                  Admin
                </span>
                <span className="block text-sm text-black">
                  admin@readysetpasta.com
                </span>
              </span>
            </div>

            <ul className="flex flex-col gap-1 border-y border-stroke p-2.5 dark:border-dark-3">
              <li>
                <Link
                  href="/profile"
                  className="flex w-full items-center gap-2.5 rounded-[7px] p-2.5 text-sm font-medium text-black hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white"
                >
                  View profile
                </Link>
              </li>
            </ul>

            <div className="p-2.5">
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  setLogoutModalOpen(true);
                }}
                className="flex w-full items-center gap-2.5 rounded-[7px] p-2.5 text-sm font-medium text-[#4caf50] hover:bg-gray-2 dark:hover:text-white"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </ClickOutside>


      <LogoutModal
      isLoading={isLoading}
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onLogout={handleLogout}
      />
    </>
  );
};

export default DropdownUser;
