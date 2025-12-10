// // Preload script - Expose IPC renderer API to React
// const { ipcRenderer } = require('electron');

// // Expose electron API to window object
// window.electron = {
//   ipcRenderer: {
//     invoke: (channel) => ipcRenderer.invoke(channel),
//   },
// };

// preload.js
const { contextBridge, ipcRenderer } = require('electron');

// Khai báo danh sách các kênh IPC được phép
// Đây là danh sách các kênh mà Renderer Process (React) có quyền gọi (invoke)
const VALID_INVOKE_CHANNELS = [
    'git:get-data',    // Lấy dữ liệu Git (đang hoạt động)
    'git:stage-all',   // Stage tất cả file
    'git:commit',      // Commit
    'git:sync',        // Pull và Push
];

// Sử dụng contextBridge để tạo một API an toàn (electron.ipcRenderer)
// Đây là bước bắt buộc khi Context Isolation được bật
contextBridge.exposeInMainWorld('electron', {
    ipcRenderer: {
        // Hàm invoke phải nhận kênh và tất cả các tham số truyền vào
        invoke: (channel, ...args) => {
            // Kiểm tra kênh có trong danh sách an toàn không
            if (VALID_INVOKE_CHANNELS.includes(channel)) {
                // Sử dụng spread operator (...args) để truyền các tham số
                return ipcRenderer.invoke(channel, ...args);
            }
            
            // Nếu kênh không hợp lệ, log lỗi và từ chối lời gọi
            console.error(`[Preload Error] Kênh IPC bị chặn vì không hợp lệ: ${channel}`);
            return Promise.reject(`Kênh IPC ${channel} bị chặn.`);
        },
        
        // Bạn có thể thêm hàm 'on' (nhận sự kiện từ Main Process) nếu cần
        // on: (channel, listener) => { ... }
    },
});

console.log("Preload script loaded and electron API exposed."); 
// Kiểm tra log này trong DevTools Console để xác nhận script đã chạy