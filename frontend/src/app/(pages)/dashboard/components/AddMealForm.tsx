import type { MealFormData } from '../types';

interface AddMealFormProps {
  formData: MealFormData;
  onFormDataChange: (data: MealFormData) => void;
  onSubmit: () => void;
  loading: boolean;
}

export function AddMealForm({
  formData,
  onFormDataChange,
  onSubmit,
  loading,
}: AddMealFormProps) {
  return (
    <div className="bg-black/70 backdrop-blur rounded-3xl shadow-md px-4 py-4 mb-4">
      <h3 className="text-white font-semibold mb-3">Add New Meal</h3>
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Meal name"
          value={formData.meal}
          onChange={(e) => onFormDataChange({ ...formData, meal: e.target.value })}
          className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-sky-400"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Calories"
            value={formData.calories}
            onChange={(e) => onFormDataChange({ ...formData, calories: e.target.value })}
            className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-sky-400"
          />
          <input
            type="number"
            placeholder="Protein (g)"
            value={formData.protein}
            onChange={(e) => onFormDataChange({ ...formData, protein: e.target.value })}
            className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-sky-400"
          />
          <input
            type="number"
            placeholder="Carbs (g)"
            value={formData.carbs}
            onChange={(e) => onFormDataChange({ ...formData, carbs: e.target.value })}
            className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-sky-400"
          />
          <input
            type="number"
            placeholder="Fats (g)"
            value={formData.fats}
            onChange={(e) => onFormDataChange({ ...formData, fats: e.target.value })}
            className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-sky-400"
          />
        </div>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => onFormDataChange({ ...formData, date: e.target.value })}
          className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-sky-400"
        />
        <button
          onClick={onSubmit}
          disabled={loading}
          className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 rounded-xl transition-colors disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Meal'}
        </button>
      </div>
    </div>
  );
}

