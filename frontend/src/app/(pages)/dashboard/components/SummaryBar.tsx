import type { TodayTotals } from '../types';

interface SummaryBarProps {
  totals: TodayTotals;
  goal: number;
}

function MacroChip({
  label,
  value,
  unit,
  dotClass,
}: {
  label: string;
  value: number;
  unit: string;
  dotClass: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs md:text-sm text-white">
      <span className={`w-2 h-2 rounded-full ${dotClass}`} />
      <span className="font-medium">{label}:</span>
      <span className="font-semibold">
        {value}
        {unit}
      </span>
    </span>
  );
}

export function SummaryBar({ totals, goal }: SummaryBarProps) {
  return (
    <div className="sticky top-4 z-40 w-full px-4 flex justify-center mt-4">
      <div className="w-full max-w-2xl bg-black/60 backdrop-blur-md shadow-xl rounded-3xl px-6 py-4 flex flex-col gap-3">
        <div className="flex justify-between items-baseline">
          <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-[0.15em] text-gray-300">
              {new Date().toLocaleDateString()}
            </span>
            <span className="text-sm md:text-base font-semibold text-white">
              Today's Intake
            </span>
          </div>
          <div className="text-right">
            <div className="text-[11px] uppercase tracking-[0.15em] text-gray-300">
              Calories
            </div>
            <div className="text-xl md:text-2xl font-bold text-sky-300">
              {totals.calories} / {goal} cal
            </div>
          </div>
        </div>

        {/* Macros */}
        <div className="flex flex-wrap gap-2 mt-1">
          <MacroChip
            label="Protein"
            value={Math.round(totals.protein)}
            unit="g"
            dotClass="bg-red-400"
          />
          <MacroChip
            label="Carbs"
            value={Math.round(totals.carbs)}
            unit="g"
            dotClass="bg-sky-300"
          />
          <MacroChip
            label="Fats"
            value={Math.round(totals.fats)}
            unit="g"
            dotClass="bg-yellow-500"
          />
        </div>

        {/* Progress Bar */}
        <div className="w-full mt-1.5">
          <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-2.5 rounded-full bg-gradient-to-r from-sky-500 to-sky-400"
              style={{ width: `${Math.min((totals.calories / goal) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

