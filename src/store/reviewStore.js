import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "../js/api";
import { getErrorMessage } from "../hooks/getErrorMessage";
import { toast } from "react-toastify";

const useReviewStore = create()(
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
      reviewList: [],
      feedbackList: [],

      clearError: () => set({ error: null }),

      getReviewbyId: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.get(`/reviews/${id}`);
          set({
            reviewList: res.data.reviews || [],
            isLoading: false,
            error: null,
          });
          return res.data;
        } catch (err) {
          console.error("Error while getting recipe", err);
          set({
            isError: true,
            error: getErrorMessage(err, "Error while getting recipe"),
          });
        }
      },

      togglePublish: async (id, isPublished) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.patch(`/reviews/status/${id}`, { isPublished });

          if (res.data?.success) {
            toast.success(
              `Review ${isPublished ? "published" : "unpublished"} successfully`,
            );
          }

          const updatedList = get().reviewList.map((review) =>
            review._id === id ? { ...review, isPublished } : review,
          );

          set({ reviewList: updatedList, isLoading: false });
          return res.data;
        } catch (err) {
          set({ isLoading: false });
          console.error("Toggle error", err);
          toast.error("Failed to toggle review");
        }
      },

      deleteReview: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.delete(`/reviews/${id}`);
          if (res.data?.success) {
           
            const updatedList = get().reviewList.filter(
              (review) => review._id !== id,
            );
            set({ reviewList: updatedList, isLoading: false });
          }
          return res.data;
        } catch (err) {
          console.error("Error while deleting review", err);
          set({
            isError: true,
            error: getErrorMessage(err, "Error while deleting review"),
          });
        }
      },
      getFeedback: async () => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.get("/feedback/");
          set({
            feedbackList: res.data || [],
            isLoading: false,
            error: null,
          });
          return res.data;
        } catch (err) {
          set({
            isLoading: false,
            error: getErrorMessage(err, "Error while fetching feedback"),
          });
        }
      },
      deleteFeedback: async (id) => { 
        set({ isLoading: true, error: null });
        try {
          const res = await api.delete(`/feedback/${id}`);
          if (res.data?.success) {
            toast.success("Feedback deleted successfully");
            const updatedList = get().feedbackList.filter(
              (feedback) => feedback._id !== id,
            );
            set({ feedbackList: updatedList, isLoading: false });
          }
          return res.data;
        } catch (err) {
          console.error("Error while deleting feedback", err);
          set({
            isError: true,
            error: getErrorMessage(err, "Error while deleting feedback"),
          });
        }
      }
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

export default useReviewStore;
