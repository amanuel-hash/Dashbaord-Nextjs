interface FormType {
  title: string;
  description: string;
  category: string;
  cuisine: string;
  cookingTime: string;
  servings: string;
  ingredients: string[];
  steps: { title: string; description: string }[]; // ✅ FIXED
  stepImages: (string | File)[];
  videoUrls: (string | File)[];
  equipment: string[];
  difficultyLevel: string;
  overview: string;
  thumbnailImage: string | File;
  is_favorite: boolean;
}

export const validateRecipeForm = (form: FormType) => {
  const errors: string[] = [];

  if (!form.title.trim()) errors.push("Recipe title is required.");
  if (!form.description.trim()) errors.push("Description is required.");
  if (!form.category) errors.push("Category must be selected.");
  if (!form.cuisine) errors.push("Cuisine must be selected.");

  if (!String(form.cookingTime).trim() || isNaN(Number(form.cookingTime))) {
    errors.push("Cooking time must be a valid number.");
  }

  if (!String(form.servings).trim() || isNaN(Number(form.servings))) {
    errors.push("Servings must be a valid number.");
  }

  if (!form.ingredients.length || !form.ingredients.every((i) => i.trim())) {
    errors.push("All ingredient fields must be filled.");
  }

  if (
    !form.steps.length ||
    !form.steps.every((step) => step.title.trim() && step.description.trim())
  ) {
    errors.push("Each step must have a title and description.");
  }
  if (!form.equipment.length || !form.equipment.every((e) => e.trim())) {
    errors.push("All equipment fields must be filled.");
  }


  if (!form.stepImages || form.stepImages.length === 0) {
    errors.push("At least one step image must be uploaded.");
  } else {
    if (form.stepImages.length !== form.steps.length) {
      errors.push("Number of step images must match number of steps.");
    }

    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    const invalidImage = form.stepImages.find(
      (img) => img instanceof File && !validTypes.includes(img.type),
    );
    if (invalidImage) {
      errors.push(
        "All step images must be valid formats: PNG, JPG, JPEG, or WEBP.",
      );
    }
  }

  if (
    !form.thumbnailImage ||
    (form.thumbnailImage instanceof File &&
      !["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(
        form.thumbnailImage.type,
      ))
  ) {
    errors.push("Thumbnail image must be PNG, JPG, JPEG, or WEBP.");
  }

  return errors;
};
