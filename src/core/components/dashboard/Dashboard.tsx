import { Fragment, useState } from 'react'; // Đảm bảo import useState
import ErrorState from "@core/common/ErrorState";
import LoadingState from "@core/common/LoadingState";
import { useGitData } from "@core/hooks/useGitData";

export default function Dashboard() {
    const { currentBranch, currentCommitHash, changes, toPush, isLoading, error } = useGitData();
    
    // Khai báo state để quản lý thông báo sao chép
    const [copied, setCopied] = useState(false); 

    // Hàm xử lý việc sao chép Hash
    const handleCopyHash = async () => {
        if (currentCommitHash) {
            try {
                // Sử dụng Clipboard API của trình duyệt
                await navigator.clipboard.writeText(currentCommitHash);
                
                // Hiển thị thông báo "Copied!" trong 2 giây
                setCopied(true);
                setTimeout(() => setCopied(false), 2000); 
            } catch (err) {
                console.error('Không thể sao chép:', err);
            }
        }
    };

    if (isLoading) {
        return <LoadingState/>;
    }

    if (error) {
        return <ErrorState error={error} />;
    }

    return (
        <div className="flex-1 bg-slate-800 p-4 text-slate-300 overflow-y-auto">
            
            {/* ---------------------------------- */}
            {/* VÙNG 1: BRANCH & COMMIT HASH (Gộp hàng ngang) */}
            {/* ---------------------------------- */}
            <div className="mb-4">
                <h2 className="text-xs uppercase text-slate-500 font-bold mb-2">Current Status</h2>
                
                <div className="bg-slate-700/50 p-2 rounded border border-slate-600 flex justify-between items-center">
                    
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
                            className={`flex items-center gap-1.5 p-1 rounded transition-colors ${
                                copied ? 'bg-green-600/70' : 'bg-slate-600/50 hover:bg-slate-600'
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
            </div>

            {/* ---------------------------------- */}
            {/* VÙNG 2: HIỂN THỊ STATS (CHANGES, TO PUSH) */}
            {/* ---------------------------------- */}
            {/* ... (Giữ nguyên) */}
            <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-700/30 p-2 rounded text-center">
                    <div className="text-xl font-bold text-yellow-400">{changes}</div>
                    <div className="text-[10px] text-slate-400">Changes</div>
                </div>
                <div className="bg-slate-700/30 p-2 rounded text-center">
                    <div className="text-xl font-bold text-blue-400">{toPush}</div>
                    <div className="text-[10px] text-slate-400">To Push</div>
                </div>
            </div>
            
        </div>
    );
}