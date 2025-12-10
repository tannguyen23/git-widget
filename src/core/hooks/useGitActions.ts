declare global {
    interface Window {
        // ✅ CHỖ SỬA 1: Thay thế ipcRenderer bằng electron
        electron: {
            ipcRenderer: {
                invoke: (channel: string, ...args: unknown[]) => Promise<unknown>;
            };
        };
    }
}
interface IPCResponse {
    success: boolean;
    [key: string]: unknown;
}

export function useGitActions() {
    // Hàm gọi IPC cho Stage All
    const stageAll = async () => {
        const result = await window.electron.ipcRenderer.invoke('git:stage-all') as IPCResponse;
        if (result.success) {
            // Sau khi thành công, nên làm mới dữ liệu Git
            // Nếu bạn có hàm refresh trong useGitData, hãy gọi nó ở đây
            // hoặc refresh trang
        }
        return result;
    };

    // Hàm gọi IPC cho Commit
    const commit = async (message: string) => {
        const result = await window.electron.ipcRenderer.invoke('git:commit', message) as IPCResponse;
        if (result.success) {
            // Cần làm mới dữ liệu
        }
        return result;
    };

    // Hàm gọi IPC cho Sync
    const sync = async () => {
        const result = await window.electron.ipcRenderer.invoke('git:sync') as IPCResponse;
        if (result.success) {
            // Cần làm mới dữ liệu
        }
        return result;
    };

    return { stageAll, commit, sync };
}