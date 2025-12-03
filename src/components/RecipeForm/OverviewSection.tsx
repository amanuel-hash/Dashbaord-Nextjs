// OverviewSection.tsx
const OverviewSection = ({ form, handleChange }: any) => (
  <div>
    <h3 className="mb-2 text-lg font-semibold text-green-600">Overview</h3>
    <textarea
      placeholder="Quick summary (e.g., Spicy stir-fried chicken with garlic and chili)"
      value={form.overview}
      onChange={(e) => handleChange("overview", e.target.value)}
      className="w-full border px-3 py-2"
    />
  </div>
);

export default OverviewSection;