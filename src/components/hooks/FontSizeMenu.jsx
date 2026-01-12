import useFontScale from "./useFontScale";

export default function FontSizeMenu({ closeMenu }) {
  const [scale, setScale] = useFontScale();

  return (
    <div className="w-72 bg-white border border-yellow-200 rounded-xl shadow-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-yellow-100">
        <p className="text-sm font-bold text-green-800">Display</p>
        <p className="text-xs text-gray-500">Adjust font size</p>
      </div>

      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-green-900">Font size</span>
          <span className="text-xs text-gray-600">{Math.round(scale * 100)}%</span>
        </div>

            <input
              type="range"
              min="0.85"
              max="1.25"
              step="0.05"
              value={scale}
              onInput={(e) => setScale(Number(e.target.value))}
              onMouseUp={() => closeMenu?.()}
              onTouchEnd={() => closeMenu?.()}
              className="w-full"
            />
            <button
              type="button"
              onClick={() => {
                setScale(1);
                setTimeout(() => closeMenu?.(), 0);
              }}
              className="mt-3 w-full rounded-full bg-green-700 text-white text-sm font-bold py-2 hover:bg-green-800 transition"
            >
              Reset to default
            </button>


      </div>
    </div>
  );
}
