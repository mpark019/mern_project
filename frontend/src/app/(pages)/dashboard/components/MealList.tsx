import { formatTime } from '../utils';
import type { CalorieLog } from '../types';

interface MealListProps {
  meals: CalorieLog[];
  onEdit: (meal: CalorieLog) => void;
  onDelete: (id: string) => void;
  loading: boolean;
  editingLog: CalorieLog | null;
}

function MacroTag({ label, value }: { label: string; value: number }) {
  return (
    <span className="px-2 py-0.5 rounded-full bg-white/10 text-white text-[11px] font-medium">
      {label}: {value}g
    </span>
  );
}

export function MealList({
  meals,
  onEdit,
  onDelete,
  loading,
  editingLog,
}: MealListProps) {
  if (meals.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>No meals logged for today</p>
        <p className="text-sm mt-2">Click "Add Meal" to get started</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 max-h-[340px] overflow-y-auto pr-1">
      {meals.map((food) => (
        <div
          key={food._id}
          className="flex items-center bg-black/70 backdrop-blur rounded-3xl shadow-md px-4 py-3 gap-3 transition-transform duration-150 hover:-translate-y-px hover:shadow-lg"
        >
          <div className="flex-1 flex items-center justify-between gap-4">
            <div>
              <div className="font-semibold text-white leading-tight">
                {food.meal}
              </div>
              <div className="text-[11px] uppercase tracking-[0.14em] text-gray-300 mt-0.5">
                {food.createdAt ? formatTime(food.createdAt) : ''}
              </div>
              <div className="flex gap-2 mt-2">
                <MacroTag label="P" value={food.protein} />
                <MacroTag label="C" value={food.carbs} />
                <MacroTag label="F" value={food.fats} />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-right">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-900 text-gray-50 text-xs md:text-sm font-semibold shadow-sm">
                  {food.calories} cal
                </div>
              </div>
              <button
                onClick={() => onEdit(food)}
                disabled={loading || editingLog !== null}
                className="p-2 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Edit"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(food._id)}
                disabled={loading}
                className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

