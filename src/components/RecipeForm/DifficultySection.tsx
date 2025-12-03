const DifficultySection = ({ form, handleChange }: any) => (
  <div>
    <h3 className="mb-2 text-lg font-semibold text-green-600">Difficulty Level</h3>
    <select
      value={form.difficultyLevel}
      onChange={(e) => handleChange("difficultyLevel", e.target.value)}
      className="w-full border px-3 py-2"
    >
      <option value="">Select difficulty</option>
      <option value="easy">Easy</option>
      <option value="medium">Medium</option>
      <option value="hard">Hard</option>
    </select>
  </div>
);

export default DifficultySection;