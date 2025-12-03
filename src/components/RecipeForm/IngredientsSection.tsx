const IngredientsSection = ({ ingredients, handleArrayChange, addField, removeField }: any) => (
  <div>
    <h3 className="mb-2 text-lg font-semibold text-green-600">Ingredients</h3>
    {ingredients.map((ingredient: string, idx: number) => (
      <div key={idx} className="mb-2 flex items-center gap-2">
        <input
          placeholder={`Ingredient ${idx + 1}`}
          value={ingredient}
          onChange={(e) => handleArrayChange("ingredients", idx, e.target.value)}
          className="w-full rounded border px-3 py-2"
        />
        {ingredients.length > 1 && (
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
      className="mt-2 rounded bg-green-100 px-3 py-1 text-sm font-medium text-green-700 hover:bg-green-200"
      onClick={() => addField("ingredients")}
    >
      + Add Ingredient
    </button>
  </div>
);

export default IngredientsSection;
