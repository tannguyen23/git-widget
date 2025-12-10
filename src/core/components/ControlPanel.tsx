export default function ControlPanel() {
  return (
    <div className="h-14 bg-slate-900 border-t border-slate-700 flex items-center justify-around px-2">
      <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-4 py-2 rounded shadow transition-colors">
        Stage All
      </button>
      <button className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-4 py-2 rounded shadow transition-colors">
        Commit
      </button>
      <button className="bg-slate-700 hover:bg-slate-600 text-white text-xs px-3 py-2 rounded transition-colors">
        Sync
      </button>
    </div>
  );
}