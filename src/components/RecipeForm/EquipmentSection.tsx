// EquipmentSection.tsx
const EquipmentSection = ({ form, setForm, removeField }: any) => (
  <div>
    <h3 className="mb-2 text-lg font-semibold text-green-600">Equipment Needed</h3>
    {form.equipment.map((item: string, idx: number) => (
      <div key={idx} className="mb-2 flex items-center gap-2">
        <input
          type="text"
          placeholder={`Equipment ${idx + 1}`}
          value={item}
          onChange={(e) => {
            const updated = [...form.equipment];
            updated[idx] = e.target.value;
            setForm((prev: any) => ({ ...prev, equipment: updated }));
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
      className="mt-2 rounded bg-green-100 px-3 py-1 text-sm font-medium text-green-700 hover:bg-green-200"
      onClick={() => setForm((prev: any) => ({ ...prev, equipment: [...prev.equipment, ""] }))}
    >
      + Add Equipment
    </button>
  </div>
);

export default EquipmentSection;