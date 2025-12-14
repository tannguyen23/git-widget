import type { GitFileChange } from "@/types/GitType";

interface FileListProps {
    files: GitFileChange[];
    type: 'staged' | 'modified' | 'untracked';
}

const FileList: React.FC<FileListProps> = ({ files, type }) => {
    // Hàm lấy style cho icon chính bên trái (giữ nguyên)
    const getStatusStyle = (status: GitFileChange['status']) => {
        switch (status) {
            case 'staged': return { color: 'text-green-400', icon: '✓' };
            case 'modified': return { color: 'text-yellow-400', icon: '●' };
            case 'untracked': return { color: 'text-slate-400', icon: '?' };
            default: return { color: 'text-slate-400', icon: ' ' };
        }
    };

    // --- HÀM MỚI: Lấy style cho raw index code bên phải ---
    const getRawIndexStyle = (rawIndex: string) => {
        // Chuẩn hóa chuỗi để dễ kiểm tra
        const code = rawIndex.toUpperCase();

        // Ưu tiên kiểm tra Deletion (Xóa) trước -> Màu Đỏ
        if (code.includes('D')) {
             // Nền đỏ nhạt, chữ đỏ sáng
            return 'bg-red-500/20 text-red-300 border border-red-500/30';
        }
        // Kiểm tra Added hoặc Untracked (Thêm mới) -> Màu Xanh lá
        if (code.includes('A') || code.includes('?')) {
            // Nền xanh nhạt, chữ xanh sáng
            return 'bg-green-500/20 text-green-300 border border-green-500/30';
        }
         // Kiểm tra Modified hoặc Renamed (Sửa/Đổi tên) -> Màu Vàng/Cam
        if (code.includes('M') || code.includes('R')) {
             // Nền vàng nhạt, chữ vàng sáng
            return 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30';
        }

        // Mặc định (cho các trường hợp lạ khác) -> Màu xám như cũ
        return 'bg-slate-800/50 text-slate-400 border border-slate-700';
    }
    // --------------------------------------------------

    if (files.length === 0) {
        return <div className="text-xs text-slate-500 italic pl-4 py-1">No files</div>;
    }

    return (
        <ul className="pl-2 pr-2 py-1">
            {files.map((file, index) => {
                const { color, icon } = getStatusStyle(file.status);
                
                // Lấy class màu sắc cho index nếu nó tồn tại
                const rawIndexClass = file.index ? getRawIndexStyle(file.index) : '';

                return (
                    <li key={index} className="flex items-center justify-between text-xs text-slate-300 py-1 hover:bg-slate-700/30 rounded px-2 cursor-default" title={file.path}>
                        {/* Container bên trái */}
                        <div className="flex items-center min-w-0 flex-1 mr-2">
                            <span className={`font-mono font-bold mr-2 shrink-0 ${color}`}>{icon}</span>
                            <span className="truncate">{file.path}</span>
                        </div>

                        {/* Container bên phải: Raw Index với màu sắc mới */}
                        {file.index && (
                            <span className={`font-mono text-[9px] leading-none shrink-0 px-1.5 py-0.5 rounded ml-2 ${rawIndexClass}`}>
                                {/* Thay thế khoảng trắng bằng ký tự giữ chỗ để đảm bảo độ rộng đồng nhất (tùy chọn) */}
                                {file.index.replace(' ', '·')}
                            </span>
                        )}
                    </li>
                );
            })}
        </ul>
    );
};

export default FileList;