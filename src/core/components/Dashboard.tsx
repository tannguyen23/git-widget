
export default function Dashboard() {
  return (
    <div className="flex-1 bg-slate-800 p-4 text-slate-300 overflow-y-auto">
      <div className="mb-4">
        <h2 className="text-xs uppercase text-slate-500 font-bold mb-2">Current Branch</h2>
        <div className="bg-slate-700/50 p-2 rounded border border-slate-600 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          <span className="font-mono text-sm text-white">feature/setup-ui</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-slate-700/30 p-2 rounded text-center">
          <div className="text-xl font-bold text-yellow-400">12</div>
          <div className="text-[10px] text-slate-400">Changes</div>
        </div>
        <div className="bg-slate-700/30 p-2 rounded text-center">
          <div className="text-xl font-bold text-blue-400">2</div>
          <div className="text-[10px] text-slate-400">To Push</div>
        </div>
      </div>
    </div>
  );
}