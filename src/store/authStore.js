import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "../js/api"; // ✅ works

import { getErrorMessage } from "../hooks/getErrorMessage";
import { toast } from "react-toastify";

const useAuthStore = create()(
  persist(
    (set, get) => ({
      user: null,
      users: null,
      token: null,
      isLoggedIn: false,
      profile: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      userList: [],
      clearError: () => set({ error: null }),

      login: async (data, router) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.post("/auth/signin", data);
          const { success, message, data: resData } = res.data;
          if (success && resData?.token && resData?.user) {
            set({
              user: resData.user,
              token: resData.token,
              isLoggedIn: true,
              isAuthenticated: true,
              isLoading: false,
            });

            toast.success(message);

            await get().getProfile();
          } else {
            set({ error: message || "Login failed", isLoading: false });
            toast.error(message || "Login failed");
          }
        } catch (err) {
          const errorMessage = getErrorMessage(err);
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
        } finally {
          set({ isLoading: false });
        }
      },
      logout: () => {
        set({
          user: null,
          token: null,
          isLoggedIn: false,
          profile: null,
          isAuthenticated: false,
          error: null,
        });
        sessionStorage.clear();
      },
      getProfile: async () => {
        set({ isLoading: true, error: null });
        try {
          const token = get().token;
          if (!token) {
            set({ isLoading: false, error: "No token found" });
            return null;
          }
          const res = await api.get("/profile");
          if (res.data) {
            const mergedProfile = {
              ...res.data.user,
              ...res.data.profile,
            };
            set({ profile: mergedProfile, isLoading: false });
            return mergedProfile;
          } else {
            set({ error: "Incomplete profile data", isLoading: false });
            return null;
          }
        } catch (err) {
          set({
            error: getErrorMessage(err, "Fetching profile failed"),
            isLoading: false,
          });
          return null;
        }
      },
      getUsers: async () => {
        set({ isLoading: true, error: null });

        try {
          const res = await api.get("/auth/admin/all-users");
          if (res.data?.data && Array.isArray(res.data.data)) {
            const transformed = res.data.data.map((user) => ({
              _id: user._id,
              role: user.role,
              email: user.email,
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user._username || "U")}`,
              status: user.isBan ? "Inactive" : "Active",
              company: user.profileId?.companyName || "N/A",
            }));

            set({
              userList: transformed,
              isLoading: false,
            });
            
          } else {
            set({ error: "Invalid response format", isLoading: false });
            toast.error("Error while getting users");
          }
        } catch (err) {
          set({
            error: getErrorMessage(err, "Fetching users failed"),
            isLoading: false,
          });
          toast.error("Failed to fetch users");
        }
      },
      deleteUserAccount: async () => {
        set({ isLoading: true, error: null });
        try {
          const token = get().token;
          await api.delete("/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          set({
            user: null,
            token: null,
            isLoggedIn: false,
            profile: null,
            isLoading: false,
          });
        } catch (err) {
          set({
            error: getErrorMessage(err, "Account deletion failed"),
            isLoading: false,
          });
          throw err;
        }
      },

      suspendUser: async (_id, suspend = true) => {
        set({ isLoading: true, error: null });

        try {
          const action = suspend ? "ban" : "unban";
          const res = await api.patch(
            `/auth/admin/toggleBan/${_id}?action=${action}`,
          );

          if (res.status === 200) {
            toast.success(
              `User ${suspend ? "deactivated" : "activated"} successfully`,
            );

            // ✅ Update userList locally
            set((state) => ({
              userList: state.userList.map((user) =>
                user._id === _id
                  ? { ...user, status: suspend ? "Inactive" : "Active" }
                  : user,
              ),
            }));
          }

          set({ isLoading: false });
          return res;
        } catch (err) {
          set({
            error: getErrorMessage(err, "Account status update failed"),
            isLoading: false,
          });
          throw err;
        }
      },
    }),
    {
      name: "auth-store",
      getStorage: () => sessionStorage,
      partialize: (state) => ({
        token: state.token,
        isLoggedIn: state.isLoggedIn,
        user: state.user,
      }),
    },
  ),
);

export default useAuthStore;
