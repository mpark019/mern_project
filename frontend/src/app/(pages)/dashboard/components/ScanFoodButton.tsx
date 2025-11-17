export function ScanFoodButton() {
  return (
    <div className="fixed bottom-8 left-0 w-full flex justify-center z-50">
      <button
        className="flex items-center gap-2 px-6 py-3 rounded-full bg-linear-to-r from-slate-600 to-sky-500 text-white font-bold shadow-lg hover:scale-[1.03] active:scale-[0.98] transition-transform"
        onClick={() => {
          // Scan food functionality disabled for now
        }}
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
  );
}

