const MetaInfoSection = ({ form, handleChange, categoryList }: any) => (
  <div>
    <h3 className="mb-2 text-lg font-semibold text-green-600">Meta Information</h3>
    <select
      value={form.cuisine}
      onChange={(e) => handleChange("cuisine", e.target.value)}
      className="mb-2 w-full border px-3 py-2"
    >
      <option value="">Select cuisine</option>
      {["Italian", "Mexican", "Indian", "Asian", "Mediterranean", "American", "Middle Eastern", "African", "French", "Chinese"].map((cuisine) => (
        <option key={cuisine} value={cuisine}>{cuisine}</option>
      ))}
    </select>
    <select
      value={form.category}
      onChange={(e) => handleChange("category", e.target.value)}
      className="mb-2 w-full border px-3 py-2"
    >
      <option value="">Select a category</option>
      {categoryList.map((cat: any) => (
        <option key={cat._id} value={cat._id}>{cat.name}</option>
      ))}
    </select>
    <input
      placeholder="Cooking time in minutes (e.g., 30)"
      value={form.cookingTime}
      onChange={(e) => handleChange("cookingTime", e.target.value)}
      className="mb-2 w-full border px-3 py-2"
    />
    <input
      placeholder="Number of servings (e.g., 4)"
      value={form.servings}
      onChange={(e) => handleChange("servings", e.target.value)}
      className="w-full border px-3 py-2"
    />
  </div>
);

export default MetaInfoSection;