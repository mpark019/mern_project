import { useState } from 'react';
import { GL } from '../../components/gl';

// Dummy data for demonstration
const todayMacros = {
  protein: 80,
  carbs: 180,
  fats: 60,
  total: 1250,
  goal: 3000,
};

const foodLog = [
  {
    name: 'Grilled Chicken Sandwich',
    time: '12:34 PM',
    calories: 450,
    protein: 40,
    carbs: 45,
    fats: 12,
    img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=facearea&w=64&h=64',
  },
  {
    name: 'Greek Yogurt',
    time: '8:15 AM',
    calories: 120,
    protein: 15,
    carbs: 10,
    fats: 2,
    img: '',
  },
];

// Small helper components for clean JSX
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

function MacroTag({ label, value }: { label: string; value: number }) {
  return (
    <span className="px-2 py-0.5 rounded-full bg-white/10 text-white text-[11px] font-medium">
      {label}: {value}g
    </span>
  );
}

function Dashboard() {
  const [scanStatus, setScanStatus] = useState<'idle' | 'analyzing' | 'done'>('idle');
  const [scanResult, setScanResult] = useState<
    null | { calories: number; protein: number; carbs: number; fats: number }
  >(null);

  // calories from macros (4 cals/g protein & carbs, 9 cals/g fat)
  const macroCalories =
    todayMacros.protein * 4 + todayMacros.carbs * 4 + todayMacros.fats * 9;

  // Simulate scan
  const handleScan = () => {
    setScanStatus('analyzing');
    setTimeout(() => {
      setScanResult({
        calories: 650,
        protein: 40,
        carbs: 60,
        fats: 20,
      });
      setScanStatus('done');
    }, 2000);
  };

  return (
    <>
      {/* Background */}
      <GL className="fixed inset-0 -z-10 blur" />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-xl font-semibold text-white">YummyYummy</h1>
            </div>
          </div>

          <nav className="flex items-center gap-4 text-sm">
            <a className="text-white hover:text-gray-400" href="/">Sign Out</a>
          </nav>
        </div>
      </header>


      <div className="fixed inset-0 -z-20 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(15,23,42,0.7),_black)]" />

      <div className="min-h-screen flex flex-col relative">


        {/* Top Summary Bar - centered elongated oval */}
        <div className="sticky top-4 z-40 w-full px-4 flex justify-center">
          <div className="w-full max-w-2xl bg-black/60 backdrop-blur-md shadow-xl rounded-3xl px-6 py-4 flex flex-col gap-3">
            <div className="flex justify-between items-baseline">
              <div className="flex flex-col">
                <span className="text-[11px] uppercase tracking-[0.15em] text-gray-300">
                  {new Date().toLocaleDateString()}
                </span>
                <span className="text-sm md:text-base font-semibold text-white">
                  Today’s Intake
                </span>
              </div>
              <div className="text-right">
                <div className="text-[11px] uppercase tracking-[0.15em] text-gray-300">
                  Calories
                </div>
                <div className="text-xl md:text-2xl font-bold text-sky-300">
                  {macroCalories} / {todayMacros.goal} cal
                </div>
              </div>
            </div>

            {/* Macros */}
            <div className="flex flex-wrap gap-2 mt-1">
              <MacroChip
                label="Protein"
                value={todayMacros.protein}
                unit="g"
                dotClass="bg-red-400"
              />
              <MacroChip
                label="Carbs"
                value={todayMacros.carbs}
                unit="g"
                dotClass="bg-sky-300"
              />
              <MacroChip
                label="Fats"
                value={todayMacros.fats}
                unit="g"
                dotClass="bg-yellow-500"
              />
            </div>

            {/* Progress Bar (using macro calories for fill) */}
            <div className="w-full mt-1.5">
              <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-2.5 rounded-full bg-gradient-to-r from-sky-500 to-sky-400"
                  style={{ width: `${(macroCalories / todayMacros.goal) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Daily Food Log Section */}
        <main className="flex-1 w-full max-w-2xl mx-auto px-4 pt-4 pb-28">
          <h2 className="text-lg md:text-xl font-semibold text-white mb-2">
            Today’s Log
          </h2>

          <div className="flex flex-col gap-4 max-h-[340px] overflow-y-auto pr-1">
            {foodLog.map((food, idx) => (
              <div
                key={idx}
                className="flex items-center bg-black/70 backdrop-blur rounded-3xl shadow-md px-4 py-3 gap-3 transition-transform duration-150 hover:-translate-y-px hover:shadow-lg"
              >
                {food.img && (
                  <img
                    src={food.img}
                    alt={food.name}
                    className="w-14 h-14 rounded-2xl object-cover shadow-sm"
                  />
                )}

                {/* Middle + right content flexed apart */}
                <div className="flex-1 flex items-center justify-between gap-4">
                  <div>
                    <div className="font-semibold text-white leading-tight">
                      {food.name}
                    </div>
                    <div className="text-[11px] uppercase tracking-[0.14em] text-gray-300 mt-0.5">
                      {food.time}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <MacroTag label="P" value={food.protein} />
                      <MacroTag label="C" value={food.carbs} />
                      <MacroTag label="F" value={food.fats} />
                    </div>
                  </div>

                  {/* Calories on the right */}
                  <div className="text-right">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-900 text-gray-50 text-xs md:text-sm font-semibold shadow-sm">
                      {food.calories} cal
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Camera / Scan Food CTA */}
        <div className="fixed bottom-8 left-0 w-full flex justify-center z-50">
          <button
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-linear-to-r from-slate-600 to-sky-500 text-white font-bold shadow-lg hover:scale-[1.03] active:scale-[0.98] transition-transform"
            onClick={handleScan}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7h2l2-3h10l2 3h2a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V9a2 2 0 012-2z"
              />
              <circle cx="12" cy="13" r="4" />
            </svg>
            Scan Food
          </button>
        </div>


        {/* AI Scan Feedback / Status */}
        {scanStatus !== 'idle' && (
          <div className="fixed top-6 left-0 w-full flex justify-center z-50">
            <div
              className={`px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 transition-all duration-200 ${
                scanStatus === 'analyzing'
                  ? 'bg-gray-100 text-gray-700'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {scanStatus === 'analyzing' ? (
                <>
                  <svg className="animate-spin w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      d="M12 2a10 10 0 0110 10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                  </svg>
                  Analyzing photo…
                </>
              ) : (
                <>
                  {scanResult && (
                    <>
                      Estimated {scanResult.calories} cal • {scanResult.protein}g protein •{' '}
                      {scanResult.carbs}g carbs • {scanResult.fats}g fat
                    </>
                  )}
                  <button
                    className="ml-4 px-2 py-1 rounded bg-gray-200 text-gray-700 text-xs"
                    onClick={() => {
                      setScanStatus('idle');
                      setScanResult(null);
                    }}
                  >
                    Dismiss
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Dashboard;
