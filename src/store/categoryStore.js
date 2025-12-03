import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "../js/api";
import { getErrorMessage } from "../hooks/getErrorMessage";
import { toast } from "react-toastify";

const useCategoryStore = create()(
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
      categoryList: [],

      clearError: () => set({ error: null }),

      createCategory: async (formData) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.post("/category", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          if (res.data?.success) {
            toast.success("Category created successfully");
            await get().fetchCategory();
            set({ isLoading: false });
          } else {
            set({
              error: res.data?.msg || "Category creation failed",
              isLoading: false,
            });
          }
          return res;
        } catch (err) {
          set({
            error: getErrorMessage(err, "Category creation failed"),
            isLoading: false,
          });
        }
      },
      fetchCategory: async () => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.get("/category");

          if (Array.isArray(res.data)) {
            set({ categoryList: res.data, isLoading: false });
          } else {
            set({
              error: "Unexpected response format",
              isLoading: false,
            });
          }

          return res;
        } catch (err) {
          set({
            error: getErrorMessage(err, "Failed to fetch categories"),
            isLoading: false,
          });
        }
      },
      deleteCategory: async (_id) => {
        set({ isLoading: true, error: null });

        try {
          const res = await api.delete(`/category/${_id}`);

          if (res.status === 200) {
            await get().fetchCategory();
          }

          set({ isLoading: false });
          return res;
        } catch (err) {
          set({
            error: getErrorMessage(err, "Category deletion failed"),
            isLoading: false,
          });
        }
      },
      updateCategory: async (_id, data) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.put(`/category/${_id}`, data);
          if (res.status === 200) {
            await get().fetchCategory();
          }
          set({ isLoading: false });
          return res;
        } catch (err) {
          set({
            error: getErrorMessage(err, "Category update failed"),
            isLoading: false,
          });
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

export default useCategoryStore;
