import type { MealFormData } from '../types';

interface EditMealFormProps {
  editFormData: MealFormData;
  onFormDataChange: (data: MealFormData) => void;
  onUpdate: () => void;
  onCancel: () => void;
  loading: boolean;
}

export function EditMealForm({
  editFormData,
  onFormDataChange,
  onUpdate,
  onCancel,
  loading,
}: EditMealFormProps) {
  return (
    <div className="bg-black/70 backdrop-blur rounded-3xl shadow-md px-4 py-4 mb-4">
      <h3 className="text-white font-semibold mb-3">Edit Meal</h3>
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Meal name"
          value={editFormData.meal}
          onChange={(e) => onFormDataChange({ ...editFormData, meal: e.target.value })}
          className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-sky-400"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Calories"
            value={editFormData.calories}
            onChange={(e) => onFormDataChange({ ...editFormData, calories: e.target.value })}
            className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-sky-400"
          />
          <input
            type="number"
            placeholder="Protein (g)"
            value={editFormData.protein}
            onChange={(e) => onFormDataChange({ ...editFormData, protein: e.target.value })}
            className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-sky-400"
          />
          <input
            type="number"
            placeholder="Carbs (g)"
            value={editFormData.carbs}
            onChange={(e) => onFormDataChange({ ...editFormData, carbs: e.target.value })}
            className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-sky-400"
          />
          <input
            type="number"
            placeholder="Fats (g)"
            value={editFormData.fats}
            onChange={(e) => onFormDataChange({ ...editFormData, fats: e.target.value })}
            className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-sky-400"
          />
        </div>
        <input
          type="date"
          value={editFormData.date}
          onChange={(e) => onFormDataChange({ ...editFormData, date: e.target.value })}
          className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-sky-400"
        />
        <div className="flex gap-2">
          <button
            onClick={onUpdate}
            disabled={loading}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-xl transition-colors disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update'}
          </button>
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 rounded-xl transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

