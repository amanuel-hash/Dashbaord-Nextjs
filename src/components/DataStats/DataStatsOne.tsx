"use client";
import React, { useEffect } from "react";
import { FaRegStar, FaUserAlt } from "react-icons/fa";
import { MdRestaurantMenu, MdCategory } from "react-icons/md";
import { toast } from "react-toastify";
import useAuthStore from "@/store/authStore";
import useCategoryStore from "@/store/categoryStore";
import useRecipeStore from "@/store/RecipeStore";

const DataStatsOne: React.FC = () => {
  const { userList = [], getUsers } = useAuthStore();
  const { recipes = [], getRecipe } = useRecipeStore();
  const { categoryList = [], fetchCategory } = useCategoryStore();
  const { reviewList = [], getReview } = useRecipeStore();

  useEffect(() => {
    getUsers().catch(() => toast.error("Failed to fetch users"));
    getRecipe().catch(() => toast.error("Failed to fetch recipes"));
    fetchCategory().catch(() => toast.error("Failed to fetch categories"));
  }, []);

  const dataStatsList = [
    // {
    //   icon: <FaRegStar size={26} color="white" />,
    //   color: "#4CAF50",
    //   title: "Total Reviews",
    //   value: "3.456K",
    //   growthRate: 0.43,
    // },
    {
      icon: <MdRestaurantMenu size={28} color="white" />,
      color: "#F4D35E",
      title: "Total Recipes",
      value: recipes.length.toString(),
      growthRate: 4.35,
    },
    {
      icon: <MdCategory size={26} color="white" />,
      color: "#E63946",
      title: "Total Categories",
      value: categoryList.length.toString(),
      growthRate: 2.59,
    },
    {
      icon: <FaUserAlt size={26} color="white" />,
      color: "#4CAF50",
      title: "Total Users",
      value: userList.length.toString(),
      growthRate: -0.95,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
      {dataStatsList.map((item, index) => (
        <div
          key={index}
          className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark"
        >
          <div
            className="flex h-14.5 w-14.5 items-center justify-center rounded-full"
            style={{ backgroundColor: item.color }}
          >
            {item.icon}
          </div>

          <div className="mt-6 flex items-end justify-between">
            <div>
              <h4 className="mb-1.5 text-heading-6 font-bold text-dark dark:text-white">
                {item.value}
              </h4>
              <span className="text-body-sm font-medium">{item.title}</span>
            </div>

            <span
              className={`flex items-center gap-1.5 text-body-sm font-medium ${
                item.growthRate > 0 ? "text-green-600" : "text-red-500"
              }`}
            >
              {item.growthRate}%
              {item.growthRate > 0 ? (
                <svg
                  className="fill-current"
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M5 0L10 5H6V10H4V5H0L5 0Z" fill="currentColor" />
                </svg>
              ) : (
                <svg
                  className="fill-current"
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M5 10L0 5H4V0H6V5H10L5 10Z" fill="currentColor" />
                </svg>
              )}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DataStatsOne;
