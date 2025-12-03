import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "../js/api";
import { getErrorMessage } from "../hooks/getErrorMessage";
import { toast } from "react-toastify";

const useRecipeStore = create()(
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
      recipes: [],

      clearError: () => set({ error: null }),

      createRecipe: async (formData) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.post("/recipes/create", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          if (res.data?.success) {
            toast.success("Recipe created successfully");
            await get().getRecipe();
            set({ isLoading: false });
          } else {
            set({
              error: res.data?.msg || "Recipe creation failed",
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

      getRecipe: async () => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.get("/recipes");
          set({ recipes: res.data, isLoading: false, error: null });
          return res.data;
        } catch (err) {
          console.error("Error while getting recipes", err);
          set({
            isError: true,
            error: getErrorMessage(err, "Error while getting recipe"),
          });
        }
      },

      editRecipe: async (id, data) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.put(`/recipes/update/${id}`, data);
          if (res.datastatus === 200) {
            await get().getRecipe();
          }
          toast.success("Recipe updated successfully!");
          set({ isLoading: false });
          return res.data;
        } catch (err) {
          set({
            error: getErrorMessage(err, "Recipe update failed"),
            isLoading: false,
          });
          toast.error("Recipe update failed");
        }
      },

      deleteRecipe: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.delete(`/recipes/delete/${id}`);
          if (res.status === 200) {
            await get().getRecipe();
          }
          set({ isLoading: false });
          return res;
        } catch (err) {
          set({
            error: getErrorMessage(err, "Recipe deletion failed"),
            isLoading: false,
          });
        }
      },
      recommend: async (id, is_favorite) => {
        set({ isLoading: true, error: null });

        try {
          const res = await api.patch(`/recipes/${id}/recomend`, {
            is_favorite, 
          });

          if (res.status === 200) {
            toast.success("Recipe recommendation updated successfully");
            await get().getRecipe(); 
          }

          set({ isLoading: false });
          return res;
        } catch (err) {
          set({
            error: getErrorMessage(err, "Recipe recommendation failed"),
            isLoading: false,
          });
          toast.error("Recipe recommendation failed");
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

export default useRecipeStore;
