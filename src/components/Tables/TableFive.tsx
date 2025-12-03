"use client";
import React, { useContext, useEffect, useState } from "react";
import { Eye } from "lucide-react";
import ViewModal from "../modals/viewUsers";
import Pagination from "../Pagination/pagination";
import useAuthStore from "@/store/authStore";
import { toast } from "react-toastify";
import { OverlayLoaderContext } from "@/contexts/OverlayLoaderContext";

interface User {
  _id: string;
  role: string;
  email: string;
  avatar: string;
  status: string;
  company: string;
}

const UsersTableView = () => {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [emailFilter, setEmailFilter] = useState("");
  const { getUsers, userList = [], suspendUser } = useAuthStore();
  const { setLoading } = useContext(OverlayLoaderContext);
  const itemsPerPage = 10;

  // Filter users by email
  const filteredUsers = userList.filter((user : User) =>
    user.email.toLowerCase().includes(emailFilter.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [emailFilter]);

  // Toggle user status
  const toggleUserStatus = async (user: User) => {
    try {
      setLoading(true);
      const suspend = user.status === "Active";
      await suspendUser(user._id, suspend);
    } catch (err) {
      toast.error("Failed to update user status");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all users on mount
  const fetchAllUsers = async () => {
    try {
      await getUsers();
    } catch {
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleView = (user: User) => {
    setSelectedUser(user);
    setViewModalOpen(true);
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      <div className="max-w-full overflow-x-auto">
        <div className="mb-4 flex items-center gap-4">
          <h3 className="text-xl font-bold text-primary dark:text-white">
            Filter By Email:
          </h3>
          <input
            type="text"
            placeholder="Enter email..."
            value={emailFilter}
            onChange={(e) => setEmailFilter(e.target.value)}
            className="w-64 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <table className="w-full table-auto">
          <thead>
            <tr className="bg-[#F7F9FC] text-left text-primary">
              <th className="px-4 py-4">#</th>
              <th className="px-4 py-4">Email</th>
              <th className="px-4 py-4">Company</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4 text-right">View</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user: User, index: number) => (
              <tr key={user._id} className="border-t">
                <td className="px-4 py-4">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="px-4 py-4">{user.email}</td>
                <td className="px-4 py-4">{user.company}</td>
                <td className="flex px-2 py-4">
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={user.status === "Active"}
                      onChange={() => toggleUserStatus(user)}
                    />
                    <div className="peer h-5 w-10 rounded-full bg-red-600 after:absolute after:start-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:bg-green-500 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full"></div>
                  </label>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => handleView(user)}
                      className="text-green-600 hover:text-blue-800"
                      title="View"
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={6} className="py-4 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <ViewModal
        isOpen={viewModalOpen}
        user={
          selectedUser
            ? {
                name: selectedUser.email.split("@")[0],
                email: selectedUser.email,
                avatar: selectedUser.avatar,
                company: selectedUser.company,
                status: selectedUser.status,
              }
            : null
        }
        onClose={() => {
          setViewModalOpen(false);
          setSelectedUser(null);
        }}
      />
    </div>
  );
};

export default UsersTableView;
