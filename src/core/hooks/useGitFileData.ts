import type { GitFileChange } from '@/types/GitType';
import { useState, useEffect } from 'react';


// Định nghĩa kiểu dữ liệu trả về từ IPC
export interface GitFileChangesData {
    staged: GitFileChange[];
    modified: GitFileChange[];
    untracked: GitFileChange[];
    error?: string | null; // Trường error tùy chọn, có thể có nếu xảy ra lỗi
}

// Định nghĩa kiểu state cho hook, bao gồm trạng thái loading và error
export interface UseGitFileDataState extends GitFileChangesData {
    isLoading: boolean;
    error?: string | null;
}

export function useGitFileData(repoPath?: string) {
    // Khởi tạo state ban đầu
    const [data, setData] = useState<UseGitFileDataState>({
        staged: [],
        modified: [],
        untracked: [],
        isLoading: true,
        error: null,
    });

    useEffect(() => {
        const fetchGitFileData = async () => {
            // Đặt trạng thái loading là true trước khi gọi API
            setData(prev => ({ ...prev, isLoading: true, error: null }));

            try {
                // Gọi IPC handler từ main process (thông qua preload script)
                // Giả sử bạn đã expose 'window.electron.ipcRenderer'
                const result = await window.electron.ipcRenderer.invoke('git:get-file-changes') as GitFileChangesData;
                
                console.log('Git file data fetched via IPC:', result);

                if (!result) {
                    throw new Error('Không nhận được dữ liệu từ IPC');
                }

                if (result.error) {
                    // Nếu main process trả về lỗi
                    setData((prev) => ({
                        ...prev,
                        isLoading: false,
                        error: result.error || 'Lỗi không xác định từ Git',
                    }));
                } else {
                    // Cập nhật state với dữ liệu thành công
                    setData({
                        staged: result.staged || [],
                        modified: result.modified || [],
                        untracked: result.untracked || [],
                        isLoading: false,
                        error: null,
                    });
                }
            } catch (err) {
                // Xử lý lỗi khi gọi IPC hoặc lỗi mạng, v.v.
                const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định khi gọi IPC';
                setData((prev) => ({
                    ...prev,
                    staged: [], modified: [], untracked: [], // Có thể reset data khi lỗi
                    isLoading: false,
                    error: errorMessage,
                }));
            }
        };

        // Gọi hàm fetch lần đầu tiên
        fetchGitFileData();

        // Tùy chọn: Cập nhật dữ liệu định kỳ (ví dụ: mỗi 5 giây)
        // Bạn có thể bỏ comment dòng dưới nếu muốn tự động polling
        const interval = setInterval(fetchGitFileData, 5000);
        
        // Cleanup function (nếu dùng setInterval)
        return () => clearInterval(interval);
    }, [repoPath]); // Hook sẽ chạy lại khi repoPath thay đổi (nếu bạn sử dụng nó)

    return data;
}