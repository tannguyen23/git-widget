import { useState, useEffect } from 'react';

interface GitData {
  currentBranch: string;
  currentCommitHash: string;
  changes: {
      staged : number,
      modified : number,
      untracked : number,
      total : number
  };
  toPush: number;
  isLoading: boolean;
  error: string | null;
}

export function useGitData(repoPath?: string) {
  const [data, setData] = useState<GitData>({
    currentBranch: '',
    currentCommitHash: '',
    changes: {
      staged : 0,
      modified : 0,
      untracked : 0,
      total : 0
    },
    toPush: 0,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchGitData = async () => {
      try {
        // Gọi IPC handler từ main process
        // const electron = (window as unknown as { electron?: { ipcRenderer?: { invoke: (channel: string) => Promise<unknown> } } }).electron;
        // const result = await electron?.ipcRenderer?.invoke('git:get-data') as GitData & { error?: string } | undefined;
        const result = await window.electron.ipcRenderer.invoke('git:get-data') as GitData & { error?: string };
        console.log('Git data fetched via IPC:', result);
        if (!result) {
          throw new Error('Electron IPC không khả dụng');
        }

        if (result.error) {
          setData((prev) => ({
            ...prev,
            isLoading: false,
            error: result.error,
          }));
        } else {
          setData({
            currentBranch: result.currentBranch || '',
            currentCommitHash: result.currentCommitHash || '',
            changes: result.changes || null,
            toPush: result.toPush || 0,
            isLoading: false,
            error: null,
          });
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định';
        setData((prev) => ({
          ...prev,
          isLoading: false,

          error: errorMessage,
        }));
      }
    };

    fetchGitData();

    // Cập nhật dữ liệu mỗi 5 giây
    const interval = setInterval(fetchGitData, 5000);

    return () => clearInterval(interval);
  }, [repoPath]);

  return data;
}
