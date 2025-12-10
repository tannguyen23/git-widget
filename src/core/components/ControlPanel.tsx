import { useState } from 'react';
import { useGitActions } from '@core/hooks/useGitActions'; // Giả sử hook được đặt ở đây

export default function ControlPanel() {
    const { stageAll, commit, sync } = useGitActions();
    
    // State quản lý việc loading và thông báo cho người dùng
    const [isProcessing, setIsProcessing] = useState(false); 
    
    // Ví dụ: State cho Commit Message (cần một modal/input field thực tế)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [commitMessage, setCommitMessage] = useState('Chỉnh sửa/Cập nhật'); 

    const handleStageAll = async () => {
        if (isProcessing) return;
        setIsProcessing(true);
        await stageAll();
        setIsProcessing(false);
        // Sau khi hoàn thành, bạn nên kích hoạt làm mới dữ liệu Git trong Dashboard
    };

    const handleCommit = async () => {
        // Trong thực tế, bạn sẽ mở Modal để nhập Commit Message
        const message = prompt('Nhập Commit Message:'); // Dùng prompt tạm thời cho ví dụ
        if (!message) return;

        if (isProcessing) return;
        setIsProcessing(true);
        await commit(message);
        setIsProcessing(false);
    };

    const handleSync = async () => {
        if (isProcessing) return;
        setIsProcessing(true);
        await sync();
        setIsProcessing(false);
    };

    return (
        <div className="h-14 bg-slate-900 border-t border-slate-700 flex items-center justify-around px-2">
            <button 
                onClick={handleStageAll}
                disabled={isProcessing}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-4 py-2 rounded shadow transition-colors disabled:opacity-50"
            >
                {isProcessing ? 'Staging...' : 'Stage All'}
            </button>
            <button 
                onClick={handleCommit}
                disabled={isProcessing}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-4 py-2 rounded shadow transition-colors disabled:opacity-50"
            >
                {isProcessing ? 'Committing...' : 'Commit'}
            </button>
            <button 
                onClick={handleSync}
                disabled={isProcessing}
                className="bg-slate-700 hover:bg-slate-600 text-white text-xs px-3 py-2 rounded transition-colors disabled:opacity-50"
            >
                {isProcessing ? 'Syncing...' : 'Sync'}
            </button>
        </div>
    );
}