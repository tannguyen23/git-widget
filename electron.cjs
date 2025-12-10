// electron.cjs
const { app, BrowserWindow } = require('electron');
const path = require('path');

// 1. TẢI BIẾN MÔI TRƯỜNG: Chỉ cần nếu bạn cài đặt và sử dụng thư viện dotenv
// try {
//   require('dotenv').config(); 
// } catch (e) {
//   console.warn("Thư viện dotenv không được tìm thấy. Bỏ qua việc tải biến môi trường.");
// }

// Cổng của Vite Server (ĐÃ ĐƯỢC XÁC NHẬN CHẠY Ở CỔNG 5173)
const VITE_DEV_SERVER_URL = 'http://localhost:5173'; 

// Kiểm tra môi trường phát triển (Đã được đảm bảo bằng lệnh trong package.json)
const isDev = process.env.NODE_ENV === 'development';

function createWindow () {
  // Lấy thông tin màn hình chính
  const display = require('electron').screen.getPrimaryDisplay();
  
  // N3: Kích thước widget cố định và vị trí góc trên bên phải
  const widgetWidth = 500;
  const widgetHeight = 500;
  const x = display.bounds.width - widgetWidth - 20; // Cách mép phải 20px
  const y = 50; 
  
  const win = new BrowserWindow({
    width: widgetWidth,
    height: widgetHeight,
    resizable: false, 
    
    // N2: Widget không khung
    frame: false, 
    
    // N1: Luôn hiển thị trên cùng
    alwaysOnTop: true, 
    
    webPreferences: {
      // Cấu hình quan trọng cho giao tiếp IPC giữa Electron và React/TSX
      contextIsolation: false, 
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'), 
    },
  });

  // Đặt vị trí cửa sổ widget
  win.setPosition(x, y);

  // Tải giao diện
  if (isDev) {
    // Tải từ server Vite khi phát triển
    win.loadURL(VITE_DEV_SERVER_URL); 
    // win.webContents.openDevTools(); 
  } else {
    // Tải file build khi chạy bản chính thức
    win.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
