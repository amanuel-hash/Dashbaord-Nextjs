/* eslint-disable @next/next/no-img-element */
"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";
import useRecipeStore from "../../../store/RecipeStore";
import useCategoryStore from "../../../store/categoryStore";
import { validateRecipeForm } from "@/components/common/Loader/recipeValidation";
import { OverlayLoaderContext } from "@/contexts/OverlayLoaderContext";

type FormType = {
  _id?: string;
  title: string;
  description: string;
  overview: string;
  category: string;
  cuisine: string;
  ingredients: string[];
  steps: { title: string; description: string }[];
  equipment: string[];
  difficultyLevel: string;
  cookingTime: string;
  nutritionalValue: string;
  cookingTips: string;
  servings: string;
  stepImages: (string | File)[];
  videoUrls: (string | File)[];
  thumbnailImage: string | File;
  is_favorite: boolean;
};

type ArrayField =
  | "ingredients"
  | "steps"
  | "stepImages"
  | "videoUrls"
  | "equipment";

const AddRecipePage = () => {
  const router = useRouter();
  const [form, setForm] = useState<FormType>({
    title: "",
    description: "",
    category: "",
    cuisine: "",
    ingredients: [""],
    steps: [{ title: "", description: "" }],
    cookingTime: "",
    servings: "",
    stepImages: [],
    videoUrls: [],
    equipment: [""],
    difficultyLevel: "",
    nutritionalValue: "",
    cookingTips: "",
    overview: "",
    thumbnailImage: "" as string | File,
    is_favorite: false,
  });
  const { createRecipe, editRecipe, error, isLoading } = useRecipeStore();
  const { setLoading } = useContext(OverlayLoaderContext);
  const { categoryList, fetchCategory } = useCategoryStore();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const recipeData = searchParams.get("data");
  const [inputText, setInputText] = useState("");
  const [nutritionTags, setNutritionTags] = useState<string[]>([]);

  const fetchCategories = async () => {
    try {
      await fetchCategory();
    } catch (error) {
      console.error("Failed to fetch categories", error);
      toast.error("Failed to fetch categories");
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors = validateRecipeForm(form);

    if (errors.length > 0) {
      errors.forEach((err) => toast.error(err));
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("category", form.category);
    formData.append("nutritionalValue", nutritionTags.join(", "));
    if (form.nutritionalValue) {
      formData.append("nutritionalValue", form.nutritionalValue);
    }
    formData.append("cookingTips", form.cookingTips);
    formData.append("cuisine", form.cuisine);
    formData.append("cookingTime", form.cookingTime);
    formData.append("servings", form.servings);
    formData.append("is_favorite", form.is_favorite.toString());
    formData.append("overview", form.overview);
    formData.append("level", form.difficultyLevel);

    formData.append(
      "ingredients",
      form.ingredients.filter((ing) => ing.trim()).join(","),
    );

    const stepsData = form.steps
      .filter((step) => step.title.trim() || step.description.trim())
      .map((step) => ({
        title: step.title,
        description: step.description,
      }));
    formData.append("steps", JSON.stringify(stepsData));
    formData.append(
      "equipment",
      form.equipment.filter((eq) => eq.trim()).join(","),
    );
    if (form.stepImages && form.stepImages.length > 0) {
      form.stepImages.forEach((img) => {
        if (img instanceof File) {
          formData.append("stepImages", img);
        }
      });
    }
    if (form.videoUrls && form.videoUrls.length > 0) {
      form.videoUrls.forEach((vid) => {
        if (vid instanceof File) {
          formData.append("video", vid);
        }
      });
    }
    if (form.thumbnailImage && form.thumbnailImage instanceof File) {
      formData.append("thumbnailImage", form.thumbnailImage);
    }

    try {
      setLoading(true);
      if (mode === "edit") {
        if (!form._id) {
          toast.error("Recipe ID is missing for edit.");
          return;
        }
        formData.append("_id", form._id);
        await editRecipe(form._id, formData);
      } else {
        await createRecipe(formData);
      }

      // Reset form
      setForm({
        title: "",
        description: "",
        category: "",
        cuisine: "",
        ingredients: [""],
        steps: [{ title: "", description: "" }],
        cookingTime: "",
        servings: "",
        stepImages: [],
        videoUrls: [],
        equipment: [""],
        difficultyLevel: "",
        overview: "",
        nutritionalValue: "",
        cookingTips: "",
        thumbnailImage: "" as string | File,
        is_favorite: false,
      });

      router.push("/recipes");
    } catch (error) {
      toast.error("An error occurred while saving the recipe.");
    } finally {
      setLoading(false); // 🔥 Always hide loader
    }
  };

  useEffect(() => {
    if (mode === "edit" && recipeData) {
      try {
        const parsed = JSON.parse(decodeURIComponent(recipeData));
        console.log("Parsed recipe data:", parsed);
        const stepImages =
          parsed.steps?.map((step: any) => step.imageUrl || "") || [];

        setForm({
          ...parsed,
          category: parsed.category._id || "",
          ingredients: parsed.ingredients || [""],
          steps: parsed.steps || [{ title: "", description: "" }],
          stepImages,
          videoUrls: parsed.videoUrls || [],
          equipment: parsed.equipment || [""],
          overview: parsed.overview || "",
          difficultyLevel: parsed.level || "",
          cuisine: parsed.cuisine || "",
          thumbnailImage: parsed.thumbnailImage || "",
          is_favorite: parsed.is_favorite || false,
        });
      } catch (err) {
        console.error("❌ Failed to parse recipeData", err);
      }
    }
  }, [mode, recipeData]);

  const handleChange = (field: keyof FormType, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (
    field: ArrayField,
    index: number,
    value: string,
  ) => {
    const updated = [...form[field]];
    updated[index] = value;
    setForm((prev) => ({ ...prev, [field]: updated }));
  };

  const addField = (field: ArrayField) => {
    if (field === "steps") {
      setForm((prev) => ({
        ...prev,
        steps: [...prev.steps, { title: "", description: "" }],
      }));
    } else {
      setForm((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
    }
  };

  const removeField = (field: ArrayField, index: number) => {
    if (field === "steps") {
      const updated = form.steps.filter((_, i) => i !== index);
      setForm((prev) => ({ ...prev, steps: updated }));
    } else {
      const updated = form[field].filter((_, i) => i !== index);
      setForm((prev) => ({ ...prev, [field]: updated }));
    }
  };

  const handleFileUpload = (field: string, files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    if (field === "thumbnailImage") {
      setForm((prev) => ({ ...prev, thumbnailImage: fileArray[0] }));
    } else if (field === "stepImages") {
      if (fileArray.length > 5) {
        alert("You can upload a maximum of 5 images.");
        return;
      }

      if (fileArray.length !== form.steps.length) {
        alert(
          `You must upload exactly ${form.steps.length} image(s), one per step.`,
        );
        return;
      }

      setForm((prev) => ({ ...prev, stepImages: fileArray }));
    } else if (field === "videoUrls") {
      if (fileArray.length > 3) {
        alert("You can upload a maximum of 3 videos.");
        return;
      }
      setForm((prev) => ({ ...prev, videoUrls: fileArray }));
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb
        paths={[
          { name: "Dashboard", href: "/" },
          { name: "Recipes", href: "/recipes" },
          { name: mode === "edit" ? "Edit Recipe" : "Add New Recipe" },
        ]}
      />

      <div className="shadow-1d rounded-[10px]  border bg-white p-4 sm:p-7.5">
        <div className="w-full p-6">
          <h2 className="mb-4 text-center text-4xl font-bold text-red-600">
            {mode === "edit" ? "Edit Recipe Details" : "Recipe Detail Form"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div>
              <h3 className="mb-2 text-lg font-semibold text-green-600">
                Basic Information
              </h3>
              <input
                placeholder="Enter recipe title (e.g., Spaghetti Bolognese)"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="mb-2 w-full border px-3 py-2"
              />
              <textarea
                placeholder="Enter description (e.g., Classic Italian pasta with beef sauce)"
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="w-full border px-3 py-2"
              />
            </div>

            {/* Overview */}
            <div>
              <h3 className="mb-2 text-lg font-semibold text-green-600">
                Overview
              </h3>
              <textarea
                placeholder="Quick summary (e.g., Spicy stir-fried chicken with garlic and chili)"
                value={form.overview}
                onChange={(e) => handleChange("overview", e.target.value)}
                className="w-full border px-3 py-2"
              />
            </div>

            {/* Meta Info */}
            <div>
              <h3 className="mb-2 text-lg font-semibold text-green-600">
                Meta Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={form.cuisine}
                  onChange={(e) => handleChange("cuisine", e.target.value)}
                  className="w-full rounded border px-3 py-2"
                >
                  <option value="">Select cuisine</option>
                  {[
                    "Italian",
                    "Mexican",
                    "Indian",
                    "Asian",
                    "Mediterranean",
                    "American",
                    "Middle Eastern",
                    "African",
                    "French",
                    "Chinese",
                  ].map((cuisine) => (
                    <option key={cuisine} value={cuisine}>
                      {cuisine}
                    </option>
                  ))}
                </select>

                <select
                  value={form.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className="w-full rounded border px-3 py-2"
                >
                  <option value="">Select a category</option>
                  {categoryList.map((cat: any) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <input
                  placeholder="Cooking time in minutes"
                  value={form.cookingTime}
                  onChange={(e) => handleChange("cookingTime", e.target.value)}
                  className="w-full rounded border px-3 py-2"
                />
                <input
                  placeholder="Number of servings"
                  value={form.servings}
                  onChange={(e) => handleChange("servings", e.target.value)}
                  className="w-full rounded border px-3 py-2"
                />
              </div>
            </div>

            {/* Ingredients & Equipment Section */}
            <div>
              <h3 className="mb-4 text-lg font-bold text-green-600">
                Ingredients & Equipment
              </h3>
              <div className="grid grid-cols-2 gap-6">
                {/* Ingredients */}
                <div>
                  <h4 className="text-md mb-2 font-semibold text-gray-700">
                    Ingredients
                  </h4>
                  {form.ingredients.map((ingredient, idx) => (
                    <div key={idx} className="mb-2 flex items-center gap-2">
                      <input
                        placeholder={`Ingredient ${idx + 1}`}
                        value={ingredient}
                        onChange={(e) =>
                          handleArrayChange("ingredients", idx, e.target.value)
                        }
                        className="w-full rounded border px-3 py-2"
                      />
                      {form.ingredients.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeField("ingredients", idx)}
                          className="rounded bg-red-100 px-2 py-1 text-sm text-red-600 hover:bg-red-200"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className=" inline-flex items-center gap-1 rounded bg-green-600 px-3 py-1 text-white shadow hover:bg-green-700"
                    onClick={() => addField("ingredients")}
                  >
                    + Add Ingredient
                  </button>
                </div>

                {/* Equipment */}
                <div>
                  <h4 className="text-md mb-2 font-semibold text-gray-700">
                    Equipment
                  </h4>
                  {form.equipment.map((item, idx) => (
                    <div key={idx} className="mb-2 flex items-center gap-2">
                      <input
                        type="text"
                        placeholder={`Equipment ${idx + 1}`}
                        value={item}
                        onChange={(e) => {
                          const updated = [...form.equipment];
                          updated[idx] = e.target.value;
                          setForm((prev) => ({ ...prev, equipment: updated }));
                        }}
                        className="w-full rounded border px-3 py-2"
                      />
                      {form.equipment.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeField("equipment", idx)}
                          className="rounded bg-red-100 px-2 py-1 text-sm text-red-600 hover:bg-red-200"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className=" inline-flex items-center gap-1 rounded bg-green-600 px-3 py-1 text-white shadow hover:bg-green-700"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        equipment: [...prev.equipment, ""],
                      }))
                    }
                  >
                    + Add Equipment
                  </button>
                </div>
              </div>
            </div>

            {/* Steps */}
            <div>
              <h3 className="mb-2 text-lg font-semibold text-green-600">
                Instructions(Cooking Steps)
              </h3>

              {form.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-gray-10 relative mb-4 rounded border border-gray-200 p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-md mb-2 font-semibold text-primary">
                      Step {idx + 1}
                    </h4>
                    {form.steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeField("steps", idx)}
                        className="rounded bg-red-100 px-2 py-1 text-sm text-red-600 hover:bg-red-200"
                      >
                        ×
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    placeholder="Step Title"
                    value={step.title}
                    onChange={(e) => {
                      const updated = [...form.steps];
                      updated[idx].title = e.target.value;
                      setForm((prev) => ({ ...prev, steps: updated }));
                    }}
                    className="mb-2 w-full rounded border px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />

                  <textarea
                    placeholder="Step Description"
                    value={step.description}
                    onChange={(e) => {
                      const updated = [...form.steps];
                      updated[idx].description = e.target.value;
                      setForm((prev) => ({ ...prev, steps: updated }));
                    }}
                    className=" w-full rounded border px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const updated = [...form.stepImages];
                        updated[idx] = file;
                        setForm((prev) => ({ ...prev, stepImages: updated }));
                      }
                    }}
                    className="my-1 w-full border bg-white px-3 py-2 focus:border-primary "
                  />
                  {/* {mode === "edit" && form.stepImages[idx] && (
                    <img
                      src={
                        typeof form.stepImages[idx] === "string"
                          ? form.stepImages[idx]
                          : URL.createObjectURL(form.stepImages[idx] as File)
                      }
                      alt={Step ${idx + 1} image}
                      className="mb-3 h-[120px] max-w-xs w-[120px] rounded-lg border border-gray-300 object-cover shadow-sm"
                    />
                  )} */}
                  {mode === "edit" &&
                    form.stepImages[idx] &&
                    (() => {
                      const image = form.stepImages[idx];
                      const src =
                        typeof image === "string"
                          ? image
                          : URL.createObjectURL(image);

                      return (
                        <img
                          src={src}
                          alt={`Step ${idx + 1} image`}
                          className="mb-3 h-[120px] w-[120px] max-w-xs rounded-lg border border-gray-300 object-cover shadow-sm"
                        />
                      );
                    })()}
                </div>
              ))}

              {/* Add Step Button */}
              <button
                type="button"
                className=" inline-flex items-center gap-1 rounded bg-green-600 px-3 py-1 text-white shadow hover:bg-green-700"
                onClick={() => addField("steps")}
              >
                + Add Step
              </button>
            </div>

            {/* Nutritional Value & Cooking Tips */}
            <div className="mt-6">
              <h3 className="mb-4 text-lg font-bold text-green-600">
                Nutrition & Cooking Tips
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Nutritional Tags
                  </label>
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (
                        (e.key === "Enter" || e.key === "Tab") &&
                        inputText.trim()
                      ) {
                        e.preventDefault();
                        if (
                          !nutritionTags.includes(
                            inputText.trim().toLowerCase(),
                          )
                        ) {
                          setNutritionTags((prev) => [
                            ...prev,
                            inputText.trim(),
                          ]);
                        }
                        setInputText("");
                      }
                    }}
                    placeholder="Enter nutrient and press Enter/Tab"
                    className="w-full rounded border px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />

                  <div className="mt-3 flex flex-wrap gap-2">
                    {nutritionTags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="rounded-full border border-gray-400 px-4 py-1 text-sm font-medium text-gray-700 shadow-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Cooking Tips */}
                <div>
                  <h4 className="text-md mb-2 font-semibold text-gray-700">
                    Cooking Tips
                  </h4>
                  <textarea
                    placeholder="e.g. Use fresh basil for better aroma"
                    value={form.cookingTips || ""}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        cookingTips: e.target.value,
                      }))
                    }
                    className="w-full rounded border px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    rows={2}
                  />
                </div>
              </div>
            </div>

            {/* Difficulty Level */}
            <div>
              <h3 className="mb-2 text-lg font-semibold text-green-600">
                Difficulty Level
              </h3>
              <select
                value={form.difficultyLevel}
                onChange={(e) =>
                  handleChange("difficultyLevel", e.target.value)
                }
                className="w-full border px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Select difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {/* Thumbnail & Videos Section */}
            <div className="mb-6">
              <h3 className="mb-4 text-lg font-bold text-green-600">
                Thumbnail & Videos
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Thumbnail Image */}
                <div>
                  <h4 className="text-md mb-2 font-semibold text-gray-700">
                    Thumbnail Image
                  </h4>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileUpload("thumbnailImage", e.target.files)
                    }
                    className="mb-2 w-full border bg-white px-3 py-2"
                  />
                  {mode === "edit" && form.thumbnailImage && (
                    <div className="flex">
                      <img
                        src={
                          typeof form.thumbnailImage === "string"
                            ? form.thumbnailImage
                            : URL.createObjectURL(form.thumbnailImage)
                        }
                        alt="Thumbnail"
                        className="mb-3 h-[120px] w-[120px] max-w-xs rounded-lg border border-gray-300 object-cover shadow-sm"
                      />
                    </div>
                  )}
                </div>

                {/* Videos */}
                <div>
                  <h4 className="text-md mb-2 font-semibold text-gray-700">
                    Videos (Max 3)
                  </h4>
                  <input
                    type="file"
                    accept="video/*"
                    multiple
                    onChange={(e) =>
                      handleFileUpload("videoUrls", e.target.files)
                    }
                    className="mb-2 w-full border bg-white px-3 py-2"
                  />
                  {mode === "edit" && form.videoUrls.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {form.videoUrls.map((vid, idx) => {
                        const src =
                          typeof vid === "string"
                            ? vid
                            : URL.createObjectURL(vid);
                        return (
                          <video
                            key={idx}
                            src={src}
                            controls
                            className="mb-3 h-[120px] w-full max-w-xs rounded-lg border border-gray-300 object-cover shadow-sm"
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="text-center">
              <button
                type="submit"
                disabled={isLoading}
                className="min-w-[80px] rounded bg-green-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Submitting...
                  </div>
                ) : mode === "edit" ? (
                  "Update Recipe"
                ) : (
                  "Submit Recipe"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AddRecipePage;
