import { Fragment } from "react/jsx-runtime";

interface BranchProps {
    currentBranch: string;
    currentCommitHash: string | null;
    handleCopyHash: () => void;
    copied: boolean;
}

export default function Branch(
    { currentBranch, currentCommitHash, handleCopyHash, copied }: BranchProps
) {
    return <div className="bg-slate-700/50 p-2 rounded border border-slate-600 flex justify-between items-center">

        {/* LEFT: Branch Name */}
        <div className="flex items-center gap-2 min-w-0 pr-2">
            <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></span>
            <span className="font-mono text-sm text-white truncate" title={currentBranch}>
                {currentBranch}
            </span>
        </div>

        {/* RIGHT: Commit Hash (Nhấn để copy) */}
        {currentCommitHash && (
            <button
                onClick={handleCopyHash}
                className={`flex items-center gap-1.5 p-1 rounded transition-colors ${copied ? 'bg-green-600/70' : 'bg-slate-600/50 hover:bg-slate-600'
                    } flex-shrink-0`}
                title="Click to copy commit hash"
            >
                {/* Hiển thị thông báo Copied! khi sao chép thành công */}
                {copied ? (
                    <span className="text-xs font-bold text-white">Copied!</span>
                ) : (
                    <Fragment>
                        <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM6.25 7.5a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zM6.25 10.5a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zM7 13.5a.75.75 0 000 1.5h6a.75.75 0 000-1.5H7z" clipRule="evenodd"></path>
                        </svg>
                        <span className="font-mono text-xs text-slate-400">
                            {currentCommitHash}
                        </span>
                    </Fragment>
                )}
            </button>
        )}
    </div>
}