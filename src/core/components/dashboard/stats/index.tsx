// Stats.tsx
import ExpandableSection from '@core/common/ExpandableSection';
import FileList from '../file-list';
import type { GitFileChange } from '@/types/GitType';

interface StatsProps {
    staged: number;
    modified: number;
    untracked: number;
    total: number;
    numberToPush: number;
    // Thêm props danh sách file
    stagedFiles: GitFileChange[];
    modifiedFiles: GitFileChange[];
    untrackedFiles: GitFileChange[];
}

export default function Stats({
    staged, modified, untracked, total, numberToPush,
    stagedFiles, modifiedFiles, untrackedFiles
}: StatsProps) {
    return (
        <div className="grid grid-cols-2 gap-2">
            {/* Cột bên trái: Thông tin Changes chi tiết */}
            <div className="bg-slate-700/30 p-2 rounded flex flex-col overflow-hidden">
                {/* Phần hiển thị Tổng số và Số liệu chi tiết (Giữ nguyên như cũ) */}
                <div className="text-center mb-2 flex-shrink-0">
                    <div className="text-xl font-bold text-yellow-400 leading-none">{total}</div>
                    <div className="text-[10px] text-slate-400 mb-2">Total Changes</div>
                    <div className="grid grid-cols-3 gap-1 pt-2 border-t border-slate-600/30">
                         <div className="flex flex-col items-center">
                            <div className="text-sm font-bold text-green-400 leading-tight">{staged}</div>
                            <div className="text-[8px] text-slate-500 uppercase tracking-wider">Staged</div>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="text-sm font-bold text-orange-300 leading-tight">{modified}</div>
                            <div className="text-[8px] text-slate-500 uppercase tracking-wider">Modif.</div>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="text-sm font-bold text-slate-300 leading-tight">{untracked}</div>
                            <div className="text-[8px] text-slate-500 uppercase tracking-wider">Untrack.</div>
                        </div>
                    </div>
                </div>

                {/* Phần danh sách file (Expandable Sections) - Có thể cuộn nếu quá dài */}
                <div className="flex-grow overflow-y-auto scrollbar-thin 
                scrollbar-thumb-slate-700 scrollbar-track-transparent pr-1">
                    <ExpandableSection title="STAGED FILES" count={staged}>
                        <FileList files={stagedFiles} type="staged" />
                    </ExpandableSection>
                    
                    {/* Mở mặc định phần Modified nếu có file thay đổi */}
                    <ExpandableSection title="MODIFIED FILES" count={modified} defaultOpen={modified > 0}>
                        <FileList files={modifiedFiles} type="modified" />
                    </ExpandableSection>

                    <ExpandableSection title="UNTRACKED FILES" count={untracked}>
                        <FileList files={untrackedFiles} type="untracked" />
                    </ExpandableSection>
                </div>
            </div>

            {/* Cột bên phải: Thông tin To Push (Giữ nguyên) */}
            <div className="bg-slate-700/30 p-2 rounded text-center flex flex-col justify-center">
                <div className="text-xl font-bold text-blue-400 leading-none">{numberToPush}</div>
                <div className="text-[10px] text-slate-400 mt-1">To Push</div>
            </div>
        </div>
    );
}