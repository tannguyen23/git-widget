
interface ErrorStateProps {
    error: string;
}

export default function ErrorState({ error }: ErrorStateProps) {
    return <div className="flex-1 bg-slate-800 p-4 text-slate-300 overflow-y-auto">
        <div className="bg-red-900/20 border border-red-600 p-3 rounded text-red-400 text-sm">
            {error}
        </div>
    </div>
}