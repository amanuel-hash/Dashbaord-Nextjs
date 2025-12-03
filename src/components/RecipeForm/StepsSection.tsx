/* eslint-disable @next/next/no-img-element */
// ... previous components remain unchanged ...

// StepsSection.tsx
const StepsSection = ({ form, setForm, addField, removeField }: any) => (
  <div>
    <h3 className="mb-2 text-lg font-semibold text-green-600">Cooking Steps</h3>
    {form.steps.map((step: any, idx: number) => (
      <div key={idx} className="bg-gray-10 relative mb-4 rounded border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h4 className="mb-2 text-base font-semibold text-gray-700">Step {idx + 1}</h4>
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
            setForm((prev: any) => ({ ...prev, steps: updated }));
          }}
          className="mb-2 w-full rounded border px-3 py-2"
        />
        <textarea
          placeholder="Step Description"
          value={step.description}
          onChange={(e) => {
            const updated = [...form.steps];
            updated[idx].description = e.target.value;
            setForm((prev: any) => ({ ...prev, steps: updated }));
          }}
          className="w-full rounded border px-3 py-2"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const updated = [...form.stepImages];
              updated[idx] = file;
              setForm((prev: any) => ({ ...prev, stepImages: updated }));
            }
          }}
          className="my-1 w-full border bg-white px-3 py-2"
        />
        {form.stepImages[idx] &&
          (typeof form.stepImages[idx] === "string" ? (
            <img
              src={form.stepImages[idx] as string}
              alt={`Step ${idx + 1} image`}
              className="mb-2 h-32 w-48 rounded border object-cover"
            />
          ) : (
            <img
              src={URL.createObjectURL(form.stepImages[idx] as File)}
              alt={`Preview Step ${idx + 1}`}
              className="mb-2 h-32 w-48 rounded border object-cover"
            />
          ))}
      </div>
    ))}
    <button
      type="button"
      className="mt-3 rounded bg-green-100 px-3 py-1 text-sm font-medium text-green-700 hover:bg-green-200"
      onClick={() => addField("steps")}
    >
      + Add Step
    </button>
  </div>
);

export default StepsSection;
