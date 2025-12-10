const { app, BrowserWindow } = require('electron');
const { createWindow } = require('./window.cjs');
const { registerGitHandlers } = require('../ipc/gitHandler.cjs');

/**
 * Xử lý app ready event
 */
function handleAppReady() {
  // Đăng ký IPC handlers
  registerGitHandlers();

  // Tạo window
  createWindow();
}

/**
 * Xử lý window-all-closed event
 */
function handleWindowAllClosed() {
  if (process.platform !== 'darwin') {
    app.quit();
  }
}

/**
 * Xử lý activate event
 */
function handleActivate() {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
}

module.exports = {
  handleAppReady,
  handleWindowAllClosed,
  handleActivate,
};
