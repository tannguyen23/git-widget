import { useState } from 'react';
import ErrorState from "@core/common/ErrorState";
import LoadingState from "@core/common/LoadingState";
import { useGitData } from "@core/hooks/useGitData";
import Stats from './stats';
import Branch from './branch';
import { useGitFileData } from '@core/hooks/useGitFileData';

export default function Dashboard() {
    const { currentBranch, currentCommitHash, changes, toPush, isLoading, error } = useGitData();
    const {modified : modifiedFiles, staged : stagedFiles, untracked : untrackedFiles} = useGitFileData()

    // Khai báo state để quản lý thông báo sao chép
    const [copied, setCopied] = useState(false);

    const {
        staged,
        modified,
        untracked,
        total
    } = changes || {};

    // Hàm xử lý việc sao chép Hash
    const handleCopyHash = async () => {
        if (currentCommitHash) {
            try {
                await navigator.clipboard.writeText(currentCommitHash);

                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('Không thể sao chép:', err);
            }
        }
    };

    if (isLoading) {
        return <LoadingState />;
    }

    if (error) {
        return <ErrorState error={error} />;
    }

    return (
        <div className="flex-1 bg-slate-800 p-4 text-slate-300 overflow-y-auto">

            <div className="mb-4">
                <h2 className="text-xs uppercase text-slate-500 font-bold mb-2">Current Status</h2>
                {/* Current branch information here */}
                <Branch
                    currentBranch={currentBranch}
                    currentCommitHash={currentCommitHash}
                    handleCopyHash={handleCopyHash}
                    copied={copied}
                />
            </div>
            {/* State of changing in local  */}
            <Stats
                modifiedFiles={modifiedFiles}
                stagedFiles={stagedFiles}
                untrackedFiles={untrackedFiles}
                staged={staged}
                modified={modified}
                untracked={untracked}
                total={total}
                numberToPush={toPush}
            />

        </div>
    );
}