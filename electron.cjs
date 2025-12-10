// electron.cjs - Entry point cho Electron main process
const { app } = require('electron');
const { handleAppReady, handleWindowAllClosed, handleActivate } = require('./electron/main/app.cjs');

// ============================================
// Cấu hình
// ============================================

// Disable GPU acceleration trên WSL/headless environment
if (process.platform === 'linux' && !process.env.DISPLAY) {
  app.disableHardwareAcceleration();
}

// ============================================
// App Lifecycle
// ============================================

app.whenReady().then(handleAppReady);
app.on('window-all-closed', handleWindowAllClosed);
app.on('activate', handleActivate);



