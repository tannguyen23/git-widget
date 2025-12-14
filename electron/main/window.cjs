// =======================================================
// ✅ SỬA: Tải dotenv ngay sau các require cơ bản
// =======================================================
require('dotenv').config();

const { BrowserWindow, screen } = require('electron');
const path = require('path');
const fs = require('fs');

// Cổng mặc định nếu VITE_DEV_PORT không tồn tại
const DEFAULT_PORT = 5173;

// Lấy giá trị port từ process.env (đã được dotenv tải)
const port = process.env.VITE_DEV_PORT || DEFAULT_PORT;

// Xây dựng URL trực tiếp từ port
const VITE_DEV_SERVER_URL = `http://localhost:${port}`; 

// Kiểm tra xem dist folder có tồn tại không (nếu có = production, không có = development)
const isDev = !fs.existsSync(path.join(__dirname, '../../dist')) || process.env.NODE_ENV === 'development';
console.log(`App is running in ${isDev ? 'development' : 'production'} mode.`);
console.log("Running with URL:", VITE_DEV_SERVER_URL);
/**
 * Tạo main window
 */
function createWindow() {
  // Lấy thông tin màn hình chính
  const display = screen.getPrimaryDisplay();

  // Kích thước widget cố định và vị trí góc trên bên phải
  const widgetWidth = 600;
  const widgetHeight = 800;
  const x = display.bounds.width - widgetWidth - 20; // Cách mép phải 20px
  const y = 50;

  const win = new BrowserWindow({
    width: widgetWidth,
    height: widgetHeight,
    resizable: false,

    // Widget không khung
    frame: false,

    // Luôn hiển thị trên cùng
    alwaysOnTop: true,

    webPreferences: {
      // Cấu hình quan trọng cho giao tiếp IPC giữa Electron và React/TSX
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, '../../preload.js'),
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
    win.loadFile(path.join(__dirname, '../../dist/index.html'));
  }

  return win;
}

module.exports = { createWindow };
