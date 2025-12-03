import React from "react";

const BasicInfoSection = ({ form, handleChange }: any) => (
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
);

export default BasicInfoSection;
